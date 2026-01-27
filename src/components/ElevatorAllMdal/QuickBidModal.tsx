import { useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useBidJobMutation } from "@/Redux/features/ElevatorDa/elevatorbid/elevatorbidApi";
import BidSubmissionSuccessModal from "./BidSubmissionSuccessModal";

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
  budgetMin = 0,
  budgetMax = 0,
}: QuickBidModalProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Bid job mutation
  const [bidJob] = useBidJobMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<QuickBidFormData>();

  if (!isOpen) return null;

  const parseTimeline = (timelineStr: string): number => {
    // Extract numbers from strings like "8-10 weeks", "4 weeks", "2 months", etc.
    const numbers = timelineStr.match(/\d+/g);
    if (!numbers || numbers.length === 0) return 4; // Default to 4 weeks

    // If range like "8-10", take the average or first number
    if (numbers.length >= 2) {
      return Math.ceil((parseInt(numbers[0]) + parseInt(numbers[1])) / 2);
    }

    // Check if it's months (multiply by 4.33 weeks per month)
    if (timelineStr.toLowerCase().includes("month")) {
      return Math.ceil(parseInt(numbers[0]) * 4.33);
    }

    // Default: assume weeks
    return parseInt(numbers[0]) || 4;
  };

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const onSubmit = async (data: QuickBidFormData) => {
    if (!jobId) {
      toast.error("Job ID is missing");
      return;
    }

    setIsSubmitting(true);
    try {
      // Parse timeline to get weeks
      const timelineWeeks = parseTimeline(data.completionTimeline);

      // Calculate completion date (current date + timeline weeks)
      const completionDate = new Date();
      completionDate.setDate(completionDate.getDate() + timelineWeeks * 7);
      const formattedCompletionDate = formatDate(completionDate);

      // Prepare bid data
      const bidData = {
        jobId: jobId,
        bidAmount: parseFloat(data.bidAmount),
        completionTimeline: formattedCompletionDate,
        timeline: timelineWeeks,
        brefProposal: data.briefProposal,
      };

      // Call API
      await bidJob(bidData).unwrap();

      reset();
      setShowSuccessModal(true); // Show success modal
      toast.success("Bid submitted successfully!");
      onClose();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        "Failed to submit bid. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  // const onSubmit = async (data: QuickBidFormData) => {
  //   console.log("Quick bid submitted 43:", data);
  //   setIsSubmitting(true);
  //   try {
  //     // TODO: Add API call here when backend is ready
  //     // You should add your bidJob mutation hook here similar to the JobDetailsWithBid component
  //     // Example:
  //     // const [bidJob] = useBidJobMutation();
  //     // await bidJob({
  //     //   jobId,
  //     //   bidAmount: parseFloat(data.bidAmount),
  //     //   completionTimeline: data.completionTimeline,
  //     //   brefProposal: data.briefProposal,
  //     // }).unwrap();

  //     // Simulate API call
  //     await new Promise((resolve) => setTimeout(resolve, 1000));

  //     toast.success("Bid submitted successfully!");
  //     reset();
  //     onClose();
  //   } catch (error: any) {
  //     const errorMessage =
  //       error?.data?.message ||
  //       error?.message ||
  //       "Failed to submit bid. Please try again.";
  //     toast.error(errorMessage);
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

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
                // validate: (value) => {
                //   const numValue = parseFloat(value);
                //   if (numValue < budgetMin || numValue > budgetMax) {
                //     return `Bid must be between ${formatBudget(budgetMin, budgetMax)}`;
                //   }
                //   return true;
                // },
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

          {/* Buttons */}
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
      {/* Success Modal */}
      <BidSubmissionSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </div>
  );
};

export default QuickBidModal;
