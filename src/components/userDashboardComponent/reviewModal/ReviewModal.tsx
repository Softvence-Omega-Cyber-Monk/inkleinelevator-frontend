import { useState } from "react";
import { X, Star } from "lucide-react";
import { useCreateReviewMutation } from "@/Redux/features/userDa/review/reviewApi";
import { toast } from "sonner";

interface ReviewModalProps {
  job: any;
  onClose: () => void;
}

const ReviewModal = ({ job, onClose }: ReviewModalProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");

  const [createReview, { isLoading }] = useCreateReviewMutation();
  console.log("iam job from review modal", job);

  const handleSubmit = async () => {
    try {
      await createReview({
        revieweeId: job?.acceptedConstructorId, // backend expects revieweeId
        jobId: job?.jobId,
        rating,
        comment: review, // ✅ FIX: match swagger
      }).unwrap();

      toast.success("Review submitted");
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed");
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Rate Your Experience
          </h2>
          <X
            size={20}
            className="cursor-pointer text-gray-500 hover:text-gray-800"
            onClick={onClose}
          />
        </div>

        <div className=" text-center">
          {/* Question */}
          <p className="text-gray-800 font-medium mb-1">
            How would you rate your overall experience with this Elevator
            Contractor?
          </p>

          {/* ⭐ Star Rating */}
          <div className="flex gap-2 mb-8 mt-8 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={28}
                className={`cursor-pointer transition ${
                  (hoverRating || rating) >= star
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Share your thoughts to help others make the right choice.
          </p>
        </div>
        {/* Review Text */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-800 mb-2">
            Can you tell us more?
          </label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Add feedback"
            rows={4}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg cursor-pointer hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            disabled={rating === 0 || isLoading}
            className="px-4 py-2 bg-gray-900 cursor-pointer text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
