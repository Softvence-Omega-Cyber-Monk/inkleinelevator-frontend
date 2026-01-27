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

const SOCKET_URL = "https://inkleinelevator-server.onrender.com";

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
      console.log("⚠️ No userId provided, skipping socket connection");
      if (socketRef.current) {
        console.log("🧹 Disconnecting existing socket");
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    console.log("🔌 Initializing socket connection for user:", userId);
    console.log("🔌 Socket URL:", SOCKET_URL);

    // Try different configurations - one of these should work
    const socketConfigs = [
      // Config 1: With custom path
      {
        url: SOCKET_URL,
        options: {
          path: "/socket/message/socket.io",
          query: { userId },
          transports: ["polling", "websocket"], // Try polling first
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionAttempts: 5,
        },
      },
      // Config 2: Without custom path (default Socket.IO)
      {
        url: `${SOCKET_URL}/socket/message`,
        options: {
          query: { userId },
          transports: ["polling", "websocket"],
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionAttempts: 5,
        },
      },
    ];

    // Try the first config (you can switch if needed)
    const config = socketConfigs[1]; // Try config 2 first

    console.log("🔧 Using config:", {
      url: config.url,
      path: config.options.path || "default",
      transports: config.options.transports,
    });

    const newSocket = io(config.url, config.options);

    // Connection event handlers
    newSocket.on("connect", () => {
      console.log("✅ Socket connected successfully!");
      console.log("   Socket ID:", newSocket.id);
      console.log("   User ID:", userId);
      console.log("   Transport:", newSocket.io.engine.transport.name);
      console.log("   Connected:", newSocket.connected);
      setIsConnected(true);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected. Reason:", reason);
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
      console.log("🔄 Will try polling transport...");
    });

    newSocket.on("reconnect_attempt", (attemptNumber) => {
      console.log("🔄 Reconnection attempt:", attemptNumber);
    });

    newSocket.on("reconnect", (attemptNumber) => {
      console.log("✅ Socket reconnected after", attemptNumber, "attempts");
      setIsConnected(true);
    });

    newSocket.on("reconnect_failed", () => {
      console.error("❌ Socket reconnection failed after max attempts");
    });

    // Debug: Log all incoming events
    newSocket.onAny((eventName, ...args) => {
      console.log(`📡 Socket event received: "${eventName}"`, args);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    // Cleanup on unmount or userId change
    return () => {
      console.log("🧹 Cleaning up socket connection for user:", userId);
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
