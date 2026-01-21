import {
  CheckCircle,

  Eye,
  MessageCircleMore,
} from "lucide-react";
import { useState } from "react";
import PaymentModal from "./Modal/PaymentModal";

interface DetailesBidsTabProps {
  singleJobData?: any;
  isLoading?: boolean;
}

export default function DetailesBidsTab({
  singleJobData,
  isLoading = false,
}: DetailesBidsTabProps) {
  const bidData = singleJobData?.bids || [];
  console.log("iam ", bidData);

  // for modal paumenbt
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState<any>(null);

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
                Elite Elevator Solutions
              </h3>

              <span className="inline-flex items-center bg-green-500 text-white gap-1 text-xs font-medium px-2.5 py-1 rounded-md">
                <CheckCircle size={12} />
                Verified
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
            <p className="text-muted-foreground text-sm mt-0.5">
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
                <button className="p-2.5 cursor-pointer rounded-lg border border-card-border bg-card hover:bg-muted transition-colors">
                  <Eye size={20} className="text-muted-foreground" />
                </button>

                <button className="p-2.5 cursor-pointer rounded-lg border border-card-border bg-card hover:bg-muted transition-colors">
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
                  className="bg-[#0A1A3A] text-white px-5 py-2.5 rounded-lg font-semibold cursor-pointer text-sm hover:opacity-90 transition-opacity"
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
        />
      )}
    </div>
  );
}
