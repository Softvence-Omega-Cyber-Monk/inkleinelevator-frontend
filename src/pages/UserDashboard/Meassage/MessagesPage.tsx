 
import { useState, useEffect, useMemo } from "react";
import { Search, ArrowLeft } from "lucide-react";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import { useGetChatListUserQuery, useGetMessageHistoryQuery } from "@/Redux/features/userDa/message/messageApi";
import { useGetMeMutation } from "@/Redux/features/auth/authApi";
import { useSocket } from "@/hooks/useSocket";

interface Conversation {
  id: number | string;
  name: string;
  avatar: string;
  lastMessage: string;
  unread: boolean;
  userId?: string;
}

export default function MessagesPage() {
  const [getMe] = useGetMeMutation();
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string |number | null>(null);
  // Socket.IO connection
  const { socket, isConnected } = useSocket(currentUserId);
  
  // Fetch chat list users
  const { data: chatListData, isLoading: isLoadingChatList } = useGetChatListUserQuery();
  
  // Get current user ID
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getMe({}).unwrap();
        if (response?.data?.userId) {
          setCurrentUserId(response.data.userId);
        }
      } catch (error) {
        console.error("Failed to get user:", error);
      }
    };
    fetchUser();
  }, [getMe]);

  // Transform chat list data to conversations
  const conversations = useMemo(() => {
    if (!chatListData?.data) return [];
    
    // Handle both array and object responses
    const chatUsers = Array.isArray(chatListData.data) 
      ? chatListData.data 
      : Object.values(chatListData.data);
    
    // Filter out current user if it appears in the list, and map to conversations
    return chatUsers
      .filter((user: any) => {
        // Exclude current user from the chat list
        const userId = String(user.id || user.userId || '');
        const currentUserIdStr = currentUserId ? String(currentUserId) : '';
        return userId !== currentUserIdStr;
      })
      .map((user: any, index: number) => {
        // Extract the other user's ID - this is the ID we'll use for the API
        const otherUserId = user.id || user.userId;
        const userIdString = otherUserId ? String(otherUserId) : null;
        
        console.log('📋 Creating conversation:', {
          otherUserId: userIdString,
          currentUserId: currentUserId ? String(currentUserId) : null,
          userName: user.name || user.companyName || user.email,
        });
        
        return {
          id: otherUserId || index + 1,
          name: user.name || user.companyName || user.email || `User ${index + 1}`,
          avatar: user.avatar || user.profile || user.businessLogo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || index}`,
          lastMessage: user.lastMessage || "No messages yet",
          unread: user.unread || false,
          userId: userIdString || undefined, // Store the OTHER user's ID - this will be used in the API
        };
      }) as Conversation[];
  }, [chatListData, currentUserId]);

  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(
    conversations.length > 0 ? conversations[0] : null
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Update selectedUserId when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      const userId = selectedConversation.userId || selectedConversation.id;
      setSelectedUserId(userId);
      console.log('✅ Selected user ID updated:', userId);
    }
  }, [selectedConversation]);

  // Filter conversations based on search
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const query = searchQuery.toLowerCase();
    return conversations.filter((conv) =>
      conv.name.toLowerCase().includes(query)
    );
  }, [conversations, searchQuery]);

  // Update selected conversation when conversations change
  useEffect(() => {
    if (!selectedConversation && conversations.length > 0) {
      setSelectedConversation(conversations[0]);
    }
  }, [conversations, selectedConversation]);

  // Update selectedUserId when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      const userId = selectedConversation.userId || selectedConversation.id;
      setSelectedUserId(userId);
      console.log('✅ Selected user ID updated:', userId, 'from conversation:', selectedConversation.name);
    } else {
      setSelectedUserId(null);
    }
  }, [selectedConversation]);

  // Get the OTHER user's ID for message history (not current user's ID)
  // This is the ID of the user selected from the conversation list
  const withUserId = useMemo(() => {
    if (!selectedConversation || !currentUserId) {
      console.log('Cannot get withUserId - selectedConversation:', selectedConversation, 'currentUserId:', currentUserId);
      return "";
    }
    
    // Get the other user's ID from the selected conversation
    // Priority: userId (explicit) > id (fallback)
    const otherUserId = selectedConversation.userId 
      ? String(selectedConversation.userId) 
      : String(selectedConversation.id || "");
    
    const currentUserIdStr = String(currentUserId);
    
    // Ensure we're not accidentally using the current user's ID
    if (otherUserId === currentUserIdStr) {
      console.warn('Warning: withUserId matches currentUserId, this should not happen');
      console.warn('Selected conversation:', selectedConversation);
      return "";
    }
    
    console.log('✅ Message history query - Selected user ID (withUserId):', otherUserId);
    console.log('   Current user ID:', currentUserIdStr);
    console.log('   Selected conversation:', selectedConversation);
    return otherUserId;
  }, [selectedConversation, currentUserId]);

  // Fetch message history when conversation is selected
  // This API will fetch messages between current user and the selected user
  // Use selectedUserId (set when conversation is selected) as withUserId parameter
  const { data: messageHistoryData, isLoading: isLoadingMessages } = useGetMessageHistoryQuery(
    { withUserId: selectedUserId || withUserId },
    { 
      skip: !selectedConversation || !currentUserId || !selectedUserId || String(selectedUserId) === String(currentUserId),
    }
  );
  
  console.log('messageHistoryData:', messageHistoryData);
  console.log('API called with selectedUserId:', selectedUserId);
  // Log when API is called
  useEffect(() => {
    if (withUserId && selectedConversation) {
      console.log('🔄 Fetching message history with selected user ID:', withUserId);
      console.log('   Selected conversation name:', selectedConversation.name);
    }
  }, [withUserId, selectedConversation]);

  // Local messages state for real-time updates
  const [realTimeMessages, setRealTimeMessages] = useState<Array<{
    id: number;
    sender: "user" | "other";
    senderName: string;
    text: string;
    timestamp: Date;
  }>>([]);

  // Transform message history to component format
  const messages = useMemo(() => {
    // Handle direct array response (API returns array directly, not wrapped in data)
    let messagesArray: any[] = [];
    
    if (Array.isArray(messageHistoryData)) {
      // Direct array response
      messagesArray = messageHistoryData;
    } else if (Array.isArray(messageHistoryData?.data)) {
      // Wrapped in data property
      messagesArray = messageHistoryData.data;
    } else {
      console.log('No message history data or not an array:', messageHistoryData);
      return [];
    }

    if (!currentUserId) {
      console.log('No currentUserId available');
      return [];
    }

    if (messagesArray.length === 0) {
      console.log('Message history array is empty');
      return [];
    }

    const currentUserIdStr = String(currentUserId).trim().toLowerCase();
    console.log('✅ Transforming messages, currentUserId:', currentUserIdStr, 'total messages:', messagesArray.length);

    const transformed = messagesArray.map((msg: any) => {
      // Convert to string for reliable comparison - use senderId directly from API
      const msgSenderId = String(msg.senderId || '').trim().toLowerCase();
      const isCurrentUser = msgSenderId === currentUserIdStr;
      
      return {
        id: msg.messageId || msg.id || Date.now(), // Use messageId from API
        sender: (isCurrentUser ? "user" : "other") as "user" | "other",
        senderName: isCurrentUser ? "You" : selectedConversation?.name || "User",
        text: msg.text || "",
        timestamp: msg.createdAt ? new Date(msg.createdAt) : new Date(),
      };
    });

    console.log('✅ Transformed messages:', transformed.length);
    console.log('   User messages count:', transformed.filter(m => m.sender === "user").length);
    console.log('   Other messages count:', transformed.filter(m => m.sender === "other").length);

    return transformed;
  }, [messageHistoryData, currentUserId, selectedConversation]);

  // Listen for real-time messages via Socket.IO
  useEffect(() => {
    if (!socket || !currentUserId || !selectedConversation) return;

    const receiverId = String(selectedConversation.userId || selectedConversation.id);
    const currentUserIdStr = String(currentUserId);

    const handleReceiveMessage = (message: any) => {
      console.log('New message received via socket:', message);
      
      // Convert IDs to strings for comparison - handle multiple possible field names
      const messageSenderId = String(message.senderId || message.sender?.userId || message.sender?.id || message.userId || '').trim().toLowerCase();
      const messageReceiverId = String(message.receiverId || message.receiver?.userId || message.receiver?.id || '').trim().toLowerCase();
      
      // Debug log
      console.log('Socket message check:', {
        messageSenderId,
        messageReceiverId,
        currentUserIdStr: currentUserIdStr.toLowerCase(),
        receiverId: receiverId.toLowerCase(),
        fullMessage: message,
        matches: (messageSenderId === currentUserIdStr.toLowerCase() && messageReceiverId === receiverId.toLowerCase()) ||
                 (messageSenderId === receiverId.toLowerCase() && messageReceiverId === currentUserIdStr.toLowerCase()),
      });
      
      // Check if message is for current conversation
      // Include messages where:
      // 1. User sent to receiver (senderId === currentUserId, receiverId === receiverId)
      // 2. Receiver sent to user (senderId === receiverId, receiverId === currentUserId)
      if (
        (messageSenderId === currentUserIdStr.toLowerCase() && messageReceiverId === receiverId.toLowerCase()) ||
        (messageSenderId === receiverId.toLowerCase() && messageReceiverId === currentUserIdStr.toLowerCase())
      ) {
        const isCurrentUser = messageSenderId === currentUserIdStr.toLowerCase();
        const newMessage = {
          id: message.id || Date.now(),
          sender: (isCurrentUser ? "user" : "other") as "user" | "other",
          senderName: isCurrentUser ? "You" : selectedConversation?.name || "User",
          text: message.text || "",
          timestamp: message.createdAt ? new Date(message.createdAt) : new Date(),
        };

        console.log('Adding message to real-time list:', newMessage);
        setRealTimeMessages((prev) => {
          // Check if message already exists to avoid duplicates
          const exists = prev.some((m) => m.id === newMessage.id);
          if (exists) {
            console.log('Message already exists, skipping');
            return prev;
          }
          console.log('Adding new message, previous count:', prev.length);
          return [...prev, newMessage];
        });
      } else {
        console.log('Message does not match current conversation, ignoring');
      }
    };

    socket.on('receive-message', handleReceiveMessage);

    return () => {
      socket.off('receive-message', handleReceiveMessage);
    };
  }, [socket, currentUserId, selectedConversation]);

  // Reset real-time messages when conversation changes
  useEffect(() => {
    setRealTimeMessages([]);
  }, [selectedConversation?.id]);

  // Function to add optimistic message (for when user sends a message)
  const addOptimisticMessage = useMemo(() => {
    return (text: string, _receiverId: string) => {
      if (!currentUserId || !selectedConversation) return;
      
      const optimisticMessage = {
        id: Date.now(), // Temporary ID
        sender: "user" as const,
        senderName: "You",
        text: text,
        timestamp: new Date(),
      };

      console.log('Adding optimistic message:', optimisticMessage);
      setRealTimeMessages((prev) => [...prev, optimisticMessage]);
    };
  }, [currentUserId, selectedConversation]);

  // Combine API messages with real-time messages
  const allMessages = useMemo(() => {
    const apiMessages = messages;
    const combined = [...apiMessages, ...realTimeMessages];
    
    // Remove duplicates and sort by timestamp
    const uniqueMessages = combined.reduce((acc, msg) => {
      // For optimistic messages (temporary IDs), check by text and timestamp instead
      const exists = acc.find((m) => {
        if (m.id === msg.id) return true;
        // Also check if it's the same message by text and timestamp (within 5 seconds)
        if (m.text === msg.text && Math.abs(m.timestamp.getTime() - msg.timestamp.getTime()) < 5000) {
          return true;
        }
        return false;
      });
      if (!exists) acc.push(msg);
      return acc;
    }, [] as typeof combined);

    return uniqueMessages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  }, [messages, realTimeMessages]);

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* ================= SIDEBAR ================= */}
      <div
        className="
          w-full lg:w-80
          border-r border-gray-200
          flex flex-col
          hidden lg:flex
        "
      >
        {/* Header */}
        <div className="p-4  border-b border-gray-100">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Messages
          </h1>
        </div>

        {/* Search */}
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-3 px-4 py-2.5 bg-gray-100 rounded-full">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-gray-900 placeholder-gray-500 outline-none flex-1"
            />
          </div>
        </div>

        {/* Conversation List */}
        {isLoadingChatList ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Loading conversations...</div>
          </div>
        ) : (
          <ConversationList
            conversations={filteredConversations}
            selectedConversation={selectedConversation}
            onSelectConversation={setSelectedConversation}
          />
        )}
      </div>

      {/* ================= CHAT ================= */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        {selectedConversation && (
          <div className="lg:hidden flex items-center gap-3 p-4 border-b border-gray-200">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft size={20} />
            </button>
            <span className="font-medium text-gray-900">
              {selectedConversation.name}
            </span>
          </div>
        )}

        {selectedConversation ? (
          <ChatWindow
            conversation={selectedConversation}
            messages={allMessages}
            isLoadingMessages={isLoadingMessages}
            receiverId={selectedConversation.userId || String(selectedConversation.id)}
            isConnected={isConnected}
            currentUserId={currentUserId}
            onMessageSent={addOptimisticMessage}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-gray-500">Select a conversation to start chatting</div>
          </div>
        )}
      </div>
    </div>
  );
}
