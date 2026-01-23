
import { useState, useEffect, useRef } from "react";
import { Send, Smile, MoreVertical } from "lucide-react";
import { useSendMessageMutation } from "@/Redux/features/userDa/message/messageApi";
import { toast } from "sonner";

interface ChatWindowProps {
  conversation: {
    id: number | string;
    name: string;
    avatar: string;
    userId?: string;
  };
  messages: Array<{
    id: number | string;
    sender: "user" | "other";
    senderName: string;
    text: string;
    timestamp: Date;
  }>;
  isLoadingMessages?: boolean;
  receiverId: string;
  isConnected?: boolean;
  currentUserId?: string | null;
  onMessageSent?: (text: string, receiverId: string) => void;
}

// Avatar component helper
const Avatar: React.FC<{
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg";
}> = ({ src, name, size = "md" }) => {
  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className={`${sizeClasses[size]} flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-purple-600 font-semibold text-white flex-shrink-0`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            const sibling = e.currentTarget.nextElementSibling as HTMLElement;
            if (sibling) sibling.textContent = getInitials(name);
          }}
        />
      ) : null}
      <span style={{ display: src ? "none" : "block" }}>{getInitials(name)}</span>
    </div>
  );
};

export default function ChatWindow({
  conversation,
  messages,
  isLoadingMessages = false,
  receiverId,
  isConnected = false,
  // currentUserId,
  onMessageSent,
}: ChatWindowProps) {
  const [message, setMessage] = useState("");
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isSendingRef = useRef(false); // Prevent duplicate sends

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e?: React.MouseEvent | React.KeyboardEvent) => {
    // Prevent default behavior and stop propagation
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Prevent duplicate sends - check multiple conditions
    if (!message.trim() || isSending || isSendingRef.current) {
      console.log('Send blocked:', { hasMessage: !!message.trim(), isSending, isSendingRef: isSendingRef.current });
      return;
    }

    // Set sending flag immediately
    isSendingRef.current = true;

    const messageText = message.trim();
    // Clear input immediately to prevent double-send
    setMessage("");

    // Add optimistic message immediately
    if (onMessageSent) {
      onMessageSent(messageText, receiverId);
    }

    try {
      await sendMessage({
        receiverId,
        text: messageText,
      }).unwrap();
      // Message will be received via socket, not refetched from API
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send message");
      setMessage(messageText); // Restore message on error
    } finally {
      // Reset sending flag after a delay to prevent rapid double-clicks
      setTimeout(() => {
        isSendingRef.current = false;
      }, 2000); // Increased to 2 seconds
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex-1 flex flex-col w-full min-w-0 overflow-hidden bg-gray-50">
      {/* ================= Header ================= */}
      <div className="border-b border-gray-100 bg-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar
              name={conversation.name}
              src={conversation.avatar}
              size="lg"
            />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {conversation.name}
              </h2>
              <p className="text-sm text-gray-500">
                {isConnected ? "Active now" : "Last seen recently"}
              </p>
            </div>
          </div>
          <button className="rounded-lg p-2 transition-colors hover:bg-gray-50">
            <MoreVertical className="h-5 w-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* ================= Messages ================= */}
      <div 
        className="flex-1 overflow-y-auto p-6 bg-gray-50" 
        ref={messagesEndRef}
      >
        {isLoadingMessages ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Loading messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="mb-2 text-lg">No messages yet</p>
              <p className="text-sm">Send a message to start the conversation</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-6`}
            >
              <div className="flex max-w-md items-end space-x-3 lg:max-w-lg">
                {msg.sender !== "user" && (
                  <Avatar
                    name={msg.senderName}
                    src={msg.sender === "other" ? conversation.avatar : undefined}
                    size="sm"
                  />
                )}
                <div
                  className={`rounded-2xl px-5 py-3 shadow-sm ${
                    msg.sender === "user"
                      ? "rounded-br-lg bg-blue-600 text-white"
                      : "rounded-bl-lg border border-gray-100 bg-white text-gray-900"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <span
                      className={`text-xs ${
                        msg.sender === "user" ? "text-blue-100" : "text-gray-500"
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                </div>
                {msg.sender === "user" && (
                  <Avatar
                    name="You"
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                    size="sm"
                  />
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= Input ================= */}
      <div className="border-t border-gray-100 bg-white p-6">
        <div className="flex items-center space-x-3">
          <button 
            className="rounded-lg p-2 transition-colors hover:bg-gray-50"
            disabled={isSending || isSendingRef.current}
          >
            <Smile className="h-5 w-5 text-gray-400" />
          </button>

          <div className="flex flex-1 items-center space-x-3">
            <input
              type="text"
              placeholder="Send quick message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  handleSend(e);
                }
              }}
              disabled={isSending || isSendingRef.current}
              className="flex-1 rounded-xl border-0 bg-gray-50 px-5 py-3 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
            />
            <button
              onClick={(e) => handleSend(e)}
              disabled={!message.trim() || isSending || isSendingRef.current}
              className="rounded-xl bg-blue-600 p-3 text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
