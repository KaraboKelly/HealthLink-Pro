// server.js
const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors =  require("cors");

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Store client connections and their corresponding IDs
const clients = new Map();

// Store offline messages
const offlineMessages = new Map();

// Handle WebRTC signaling and socket.io signaling
io.on('connection', (socket) => {
  console.log('A user connected');

  // Store the client ID when a user connects
  const { id } = socket;
  clients.set(id, socket);

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
    clients.delete(id); // Remove disconnected client from the map
  });

  // Define a route to handle requests for fetching all offline messages
app.get('/offlineMessages', (req, res) => {
  // Construct an array to hold all offline messages from all users
  const allOfflineMessages = [];

  // Iterate through all offline messages and combine them into a single array
  offlineMessages.forEach((messages) => {
    allOfflineMessages.push(...messages);
  });

  // Respond with the combined array of all offline messages
  res.json(allOfflineMessages);
});

  // Define a route to handle requests for fetching offline messages
app.get('/offlineMessages/:recipientId', (req, res) => {
  const recipientId = req.params.recipientId;
  const userOfflineMessages = [];

  // Iterate through all offline messages and filter those that match the recipientId
  offlineMessages.forEach((messages, userId) => {
    if (userId === recipientId) {
      userOfflineMessages.push(...messages);
    }
  });

  // Respond with the filtered offline messages for the recipientId
  res.json(userOfflineMessages);
});


  // Handle chat messages
  socket.on('message', (message) => {
    console.log('Message received :', message);
    const timestamp = new Date(); // Get current timestamp
    const messageWithTimestamp = { ...message, receivedAt: timestamp }; // Add receivedAt property to message
    console.log('Message with timestamp:', messageWithTimestamp);

    // Extract recipient ID from the message
    const { recipientId } = messageWithTimestamp;


    // Check if the recipient is connected
    const recipientSocket = clients.get(recipientId);
    if (recipientSocket) {
      // Emit the message only to the recipient
      recipientSocket.emit('message', messageWithTimestamp);
      console.log('Message emitted:', messageWithTimestamp);
    } else {
      console.log('Recipient is not connected,storing message for later delivery');
      // Store the message for later delivery
      if (!offlineMessages.has(recipientId)) {
        offlineMessages.set(recipientId, []);
      }
      offlineMessages.get(recipientId).push(messageWithTimestamp);
    }
  }); 

  // Handle reply messages
socket.on('reply', (reply) => {
  try {
  console.log('Reply received:', reply);

  // Extract sender ID from the reply
  const { recipientId } = reply;

  // Check if there are any offline messages for the recipient
  if (offlineMessages.has(recipientId)) {
    // Append the reply to the existing offline messages for the recipient
    offlineMessages.get(recipientId).push(reply);
    console.log('Reply stored with offline messages for recipient:', reply);
  } else {
    console.log('Recipient is not connected, storing reply for later delivery');
    // If there are no offline messages for the recipient, create a new entry
    offlineMessages.set(recipientId, [reply]);
  }

 // Check if the sender is connected
 const recipientSocket = clients.get(recipientId);
 if (recipientSocket) {
   // Emit the reply to the original sender
   recipientSocket.emit('reply', reply);
   console.log('Reply forwarded to original sender:', reply);
 }
} catch (error) {
  console.error('Error processing reply:', error);
  }
});

// Send offline messages when a user reconnects
socket.on('userConnected', (userId) => {
  try {
    const userOfflineMessages = offlineMessages.get(userId) || [];
    const userSocket = clients.get(userId);

    if (userSocket && userOfflineMessages.length > 0) {
      console.log(`Sending ${userOfflineMessages.length} offline messages to user ${userId}`);
      userOfflineMessages.forEach((message) => {
        userSocket.emit('message', message);
        console.log('Offline message emitted:', message);
      });
      offlineMessages.delete(userId); // Clear offline messages after delivery
    }
  } catch (error) {
    console.error('Error sending offline messages:', error);
  }
});
});


const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});