import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import "./SpecialistReg.css";
import { auth} from '../firebaseconfig';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function MessagingContainer({ specialist }) {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [patientName, setPatientName] = useState('');
  const name = specialist ? `${specialist.firstName} ${specialist.surname}` : '';
  const messageContainerRef = useRef(null);
  const [showMessages, setShowMessages] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [replyMessages, setReplyMessages] = useState([]);

  useEffect(() => {
    // Connect to the Socket.io server
    const newSocket = io('http://localhost:3001'); 
    setSocket(newSocket);

    // Clean up on unmount
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, []);

 
  useEffect(() => {
    // Load messages from local storage when component mounts
    const storedMessages = JSON.parse(localStorage.getItem('messages'));
    if (storedMessages) {
      setMessages(storedMessages);
    }
  }, []);


  useEffect(() => {
    // Listen for incoming messages
    if (socket) {
      socket.on('reply', (receivedReply) => {
        console.log('Received reply:', receivedReply);

        // Update messages state to include the received reply
        setMessages(prevMessages => [...prevMessages, receivedReply]);

        // Update local storage
        localStorage.setItem('messages', JSON.stringify([...messages, receivedReply]));


 
        // Scroll to bottom
        messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
      });

      socket.on('connect', () => {
        console.log('Connected to server');
      });
  
      socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });
    }

  }, [socket, messages]);

  // Function to fetch stored messages from the server
  useEffect(() => {
    fetchStoredMessages(); // Call fetchStoredMessages when component mounts or when specialist or user authentication changes
  }, [specialist, auth.currentUser]);
  
  // Function to fetch stored messages from the server
  const fetchStoredMessages = () => {
    if (auth.currentUser && specialist && specialist.uid) { 
      fetch(`http://localhost:3001/offlineMessages/${auth.currentUser.uid}`)
        .then(response => response.json())
        .then(data => {
          // Filter messages to include only those relevant to the current conversation
        const filteredMessages = data.filter(message => 
          (message.recipientId === auth.currentUser.uid && message.senderId === specialist.uid) ||
          (message.recipientId === specialist.uid && message.senderId === auth.currentUser.uid)
        );
        // Combine received messages with locally stored messages
        const combinedMessages = [...messages, ...filteredMessages];
        setMessages(combinedMessages);

        // Update local storage
        localStorage.setItem('messages', JSON.stringify(combinedMessages));
      })
      .catch(error => {
        console.error('Error fetching stored messages:', error);
      });
  }
};

   // Function to fetch patient's name from Firebase
   useEffect(() => {
    const fetchPatientName = async () => {
      try {
        const user = auth.currentUser;
        console.log('Current user:', user);
        if (!user) {
          console.error('User not authenticated');
      return;
    }
    const fullName = user.displayName;
    const uid = user.uid; // Retrieve the uid
    console.log('Full name:', fullName); // Log the full name
    console.log('UID:', uid); 

          if (fullName) {
            setPatientName(fullName);
          } else {
            console.error('Display Name not found');
  
          } 
      } catch (error) {
        console.error('Error fetching patient name:', error);
      }
    };
    
    fetchPatientName();
  }, []);


  const sendMessage = () => {
    // Send message to server
    if (socket && message.trim() !== '' && auth.currentUser) {
      const recipientId = specialist.uid ; // Check if specialist and uid exist
        const messageObject = {
          content: message,
          recipientId: recipientId ,
          senderName: patientName,
          senderId: auth.currentUser.uid 
        };
       
       // Update messages state immediately
    const newMessages = [...messages, messageObject];
    setMessages(newMessages);

    localStorage.setItem('messages', JSON.stringify(newMessages));
    setMessage(''); // Clear input field after sending message
    console.log(`Message sent from ${patientName} (${auth.currentUser.uid}) to Dr. ${specialist.firstName} ${specialist.surname} (${recipientId}): "${message}"`);
    // Scroll to bottom
    messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;

     // Emit the message to the server
     socket.emit('message', messageObject);

      // Save the message to local storage
    localStorage.setItem('messages', JSON.stringify(newMessages));

   
      
  }
};
      
      
    const clearMessages = () => {
      setMessages([]);
      localStorage.removeItem('messages');
    };
     const toggleMessageContainer = () => {
    setShowMessages(!showMessages);
  };

  const handleClose = () => {
    setIsVisible(false);
  };


  const handleOpen = () => {
    setIsVisible(true);
  };
  
   
  

    return (
      <>
      {isVisible && (
      <div className="custom-chat-container">
        <FontAwesomeIcon icon={faTimes} onClick={handleClose} style={{ cursor: 'pointer' }} />
        <div className="custom-chat-header">
          <h2>Chat with Dr. {name}</h2>
        {/* <button onClick={clearMessages}>Clear Messages</button>   */}
        
        </div>
        
        <div className="custom-message-wrapper">
        <div className="custom-message-container"  ref={messageContainerRef}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`custom-message ${msg.senderId === auth.currentUser.uid ? 'custom-right' : 'custom-left'}`}
            >
              {msg.isReply ? <p className="custom-reply">{msg.content}</p> : <p>{msg.content}</p>}
            </div>
          ))}
        </div>
    
        <div className="custom-input-container">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
          />
    
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
      </div>
    )}
    </>
  );
}

export default MessagingContainer;
