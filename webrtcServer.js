const express = require('express');
const http = require('http');
const { Server } = require('socket.io');


const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    },
    allowEIO3: true,
    transports: ['websocket', 'polling'],
  });

  // Initialize data structures to store socket connections and offers
const clients = new Map();
const pendingOffers = new Map();


// Handle socket connections and events
io.on('connection', (socket) => {
  console.log('A user connected');

  const { id } = socket;
  console.log(`Socket connected: ${socket.id}`);
 
  // Get the user ID from the query parameter 
  const queryParams = socket.handshake.query;
   const userId = queryParams.userId;



   // Store the socket connection with user ID 
   clients.set(userId, socket);

   // Emit userConnected event with the user ID

    console.log(`User ${userId} connected`);
    //clients.set(userId, userId); // Store the socket connection with user ID
  

  socket.on('disconnect', () => {
    console.log('User disconnected');
   clients.delete(userId);
  });

  // Handle consultation initiation
  socket.on('startConsultation', (data) => {
     // Extract appointment ID and recipient ID from the data
     const { appointmentId, recipientUserId } = data;


    // Store the appointment ID with the socket
    socket.appointmentId = appointmentId;
    console.log(`Specialist started consultation for appointment: ${appointmentId}`);

    // Log that the server received the event
    console.log(`Received startConsultation event for appointment: ${appointmentId}`);

     // Create a room for the consultation
     socket.join(appointmentId);

       // Emitting the offer event with the correct recipientUserId
    io.to(appointmentId).emit('offer', { offer: yourOfferData, recipientUserId, appointmentId });


     // Check if the room was successfully created
    const rooms = io.sockets.adapter.rooms;
    if (rooms.has(appointmentId)) {
        console.log(`Room for appointment ${appointmentId} successfully created`);
    } else {
        console.log(`Failed to create room for appointment ${appointmentId}`);
    }
});

// Handle patient joining the consultation
socket.on('joinConsultation', (appointmentId) => {
    // Find specialist socket with the same appointment ID

    //join the consultation room
        socket.join(appointmentId);
        console.log(`Patient joined consultation for appointment: ${appointmentId}`);
        console.log(`Room for appointment ${appointmentId} successfully created`);
    
        // Check if there are pending offers for this appointment and forward them
      if (pendingOffers.has(appointmentId)) {
        const offers = pendingOffers.get(appointmentId);
        offers.forEach(offer => {
          socket.emit('offer', { ...offer, appointmentId });
          console.log('Offer forwarded to recipient:', offer);
        });
        // Clear pending offers for this appointment
        pendingOffers.delete(appointmentId);
      }
    console.log(`Received joinConsultation event for appointment: ${appointmentId}`);
  });



  socket.on('offer', (offer) => {
    try {
      const { appointmentId} = offer;
      const recipientSocket = clients.get(appointmentId);
      if (recipientSocket) {
        recipientSocket.emit('offer', offer);
        console.log('Offer forwarded to recipient:', offer);
      } else {
        console.log('Recipient is not connected, unable to send offer');
     // Store the offer for the recipient to connect later
     if (!pendingOffers.has(appointmentId)) {
      pendingOffers.set(appointmentId, []);
    }
    pendingOffers.get(appointmentId).push(offer);
  }
} catch (error) {
  console.error('Error processing offer:', error);
}
});


  socket.on('answer', (answer) => {
    try {
      const { senderId } = answer;
      const senderSocket = clients.get(senderId);
      if (senderSocket) {
        senderSocket.emit('answer', answer);
        console.log('Answer forwarded to sender:', answer);
      } else {
        console.log('Sender is not connected, unable to send answer');
      }
    } catch (error) {
      console.error('Error processing answer:', error);
    }
  });

  socket.on('iceCandidate', (candidate) => {
    try {
      const { recipientId } = candidate;
      const recipientSocket = clients.get(recipientId);
      if (recipientSocket) {
        recipientSocket.emit('iceCandidate', candidate);
        console.log('ICE candidate forwarded to recipient:', candidate);
      } else {
        console.log('Recipient is not connected, unable to send ICE candidate');
      }
    } catch (error) {
      console.error('Error processing ICE candidate:', error);
    }
  });

  // Handle appointment data
  socket.on('appointmentData', ({ userId, appointmentId }) => {
    try {
      // Here, you can process the appointment data as needed
      console.log(`Received appointment data from user ${userId} for appointment ${appointmentId}`);
    } catch (error) {
      console.error('Error handling appointment data:', error);
    }
  });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`WebRTC server running on port ${PORT}`);
});

