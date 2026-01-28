import { useState, useEffect, useMemo } from "react";
import { Search, ArrowLeft } from "lucide-react";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import {
  useGetChatListUserQuery,
  useGetMessageHistoryQuery,
} from "@/Redux/features/userDa/message/messageApi";
import { useGetMeMutation } from "@/Redux/features/auth/authApi";
import { useSocket } from "@/hooks/useSocket";
import { BeatLoader } from "react-spinners";

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
  const [selectedUserId, setSelectedUserId] = useState<string | number | null>(
    null,
  );
  // Socket.IO connection
  const { socket, isConnected } = useSocket(currentUserId);

  // Fetch chat list users
  const { data: chatListData, isLoading: isLoadingChatList } =
    useGetChatListUserQuery();

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
        const userId = String(user.id || user.userId || "");
        const currentUserIdStr = currentUserId ? String(currentUserId) : "";
        return userId !== currentUserIdStr;
      })
      .map((user: any, index: number) => {
        // Extract the other user's ID - this is the ID we'll use for the API
        const otherUserId = user.id || user.userId;
        const userIdString = otherUserId ? String(otherUserId) : null;

        console.log("📋 Creating conversation:", {
          otherUserId: userIdString,
          currentUserId: currentUserId ? String(currentUserId) : null,
          userName: user.name || user.companyName || user.email,
        });

        return {
          id: otherUserId || index + 1,
          name:
            user.name || user.companyName || user.email || `User ${index + 1}`,
          avatar:
            user.avatar ||
            user.profile ||
            user.businessLogo ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name || index}`,
          lastMessage: user.lastMessage || "No messages yet",
          unread: user.unread || false,
          userId: userIdString || undefined, // Store the OTHER user's ID - this will be used in the API
        };
      }) as Conversation[];
  }, [chatListData, currentUserId]);

  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(
      conversations.length > 0 ? conversations[0] : null,
    );
  const [searchQuery, setSearchQuery] = useState("");

  // Update selectedUserId when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      const userId = selectedConversation.userId || selectedConversation.id;
      setSelectedUserId(userId);
      console.log("✅ Selected user ID updated:", userId);
    }
  }, [selectedConversation]);

  // Filter conversations based on search
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return conversations;
    const query = searchQuery.toLowerCase();
    return conversations.filter((conv) =>
      conv.name.toLowerCase().includes(query),
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
      console.log(
        "✅ Selected user ID updated:",
        userId,
        "from conversation:",
        selectedConversation.name,
      );
    } else {
      setSelectedUserId(null);
    }
  }, [selectedConversation]);

  // Get the OTHER user's ID for message history (not current user's ID)
  // This is the ID of the user selected from the conversation list
  const withUserId = useMemo(() => {
    if (!selectedConversation || !currentUserId) {
      console.log(
        "Cannot get withUserId - selectedConversation:",
        selectedConversation,
        "currentUserId:",
        currentUserId,
      );
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
      console.warn(
        "Warning: withUserId matches currentUserId, this should not happen",
      );
      console.warn("Selected conversation:", selectedConversation);
      return "";
    }

    console.log(
      "✅ Message history query - Selected user ID (withUserId):",
      otherUserId,
    );
    console.log("   Current user ID:", currentUserIdStr);
    console.log("   Selected conversation:", selectedConversation);
    return otherUserId;
  }, [selectedConversation, currentUserId]);

  // Fetch message history when conversation is selected
  // This API will fetch messages between current user and the selected user
  // Use selectedUserId (set when conversation is selected) as withUserId parameter
  const { data: messageHistoryData, isLoading: isLoadingMessages } =
    useGetMessageHistoryQuery(
      { withUserId: selectedUserId || withUserId },
      {
        skip:
          !selectedConversation ||
          !currentUserId ||
          !selectedUserId ||
          String(selectedUserId) === String(currentUserId),
      },
    );
  // socket io
  // Local messages state for real-time updates
  const [realTimeMessages, setRealTimeMessages] = useState<
    Array<{
      id: number | string;
      sender: "user" | "other";
      senderName: string;
      text: string;
      timestamp: Date;
    }>
  >([]);

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
      console.log(
        "No message history data or not an array:",
        messageHistoryData,
      );
      return [];
    }

    if (!currentUserId) {
      console.log("No currentUserId available");
      return [];
    }

    if (messagesArray.length === 0) {
      console.log("Message history array is empty");
      return [];
    }

    const currentUserIdStr = String(currentUserId).trim().toLowerCase();
    console.log(
      "✅ Transforming messages, currentUserId:",
      currentUserIdStr,
      "total messages:",
      messagesArray.length,
    );

    const transformed = messagesArray.map((msg: any) => {
      // Convert to string for reliable comparison - use senderId directly from API
      const msgSenderId = String(msg.senderId || "")
        .trim()
        .toLowerCase();
      const isCurrentUser = msgSenderId === currentUserIdStr;

      return {
        id: msg.messageId || msg.id || Date.now(), // Use messageId from API
        sender: (isCurrentUser ? "user" : "other") as "user" | "other",
        senderName: isCurrentUser
          ? "You"
          : selectedConversation?.name || "User",
        text: msg.text || "",
        timestamp: msg.createdAt ? new Date(msg.createdAt) : new Date(),
      };
    });

    console.log("✅ Transformed messages:", transformed.length);
    console.log(
      "   User messages count:",
      transformed.filter((m) => m.sender === "user").length,
    );
    console.log(
      "   Other messages count:",
      transformed.filter((m) => m.sender === "other").length,
    );

    return transformed;
  }, [messageHistoryData, currentUserId, selectedConversation]);

  // Listen for real-time messages via Socket.IO
  useEffect(() => {
    if (!socket || !currentUserId || !selectedConversation) return;

    const receiverId = String(
      selectedConversation.userId || selectedConversation.id,
    );
    const currentUserIdStr = String(currentUserId);

    const handleReceiveMessage = (message: any) => {
      console.log("New message received via socket:", message);

      // Convert IDs to strings for comparison - handle multiple possible field names
      const messageSenderId = String(
        message.senderId ||
          message.sender?.userId ||
          message.sender?.id ||
          message.userId ||
          "",
      )
        .trim()
        .toLowerCase();
      const messageReceiverId = String(
        message.receiverId ||
          message.receiver?.userId ||
          message.receiver?.id ||
          "",
      )
        .trim()
        .toLowerCase();

      // Debug log
      console.log("Socket message check:", {
        messageSenderId,
        messageReceiverId,
        currentUserIdStr: currentUserIdStr.toLowerCase(),
        receiverId: receiverId.toLowerCase(),
        fullMessage: message,
        matches:
          (messageSenderId === currentUserIdStr.toLowerCase() &&
            messageReceiverId === receiverId.toLowerCase()) ||
          (messageSenderId === receiverId.toLowerCase() &&
            messageReceiverId === currentUserIdStr.toLowerCase()),
      });

      // Check if message is for current conversation
      // Include messages where:
      // 1. User sent to receiver (senderId === currentUserId, receiverId === receiverId)
      // 2. Receiver sent to user (senderId === receiverId, receiverId === currentUserId)
      if (
        (messageSenderId === currentUserIdStr.toLowerCase() &&
          messageReceiverId === receiverId.toLowerCase()) ||
        (messageSenderId === receiverId.toLowerCase() &&
          messageReceiverId === currentUserIdStr.toLowerCase())
      ) {
        const isCurrentUser =
          messageSenderId === currentUserIdStr.toLowerCase();
        const messageId = message.messageId || message.id || Date.now();
        const newMessage = {
          id: messageId,
          sender: (isCurrentUser ? "user" : "other") as "user" | "other",
          senderName: isCurrentUser
            ? "You"
            : selectedConversation?.name || "User",
          text: message.text || "",
          timestamp: message.createdAt
            ? new Date(message.createdAt)
            : new Date(),
        };

        console.log("Adding message to real-time list:", newMessage);
        setRealTimeMessages((prev) => {
          // If this is a message from current user, check if there's an optimistic message to replace
          if (isCurrentUser) {
            // Find and remove optimistic message with same text (within 30 seconds)
            const optimisticIndex = prev.findIndex((m) => {
              const isOptimistic =
                typeof m.id === "string" && m.id.startsWith("temp-");
              const sameText = m.text.trim() === newMessage.text.trim();
              const sameSender = m.sender === "user";
              const timeDiff =
                Math.abs(
                  m.timestamp.getTime() - newMessage.timestamp.getTime(),
                ) < 30000; // Within 30 seconds
              return isOptimistic && sameText && sameSender && timeDiff;
            });

            if (optimisticIndex !== -1) {
              console.log(
                "Replacing optimistic message with real message from socket",
              );
              const updated = [...prev];
              updated[optimisticIndex] = newMessage;
              return updated;
            }
          }

          // Check if message already exists (by ID or by content)
          const exists = prev.some((m) => {
            // Check by exact ID match
            if (String(m.id) === String(newMessage.id)) return true;

            // For user messages, check if it's the same message by text, sender, and timestamp (within 10 seconds)
            if (isCurrentUser && m.sender === "user") {
              if (
                m.text.trim() === newMessage.text.trim() &&
                Math.abs(
                  m.timestamp.getTime() - newMessage.timestamp.getTime(),
                ) < 10000
              ) {
                return true;
              }
            }

            // For other messages, check by text, sender, and timestamp (within 5 seconds)
            if (
              m.text.trim() === newMessage.text.trim() &&
              m.sender === newMessage.sender &&
              Math.abs(m.timestamp.getTime() - newMessage.timestamp.getTime()) <
                5000
            ) {
              return true;
            }
            return false;
          });

          if (exists) {
            console.log("Message already exists in realTimeMessages, skipping");
            return prev;
          }

          console.log("Adding new message, previous count:", prev.length);
          return [...prev, newMessage];
        });
      } else {
        console.log("Message does not match current conversation, ignoring");
      }
    };

    socket.on("receive-message", handleReceiveMessage);
    socket.on("message", handleReceiveMessage);
    socket.on("new-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
      socket.off("message", handleReceiveMessage);
      socket.off("new-message", handleReceiveMessage);
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

      // Use a temp- prefix as a marker for optimistic messages
      // This makes them easy to identify and replace
      const optimisticId = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const optimisticMessage = {
        id: optimisticId,
        sender: "user" as const,
        senderName: "You",
        text: text.trim(),
        timestamp: new Date(),
      };

      console.log("Adding optimistic message:", optimisticMessage);
      setRealTimeMessages((prev) => {
        // Check if we already have an optimistic message with the same text (prevent double-add)
        const hasDuplicate = prev.some((m) => {
          const isOptimistic =
            typeof m.id === "string" && m.id.startsWith("temp-");
          return (
            isOptimistic && m.text.trim() === text.trim() && m.sender === "user"
          );
        });

        if (hasDuplicate) {
          console.log("Optimistic message already exists, skipping");
          return prev;
        }

        return [...prev, optimisticMessage];
      });
    };
  }, [currentUserId, selectedConversation]);

  // Combine API messages with real-time messages
  const allMessages = useMemo(() => {
    // Start with API messages (these are the source of truth)
    const apiMessages = messages;

    // Filter out optimistic messages from realTimeMessages that match API messages
    const filteredRealTime = realTimeMessages.filter((rtMsg) => {
      // If it's an optimistic message, check if it exists in API messages
      if (typeof rtMsg.id === "string" && rtMsg.id.startsWith("temp-")) {
        const existsInApi = apiMessages.some((apiMsg) => {
          return (
            apiMsg.sender === "user" &&
            apiMsg.text.trim() === rtMsg.text.trim() &&
            Math.abs(apiMsg.timestamp.getTime() - rtMsg.timestamp.getTime()) <
              10000
          );
        });
        if (existsInApi) {
          console.log("Removing optimistic message - already in API messages");
          return false; // Remove optimistic message if it's in API
        }
      }
      return true; // Keep all other real-time messages
    });

    const combined = [...apiMessages, ...filteredRealTime];

    // Remove duplicates and sort by timestamp
    const uniqueMessages = combined.reduce(
      (acc, msg) => {
        // Check if message already exists
        const existingIndex = acc.findIndex((m) => {
          // Exact ID match
          if (String(m.id) === String(msg.id)) return true;

          // For user messages, check by text and timestamp (more lenient for duplicates)
          if (msg.sender === "user" && m.sender === "user") {
            if (
              m.text.trim() === msg.text.trim() &&
              Math.abs(m.timestamp.getTime() - msg.timestamp.getTime()) < 15000 // Within 15 seconds
            ) {
              return true;
            }
          }

          // For other messages, check by text, sender, and timestamp
          if (
            m.text.trim() === msg.text.trim() &&
            m.sender === msg.sender &&
            Math.abs(m.timestamp.getTime() - msg.timestamp.getTime()) < 5000
          ) {
            return true;
          }

          return false;
        });

        if (existingIndex === -1) {
          // No duplicate found, add the message
          acc.push(msg);
        } else {
          // Duplicate found - replace if the new one is better (has real ID, not optimistic)
          const existing = acc[existingIndex];
          const isExistingOptimistic =
            typeof existing.id === "string" && existing.id.startsWith("temp-");
          const isNewOptimistic =
            typeof msg.id === "string" && msg.id.startsWith("temp-");

          // Replace optimistic with real message (prefer API/socket message over optimistic)
          if (isExistingOptimistic && !isNewOptimistic) {
            console.log(
              "Replacing optimistic message with real message in allMessages",
            );
            acc[existingIndex] = msg;
          }
          // If both are real messages (not optimistic), keep the first one (from API)
          // This prevents socket duplicates from overwriting API messages
        }

        return acc;
      },
      [] as typeof combined,
    );

    return uniqueMessages.sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
    );
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
            <div className="text-gray-500">
              <BeatLoader />
            </div>
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
            receiverId={
              selectedConversation.userId || String(selectedConversation.id)
            }
            isConnected={isConnected}
            currentUserId={currentUserId}
            onMessageSent={addOptimisticMessage}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-gray-500">
              Select a conversation to start chatting
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
