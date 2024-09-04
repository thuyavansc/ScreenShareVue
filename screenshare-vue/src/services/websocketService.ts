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

export const startWebSocketConnection = (store: any) => {
  deviceStore = store; // Set the store instance
  const url = "ws://localhost:3000"; // Your signaling server URL
  socket = new WebSocket(url);

  socket.onopen = () => {
    console.log("WebSocket connection opened");
  };

  socket.onmessage = (message) => {
    const data = JSON.parse(message.data);
    console.log("WebSocket message received:", data);

    switch (data.type) {
      case "SignIn":
        deviceStore.addDevice(data.username); // Use the passed store
        break;
      case "Offer":
        handleOffer(data);
        break;
      case "IceCandidate":
        handleIceCandidate(data);
        break;
      case "EndCall":
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

// Request to start screen sharing
export const requestScreenShare = (target: string) => {
  if (socket) {
    socket.send(
      JSON.stringify({
        type: "StartStreaming",
        target,
      })
    );
  }
};

// Handle WebRTC Offer from Android (SDP)
const handleOffer = (data: any) => {
  peer = new SimplePeer({ initiator: false, trickle: false });

  // Receive the offer from Android and signal it in SimplePeer
  peer.signal(data.offer);

  // Send SDP answer back to Android after creating it
  peer.on("signal", (answer) => {
    if (socket) {
      socket.send(
        JSON.stringify({
          type: "Answer",
          target: data.username,
          answer,
        })
      );
    }
  });

  // Handle the remote video stream from Android
  peer.on("stream", (stream) => {
    const videoElement = document.getElementById(
      "remoteVideo"
    ) as HTMLVideoElement;
    if (videoElement) {
      videoElement.srcObject = stream;
    }
  });
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
