// import { Send, Smile, MoreVertical } from "lucide-react"

// interface Message {
//   id: number
//   sender: "bill" | "user"
//   senderName: string
//   text: string
//   timestamp: Date
// }

// interface Conversation {
//   id: number
//   name: string
//   avatar: string
//   lastMessage: string
//   unread: boolean
// }

// interface ChatWindowProps {
//   conversation: Conversation
//   messages: Message[]
//   onSendMessage: () => void
//   message: string
//   onMessageChange: (message: string) => void
// }

// export default function ChatWindow({
//   conversation,
//   messages,
//   onSendMessage,
//   message,
//   onMessageChange,
// }: ChatWindowProps) {
//   return (
//     <div className="flex-1 flex flex-col">
//       {/* Header */}
//       <div className="px-8 py-4 border-b border-gray-200 flex items-center justify-between">
//         <div>
//           <h2 className="text-lg font-semibold text-gray-900">{conversation.name}</h2>
//           <p className="text-sm text-gray-500">Online for 10 mins</p>
//         </div>
//         <button className="text-gray-400 hover:text-gray-600">
//           <MoreVertical size={20} />
//         </button>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-8 space-y-6">
//         {messages.map((msg) => (
//           <div
//             key={msg.id}
//             className={`flex items-end gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
//           >
//             {msg.sender === "bill" && (
//               <img
//                 src={conversation.avatar || "/placeholder.svg"}
//                 alt={msg.senderName}
//                 className="w-8 h-8 rounded-full object-cover flex-shrink-0"
//               />
//             )}
//             <div
//               className={`max-w-md ${
//                 msg.sender === "user" ? "bg-blue-100 text-gray-900" : "bg-gray-100 text-gray-900"
//               } rounded-2xl px-4 py-2.5 text-sm leading-relaxed`}
//             >
//               {msg.text}
//             </div>
//             {msg.sender === "user" && (
//               <img
//                 src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
//                 alt="You"
//                 className="w-8 h-8 rounded-full object-cover flex-shrink-0"
//               />
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Input Area */}
//       <div className="px-8 py-4 border-t border-gray-200">
//         <div className="flex items-center gap-3">
//           <button className="text-gray-400 hover:text-gray-600">
//             <div className="w-6 h-6 flex items-center justify-center">+</div>
//           </button>
//           <input
//             type="text"
//             placeholder="Type your message"
//             value={message}
//             onChange={(e) => onMessageChange(e.target.value)}
//             onKeyPress={(e) => {
//               if (e.key === "Enter" && !e.shiftKey) {
//                 e.preventDefault()
//                 onSendMessage()
//               }
//             }}
//             className="flex-1 bg-gray-100 text-gray-900 placeholder-gray-500 rounded-full px-4 py-3 outline-none text-sm"
//           />
//           <button className="text-gray-400 hover:text-gray-600">
//             <Smile size={20} />
//           </button>
//           <button onClick={onSendMessage} className="text-gray-400 hover:text-gray-600">
//             <Send size={20} />
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

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
    id: number;
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

export default function ChatWindow({
  conversation,
  messages,
  isLoadingMessages = false,
  receiverId,
  isConnected = false,
  currentUserId,
  onMessageSent,
}: ChatWindowProps) {
  const [message, setMessage] = useState("");
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || isSending) return;

    const messageText = message.trim();
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
      // Message will be refetched via the query or received via socket
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send message");
      setMessage(messageText); // Restore message on error
    }
  };
  return (
    <div className="flex-1 flex flex-col w-full min-w-0 overflow-hidden">
      {/* ================= Header ================= */}
      <div className="px-4 sm:px-6 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
            {conversation.name}
          </h2>
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <p className="text-xs sm:text-sm text-gray-500">
              {isConnected ? "Connected" : "Disconnected"}
            </p>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600 flex-shrink-0">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* ================= Messages ================= */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
        {isLoadingMessages ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">Loading messages...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-gray-500">No messages yet. Start the conversation!</div>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2 ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {/* Avatar (left) */}
              {msg.sender !== "user" && (
                <img
                  src={conversation.avatar}
                  alt={msg.senderName}
                  className="w-7 h-7 rounded-full flex-shrink-0"
                />
              )}

              {/* Bubble */}
              <div
                className={`
                  max-w-[85%] sm:max-w-md
                  break-words
                  ${
                    msg.sender === "user"
                      ? "bg-blue-100 text-gray-900"
                      : "bg-gray-100 text-gray-900"
                  }
                  rounded-2xl px-4 py-2.5 text-sm
                `}
              >
                {msg.text}
              </div>

              {/* Avatar (right) */}
              {msg.sender === "user" && (
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                  alt="You"
                  className="w-7 h-7 rounded-full flex-shrink-0"
                />
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ================= Input ================= */}
      <div className="px-4 sm:px-6 py-3 border-t border-gray-200">
        <div className="flex items-center gap-2 sm:gap-3">
          <button className="text-gray-400 hover:text-gray-600 flex-shrink-0">
            +
          </button>

          <input
            type="text"
            placeholder="Type your message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={isSending}
            className="
              flex-1 min-w-0
              bg-gray-100 text-gray-900 placeholder-gray-500
              rounded-full px-4 py-2.5
              outline-none text-sm
              disabled:opacity-50
            "
          />

          <button className="text-gray-400 hover:text-gray-600 flex-shrink-0">
            <Smile size={20} />
          </button>

          <button
            onClick={handleSend}
            disabled={!message.trim() || isSending}
            className="text-gray-400 hover:text-gray-600 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
