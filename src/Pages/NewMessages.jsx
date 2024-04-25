// NewMessages.jsx
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import './Navbar.css';

const NewMessages = ({ specialist, messages }) => {
const [socket, setSocket] = useState(null);
  const [newMessages, setNewMessages] = useState([]);

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
    if (socket && specialist?.uid) {
      socket.on('message', (message) => {
        if (message.recipientId === specialist.uid) {
            console.log('New message:', message);
          setNewMessages((prevMessages) => [...prevMessages, message]);
        }
      });
    }

    return () => {
      if (socket) {
        socket.off('message');
      }
    };
  }, [socket, specialist?.uid]);

  // Function to fetch stored messages from the server
  const fetchStoredMessages = () => {
    if (specialist && specialist.uid) { 
    // Send a request to the server to fetch stored messages for the specialist
    fetch(`http://localhost:3001/offlineMessages/${specialist.uid}`)
      .then(response => response.json())
      .then(data => {
        // Update the state with the fetched messages
        setNewMessages(data);
      })
      .catch(error => {
        console.error('Error fetching stored messages:', error);
      });
    }
  };

  // Function to format the date string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };




  return (
    <div>
      {newMessages.map((message, index) => (
        <div key={index} className="message-container">
          <p><strong>From: </strong>{message.senderName}</p>
          <p><strong>Message: </strong>{message.content}</p>
          <p className="time">Time: {formatDate(message.receivedAt)}</p>
        </div>
      ))}
    </div>
  );
};

export default NewMessages;