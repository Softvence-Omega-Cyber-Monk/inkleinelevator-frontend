import { X } from "lucide-react";
import { useState } from "react";
import PaymentConfirmModal from "./PaymentConfirmModal";

interface PaymentModalProps {
  bid: any;
  job: any;
  onClose: () => void;
  refetch?: () => void;
}

export default function PaymentModal({
  bid,
  job,
  onClose,
  refetch,
}: PaymentModalProps) {
  console.log(job);

  const bidAmount = Number(bid?.bidAmount || 0);
  const platformFee = bidAmount * 0.1;
  const contractorReceives = bidAmount - platformFee;

  // this modal for payment confirm
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b  border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Review & Award Contract
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Award contract to Elite Elevator Solutions
            </p>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Contract Summary */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Contract Summary
            </h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Contractor:</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {bid?.user?.companyName}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Bid Amount:</span>
                  <span className="text-sm text-gray-900 font-medium">
                    {bid?.bidAmount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Estimated Timeline:
                  </span>
                  <span className="text-sm text-gray-900 font-medium">
                    {bid?.timeline} weeks
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Breakdown */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Payment Breakdown
            </h3>
            <div className="bg-gray-50 p-4">
              <div className="space-y-3 ">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Contract Amount:
                  </span>
                  <span className="text-sm text-gray-900 font-medium">
                    ${bid?.bidAmount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Platform Fee (10%):
                  </span>
                  <span className="text-sm text-gray-900 font-medium">
                    - ${platformFee.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="text-sm text-gray-900 font-semibold">
                    Contractor Receives:
                  </span>
                  <span className="text-sm text-green-600 font-semibold">
                    ${contractorReceives.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                  <span className="text-sm text-gray-900 font-semibold">
                    You Pay:
                  </span>
                  <span className="text-sm text-gray-900 font-semibold">
                    ${bid?.bidAmount}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-[#FFE8D9] rounded-md p-4">
            <p className="text-xs text-[#F60] leading-relaxed">
              You pay the full contract amount. In-situm automatically deducts
              the 10% platform fee and transfers the remaining amount to the
              contractor after job milestones are approved.
            </p>
          </div>

          {/* Before You Proceed */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              Before You Proceed:
            </h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-600">
                Payment will be processed immediately
              </li>
              <li className="text-sm text-gray-600">
                The contractor will be notified and can begin work
              </li>
              <li className="text-sm text-gray-600">
                Funds are held securely until milestone approval
              </li>
              <li className="text-sm text-gray-600">
                You can track project progress in your dashboard
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => setIsConfirmOpen(true)} // open confirm modal
            className="flex-1 px-4 py-2.5 bg-black rounded-md text-sm font-medium text-white hover:bg-gray-800 transition-colors"
          >
            Continue Payment
          </button>
        </div>
      </div>
      {/* Payment Confirm Modal */}
      {isConfirmOpen && (
        <PaymentConfirmModal
          bid={bid}
          job={job}
          onClose={() => setIsConfirmOpen(false)} // close confirm modal
          onSuccess={() => {
            setIsConfirmOpen(false); // close child
            onClose(); // close parent ✅
          }}
          refetch={refetch}
        />
      )}
    </div>
  );
}
