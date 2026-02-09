import { useUserTrmsAgreeMutation } from "@/Redux/features/trmsConditions/trmsConditionsApi";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
// import { useAcceptTermsMutation } from "@/Redux/features/auth/authApi";

interface TermsModalProps {
  open: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ open, onClose }) => {
  const [checked, setChecked] = useState(false);
  const [userTrmsAgree, { isLoading }] = useUserTrmsAgreeMutation();

  // const [acceptTerms] = useAcceptTermsMutation();

  const handleAccept = async () => {
    if (!checked) return;

    try {
      //  Call swagger API
      const res: any = await userTrmsAgree().unwrap();
      // console.log("i am the res for thew agree", res);

      toast.success(res?.message);
      onClose(); // close modal
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Modal box */}
      <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Accept Terms & Conditions</h2>

        {/* Summary */}
        <div className="text-sm text-gray-600 space-y-3">
          <p>By using In-Klein, you agree that:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>In-Klein is a technology platform, not a service provider</li>
            <li>All jobs, communication, and payments must stay on-platform</li>
            <li>A 10% platform service fee applies to all projects</li>
            <li>
              Off-platform work may result in penalties or account termination
            </li>
          </ul>
        </div>

        {/* Full terms link */}
        <Link
          to="/trms-conditions"
          target="_blank"
          className="block mt-3 text-sm text-blue-600 hover:underline"
        >
          View full Terms & Conditions
        </Link>

        {/* Checkbox */}
        <label className="flex items-start gap-2 mt-4 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-1"
          />
          <span>I have read and agree to the Terms & Conditions</span>
        </label>

        {/* Action button */}
        <button
          onClick={handleAccept}
          disabled={!checked || isLoading}
          className={`w-full mt-5 py-3 rounded-lg font-medium text-white transition
            ${
              checked
                ? "bg-gray-900 hover:bg-gray-800"
                : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          {isLoading ? "Accepting..." : "Accept & Continue"}
        </button>

        <p className="text-xs text-gray-500 text-center mt-2">
          You must accept the Terms & Conditions to continue.
        </p>
      </div>
    </div>
  );
};

export default TermsModal;
