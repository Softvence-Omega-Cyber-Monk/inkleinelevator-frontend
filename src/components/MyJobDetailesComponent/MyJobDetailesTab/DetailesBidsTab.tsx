import { CheckCircle, Eye, MessageCircleMore } from "lucide-react";
import { useState } from "react";
import PaymentModal from "./Modal/PaymentModal";

import TmessageModal from "@/components/userDashboardComponent/tmassageModal/TmessageModal";
import ViewDetailsModal from "@/components/userDashboardComponent/tmassageModal/ViewDetailsModal";

interface DetailesBidsTabProps {
  singleJobData?: any;
  isLoading?: boolean;
  refetch?: () => void;
}

export default function DetailesBidsTab({
  singleJobData,
  isLoading = false,
  refetch,
}: DetailesBidsTabProps) {
  const bidData = singleJobData?.bids || [];
  console.log("iam ", bidData);

  // for modal paumenbt
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState<any>(null);

  // for Message Modal
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedBidForMessage, setSelectedBidForMessage] = useState<any>(null);
  // details modal
  const [veiwedetailesModalOpen, setVeiwedetailesModalOpen] = useState(false);
  const [selectedViewedetailes, setselectedViewedetailes] = useState<any>(null);

  if (isLoading) {
    return <div>Loading bids...</div>;
  }

  return (
    <div>
      DetailesBidsTab ({bidData.length})
      {bidData.map((bid: any, index: number) => (
        <div
          key={bid.bidId || index}
          className="bg-card border border-[#0A1A3A33] bg-[#FFF] rounded-lg px-6 py-8 flex flex-col md:flex-row gap-6 items-center justify-between shadow-sm hover:shadow-md transition-shadow mb-6"
        >
          {/* Left Section */}
          <div className="flex flex-col gap-1.5">
            {/* Company Name & Verified Badge */}
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-card-foreground">
                {singleJobData?.jobTitle}
              </h3>

              <span
                className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-md ${
                  bid?.status === "ACCEPTED"
                    ? "bg-green-500 text-white"
                    : bid?.status === "DECLINED"
                      ? "bg-red-500 text-white"
                      : bid?.status === "PENDING_REVIEW"
                        ? "bg-yellow-400 text-white"
                        : "bg-gray-300 text-gray-800"
                }`}
              >
                <CheckCircle size={12} />
                {bid?.status}
              </span>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <span className="text-star font-semibold text-sm">4</span>
              <div className="flex items-center gap-0.5">star</div>
              <span className="text-muted-foreground text-sm">
                project count
              </span>
            </div>

            {/* Description */}
            <p className="text-muted-foreground text-sm mt-0.5 w-[70%]">
              {bid.brefProposal}
            </p>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <div className="text-right mr-4">
              <p className="text-2xl font-bold text-card-foreground">
                ${bid.bidAmount}
              </p>

              <p className="text-muted-foreground text-sm mt-2">
                Est. Timeline: {bid.timeline} weeks
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => {
                    setselectedViewedetailes(bid);
                    setVeiwedetailesModalOpen(true);
                  }}
                  className="p-2.5 cursor-pointer rounded-lg border border-card-border bg-card hover:bg-muted transition-colors"
                >
                  <Eye size={20} className="text-muted-foreground" />
                </button>

                <button
                  onClick={() => {
                    setSelectedBidForMessage(bid); // set the clicked bid info
                    setIsMessageModalOpen(true); // open the modal
                  }}
                  className="p-2.5 cursor-pointer rounded-lg border border-card-border bg-card hover:bg-muted transition-colors"
                >
                  <MessageCircleMore
                    size={20}
                    className="text-muted-foreground"
                  />
                </button>

                <button
                  onClick={() => {
                    setSelectedBid(bid);
                    setIsModalOpen(true);
                  }}
                  disabled={
                    bid?.status === "ACCEPTED" || bid?.status === "DECLINED"
                  }
                  className={`px-5 py-2.5 rounded-lg font-semibold text-sm transition-opacity ${
                    bid?.status === "ACCEPTED" || bid?.status === "DECLINED"
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-[#0A1A3A] text-white hover:opacity-90 cursor-pointer"
                  }`}
                >
                  Award Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
      {/* here is modal */}
      {isModalOpen && (
        <PaymentModal
          bid={selectedBid}
          job={singleJobData}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedBid(null);
          }}
          refetch={refetch}
        />
      )}
      {/* Message Modal */}
      {isMessageModalOpen && selectedBidForMessage && (
        <TmessageModal
          bidMessage={selectedBidForMessage}
          onClose={() => {
            setIsMessageModalOpen(false);
            setSelectedBidForMessage(null);
          }}
        />
      )}
      {/* View Details Modal */}
      {veiwedetailesModalOpen && selectedViewedetailes && (
        <ViewDetailsModal
          bid={selectedViewedetailes}
          onClose={() => {
            setVeiwedetailesModalOpen(false);
            setselectedViewedetailes(null);
          }}
        />
      )}
    </div>
  );
}
