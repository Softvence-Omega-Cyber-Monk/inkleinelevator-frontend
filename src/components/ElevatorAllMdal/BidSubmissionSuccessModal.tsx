import { X, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BidSubmissionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BidSubmissionSuccessModal = ({
  isOpen,
  onClose,
}: BidSubmissionSuccessModalProps) => {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    onClose();
    navigate("/elevator");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleBackToDashboard}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 border border-gray-200 z-10">
        {/* Close Button */}
        <button
          onClick={handleBackToDashboard}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="pr-8">
          {/* Checkmark Icon */}
          <div className="flex items-start gap-4 mb-4">
            <div className="flex-shrink-0">
              <CheckCircle2 className="w-8 h-8 text-green-500 stroke-2" />
            </div>
            <div className="flex-1">
              {/* Title */}
              <h2 className="text-xl md:text-2xl font-bold text-[#1e3a5f] mb-3">
                Your bid has been submitted!
              </h2>

              {/* Primary Text */}
              <p className="text-base md:text-lg text-[#1e3a5f] mb-2 font-medium">
                The job requester will review all bids and get back to you soon.
              </p>

              {/* Secondary Text */}
              <p className="text-sm text-gray-500 mb-6">
                You'll receive a notification if your bid is selected or if there
                are any updates.
              </p>

              {/* Back to Dashboard Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleBackToDashboard}
                  className="px-6 py-2.5 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium hover:bg-[#2d4a6f] transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BidSubmissionSuccessModal;
