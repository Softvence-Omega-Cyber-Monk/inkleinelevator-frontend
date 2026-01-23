interface ViewDetailsModalProps {
  bid: any;
  onClose: () => void;
}

export default function ViewDetailsModal({
  bid,
  onClose,
}: ViewDetailsModalProps) {
  if (!bid) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6">
        <h2 className="text-lg font-semibold mb-4">Bid Details</h2>

        <div className="space-y-2">
          <p>
            <strong>Company:</strong> {bid.user?.name || "N/A"}
          </p>
          <p>
            <strong>Proposal:</strong> {bid.brefProposal}
          </p>
          <p>
            <strong>Bid Amount:</strong> ${bid.bidAmount}
          </p>
          <p>
            <strong>Timeline:</strong> {bid.timeline} weeks
          </p>
          <p>
            <strong>Status:</strong> {bid.status}
          </p>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0A1A3A] text-white rounded-lg hover:bg-[#0F2340] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
