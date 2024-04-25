// Constants
const APP_ID = "56352414986f4840bc087ebc09678c9f";
const token = null;
const uid = String(Math.floor(Math.random() * 10000));

let client;
let channel;

let queryString = window.location.search
let urlParams = new URLSearchParams(queryString)
let roomId = urlParams.get('room')

if(!roomId){
    window.location = 'lobby.html'
}


let localStream;
let remoteStream;
let peerConnection;

const servers = {
    iceServers: [
        {
            urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"],
        },
    ],
};

let constraints = {
    video:{
        width:{min:640, ideal:1920, max:1920},
        height:{min:480, ideal:1080, max:1080},
    },
    audio:true
}

// Initialize
const init = async () => {
    try {
        client = await AgoraRTM.createInstance(APP_ID);
        await client.login({ uid, token });

        channel = client.createChannel(roomId);
        await channel.join();

        channel.on("MemberJoined", handleUserJoined);
        channel.on('MemberLeft', handleUserLeft)

        client.on("MessageFromPeer", handleMessageFromPeer);

        // Get the local stream
        localStream = await navigator.mediaDevices.getUserMedia(constraints);
        document.getElementById("user-1").srcObject = localStream;

        console.log("Local stream initialized and set to user-1");
    } catch (error) {
        console.error("Error initializing Agora or local stream:", error);
    }
};

let handleUserLeft = (MemberId) => {
    document.getElementById("user-2").style.display ='none' 
    document.getElementById("user-1").classList.remove ('smallFrame' )

}

const handleMessageFromPeer = async (message, MemberId) => {
    try {
        const parsedMessage = JSON.parse(message.text);

        if (parsedMessage.type === "offer") {
            console.log("Received offer from", MemberId);
            await createAnswer(MemberId, parsedMessage.offer);
        }

        if (parsedMessage.type === "answer") {
            console.log("Received answer from", MemberId);
            await addAnswer(parsedMessage.answer);
        }

        if (parsedMessage.type === "candidate" && peerConnection) {
            console.log("Adding ICE candidate:", parsedMessage.candidate);
            await peerConnection.addIceCandidate(parsedMessage.candidate);
        }
    } catch (error) {
        console.error("Error handling message from peer:", error);
    }
};

const handleUserJoined = async (MemberId) => {
    console.log("A new user joined the channel:", MemberId);
    await createOffer(MemberId);
};

const createPeerConnection = async (MemberId) => {
    try {
        peerConnection = new RTCPeerConnection(servers);

        remoteStream = new MediaStream();
        document.getElementById("user-2").srcObject = remoteStream;
        document.getElementById("user-2").style.display ='block' 

        document.getElementById("user-1").classList.add ('smallFrame' )


        if (!localStream) {
            console.error("Local stream is not initialized!");
            return; // Exit early to avoid further errors
        }

        localStream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, localStream);
        });

        peerConnection.ontrack = (event) => {
            console.log("Received remote track:", event.streams[0]);
            event.streams[0].getTracks().forEach((track) => {
                remoteStream.addTrack(track);
            });
        };

        peerConnection.onicecandidate = async (event) => {
            if (event.candidate) {
                await client.sendMessageToPeer(
                    { text: JSON.stringify({ type: "candidate", candidate: event.candidate }) },
                    MemberId
                );
            }
        };
    } catch (error) {
        console.error("Error creating peer connection:", error);
    }
};


const createOffer = async (MemberId) => {
    try {
        await createPeerConnection(MemberId);

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        await client.sendMessageToPeer(
            { text: JSON.stringify({ type: "offer", offer }) },
            MemberId
        );
        console.log("Sent offer to", MemberId);
    } catch (error) {
        console.error("Error creating or sending offer:", error);
    }
};

const createAnswer = async (MemberId, offer) => {
    try {
        await createPeerConnection(MemberId);
        await peerConnection.setRemoteDescription(offer);

        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);

        await client.sendMessageToPeer(
            { text: JSON.stringify({ type: "answer", answer }) },
            MemberId
        );
        console.log("Sent answer to", MemberId);
    } catch (error) {
        console.error("Error creating or sending answer:", error);
    }
};

const addAnswer = async (answer) => {
    try {
        if (!peerConnection.currentRemoteDescription) {
            await peerConnection.setRemoteDescription(answer);
            console.log("Added remote description:", answer);
        }
    } catch (error) {
        console.error("Error adding remote description:", error);
    }
};

let leaveChannel = async () => {
    await channel.leave()
    await client.logout()
}

let toggleCamera = async () => {
    let videoTrack = localStream.getTracks().find(track => track.kind === 'video')

    if(videoTrack.enabled){
        videoTrack.enabled = false
        document.getElementById('camera-btn').style.backgroundColor = 'rgb(255,80,80)'
    }else{
        videoTrack.enabled = true
        document.getElementById('camera-btn').style.backgroundColor = 'rgb(179,102,249, .9)'
    }
}

let toggleMic = async () => {
    let audioTrack = localStream.getTracks().find(track => track.kind === 'audio')

    if(audioTrack.enabled){
        audioTrack.enabled = false
        document.getElementById('mic-btn').style.backgroundColor = 'rgb(255,80,80)'
    }else{
        audioTrack.enabled = true
        document.getElementById('mic-btn').style.backgroundColor = 'rgb(179,102,249, .9)'
    }
}




window.addEventListener('beforeunload', leaveChannel)

document.getElementById('camera-btn').addEventListener('click', toggleCamera)
document.getElementById('mic-btn').addEventListener('click', toggleMic)

// Start initialization
init();
