import React, { useState, useMemo } from 'react';
import { Search, Package, Clock, DollarSign, Percent, MoreHorizontal, X, Star, Eye, Users } from 'lucide-react';
import { useGetAllBidByAdminQuery } from '@/Redux/features/AdminDashboard/adminApi';

// Types
interface Bid {
  id: number;
  contractor: string;
  contractorEmail: string;
  job: string;
  jobDetails: string;
  requester: string;
  bidAmount: string;
  platformFee: string;
  timeline: string;
  status: 'pending' | 'completed';
  rating?: number;
  experience?: string;
}

// Stats Card Component
const StatsCard: React.FC<{ title: string; value: string | number; subtitle: string; icon: React.ReactNode }> = ({ title, value, subtitle, icon }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs sm:text-sm text-gray-600">{title}</span>
        <div className="text-gray-400">{icon}</div>
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-xs text-gray-500">{subtitle}</div>
    </div>
  );
};

// Action Modal Component
const ActionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onViewBids: () => void;
  onViewAllBidders: () => void;
}> = ({ isOpen, onClose, onViewBids, onViewAllBidders }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-900">Action</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded focus:outline-none">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-4 space-y-2">
          <button
            onClick={onViewBids}
            className="w-full px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            <span>View Bids</span>
          </button>
          <button
            onClick={onViewAllBidders}
            className="w-full px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            <span>View All Bidders</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// All Bidders Modal Component
const AllBiddersModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  bids: Bid[];
  jobTitle: string;
}> = ({ isOpen, onClose, bids }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">All Bids</h3>
            <p className="text-xs text-gray-500 mt-1">Monitor and review all contractor bid submissions</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded focus:outline-none flex-shrink-0">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {bids.map((bid) => (
            <div key={bid.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-gray-900">{bid.contractor}</h4>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < (bid.rating || 5) ? 'fill-orange-400 text-orange-400' : 'fill-gray-200 text-gray-200'
                        }`}
                      />
                    ))}
                    <span className="text-xs text-gray-600 ml-1">{bid.rating || 5} (7 project)</span>
                  </div>
                  <p className="text-xs text-gray-500">{bid.experience || 'Est. 30-40 days completion experience'}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <div className="text-lg font-bold text-gray-900">{bid.bidAmount}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {bid.timeline === '16 weeks' ? 'Est. 1 week' : bid.timeline}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Bid Card Component (Mobile)
const BidCard: React.FC<{ bid: Bid; onActionClick: (bid: Bid) => void }> = ({ bid, onActionClick }) => {
  const getStatusColor = (status: string) => {
    return status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0">
            <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500 rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 truncate">{bid.contractor}</h4>
            <p className="text-xs text-gray-500 truncate">{bid.contractorEmail}</p>
          </div>
        </div>
        <button 
          onClick={() => onActionClick(bid)}
          className="p-1 hover:bg-gray-100 rounded focus:outline-none flex-shrink-0"
        >
          <MoreHorizontal className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="space-y-2 text-xs">
        <div>
          <div className="text-gray-600 mb-0.5">Job:</div>
          <div className="text-gray-900 font-medium">{bid.job}</div>
          <div className="text-gray-500">{bid.jobDetails}</div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Requester:</span>
          <span className="text-gray-900">{bid.requester}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Bid Amount:</span>
          <span className="text-gray-900 font-medium">{bid.bidAmount}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Platform Fee (10%):</span>
          <span className="text-red-600 font-medium">{bid.platformFee}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Timeline:</span>
          <span className="text-gray-900">{bid.timeline}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Status:</span>
          <span className={`px-2 py-1 rounded-full font-medium ${getStatusColor(bid.status)}`}>
            {bid.status === 'pending' ? 'Pending' : 'Completed'}
          </span>
        </div>
      </div>
    </div>
  );
};

// Bids Table Component
const BidsTable: React.FC<{ bids: Bid[]; onActionClick: (bid: Bid) => void }> = ({ bids, onActionClick }) => {
  const getStatusColor = (status: string) => {
    return status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700';
  };

  return (
    <>
      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-3">
        {bids.map((bid) => (
          <BidCard key={bid.id} bid={bid} onActionClick={onActionClick} />
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Contractor</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Job</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Requester</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Bid Amount</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Platform Fee (10%)</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Timeline</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bids.map((bid) => (
                <tr key={bid.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0">
                        <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500 rounded-full"></div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{bid.contractor}</div>
                        <div className="text-xs text-gray-500">{bid.contractorEmail}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm font-medium text-gray-900">{bid.job}</div>
                    <div className="text-xs text-gray-500">{bid.jobDetails}</div>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">{bid.requester}</td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">{bid.bidAmount}</td>
                  <td className="py-4 px-4 text-sm font-medium text-red-600">{bid.platformFee}</td>
                  <td className="py-4 px-4 text-sm text-gray-900">{bid.timeline}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(bid.status)}`}>
                      {bid.status === 'pending' ? 'Pending' : 'Completed'}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button 
                      onClick={() => onActionClick(bid)}
                      className="p-1 hover:bg-gray-100 rounded focus:outline-none"
                    >
                      <MoreHorizontal className="w-5 h-5 text-gray-600" />
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
const BidsManagement: React.FC = () => {
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isAllBiddersModalOpen, setIsAllBiddersModalOpen] = useState(false);
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch bids from API
  const { data: bidsData, isLoading, isError } = useGetAllBidByAdminQuery({
    page: currentPage,
    limit: itemsPerPage,
    searchTerm: searchTerm || undefined,
  });

  // Transform API response to match Bid interface
  const bids: Bid[] = useMemo(() => {
    const bidsArray = bidsData?.data?.data || [];

    if (!bidsArray || bidsArray.length === 0) return [];

    return bidsArray.map((bid: any, index: number) => {
      // Format bid amount
      const formatAmount = (amount?: number | string) => {
        if (!amount && amount !== 0) return '$0';
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        if (isNaN(numAmount)) return '$0';
        return `$${numAmount.toLocaleString()}`;
      };

      // Calculate platform fee (10%)
      const calculatePlatformFee = (amount?: number | string) => {
        if (!amount && amount !== 0) return '$0';
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        if (isNaN(numAmount)) return '$0';
        const fee = numAmount * 0.1;
        return `$${fee.toLocaleString()}`;
      };

      // Format timeline
      const formatTimeline = (timeline?: number | string) => {
        if (!timeline && timeline !== 0) return 'N/A';
        if (typeof timeline === 'number') {
          return `${timeline} ${timeline === 1 ? 'day' : 'days'}`;
        }
        return timeline;
      };

      // Map status
      const mapStatus = (status?: string): 'pending' | 'completed' => {
        if (!status) return 'pending';
        const upperStatus = status.toUpperCase();
        if (upperStatus === 'ACCEPTED' || upperStatus === 'COMPLETED') return 'completed';
        return 'pending';
      };

      // Get contractor info
      const contractorName = bid.user?.companyName || bid.user?.name || 'Unknown Contractor';
      const contractorEmail = bid.user?.email || 'No email';

      // Get job info
      const jobTitle = bid.job?.jobTitle || bid.jobTitle || 'Untitled Job';
      const jobDetails = bid.job?.user?.name || bid.requesterName || 'Unknown Requester';
      const requesterName = bid.job?.user?.name || bid.requesterName || 'Unknown';

      // Generate ID
      const generateId = () => {
        if (bid.bidId) {
          const hexStr = bid.bidId.replace(/-/g, '').substring(0, 8);
          const num = parseInt(hexStr, 16);
          if (!isNaN(num)) return num;
        }
        return index + 1;
      };

      return {
        id: generateId(),
        contractor: contractorName,
        contractorEmail: contractorEmail,
        job: jobTitle,
        jobDetails: jobDetails,
        requester: requesterName,
        bidAmount: formatAmount(bid.bidAmount),
        platformFee: calculatePlatformFee(bid.bidAmount),
        timeline: formatTimeline(bid.timeline || bid.completionTimeline),
        status: mapStatus(bid.status),
        rating: bid.user?.rating || 5,
        experience: bid.brefProposal || 'No experience details',
      };
    });
  }, [bidsData]);

  // Calculate stats from bids data
  const stats = useMemo(() => {
    const totalBids = bidsData?.data?.meta?.total || 0;
    const pendingBids = bids.filter(b => b.status === 'pending').length;
    const avgBidAmount = bids.length > 0
      ? bids.reduce((sum, bid) => {
          const amount = parseFloat(bid.bidAmount.replace(/[^0-9.]/g, ''));
          return sum + (isNaN(amount) ? 0 : amount);
        }, 0) / bids.length
      : 0;
    const totalPlatformFees = bids.reduce((sum, bid) => {
      const fee = parseFloat(bid.platformFee.replace(/[^0-9.]/g, ''));
      return sum + (isNaN(fee) ? 0 : fee);
    }, 0);

    return {
      totalBids,
      pendingBids,
      avgBidAmount: `$${Math.round(avgBidAmount / 1000)}K`,
      totalPlatformFees: `$${Math.round(totalPlatformFees / 1000)}K`,
    };
  }, [bidsData, bids]);

  // Use same bids data for all bidders modal
  const allBidders: Bid[] = bids;

  const handleActionClick = (bid: Bid) => {
    setSelectedBid(bid);
    setIsActionModalOpen(true);
  };

  const handleViewBids = () => {
    setIsActionModalOpen(false);
    // Handle view bids logic
  };

  const handleViewAllBidders = () => {
    setIsActionModalOpen(false);
    setIsAllBiddersModalOpen(true);
  };

  return (
    <div className="bg-gray-50 p-4">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">Bids Management</h1>
          <p className="text-xs sm:text-sm text-gray-600">View, compare, and finalize contractor bids across all jobs</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Total Bids"
            value={stats.totalBids.toLocaleString()}
            subtitle="All bids submitted"
            icon={<Package className="w-5 h-5" />}
          />
          <StatsCard
            title="Pending Bids"
            value={stats.pendingBids}
            subtitle="Awaiting review"
            icon={<Clock className="w-5 h-5" />}
          />
          <StatsCard
            title="Avg Bid Amount"
            value={stats.avgBidAmount}
            subtitle="Per job"
            icon={<DollarSign className="w-5 h-5" />}
          />
          <StatsCard
            title="Platform Fees"
            value={stats.totalPlatformFees}
            subtitle="Total fees earned"
            icon={<Percent className="w-5 h-5" />}
          />
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by contractor, job, or requester..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Section Title */}
        <div className="mb-4">
          <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">All Bids</h2>
          <p className="text-xs sm:text-sm text-gray-600">Monitor and review all contractor bid submissions</p>
        </div>

        {/* Bids Table */}
        {isLoading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">Loading bids...</p>
          </div>
        ) : isError ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-red-500">Error loading bids. Please try again.</p>
          </div>
        ) : bids.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No bids found.</p>
          </div>
        ) : (
          <BidsTable bids={bids} onActionClick={handleActionClick} />
        )}

        {/* Pagination */}
        {bidsData?.data?.meta && (
          <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ‹ Previous
            </button>
            {Array.from({ length: Math.min(5, bidsData.data.meta.totalPage) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded ${
                    currentPage === pageNum
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            {bidsData.data.meta.totalPage > 5 && (
              <>
                <span className="px-1 sm:px-2 text-xs sm:text-sm text-gray-600">...</span>
                <button
                  onClick={() => setCurrentPage(bidsData.data.meta.totalPage)}
                  className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-gray-600 hover:bg-gray-100 rounded"
                >
                  {bidsData.data.meta.totalPage}
                </button>
              </>
            )}
            <button
              onClick={() => setCurrentPage(prev => Math.min(bidsData.data.meta.totalPage, prev + 1))}
              disabled={currentPage >= bidsData.data.meta.totalPage}
              className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next ›
            </button>
          </div>
        )}

        {/* Modals */}
        <ActionModal
          isOpen={isActionModalOpen}
          onClose={() => setIsActionModalOpen(false)}
          onViewBids={handleViewBids}
          onViewAllBidders={handleViewAllBidders}
        />

        <AllBiddersModal
          isOpen={isAllBiddersModalOpen}
          onClose={() => setIsAllBiddersModalOpen(false)}
          bids={allBidders}
          jobTitle={selectedBid?.job || ''}
        />
      </div>
    </div>
  );
};

export default BidsManagement;