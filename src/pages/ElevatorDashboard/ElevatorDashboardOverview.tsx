import { useState, useMemo } from "react";
import { DollarSign, TrendingUp, Star, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import QuickBidModal from "@/components/ElevatorAllMdal/QuickBidModal";
import { useGetMyBidsQuery } from "@/Redux/features/ElevatorDa/elevatorbid/elevatorbidApi";
import { useGetAllJobsQuery } from "@/Redux/features/userDa/userJob/userJobApi";
import { useGetDashboardAnalyticsQuery } from "@/Redux/features/ElevatorDa/dashboardAnalytics/dashboardAnalyticsApi";

const ElevatorDashboardOverview = () => {
  const [quickBidModalOpen, setQuickBidModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<{
    id: number | string;
    title: string;
    budgetMin: number;
    budgetMax: number;
  } | null>(null);

  // Fetch dashboard analytics
  const { data: analyticsData, isLoading: isLoadingAnalytics } =
    useGetDashboardAnalyticsQuery();

  // Format revenue with currency
  const formatRevenue = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format rating
  const formatRating = (rating: number | null) => {
    if (rating === null || rating === undefined) return "N/A";
    return rating.toFixed(1);
  };

  // Create stats cards from API data
  const statsCards = useMemo(() => {
    const analytics = analyticsData?.data;
    const totalBids = analytics?.totalBid || 0;
    const jobCount = analytics?.jobCount || 0;
    const revenue = analytics?.totalRevenew || 0;
    const rating = analytics?.userRatingResult?._avg?.rating || null;

    return [
      {
        title: "Active Projects",
        value: jobCount.toString(),
        subtitle: `${jobCount} ${jobCount === 1 ? "project" : "projects"}`,
        icon: Briefcase,
      },
      {
        title: "Revenue This Month",
        value: formatRevenue(revenue),
        subtitle: revenue > 0 ? "Total revenue" : "No revenue yet",
        icon: DollarSign,
      },
      {
        title: "Total Bids",
        value: totalBids.toString(),
        subtitle: `${totalBids} ${totalBids === 1 ? "bid" : "bids"} submitted`,
        icon: TrendingUp,
      },
      {
        title: "Company Rating",
        value: formatRating(rating),
        subtitle: rating ? "Average rating" : "No ratings yet",
        icon: Star,
      },
    ];
  }, [analyticsData]);

  // Fetch all jobs using API
  const { data: allJobsData, isLoading: isLoadingActiveJobs } =
    useGetAllJobsQuery({
      page: 1,
      limit: 10, // Limit to 10 jobs for the dashboard
    });

  // Transform API response to match component structure
  const activeJobs = useMemo(() => {
    // Handle the API response structure: data.data.jobs
    const jobsArray = allJobsData?.data?.jobs || allJobsData?.data || [];
    if (!Array.isArray(jobsArray) || jobsArray.length === 0) return [];

    // Limit to 5 jobs for dashboard display
    return jobsArray.slice(0, 3).map((job: any) => {
      // Parse budget range (format: "6300-3594" or "50000")
      const parseBudget = (budgetStr?: string) => {
        if (!budgetStr) return { min: 0, max: 0, display: "$0" };
        const parts = budgetStr
          .split("-")
          .map((p) => parseFloat(p.trim()))
          .filter((p) => !isNaN(p));
        if (parts.length === 2) {
          return {
            min: Math.min(parts[0], parts[1]),
            max: Math.max(parts[0], parts[1]),
            display: `$${Math.min(parts[0], parts[1]).toLocaleString()}-$${Math.max(parts[0], parts[1]).toLocaleString()}`,
          };
        }
        // Single value budget
        const singleValue = parseFloat(budgetStr);
        if (!isNaN(singleValue)) {
          return {
            min: singleValue,
            max: singleValue,
            display: `$${singleValue.toLocaleString()}`,
          };
        }
        return { min: 0, max: 0, display: `$${budgetStr}` };
      };

      const budget = parseBudget(job.estimitedBudget);

      // Combine location fields
      const locationParts = [
        job.streetAddress,
        job.address,
        job.city,
        job.zipCode,
      ].filter(Boolean);
      const fullLocation =
        locationParts.join(", ") ||
        job.address ||
        job.city ||
        "Location not specified";

      // Capitalize job type
      const capitalize = (str: string) => {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      };

      return {
        id: job.jobId,
        jobId: job.jobId,
        title: job.jobTitle || "Untitled Job",
        type: capitalize(job.jobType || ""),
        budget: budget.display,
        budgetMin: budget.min,
        budgetMax: budget.max,
        location: fullLocation,
      };
    });
  }, [allJobsData]);

  // Fetch my bids using API
  const { data: bidsData, isLoading: isLoadingBids } = useGetMyBidsQuery({
    page: 0,
    limit: 10,
  });

  // Transform API response to match component structure
  const recentBids = useMemo(() => {
    if (!bidsData?.data?.data || !Array.isArray(bidsData.data.data)) return [];

    return bidsData.data.data.map((bid) => {
      // Map status to display text and color
      const statusMap: Record<string, { status: string; color: string }> = {
        PENDING_REVIEW: { status: "Pending", color: "bg-yellow-500" },
        ACCEPTED: { status: "Accepted", color: "bg-green-500" },
        REJECTED: { status: "Not Accepted", color: "bg-red-500" },
        APPROVED: { status: "Approved", color: "bg-green-500" },
      };
      const statusInfo = statusMap[bid.status] || {
        status: bid.status,
        color: "bg-gray-500",
      };

      return {
        title: bid.job?.jobTitle || "Unknown Job",
        bid: `$${bid.bidAmount.toLocaleString()}`,
        status: statusInfo.status,
        statusColor: statusInfo.color,
        bidId: bid.bidId,
        jobId: bid.jobId,
      };
    });
  }, [bidsData]);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Overview of your elevator jobs, bids, and activity
          </p>
        </div>
        {/* <button className="bg-[#1e3a5f] text-white px-3 md:px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-[#2d4a6f] transition-colors text-sm md:text-base w-full sm:w-auto">
                    <Briefcase size={18} />
                    Find Elevator Job
                </button> */}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {isLoadingAnalytics
          ? Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 p-4 md:p-6"
              >
                <div className="flex justify-between items-start mb-3 md:mb-4">
                  <span className="text-xs md:text-sm text-gray-300 bg-gray-200 rounded h-4 w-20 animate-pulse"></span>
                  <div className="w-4 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-200 bg-gray-200 rounded h-8 w-24 mb-1 animate-pulse"></div>
                <div className="text-xs text-gray-200 bg-gray-200 rounded h-3 w-32 animate-pulse"></div>
              </div>
            ))
          : statsCards.map((card, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 p-4 md:p-6"
              >
                <div className="flex justify-between items-start mb-3 md:mb-4">
                  <span className="text-xs md:text-sm text-gray-600">
                    {card.title}
                  </span>
                  <card.icon size={18} className="text-gray-400" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  {card.value}
                </div>
                <div className="text-xs text-gray-500">{card.subtitle}</div>
              </div>
            ))}
      </div>

      {/* Active Jobs and Recent Bids */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Active Jobs */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <h2 className="text-base md:text-lg font-semibold text-gray-900">
              Active Jobs
            </h2>
          </div>
          {isLoadingActiveJobs ? (
            <div className="p-4 md:p-6 text-center text-gray-500 text-sm">
              Loading active jobs...
            </div>
          ) : activeJobs.length === 0 ? (
            <div className="p-4 md:p-6 text-center text-gray-500 text-sm">
              No active jobs found
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {activeJobs.map((job: any) => (
                <div key={job.jobId || job.id} className="p-4 md:p-6">
                  <h3 className="font-semibold text-sm md:text-base text-gray-900 mb-3">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4 text-xs md:text-sm text-gray-600">
                    <span
                      className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${
                        job.type === "Modernization"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {job.type}
                    </span>
                    <span className="text-xs md:text-sm">{job.budget}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="text-xs md:text-sm">{job.location}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                    <Link
                      to={`/elevator/job-bid/${job.jobId || job.id}`}
                      className="flex-1 px-3 md:px-4 py-2 border border-gray-300 rounded-lg text-xs md:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors text-center"
                    >
                      View Details
                    </Link>
                    <button
                      onClick={() => {
                        setSelectedJob({
                          id: job.jobId || job.id,
                          title: job.title,
                          budgetMin: job.budgetMin,
                          budgetMax: job.budgetMax,
                        });
                        setQuickBidModalOpen(true);
                      }}
                      className="flex-1 px-3 md:px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-xs md:text-sm font-medium hover:bg-[#2d4a6f] transition-colors"
                    >
                      Quick Bid
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Recent Bids */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-4 md:p-6 border-b border-gray-200">
            <h2 className="text-base md:text-lg font-semibold text-gray-900">
              My Recent Bids
            </h2>
          </div>
          {isLoadingBids ? (
            <div className="p-4 md:p-6 text-center text-gray-500 text-sm">
              Loading bids...
            </div>
          ) : recentBids.length === 0 ? (
            <div className="p-4 md:p-6 text-center text-gray-500 text-sm">
              No bids found
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {recentBids.map((bid, index) => (
                <div key={bid.bidId || index} className="p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                    <h3 className="font-semibold text-sm md:text-base text-gray-900">
                      {bid.title}
                    </h3>
                    <span
                      className={`${bid.statusColor} text-white text-xs font-medium px-3 py-1 rounded-full w-fit`}
                    >
                      {bid.status}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600">
                    Bid: {bid.bid}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Bid Modal */}
      {quickBidModalOpen && selectedJob && (
        <QuickBidModal
          isOpen={quickBidModalOpen}
          onClose={() => {
            setQuickBidModalOpen(false);
            setSelectedJob(null);
          }}
          jobId={selectedJob.id}
          jobTitle={selectedJob.title}
          budgetMin={selectedJob.budgetMin}
          budgetMax={selectedJob.budgetMax}
        />
      )}
    </div>
  );
};

export default ElevatorDashboardOverview;
