import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  DollarSign,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useGetElevatorAllRecentBidQuery } from "@/Redux/features/ElevatorDa/elevatorbid/elevatorbidApi";
import { useRequestJobStatusMutation } from "@/Redux/features/userDa/userJob/userJobApi";
import { toast } from "sonner";

// My Jobs Component - Uses recent bids API to get jobs
const MyJobsContent = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 100;

  // Fetch recent bids to get jobs
  const { data: recentBidsData, isLoading } = useGetElevatorAllRecentBidQuery();
  const [requestJobStatus] = useRequestJobStatusMutation();
  console.log(recentBidsData);
  // Transform recent bids data to jobs format
  const jobsFromBids = useMemo(() => {
    if (!recentBidsData?.data || !Array.isArray(recentBidsData.data)) return [];

    return recentBidsData.data.map((bid) => {
      const job = bid.job;
      console.log(job);
      // Parse budget range (format: "6300-3594")
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
            display: `$${Math.min(parts[0], parts[1])}-$${Math.max(parts[0], parts[1])}`,
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

      // Strip HTML from description
      const stripHtml = (html: string) => {
        if (!html) return "";
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
      };

      // Capitalize job type
      const capitalize = (str: string) => {
        if (!str) return "";
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
      };

      // Map bid status to job status
      const statusMap: Record<string, { status: string; color: string }> = {
        PENDING_REVIEW: { status: "Pending", color: "bg-yellow-500" },
        ACCEPTED: { status: "Accepted", color: "bg-green-500" },
        REJECTED: { status: "Not Accepted", color: "bg-red-500" },
        APPROVED: { status: "Approved", color: "bg-green-500" },
      };
      const statusInfo = statusMap[bid.status] || {
        status: "Active",
        color: "bg-orange-500",
      };

      // Format date
      const formatDate = (dateStr?: string) => {
        if (!dateStr) return "Recently";
        try {
          const date = new Date(dateStr);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - date.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          if (diffDays === 0) return "Today";
          if (diffDays === 1) return "Yesterday";
          if (diffDays < 7) return `${diffDays} days ago`;
          if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
          return date.toLocaleDateString();
        } catch {
          return "Recently";
        }
      };

      return {
        id: parseInt(job.jobId?.slice(0, 8) || "0", 16) || 0, // Generate numeric ID from jobId for compatibility
        jobId: job.jobId,
        title: job.jobTitle || "Untitled Job",
        location: fullLocation,
        budget: budget.display,
        budgetMin: budget.min,
        budgetMax: budget.max,
        postedTime: formatDate(job.createdAt),
        type: capitalize(job.jobType || ""),
        status: statusInfo.status,
        jobStaus: job.jobStatus,
        statusColor: statusInfo.color,
        description: stripHtml(job.projectDescription || ""),
      };
    });
  }, [recentBidsData]);

  // Use jobs from recent bids API only
  const allJobs = jobsFromBids;

  // Reset pagination when jobs change
  useEffect(() => {
    setCurrentPage(1);
  }, [jobsFromBids]);

  // Pagination logic
  const totalPages = Math.ceil(allJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedJobs = allJobs.slice(startIndex, endIndex);
  console.log("137 -----------", paginatedJobs);
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const handleSendMessage = async (id: number | string) => {
    console.log("Requesting job review for:", id);

    try {
      const res = await requestJobStatus(id).unwrap();
      console.log("Response:", res);
      toast.success("Job status updated to ready for review!");
    } catch (error: any) {
      console.error("Error:", error);
      const errorMessage =
        error?.data?.message || error?.message || "Failed to update job status";
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">Loading jobs...</div>
      </div>
    );
  }

  if (paginatedJobs.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-gray-500">No jobs found</div>
      </div>
    );
  }

  return (
    <>
      {/* Job Listings */}
      <div className="space-y-3 md:space-y-4">
        {paginatedJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white border border-gray-200 rounded-lg p-4 md:p-6"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3 md:gap-4 mb-3 md:mb-4">
              <div className="flex gap-2">
                <h2 className="text-base md:text-lg font-semibold text-gray-900 pr-2">
                  {job.title}
                </h2>
                {job.jobStaus == "INPROGRESS" && (
                  <button
                    onClick={() => handleSendMessage(job.jobId)}
                    className="w-full sm:w-auto bg-[#1e3a5f] text-white px-4 md:px-6 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium hover:bg-[#2d4a6f] transition-colors inline-block text-center"
                  >
                    Send Message
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <span className="bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap">
                  {job.type}
                </span>
                <span
                  className={`${job.statusColor} text-white text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap`}
                >
                  {job.status}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-4 mb-3 md:mb-4 text-xs md:text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                <span className="break-words">{job.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-gray-400 flex-shrink-0" />
                <span className="whitespace-nowrap">Budget: {job.budget}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-400 flex-shrink-0" />
                <span className="whitespace-nowrap">
                  Posted {job.postedTime}
                </span>
              </div>
            </div>

            <p className="text-xs md:text-sm text-gray-700 mb-3 md:mb-4 leading-relaxed">
              {job.description}
            </p>

            <Link
              to={`/elevator/my-job-details/${job.jobId || job.id}`}
              className="w-full sm:w-auto bg-[#1e3a5f] text-white px-4 md:px-6 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium hover:bg-[#2d4a6f] transition-colors inline-block text-center"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1 md:gap-2 overflow-x-auto pb-2">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className={`flex items-center gap-1 px-2 md:px-4 py-2 text-xs md:text-sm rounded-lg transition-colors whitespace-nowrap ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ChevronLeft size={16} />
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              className={`px-2.5 md:px-3 py-2 text-xs md:text-sm rounded-lg transition-colors ${
                currentPage === page
                  ? "bg-[#1e3a5f] text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`flex items-center gap-1 px-2 md:px-4 py-2 text-xs md:text-sm rounded-lg transition-colors whitespace-nowrap ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </>
  );
};

export default MyJobsContent;
