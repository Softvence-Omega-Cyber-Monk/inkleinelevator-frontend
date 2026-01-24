import React, { useState, useMemo, useRef } from "react";
import { MoreHorizontal, X, AlertTriangle } from "lucide-react";
import {
  useGetAllReviewPaymentQuery,
  useGetAllReleasedPaymentQuery,
  useReleasePaymentMutation,
} from "@/Redux/features/AdminDashboard/paymentApi";
import { toast } from "sonner";
import AdminPaymentAnalytics from "@/components/adminDashboard/AdminPaymentAnalytics/AdminPaymentAnalytics";

// Types
interface Payment {
  id: number;
  paymentId?: string; // Store original paymentId from API
  jobTitle: string;
  jobDetails: string;
  requester: string;
  requesterDetails: string;
  contractor: string;
  contractorDetails: string;
  contractAmount: string;
  platformFee: string;
  contractorReceives: string;
  milestone?: string;
  status: "completed" | "pending" | "released";
  originalPayment?: any; // Store original API payment data
  createdAt?: string;
  acceptedDate?: string; // Store accepted date separately
  jobId?: string;
  bidId?: string;
  stripePaymentId?: string;
  paymentStatus?: string; // PAID status from API
}

// Action Modal Component
const ActionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onViewDetails: () => void;
  onReleasePayment: () => void;
}> = ({ isOpen, onClose, onViewDetails, onReleasePayment }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-900">Actions</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded focus:outline-none"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-4 space-y-2">
          <button
            onClick={onViewDetails}
            className="w-full px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none"
          >
            View Details
          </button>
          <button
            onClick={onReleasePayment}
            className="w-full px-4 py-3 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none"
          >
            Release Payment
          </button>
        </div>
      </div>
    </div>
  );
};

// Review Payment Modal Component
const ReviewPaymentModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  payment: Payment | null;
  onRelease: (paymentId: string) => Promise<void>;
}> = ({ isOpen, onClose, payment, onRelease }) => {
  const [reviewNotes, setReviewNotes] = useState("");
  const [isReleasing, setIsReleasing] = useState(false);

  if (!isOpen || !payment) return null;

  const handleRelease = async () => {
    if (!payment.paymentId) {
      toast.error("Payment ID not found");
      return;
    }
    setIsReleasing(true);
    try {
      await onRelease(payment.paymentId);
      onClose();
    } catch (error) {
      // Error handled in parent
    } finally {
      setIsReleasing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              Review Payment Release
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              Verify completion and release payment to contractor
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded focus:outline-none flex-shrink-0"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Job Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">
              Job Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500 mb-1">Job</div>
                <div className="text-sm font-medium text-gray-900">
                  {payment.jobTitle}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Milestone</div>
                <div className="text-sm font-medium text-gray-900">
                  {payment.milestone || "Project Completion"}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Requester</div>
                <div className="text-sm font-medium text-gray-900">
                  {payment.requester}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 mb-1">Contractor</div>
                <div className="text-sm font-medium text-gray-900">
                  {payment.contractor}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Breakdown */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">
              Payment Breakdown
            </h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Contract Amount:</span>
                <span className="font-semibold text-gray-900">
                  {payment.contractAmount}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">
                  Platform Commission (10%):
                </span>
                <span className="font-semibold text-gray-900">
                  {payment.platformFee}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Contractor Payout (90%):</span>
                <span className="font-semibold text-gray-900">
                  {payment.contractorReceives}
                </span>
              </div>
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-900 font-semibold">
                    Amount to Release:
                  </span>
                  <span className="text-lg font-bold text-green-600">
                    {payment.contractorReceives}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Review Notes */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-2">
              Admin Review Notes
            </h4>
            <textarea
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              placeholder="Enter review notes or reasons for holding payment..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={3}
            />
          </div>

          {/* Warning Message */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-orange-800">
              Payment has been on escrow for 2 days. Holding release period is
              5-7 business days.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none"
            >
              Cancel
            </button>
            <button
              onClick={handleRelease}
              disabled={isReleasing}
              className="flex-1 px-4 py-3 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isReleasing
                ? "Releasing..."
                : `Release Payment (${payment.contractorReceives})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Upcoming Releases Table Card (Mobile)
const UpcomingReleaseCard: React.FC<{
  payment: Payment;
  onActionClick: (payment: Payment) => void;
}> = ({ payment, onActionClick }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900">
            {payment.jobTitle}
          </h4>
          <p className="text-xs text-gray-500 mt-1">{payment.jobDetails}</p>
        </div>
        <button
          onClick={() => onActionClick(payment)}
          className="p-1 hover:bg-gray-100 rounded focus:outline-none flex-shrink-0"
        >
          <MoreHorizontal className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="space-y-2 text-xs">
        <div>
          <div className="text-gray-600 mb-1">Requester:</div>
          <div className="text-gray-900 font-medium">{payment.requester}</div>
          <div className="text-gray-500">{payment.requesterDetails}</div>
        </div>
        <div>
          <div className="text-gray-600 mb-1">Contractor:</div>
          <div className="text-gray-900 font-medium">{payment.contractor}</div>
          <div className="text-gray-500">{payment.contractorDetails}</div>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100">
          <div>
            <div className="text-gray-600">Contract:</div>
            <div className="text-gray-900 font-semibold">
              {payment.contractAmount}
            </div>
          </div>
          <div>
            <div className="text-gray-600">Platform Fee:</div>
            <div className="text-gray-900 font-semibold">
              {payment.platformFee}
            </div>
          </div>
        </div>
        <div className="pt-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            {payment.status === "completed" ? "Completed" : "Pending"}
          </span>
        </div>
      </div>
    </div>
  );
};

// Upcoming Releases Table Component
const UpcomingReleasesTable: React.FC<{
  payments: Payment[];
  onActionClick: (payment: Payment) => void;
}> = ({ payments, onActionClick }) => {
  return (
    <>
      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-3">
        {payments.map((payment) => (
          <UpcomingReleaseCard
            key={payment.id}
            payment={payment}
            onActionClick={onActionClick}
          />
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">
                  Job Details
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">
                  Parties
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">
                  Payment Breakdown
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="text-sm font-medium text-gray-900">
                      {payment.jobTitle}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {payment.milestone || "Project Completion"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {payment.jobDetails}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="mb-2">
                      <div className="text-xs text-gray-500 mb-0.5">From</div>
                      <div className="text-sm text-gray-900">
                        {payment.requester}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">To</div>
                      <div className="text-sm text-gray-900">
                        {payment.contractor}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Accepted:{" "}
                      {payment.acceptedDate ||
                        payment.jobDetails.replace("Completed: ", "")}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total:</span>
                        <span className="font-medium text-gray-900">
                          {payment.contractAmount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Platform (10%):</span>
                        <span className="font-medium text-blue-600">
                          {payment.platformFee}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Contractor:</span>
                        <span className="font-medium text-blue-600">
                          {payment.contractorReceives}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      Accept Complete Request
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => onActionClick(payment)}
                      className="px-4 py-2 text-xs font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none"
                    >
                      Review & Release
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

// Compliance Hold Table Component
// const ComplianceHoldTable: React.FC<{ payments: Payment[] }> = ({ payments }) => {
//   return (
//     <>
//       {/* Mobile Card View */}
//       <div className="block lg:hidden space-y-3">
//         {payments.map((payment) => (
//           <div key={payment.id} className="bg-white border border-gray-200 rounded-lg p-4">
//             <div className="space-y-3 text-xs">
//               <div>
//                 <div className="text-gray-600 mb-1">Requester + Contractor:</div>
//                 <div className="text-sm font-medium text-gray-900">{payment.requester}</div>
//                 <div className="text-gray-500">{payment.requesterDetails}</div>
//                 <div className="text-sm font-medium text-gray-900 mt-1">{payment.contractor}</div>
//                 <div className="text-gray-500">{payment.contractorDetails}</div>
//               </div>
//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <div className="text-gray-600">Amount:</div>
//                   <div className="text-gray-900 font-semibold">{payment.contractAmount}</div>
//                 </div>
//                 <div>
//                   <div className="text-gray-600">Platform Fee:</div>
//                   <div className="text-gray-900 font-semibold">{payment.platformFee}</div>
//                 </div>
//               </div>
//               <div>
//                 <div className="text-gray-600">Contractor Receives:</div>
//                 <div className="text-gray-900 font-semibold">{payment.contractorReceives}</div>
//               </div>
//               <button className="w-full px-4 py-2 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors">
//                 Resolve
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Desktop Table View */}
//       <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-gray-50 border-b border-gray-200">
//               <tr>
//                 <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Requester + Contractor</th>
//                 <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Amount</th>
//                 <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Platform Fee</th>
//                 <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Contractor Receives</th>
//                 <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200">
//               {payments.map((payment) => (
//                 <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
//                   <td className="py-4 px-4">
//                     <div className="mb-2">
//                       <div className="text-sm font-medium text-gray-900">{payment.requester}</div>
//                       <div className="text-xs text-gray-500">{payment.requesterDetails}</div>
//                     </div>
//                     <div>
//                       <div className="text-sm font-medium text-gray-900">{payment.contractor}</div>
//                       <div className="text-xs text-gray-500">{payment.contractorDetails}</div>
//                     </div>
//                   </td>
//                   <td className="py-4 px-4 text-sm font-semibold text-gray-900">{payment.contractAmount}</td>
//                   <td className="py-4 px-4 text-sm font-semibold text-blue-600">{payment.platformFee}</td>
//                   <td className="py-4 px-4 text-sm font-semibold text-gray-900">{payment.contractorReceives}</td>
//                   <td className="py-4 px-4">
//                     <button className="px-4 py-2 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors focus:outline-none">
//                       Resolve
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </>
//   );
// };

// Recently Released Payments Table Component
const RecentlyReleasedTable: React.FC<{ payments: Payment[] }> = ({
  payments,
}) => {
  return (
    <>
      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-3">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="bg-white border border-gray-200 rounded-lg p-4"
          >
            <div className="space-y-3 text-xs">
              <div>
                <div className="text-gray-600 mb-1">
                  Requester + Contractor:
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {payment.requester}
                </div>
                <div className="text-gray-500">{payment.requesterDetails}</div>
                <div className="text-sm font-medium text-gray-900 mt-1">
                  {payment.contractor}
                </div>
                <div className="text-gray-500">{payment.contractorDetails}</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-gray-600">Amount:</div>
                  <div className="text-gray-900 font-semibold">
                    {payment.contractAmount}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Platform Fee:</div>
                  <div className="text-blue-600 font-semibold">
                    {payment.platformFee}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-gray-600">Contractor Received:</div>
                <div className="text-gray-900 font-semibold">
                  {payment.contractorReceives}
                </div>
              </div>
              <button className="w-full px-4 py-2 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg">
                Released
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">
                  Job
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">
                  Requester → Contractor
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">
                  Amount
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">
                  Platform Fee
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">
                  Contractor Received
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="text-sm font-medium text-gray-900">
                      {payment.jobTitle}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {payment.milestone || "Project Completion"}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {payment.jobDetails}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="mb-2">
                      <div className="text-xs text-gray-500 mb-0.5">From</div>
                      <div className="text-sm text-gray-900">
                        {payment.requester}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-0.5">To</div>
                      <div className="text-sm text-gray-900">
                        {payment.contractor}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Accepted:{" "}
                      {payment.acceptedDate ||
                        payment.jobDetails.replace("Completed: ", "")}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm font-semibold text-gray-900">
                    {payment.contractAmount}
                  </td>
                  <td className="py-4 px-4 text-sm font-semibold text-green-600">
                    {payment.platformFee}
                  </td>
                  <td className="py-4 px-4 text-sm font-semibold text-blue-600">
                    {payment.contractorReceives}
                  </td>
                  <td className="py-4 px-4">
                    <button className="px-4 py-2 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-lg">
                      Released
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

// Main Component
const PaymentProcessing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"pending" | "released">("pending");
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [currentPagePending, setCurrentPagePending] = useState(1);
  const [currentPageReleased, setCurrentPageReleased] = useState(1);
  const itemsPerPage = 10;

  // Refs for scrolling to sections
  const pendingSectionRef = useRef<HTMLDivElement>(null);
  const releasedSectionRef = useRef<HTMLDivElement>(null);

  // Fetch payments from API
  const {
    data: reviewPaymentsData,
    isLoading: isLoadingReview,
    refetch: refetchReview,
  } = useGetAllReviewPaymentQuery({
    page: currentPagePending,
    limit: itemsPerPage,
  });

  const {
    data: releasedPaymentsData,
    isLoading: isLoadingReleased,
    refetch: refetchReleased,
  } = useGetAllReleasedPaymentQuery({
    page: currentPageReleased,
    limit: itemsPerPage,
  });

  const [releasePayment] = useReleasePaymentMutation();

  // Transform API response to Payment interface
  const transformPayment = (payment: any, index: number): Payment => {
    const formatAmount = (amount?: number | string) => {
      if (!amount && amount !== 0) return "$0";
      const numAmount =
        typeof amount === "string" ? parseFloat(amount) : amount;
      if (isNaN(numAmount)) return "$0";
      return `$${numAmount.toLocaleString()}`;
    };

    const calculatePlatformFee = (amount?: number | string) => {
      if (!amount && amount !== 0) return "$0";
      const numAmount =
        typeof amount === "string" ? parseFloat(amount) : amount;
      if (isNaN(numAmount)) return "$0";
      const fee = numAmount * 0.1;
      return `$${fee.toLocaleString()}`;
    };

    const calculateContractorReceives = (amount?: number | string) => {
      if (!amount && amount !== 0) return "$0";
      const numAmount =
        typeof amount === "string" ? parseFloat(amount) : amount;
      if (isNaN(numAmount)) return "$0";
      const receives = numAmount * 0.9;
      return `$${receives.toLocaleString()}`;
    };

    // Generate ID from paymentId
    const generateId = () => {
      if (payment.paymentId) {
        const hexStr = payment.paymentId.replace(/-/g, "").substring(0, 8);
        const num = parseInt(hexStr, 16);
        if (!isNaN(num)) return num;
      }
      return index + 1;
    };

    // Format date for display (e.g., "Completed: 2024-12-15")
    const formatDisplayDate = (
      dateStr?: string,
      prefix: string = "Completed",
    ) => {
      if (!dateStr) return `${prefix}: Recently`;
      try {
        const date = new Date(dateStr);
        const formatted = date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
        return `${prefix}: ${formatted}`;
      } catch {
        return `${prefix}: Recently`;
      }
    };

    const contractAmount = formatAmount(payment.amount);
    const platformFee = calculatePlatformFee(payment.amount);
    const contractorReceives = calculateContractorReceives(payment.amount);

    // Format date for accepted date (using createdAt as accepted date)
    const formatAcceptedDate = (dateStr?: string) => {
      if (!dateStr) return "Recently";
      try {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });
      } catch {
        return "Recently";
      }
    };

    // Since API doesn't include job/user details, use IDs from response
    // Format IDs to be more readable (first 8 chars)
    const formatId = (id?: string, prefix: string = "") => {
      if (!id) return `${prefix}N/A`;
      return `${prefix}${id.slice(0, 8)}...`;
    };

    const jobTitle =
      payment.job?.jobTitle || `Job ${formatId(payment.jobId, "")}`;
    const requesterName =
      payment.job?.user?.name || `User ${formatId(payment.userId, "")}`;
    const requesterEmail =
      payment.job?.user?.email || `ID: ${payment.userId || "N/A"}`;
    const contractorName =
      payment.user?.companyName ||
      payment.user?.name ||
      `Contractor ${formatId(payment.userId, "")}`;
    const contractorEmail =
      payment.user?.email || `ID: ${payment.userId || "N/A"}`;
    const acceptedDate = formatAcceptedDate(payment.createdAt);

    return {
      id: generateId(),
      paymentId: payment.paymentId,
      jobTitle: jobTitle,
      jobDetails: formatDisplayDate(payment.createdAt, "Completed"),
      requester: requesterName,
      requesterDetails: requesterEmail,
      contractor: contractorName,
      contractorDetails: contractorEmail,
      contractAmount, // Using actual amount from API
      platformFee, // Calculated from actual amount
      contractorReceives, // Calculated from actual amount
      milestone: "Project Completion",
      status:
        payment.releaseStatus === "RELESE" ||
        payment.releaseStatus === "RELEASED"
          ? "released"
          : "pending",
      originalPayment: payment, // Store full API response
      createdAt: payment.createdAt, // Actual creation date from API
      acceptedDate, // Formatted accepted date
      // Store additional API data for reference
      jobId: payment.jobId,
      bidId: payment.bidId,
      stripePaymentId: payment.stripePaymentId,
      paymentStatus: payment.status, // PAID status from API
    };
  };

  const upcomingPayments: Payment[] = useMemo(() => {
    const paymentsArray = reviewPaymentsData?.data?.data || [];
    return paymentsArray.map((payment: any, index: number) =>
      transformPayment(payment, index),
    );
  }, [reviewPaymentsData]);

  // const compliancePayments: Payment[] = []; // Can be filtered from reviewPayments if needed

  const releasedPayments: Payment[] = useMemo(() => {
    const paymentsArray = releasedPaymentsData?.data?.data || [];
    return paymentsArray.map((payment: any, index: number) =>
      transformPayment(payment, index),
    );
  }, [releasedPaymentsData]);

  // Calculate stats from actual API data
  // const stats = useMemo(() => {
  //   const pendingCount = upcomingPayments.length;

  //   // Calculate from actual API amounts (not formatted strings)
  //   const inEscrow = (reviewPaymentsData?.data?.data || []).reduce(
  //     (sum: number, p: any) => {
  //       return (
  //         sum +
  //         (typeof p.amount === "number" ? p.amount : parseFloat(p.amount) || 0)
  //       );
  //     },
  //     0,
  //   );

  //   const platformRevenue = (reviewPaymentsData?.data?.data || []).reduce(
  //     (sum: number, p: any) => {
  //       const amount =
  //         typeof p.amount === "number" ? p.amount : parseFloat(p.amount) || 0;
  //       return sum + amount * 0.1; // 10% platform fee
  //     },
  //     0,
  //   );

  //   const toBeReleased = (reviewPaymentsData?.data?.data || []).reduce(
  //     (sum: number, p: any) => {
  //       const amount =
  //         typeof p.amount === "number" ? p.amount : parseFloat(p.amount) || 0;
  //       return sum + amount * 0.9; // 90% to contractor
  //     },
  //     0,
  //   );

  //   // Calculate released today (payments released today) from actual API data
  //   const today = new Date().toDateString();
  //   const releasedTodayData = (releasedPaymentsData?.data?.data || []).filter(
  //     (p: any) => {
  //       if (!p.createdAt) return false;
  //       const paymentDate = new Date(p.createdAt).toDateString();
  //       return paymentDate === today;
  //     },
  //   );

  //   const releasedToday = releasedTodayData.reduce((sum: number, p: any) => {
  //     return (
  //       sum +
  //       (typeof p.amount === "number" ? p.amount : parseFloat(p.amount) || 0)
  //     );
  //   }, 0);

  //   const releasedTodayCount = releasedTodayData.length;

  //   return {
  //     inEscrow: `$${Math.round(inEscrow).toLocaleString()}`,
  //     platformRevenue: `$${Math.round(platformRevenue).toLocaleString()}`,
  //     toBeReleased: `$${Math.round(toBeReleased).toLocaleString()}`,
  //     releasedToday: `$${Math.round(releasedToday).toLocaleString()}`,
  //     pendingCount,
  //     releasedTodayCount,
  //   };
  // }, [reviewPaymentsData, releasedPaymentsData, upcomingPayments.length]);

  const handleActionClick = (payment: Payment) => {
    setSelectedPayment(payment);
    setIsActionModalOpen(true);
  };

  const handleViewDetails = () => {
    setIsActionModalOpen(false);
    setIsReviewModalOpen(true);
  };

  const handleReleasePayment = () => {
    setIsActionModalOpen(false);
    setIsReviewModalOpen(true);
  };

  const handleRelease = async (paymentId: string) => {
    try {
      await releasePayment(paymentId).unwrap();
      toast.success("Payment released successfully");
      // Refetch both lists to update data
      refetchReview();
      refetchReleased();
      setIsReviewModalOpen(false);
      setSelectedPayment(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to release payment");
    }
  };

  // Handle tab click with scroll
  const handleTabClick = (tab: "pending" | "released") => {
    setActiveTab(tab);
    // Use setTimeout to ensure DOM is ready
    setTimeout(() => {
      if (tab === "pending" && pendingSectionRef.current) {
        pendingSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      } else if (tab === "released" && releasedSectionRef.current) {
        releasedSectionRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  return (
    <div className="bg-gray-50 p-4">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
            Payment Processing
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Monitor contractor payments and escrow fund events
          </p>
        </div>

        {/* Stats Grid */}

        {/* this component refactor by shaikot  */}
        <AdminPaymentAnalytics />

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => handleTabClick("pending")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "pending"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Pending Releases
          </button>
          <button
            onClick={() => handleTabClick("released")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === "released"
                ? "bg-gray-900 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            Recently Released
          </button>
        </div>

        {/* Payments Awaiting Release Section */}
        <div ref={pendingSectionRef} className="mb-8">
          <div className="mb-4">
            <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
              Payments Awaiting Release
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              Review milestones and release payments to contractors
            </p>
          </div>
          {isLoadingReview ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-500">Loading payments...</p>
            </div>
          ) : upcomingPayments.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-500">No pending payments found.</p>
            </div>
          ) : (
            <>
              <UpcomingReleasesTable
                payments={upcomingPayments}
                onActionClick={handleActionClick}
              />
              {/* Pagination for Pending */}
              {reviewPaymentsData?.data?.meta && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button
                    onClick={() =>
                      setCurrentPagePending((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPagePending === 1}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from(
                    {
                      length: Math.min(
                        5,
                        reviewPaymentsData.data.meta.totalPage,
                      ),
                    },
                    (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPagePending(pageNum)}
                          className={`px-3 py-1.5 text-sm rounded ${
                            currentPagePending === pageNum
                              ? "bg-gray-900 text-white"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    },
                  )}
                  {reviewPaymentsData.data.meta.totalPage > 5 && (
                    <>
                      <span className="px-2 text-sm text-gray-600">...</span>
                      <button
                        onClick={() =>
                          setCurrentPagePending(
                            reviewPaymentsData.data.meta.totalPage,
                          )
                        }
                        className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded"
                      >
                        {reviewPaymentsData.data.meta.totalPage}
                      </button>
                    </>
                  )}
                  <button
                    onClick={() =>
                      setCurrentPagePending((prev) =>
                        Math.min(
                          reviewPaymentsData.data.meta.totalPage,
                          prev + 1,
                        ),
                      )
                    }
                    disabled={
                      currentPagePending >=
                      reviewPaymentsData.data.meta.totalPage
                    }
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Recently Released Payments Section */}
        <div ref={releasedSectionRef} className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
                Recently Released Payments
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                Payment history and completed transactions
              </p>
            </div>
            <div className="text-right">
              <a href="#" className="text-xs text-blue-600 hover:underline">
                View All
              </a>
            </div>
          </div>
          {isLoadingReleased ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-500">Loading payments...</p>
            </div>
          ) : releasedPayments.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
              <p className="text-gray-500">No released payments found.</p>
            </div>
          ) : (
            <>
              <RecentlyReleasedTable payments={releasedPayments} />
              {/* Pagination for Released */}
              {releasedPaymentsData?.data?.meta && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <button
                    onClick={() =>
                      setCurrentPageReleased((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPageReleased === 1}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    &lt; Previous
                  </button>
                  {Array.from(
                    {
                      length: Math.min(
                        5,
                        releasedPaymentsData.data.meta.totalPage,
                      ),
                    },
                    (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPageReleased(pageNum)}
                          className={`px-3 py-1.5 text-sm rounded ${
                            currentPageReleased === pageNum
                              ? "bg-gray-900 text-white"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    },
                  )}
                  {releasedPaymentsData.data.meta.totalPage > 5 && (
                    <>
                      <span className="px-2 text-sm text-gray-600">...</span>
                      <button
                        onClick={() =>
                          setCurrentPageReleased(
                            releasedPaymentsData.data.meta.totalPage,
                          )
                        }
                        className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded"
                      >
                        {releasedPaymentsData.data.meta.totalPage}
                      </button>
                    </>
                  )}
                  <button
                    onClick={() =>
                      setCurrentPageReleased((prev) =>
                        Math.min(
                          releasedPaymentsData.data.meta.totalPage,
                          prev + 1,
                        ),
                      )
                    }
                    disabled={
                      currentPageReleased >=
                      releasedPaymentsData.data.meta.totalPage
                    }
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next &gt;
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modals */}
        <ActionModal
          isOpen={isActionModalOpen}
          onClose={() => setIsActionModalOpen(false)}
          onViewDetails={handleViewDetails}
          onReleasePayment={handleReleasePayment}
        />

        <ReviewPaymentModal
          isOpen={isReviewModalOpen}
          onClose={() => {
            setIsReviewModalOpen(false);
            setSelectedPayment(null);
          }}
          payment={selectedPayment}
          onRelease={handleRelease}
        />
      </div>
    </div>
  );
};

export default PaymentProcessing;
