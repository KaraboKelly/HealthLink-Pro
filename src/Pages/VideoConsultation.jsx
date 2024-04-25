import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faMicrophone, faPhone } from '@fortawesome/free-solid-svg-icons';
import './VideoConsultation.css'; 

const VideoConsultation = ({ userId, appointmentId, setShowVideoConsultation }) => {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const socketRef = useRef();
  const [localStream, setLocalStream] = useState(null);
  const [smallFrame, setSmallFrame] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  

  useEffect(() => {
    const connectSocket = () => {
    // Initialize socket connection
    socketRef.current = io('http://localhost:3002', {
      query: {
        userId,
        appointmentId,
      },
      transports: ['websocket'],
     
    });

    socketRef.current.on('connect', () => {
      setSocketConnected(true);

      if (userId !== null) {
        socketRef.current.emit('userConnected', userId);
      }
    });

    socketRef.current.on('disconnect', () => {
      setSocketConnected(false);
      // Reconnect after a delay
      setTimeout(connectSocket, 9000);
    });

    socketRef.current.on('offer', handleOffer);
  };

  connectSocket();

    // Get user media and clean up on unmount
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setLocalStream(stream);
        localVideoRef.current.srcObject = stream;
      })
      .catch((error) => {
        console.error('Error accessing media devices:', error);
      });

    return () => {
      // Clean up
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCall = async () => {
    try {
      // Create peer connection
      const peerConnection = new RTCPeerConnection();
      localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

      // Create offer and set local description
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      // Emit offer to the server
      socketRef.current.emit('offer', {
        offer,
        recipientId: appointmentId,
        appointmentId: appointmentId 
      });
    } catch (error) {
      console.error('Error starting call:', error);
    }
  };



  const handleOffer = (data) => {
    const { offer } = data;
    const peerConnection = new RTCPeerConnection();
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current.emit('iceCandidate', event.candidate);
      }
    };

    peerConnection.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
      .then(() => navigator.mediaDevices.getUserMedia({ video: true, audio: true }))
      .then((stream) => {
        setLocalStream(stream);
        localVideoRef.current.srcObject = stream;
        stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));
      })
      .then(() => peerConnection.createAnswer())
      .then((createdAnswer) => {
        return peerConnection.setLocalDescription(createdAnswer);
      })
      .then(() => {
        socketRef.current.emit('answer', peerConnection.localDescription);
      })
      .catch((error) => {
        console.error('Error handling offer:', error);
      });
  };


  const toggleSmallFrame = () => {
    setSmallFrame(prev => !prev);
  };

  const handleEndCall = () => {
    // Stop local stream tracks
    localStream.getTracks().forEach(track => track.stop());

    // Hide the VideoConsultation container
    setShowVideoConsultation(false);
  };

  
  return (
    <div id="videos"  style={{ height: '800px' }}>
      <div id="socket-status">{socketConnected ? 'Connected' : 'Not connected'}</div>
      <video ref={localVideoRef} className={`video-player ${smallFrame ? 'smallFrame' : ''}`} autoPlay playsInline muted />
      <video ref={remoteVideoRef} className={`video-player ${smallFrame ? '' : 'smallFrame'}`} autoPlay playsInline />
      <div id="controls">
        <div className="control-container" id="small-frame-btn" onClick={toggleSmallFrame}>
          <FontAwesomeIcon icon={faCamera}  />
        </div>
        <div className="control-container" id="mic-btn">
          <FontAwesomeIcon icon={faMicrophone} />
        </div>
          <div className="control-container" id="leave-btn" onClick={handleEndCall}>
            <FontAwesomeIcon icon={faPhone} />
          </div>
          <button className="control-container" id="start-call-btn" onClick={startCall}>
          Start Call
        </button>
      </div>
    </div>
  );
};


export default VideoConsultation;
