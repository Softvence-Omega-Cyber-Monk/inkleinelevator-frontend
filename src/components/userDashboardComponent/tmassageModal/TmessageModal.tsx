import { useState } from "react";
import { toast } from "sonner";
import { useSendTMessageMutation } from "@/Redux/features/userDa/mytMessage/mytMessageApi";

interface TmessageModalProps {
  bidMessage: any; // the bid object with user info
  onClose: () => void;
}

export default function TmessageModal({
  bidMessage,
  onClose,
}: TmessageModalProps) {
  const [messageText, setMessageText] = useState("");
  const [sendTMessage, { isLoading: sendMessageLoading }] =
    useSendTMessageMutation();

  const handleSend = async () => {
    if (!bidMessage?.user?.userId) {
      toast.error("Invalid user ID");
      return;
    }

    try {
      await sendTMessage({
        receiverId: bidMessage.user.userId,
        text: messageText,
      }).unwrap();
      toast.success("Message sent successfully!");
      setMessageText("");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to send message");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <h2 className="text-lg font-semibold mb-4">Send Message</h2>

        <textarea
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type your message..."
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-100"
            disabled={sendMessageLoading}
          >
            Cancel
          </button>

          <button
            onClick={handleSend}
            disabled={sendMessageLoading || messageText.trim() === ""}
            className="px-4 py-2 bg-[#0A1A3A] text-white rounded-lg hover:bg-[#0F2340] disabled:opacity-50"
          >
            {sendMessageLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
