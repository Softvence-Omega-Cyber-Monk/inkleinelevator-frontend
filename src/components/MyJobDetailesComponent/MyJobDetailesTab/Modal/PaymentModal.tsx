interface PaymentModalProps {
  bid: any;
  job: any;
  onClose: () => void;
}

export default function PaymentModal({ bid, job, onClose }: PaymentModalProps) {
  console.log(job);
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Award Contract</h2>

        <p className="text-sm text-gray-600 mb-2">
          Bid Amount: <strong>${bid?.bidAmount}</strong>
        </p>

        <p className="text-sm text-gray-600 mb-4">
          Timeline: <strong>{bid?.timeline} weeks</strong>
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300"
          >
            Cancel
          </button>

          <button className="px-4 py-2 rounded-lg bg-[#0A1A3A] text-white">
            Confirm Award
          </button>
        </div>
      </div>
    </div>
  );
}
