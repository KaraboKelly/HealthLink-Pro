import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import avatar from '../images/avatar.png';
import './PatientMessages.css'; 

const PatientMessages = ({ patient }) => {
  const [socket, setSocket] = useState(null);
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [replyMessage, setReplyMessage] = useState('');

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    // Fetch stored messages when the component mounts
    fetchStoredMessages();

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (socket && patient?.uid) {
      socket.on('message', (message) => {
        if (message.recipientId === patient.uid) {
          setReceivedMessages((prevMessages) => {
            const updatedMessages = [...prevMessages];
            const messageIndex = updatedMessages.findIndex(
              (msg) => msg.senderId === message.senderId && msg.content === message.content
            );

            if (messageIndex > -1) {
              updatedMessages[messageIndex].replies = [
                ...(updatedMessages[messageIndex].replies || []),
                message,
              ];
            } else {
              updatedMessages.push(message);
            }

            return updatedMessages;
          });
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('message');
      }
    };
  }, [socket, patient?.uid]);

  const fetchStoredMessages = () => {
    if (patient && patient.uid) {
      fetch(`http://localhost:3001/offlineMessages/${patient.uid}`)
        .then((response) => response.json())
        .then((data) => setReceivedMessages(data))
        .catch((error) => console.error('Error fetching stored messages:', error));
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  const handleReply = (message) => {
    if (socket && replyMessage.trim() !== '') {
      const replyObject = {
        content: replyMessage,
        recipientId: message.senderId,
        senderName: patient.firstName,
        senderId: patient.uid,
      };
      socket.emit('reply', replyObject);
      setReplyMessage('');

      setReceivedMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        const messageIndex = updatedMessages.findIndex(
          (msg) => msg.senderId === message.senderId && msg.content === message.content
        );

        if (messageIndex > -1) {
          updatedMessages[messageIndex].replies = [
            ...(updatedMessages[messageIndex].replies || []),
            {
              senderName: patient.firstName,
              content: replyMessage,
              receivedAt: new Date().toISOString(),
            },
          ];
        } else {
          updatedMessages.push({
            senderName: patient.firstName,
            content: replyMessage,
            receivedAt: new Date().toISOString(),
          });
        }

        return updatedMessages;
      });
    }
  };

  return (
    
    <div className="chat">
    {receivedMessages.length === 0 ? (
      <div className="empty-inbox">No messages yet. Your inbox is empty.</div>
    ) : (
      receivedMessages.map((message, index) => (
        <div key={index} className="message-card">
          <div className="message-header" style={{background:'#fff'}}>
            <img src={avatar} alt="Avatar" className="avatar" />
            <div className="received-message">
              <p className="sender">Dr.{message.senderName}</p>
              <p className="content">{message.content}</p>
              <p className="time">{formatDate(message.receivedAt)}</p>
            </div>
          </div>

          {(message.replies || []).map((reply, idx) => (
            <div key={idx} className="reply-card">

              <p className="reply-content">{reply.content}</p>
              <p className="reply-time">{formatDate(reply.receivedAt)}</p>
            </div>
          ))}

          <div className="reply-input-container">
            <input
              type="text"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Type your reply..."
              className="reply-input"
            />
            <button
              onClick={() => handleReply(message)}
              className="reply-button"
            >
              Send
            </button>
          </div>
        </div>
      ))
    )}
  </div>
);
};


export default PatientMessages;
