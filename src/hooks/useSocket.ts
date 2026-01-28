// import { useEffect, useRef, useState } from 'react';
// import { io, Socket } from 'socket.io-client';

// const SOCKET_URL = 'https://inkleinelevator-server.onrender.com/socket/message';

// interface UseSocketReturn {
//   socket: Socket | null;
//   isConnected: boolean;
// }

// export const useSocket = (userId: string | null): UseSocketReturn => {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [isConnected, setIsConnected] = useState<boolean>(false);
//   const socketRef = useRef<Socket | null>(null);

//   useEffect(() => {
//     if (!userId) {
//       // Disconnect if no user ID
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//         socketRef.current = null;
//         setSocket(null);
//         setIsConnected(false);
//       }
//       return;
//     }

//     // Create socket connection
//     const newSocket = io(SOCKET_URL, {
//       query: { userId },
//       transports: ['websocket', 'polling'],
//     });

//     // Connection event handlers
//     newSocket.on('connect', () => {
//       console.log('Socket connected');
//       setIsConnected(true);
//     });

//     newSocket.on('disconnect', () => {
//       console.log('Socket disconnected');
//       setIsConnected(false);
//     });

//     socketRef.current = newSocket;
//     setSocket(newSocket);

//     // Cleanup on unmount or userId change
//     return () => {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//         socketRef.current = null;
//         setSocket(null);
//         setIsConnected(false);
//       }
//     };
//   }, [userId]);

//   return { socket, isConnected };
// };

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "https://api.inkleinelevators.com";

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
}

export const useSocket = (userId: string | null): UseSocketReturn => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId) {
      console.log("⚠️ No userId, skipping socket");
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    console.log("🔌 Connecting socket for user:", userId);
    console.log("🔌 Socket URL:", SOCKET_URL);

    const newSocket = io(SOCKET_URL, {
      query: { userId: userId },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    newSocket.on("connect", () => {
      console.log("✅ ✅ ✅ Socket CONNECTED successfully!");
      console.log("   Socket ID:", newSocket.id);
      console.log("   User ID:", userId);
      console.log("   Transport:", newSocket.io.engine.transport.name);
      setIsConnected(true);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected. Reason:", reason);
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("❌ Connection error:", error.message);
    });

    // IMPORTANT: Log ALL socket events
    newSocket.onAny((eventName, ...args) => {
      console.log(`📡 📡 📡 Socket event received: "${eventName}"`, args);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      console.log("🧹 Disconnecting socket for user:", userId);
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
    };
  }, [userId]);

  return { socket, isConnected };
};
