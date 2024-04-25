import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AgoraRTM from 'agora-rtm-sdk';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faMicrophone, faPhone } from '@fortawesome/free-solid-svg-icons';
import './VideoChat.css';

const APP_ID = '56352414986f4840bc087ebc09678c9f';
const token = null;
const uid = `${String(Math.floor(Math.random() * 10000))}-${Date.now()}`;

const VideoChat = () => {
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const roomId = new URLSearchParams(location.search).get('room');

  const servers = {
    iceServers: [
      { urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'] },
    ],
  };

  const constraints = {
    video: {
      width: { min: 640, ideal: 1920, max: 1920 },
      height: { min: 480, ideal: 1080, max: 1080 },
    },
    audio: true,
  };

  useEffect(() => {
    const init = async () => {
      console.log("Initializing Agora and local stream...");

      if (!roomId) {
        console.log("No roomId, navigating to lobby...");
        navigate('/lobby');
        return;
      }
   

      try {
        const agoraClient = AgoraRTM.createInstance(APP_ID);
        await agoraClient.login({ uid, token });
        setClient(agoraClient); 
     

        console.log("Agora client initialized and logged in");

        const agoraChannel =agoraClient.createChannel(roomId);
        await agoraChannel.join();

        console.log("Agora channel joined:", roomId);
        
        setChannel(agoraChannel);

        agoraChannel.on('MemberJoined', handleUserJoined);
        agoraChannel.on('MemberLeft', handleUserLeft);
        agoraClient.on('MessageFromPeer', handleMessageFromPeer);

       
      // Ensure the local stream is initialized
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);
      document.getElementById('user-1').srcObject = stream;
      console.log("Local stream initialized and set to 'user-1'");

   // Create peer connection after local stream is initialized
   await createPeerConnection(); // Initialize peerConnection after local stream is set
    } catch (error) {
      console.error('Error during initialization:', error);
      navigate('/lobby'); // Navigate if initialization fails
    }
  };

  
    init();

    return () => {
      console.log("Cleaning up: logging out and leaving channel");
      if (client) {
        client.logout();
      }
      if (channel) {
        channel.leave();
      }
    };
  }, [roomId, navigate]);
 

  const handleUserJoined = async (MemberId) => {
    console.log('A new user joined the channel:', MemberId);
    if (!localStream) {
      console.warn("Local stream not yet initialized. Skipping offer creation...");
      return;
    }
    await createOffer(MemberId);
  };

  const handleUserLeft = (MemberId) => {
    console.log("User left the channel:", MemberId);
    document.getElementById('user-2').style.display = 'none';
    document.getElementById('user-1').classList.remove('smallFrame');
  };

  const handleMessageFromPeer = async (message, MemberId) => {
    console.log('Received message from peer:', MemberId, message.text);
    try {
      const parsedMessage = JSON.parse(message.text);

      if (parsedMessage.type === 'offer') {
        await createAnswer(MemberId, parsedMessage.offer);
      }

      if (parsedMessage.type === 'answer') {
        await addAnswer(parsedMessage.answer);
      }

      if (parsedMessage.type === 'candidate' && peerConnection) {
        await peerConnection.addIceCandidate(parsedMessage.candidate);
      }
    } catch (error) {
      console.error('Error handling message from peer:', error);
    }
  };




  const createOffer = async (MemberId) => {
    if (!peerConnection) {
      console.warn("Peer connection not initialized, attempting to create it...");
      await createPeerConnection(MemberId);
    }

    if (!peerConnection) {
      console.error("Cannot create offer: Peer connection not initialized after attempt!");
      return;
    }

    if (!client) {
        console.error("Cannot create offer: Agora client not initialized!");
        return;
      }
    

    try {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      await client.sendMessageToPeer(
        { text: JSON.stringify({ type: 'offer', offer }) },
        MemberId
      );

      console.log("Offer created and sent to user:", MemberId);
    } catch (error) {
      console.error("Error creating or sending offer:", error);
    }
  };

  const createPeerConnection = async (MemberId) => {
    if (peerConnection) {
      console.log("Peer connection already exists, returning...");
      return;
    }

    if (!localStream) {
      console.error('Local stream is not initialized! Initializing it now...');
      return;
    }

    try {
      const pc = new RTCPeerConnection(servers);
      setPeerConnection(pc);

      const remote = new MediaStream();
      setRemoteStream(remote);

      pc.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remote.addTrack(track);
        });
      };

      pc.onicecandidate = async (event) => {
        if (event.candidate) {
          await client.sendMessageToPeer(
            { text: JSON.stringify({ type: 'candidate', candidate: event.candidate }) },
            MemberId
          );
        }
      };

      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });

      document.getElementById('user-2').style.display = 'block';
      document.getElementById('user-1').classList.add('smallFrame');

      console.log("Peer connection created with user:", MemberId);
    } catch (error) {
      console.error('Error creating peer connection:', error);
      setPeerConnection(null);
    }
  };

 

  const createAnswer = async (MemberId, offer) => {
    if (!peerConnection) {
      console.error("Cannot create answer: Peer connection not initialized!");
      return;
    }

    try {
      await peerConnection.setRemoteDescription(offer);

      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      await client.sendMessageToPeer(
        { text: JSON.stringify({ type: 'answer', answer }) },
        MemberId
      );

      console.log("Answer created and sent to user:", MemberId);
    } catch (error) {
      console.error('Error creating or sending answer:', error);
    }
  };

  const addAnswer = async (answer) => {
    if (!peerConnection) {
      console.error("Cannot add answer: Peer connection not initialized!");
      return;
    }

    try {
      if (!peerConnection.currentRemoteDescription) {
        await peerConnection.setRemoteDescription(answer);
      }

      console.log("Remote description set with answer.");
    } catch (error) {
      console.error('Error adding remote description:', error);
    }
  };

  const toggleCamera = async () => {
    if (!localStream) {
      console.error('Local stream not found for toggling camera.');
      return;
    }

    const videoTrack = localStream.getTracks().find((track) => track.kind === 'video');

    if (videoTrack.enabled) {
      videoTrack.enabled = false;
      document.getElementById('camera-btn').style.backgroundColor = 'rgb(255,80,80)';
    } else {
      videoTrack.enabled = true;
      document.getElementById('camera-btn').style.backgroundColor = 'rgb(179,102,249, .9)';
    }
  };

  const toggleMic = async () => {
    if (!localStream) {
      console.error('Local stream not found for toggling microphone.');
      return;
    }

    const audioTrack = localStream.getTracks().find((track) => track.kind === 'audio');

    if (audioTrack.enabled) {
      audioTrack.enabled = false;
      document.getElementById('mic-btn').style.backgroundColor = 'rgb(255,80,80)';
    } else {
      audioTrack.enabled =true;
      document.getElementById('mic-btn').style.backgroundColor = 'rgb(179,102,249, .9)';
    }
  };

  const leaveChannel = async () => {
    console.log("Leaving the channel and logging out...");
    try {
      if (channel) {
        await channel.leave();
      }
      if (client) {
        await client.logout();
      }
      console.log("Successfully left the channel and logged out.");
    } catch (error) {
      console.error('Error during leave channel/logout:', error);
    }
    navigate('/lobby');
  };

  return (
    <div>
      <div id="videos">
        <video className="video-player" id="user-1" autoPlay playsInline />
        <video className="video-player" id="user-2" autoPlay playsInline style={{ display: 'none' }} />
      </div>

      <div id="controls">
        <div className="control-container" id="camera-btn" onClick={toggleCamera}>
          <FontAwesomeIcon icon={faCamera} />
        </div>

        <div className="control-container" id="mic-btn" onClick={toggleMic}>
          <FontAwesomeIcon icon={faMicrophone} />
        </div>

        <div className="control-container" id="leave-btn" onClick={leaveChannel}>
          <FontAwesomeIcon icon={faPhone} />
        </div>
      </div>
    </div>
  );
};


export default VideoChat;
