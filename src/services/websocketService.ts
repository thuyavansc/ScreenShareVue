// import { useDeviceStore } from "@/store/deviceStore";
// import SimplePeer from "simple-peer";

// const deviceStore = useDeviceStore();

// let socket: WebSocket | null = null;
// let peer: SimplePeer.Instance | null = null;

// export const startWebSocketConnection = () => {
//   const url = "ws://localhost:3000"; // Your signaling server URL
//   socket = new WebSocket(url);

//   socket.onopen = () => {
//     console.log("WebSocket connection opened");
//   };

//   socket.onmessage = (message) => {
//     const data = JSON.parse(message.data);
//     console.log("WebSocket message received:", data);

//     switch (data.type) {
//       case "SignIn":
//         deviceStore.addDevice(data.username);
//         break;
//       case "Offer":
//         handleOffer(data);
//         break;
//       case "IceCandidate":
//         handleIceCandidate(data);
//         break;
//       case "EndCall":
//         handleEndCall();
//         break;
//       default:
//         console.log(`Unknown message type: ${data.type}`);
//     }
//   };

//   socket.onclose = () => {
//     console.log("WebSocket connection closed");
//   };

//   socket.onerror = (error) => {
//     console.error("WebSocket error:", error);
//   };
// };

// // Request to start screen sharing
// export const requestScreenShare = (target: string) => {
//   if (socket) {
//     socket.send(
//       JSON.stringify({
//         type: "StartStreaming",
//         target,
//       })
//     );
//   }
// };

// // Handle WebRTC Offer from Android (SDP)
// const handleOffer = (data: any) => {
//   peer = new SimplePeer({ initiator: false, trickle: false });

//   // Receive the offer from Android and signal it in SimplePeer
//   peer.signal(data.offer);

//   // Send SDP answer back to Android after creating it
//   peer.on("signal", (answer) => {
//     if (socket) {
//       socket.send(
//         JSON.stringify({
//           type: "Answer",
//           target: data.username,
//           answer,
//         })
//       );
//     }
//   });

//   // Handle the remote video stream from Android
//   peer.on("stream", (stream) => {
//     const videoElement = document.getElementById(
//       "remoteVideo"
//     ) as HTMLVideoElement;
//     if (videoElement) {
//       videoElement.srcObject = stream;
//     }
//   });
// };

// // Handle incoming ICE candidates from Android
// const handleIceCandidate = (data: any) => {
//   if (peer) {
//     peer.signal(data.candidate);
//   }
// };

// // Send local ICE candidates to Android
// const sendIceCandidate = (candidate: any, target: string) => {
//   if (socket) {
//     socket.send(
//       JSON.stringify({
//         type: "IceCandidate",
//         target,
//         candidate,
//       })
//     );
//   }
// };

// // Handle end call event
// const handleEndCall = () => {
//   if (peer) {
//     peer.destroy();
//     peer = null;
//   }

//   const videoElement = document.getElementById(
//     "remoteVideo"
//   ) as HTMLVideoElement;
//   if (videoElement) {
//     videoElement.srcObject = null;
//   }
// };

//Code-2---------
import SimplePeer from "simple-peer";

let socket: WebSocket | null = null;
let peer: SimplePeer.Instance | null = null;
let deviceStore: any = null; // We will set the store instance later

const url = "ws://localhost:3000"; // Your signaling server URL
const username = "admin-vue";

export const startWebSocketConnection = (store: any) => {
  deviceStore = store; // Set the store instance
  socket = new WebSocket(url);

  socket.onopen = () => {
    console.log("WebSocket connection opened");
    // Automatically sign in the Vue app as "admin-vue" when connected
    socket?.send(
      JSON.stringify({
        type: "SignIn",
        username: username,
      })
    );
  };

  socket.onmessage = (message) => {
    const data = JSON.parse(message.data);
    console.log("WebSocket message received:", data);

    switch (data.type) {
      case "SignIn":
        console.log("WebSocket message received: SignIn ");
        deviceStore.addDevice(data.username); // Use the passed store
        break;
      case "Offer":
        console.log("WebSocket message received: Offer ");
        handleOffer(data);
        break;
      case "IceCandidate":
        console.log("WebSocket message received: IceCandidate ");
        handleIceCandidate(data);
        break;
      case "EndCall":
        console.log("WebSocket message received: EndCall ");
        handleEndCall();
        break;
      default:
        console.log(`Unknown message type: ${data.type}`);
    }
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed");
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error);
  };
};

// Function to send a screen share request to the Android device
export const requestScreenShare = (target: string) => {
  if (socket) {
    socket.send(
      JSON.stringify({
        type: "StartStreaming",
        target,
        username: username,
      })
    );
  } else {
    console.error("WebSocket connection not available");
  }
};

// Handle WebRTC Offer from Android (SDP)
// const handleOffer = (data: any) => {
//   peer = new SimplePeer({ initiator: false, trickle: false });

//   // Receive the offer from Android and signal it in SimplePeer
//   peer.signal(data.offer);

//   // Send SDP answer back to Android after creating it
//   peer.on("signal", (answer) => {
//     if (socket) {
//       socket.send(
//         JSON.stringify({
//           type: "Answer",
//           target: data.username,
//           answer,
//         })
//       );
//     }
//   });

//   // Handle the remote video stream from Android
//   peer.on("stream", (stream) => {
//     const videoElement = document.getElementById(
//       "remoteVideo"
//     ) as HTMLVideoElement;
//     if (videoElement) {
//       videoElement.srcObject = stream;
//     }
//   });
// };

const handleOffer = (data: any) => {
  console.log("Received offer: ", data.offer); // Log the offer to verify it's well-formed
  if (!data.offer) {
    console.error("No offer found in the message");
    return;
  }

  console.log("Received offer: ", data.offer); // Log the offer to verify it's well-formed

  // Ensure the peer is initialized only once
  if (!peer) {
    peer = new SimplePeer({
      initiator: false, // This peer is not the initiator since we are responding to an offer
      trickle: false, // Disable trickle ICE to handle ICE candidates manually
      stream: undefined, // Use undefined if no local stream is provided
    });

    // Handle the offer received from the Android device
    peer.signal(data.offer);

    // When the peer creates an answer (after receiving an offer)
    peer.on("signal", (answer) => {
      console.log("Sending answer back to Android device", answer);
      if (socket) {
        socket.send(
          JSON.stringify({
            type: "Answer",
            target: data.username,
            answer, // The answer SDP
          })
        );
      }
    });

    // When we receive a media stream from the Android device (video, etc.)
    peer.on("stream", (stream) => {
      console.log("Received remote stream from Android device");
      const videoElement = document.getElementById(
        "remoteVideo"
      ) as HTMLVideoElement;
      if (videoElement) {
        videoElement.srcObject = stream;
      }
    });

    // Handle errors within the peer connection
    peer.on("error", (err) => {
      console.error("WebRTC Peer error:", err);
    });
  } else {
    console.error("Peer is already initialized");
  }
};

// Handle incoming ICE candidates from Android
const handleIceCandidate = (data: any) => {
  if (peer) {
    peer.signal(data.candidate);
  }
};

// Handle end call event
const handleEndCall = () => {
  if (peer) {
    peer.destroy();
    peer = null;
  }

  const videoElement = document.getElementById(
    "remoteVideo"
  ) as HTMLVideoElement;
  if (videoElement) {
    videoElement.srcObject = null;
  }
};