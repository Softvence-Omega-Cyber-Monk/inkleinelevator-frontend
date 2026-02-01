// // hooks/useSocket.tsx
// import { useEffect, useRef, useState } from 'react';
// import { io, Socket } from 'socket.io-client';

// const SOCKET_URL = 'https://inkleinelevator-server.onrender.com';
// // Alternative URL if needed: 'https://api.inkleinelevators.com'

// interface UseSocketReturn {
//   socket: Socket | null;
//   isConnected: boolean;
//   error: string | null;
//   reconnect: () => void;
// }

// export const useSocket = (userId: string | null): UseSocketReturn => {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [isConnected, setIsConnected] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const socketRef = useRef<Socket | null>(null);
//   const connectionAttempts = useRef(0);
//   const MAX_RETRIES = 3;

//   const createSocketConnection = (userId: string) => {
//     if (socketRef.current) {
//       socketRef.current.disconnect();
//       socketRef.current = null;
//     }

//     try {
//       console.log(`🔄 Creating Socket.io connection for user: ${userId}`);

//       const newSocket = io(SOCKET_URL, {
//         query: {
//           userId,
//           clientType: 'web',
//           timestamp: Date.now()
//         },
//         transports: ['polling', 'websocket'], // Try polling first, then websocket
//         path: '/socket.io',
//         reconnection: true,
//         reconnectionAttempts: 5,
//         reconnectionDelay: 1000,
//         reconnectionDelayMax: 5000,
//         timeout: 10000,
//         autoConnect: true,
//         forceNew: false,
//       });

//       // Connection event handlers
//       newSocket.on('connect', () => {
//         console.log('✅ Socket.io CONNECTED!', {
//           socketId: newSocket.id,
//           userId,
//           transport: newSocket.io.engine?.transport?.name
//         });
//         setIsConnected(true);
//         setError(null);
//         connectionAttempts.current = 0;
//       });

//       newSocket.on('connect_error', (err) => {
//         console.error('❌ Socket.io connection error:', {
//           message: err.message,
//           description: err.description,
//           attempts: connectionAttempts.current
//         });

//         setIsConnected(false);
//         connectionAttempts.current += 1;

//         if (connectionAttempts.current >= MAX_RETRIES) {
//           setError('Unable to establish real-time connection. Using API fallback.');
//           console.log('Max connection attempts reached, giving up on WebSocket');
//         } else {
//           setError(`Connecting... (attempt ${connectionAttempts.current}/${MAX_RETRIES})`);
//         }
//       });

//       newSocket.on('disconnect', (reason) => {
//         console.log('⚠️ Socket.io disconnected:', reason);
//         setIsConnected(false);

//         if (reason === 'io server disconnect') {
//           setError('Server disconnected. Will try to reconnect...');
//         }
//       });

//       newSocket.on('reconnect', (attempt) => {
//         console.log(`♻️ Socket.io reconnected after ${attempt} attempts`);
//         setIsConnected(true);
//         setError(null);
//       });

//       newSocket.on('reconnect_error', (err) => {
//         console.error('❌ Socket.io reconnection error:', err.message);
//         setError('Reconnection failed. Using API fallback.');
//       });

//       newSocket.on('reconnect_failed', () => {
//         console.error('❌ Socket.io reconnection failed');
//         setError('Unable to reconnect. Messages will use API.');
//       });

//       // Listen for incoming messages
//       newSocket.on('message', (data) => {
//         console.log('📨 Received message via socket:', data);
//       });

//       newSocket.on('receive-message', (data) => {
//         console.log('📨 Received "receive-message" event:', data);
//       });

//       socketRef.current = newSocket;
//       setSocket(newSocket);
//       setError('Connecting to chat server...');

//     } catch (err: any) {
//       console.error('Failed to create socket connection:', err);
//       setError(`Connection error: ${err.message}`);
//     }
//   };

//   useEffect(() => {
//     if (!userId) {
//       if (socketRef.current) {
//         socketRef.current.disconnect();
//         socketRef.current = null;
//       }
//       setSocket(null);
//       setIsConnected(false);
//       setError(null);
//       return;
//     }

//     createSocketConnection(userId);

//     // Cleanup function
//     return () => {
//       if (socketRef.current) {
//         console.log('🧹 Cleaning up socket connection');
//         socketRef.current.disconnect();
//         socketRef.current = null;
//         setSocket(null);
//         setIsConnected(false);
//         setError(null);
//       }
//     };
//   }, [userId]);

//   // Manual reconnect function
//   const reconnect = () => {
//     if (userId) {
//       console.log('🔄 Manual reconnect triggered');
//       setError('Reconnecting...');
//       createSocketConnection(userId);
//     }
//   };

//   return { socket, isConnected, error, reconnect };
// };

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

// const SOCKET_URL = 'https://inkleinelevator-server.onrender.com/socket/message';
const SOCKET_URL = "https://api.inkleinelevators.com/socket/message";

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
