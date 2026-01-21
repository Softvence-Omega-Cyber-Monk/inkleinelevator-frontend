import { useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface QuickBidModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId?: number | string;
  jobTitle?: string;
  budgetMin?: number;
  budgetMax?: number;
}

interface QuickBidFormData {
  bidAmount: string;
  completionTimeline: string;
  briefProposal: string;
}

const QuickBidModal = ({
  isOpen,
  onClose,
  jobId,
  jobTitle = "Elevator Modernization - 6 Units",
  budgetMin = 150000,
  budgetMax = 180000,
}: QuickBidModalProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<QuickBidFormData>();

  if (!isOpen) return null;

  const onSubmit = async (data: QuickBidFormData) => {
    console.log(data);
    setIsSubmitting(true);
    try {
      // TODO: Add API call here when backend is ready
      // await submitBid({ jobId, ...data });
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success("Bid submitted successfully!");
      reset();
      onClose();
    } catch (error) {
      toast.error("Failed to submit bid. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewFullDetails = () => {
    if (jobId) {
      navigate(`/elevator/jobdetails/${jobId}`);
    }
    onClose();
  };

  const formatBudget = (min: number, max: number) => {
    const minFormatted = (min / 1000).toFixed(0) + "k";
    const maxFormatted = (max / 1000).toFixed(0) + "k";
    return `$${minFormatted} - $${maxFormatted}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 z-10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6 pr-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            Submit Quick Bid
          </h2>
          <p className="text-sm text-gray-500">{jobTitle}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Bid Amount */}
          <div>
            <label
              htmlFor="bidAmount"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Bid Amount ($)
            </label>
            <input
              type="text"
              id="bidAmount"
              placeholder="Enter your bid amount"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
              {...register("bidAmount", {
                required: "Bid amount is required",
                pattern: {
                  value: /^\d+(\.\d{1,2})?$/,
                  message: "Please enter a valid amount",
                },
                validate: (value) => {
                  const numValue = parseFloat(value);
                  if (numValue < budgetMin || numValue > budgetMax) {
                    return `Bid must be between ${formatBudget(budgetMin, budgetMax)}`;
                  }
                  return true;
                },
              })}
            />
            {errors.bidAmount && (
              <p className="text-red-500 text-xs mt-1">
                {errors.bidAmount.message}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Budget range: {formatBudget(budgetMin, budgetMax)}
            </p>
          </div>

          {/* Completion Timeline */}
          <div>
            <label
              htmlFor="completionTimeline"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Completion Timeline
            </label>
            <input
              type="text"
              id="completionTimeline"
              placeholder="e.g., 8-10 weeks"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm"
              {...register("completionTimeline", {
                required: "Completion timeline is required",
              })}
            />
            {errors.completionTimeline && (
              <p className="text-red-500 text-xs mt-1">
                {errors.completionTimeline.message}
              </p>
            )}
          </div>

          {/* Brief Proposal */}
          <div>
            <label
              htmlFor="briefProposal"
              className="block text-sm font-medium text-gray-900 mb-2"
            >
              Brief Proposal
            </label>
            <textarea
              id="briefProposal"
              rows={4}
              placeholder="Briefly describe your approach and experience..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm resize-none"
              {...register("briefProposal", {
                required: "Brief proposal is required",
                minLength: {
                  value: 50,
                  message: "Proposal must be at least 50 characters",
                },
              })}
            />
            {errors.briefProposal && (
              <p className="text-red-500 text-xs mt-1">
                {errors.briefProposal.message}
              </p>
            )}
          </div>

          {/* Confirmation Message */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-900">
              By submitting this bid, you confirm that you meet all the
              requirements listed and can complete the project as specified.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleViewFullDetails}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              View Full Details
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Bid"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickBidModal;
