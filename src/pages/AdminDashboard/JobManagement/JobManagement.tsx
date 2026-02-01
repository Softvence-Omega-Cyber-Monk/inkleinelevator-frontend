import React, { useState, useMemo } from "react";
import {
  Search,
  Briefcase,
  FolderOpen,
  Users,
  DollarSign,
  MoreHorizontal,
  X,
  FileText,
} from "lucide-react";
import { useGetAllJobByAdminQuery } from "@/Redux/features/AdminDashboard/adminApi";

// Types
interface Job {
  id: number;
  title: string;
  requester: string;
  requesterEmail: string;
  status: "posted" | "completed" | "in-progress";
  budget: string;
  location: string;
  bids: number;
  posted: string;
  description?: string;
  requirements?: string[];
  technicalRequirements?: string[];
  originalJob?: any; // Store original API job data
}

interface Bid {
  id: number;
  company: string;
  amount: string;
  timeframe: string;
  status: "active" | "accepted" | "rejected";
}

// Stats Card Component
const StatsCard: React.FC<{
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
}> = ({ title, value, subtitle, icon }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs sm:text-sm text-gray-600">{title}</span>
        <div className="text-gray-400">{icon}</div>
      </div>
      <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
        {value}
      </div>
      <div className="text-xs text-gray-500">{subtitle}</div>
    </div>
  );
};

// Action Modal Component
const ActionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onViewDetails: () => void;
  onViewBids: () => void;
}> = ({ isOpen, onClose, onViewDetails, onViewBids }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-900">
            Choose Action
          </h3>
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
            className="w-full px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>View Details</span>
          </button>
          <button
            onClick={onViewBids}
            className="w-full px-4 py-3 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors focus:outline-none flex items-center justify-center gap-2"
          >
            <Users className="w-4 h-4" />
            <span>View Bids</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Job Details Modal Component
const JobDetailsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  job: Job | null;
}> = ({ isOpen, onClose, job }) => {
  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50  flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
            Post New Job
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded focus:outline-none"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          {/* Job Details Section */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-base sm:text-lg font-semibold text-gray-900">
                  {job.title}
                </h4>
                <span
                  className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium mt-2 ${
                    job.status === "completed"
                      ? "bg-green-100 text-green-700"
                      : job.status === "in-progress"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {job.status === "completed"
                    ? "Completed"
                    : job.status === "in-progress"
                      ? "In Progress"
                      : "Active"}
                </span>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 mb-1">Job Budget</div>
                <div className="text-xl font-bold text-gray-900">
                  {job.budget}
                </div>
              </div>
            </div>

            {/* Project Description */}
            <div className="mb-6">
              <h5 className="text-sm font-semibold text-gray-900 mb-2">
                Project Description
              </h5>
              {job.description ? (
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {job.description}
                </p>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No description provided
                </p>
              )}
            </div>

            {/* Technical Requirements */}
            {job.technicalRequirements &&
              job.technicalRequirements.length > 0 && (
                <div className="mb-6">
                  <h5 className="text-sm font-semibold text-gray-900 mb-3">
                    Technical Requirements
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {job.technicalRequirements.map((req, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                      >
                        {req}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* Elevator Specifications */}
            {job.originalJob && (
              <div className="mb-6">
                <h5 className="text-sm font-semibold text-gray-900 mb-3">
                  Elevator Specifications
                </h5>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-500 mb-1">
                      Number of Elevators
                    </div>
                    <div className="text-gray-900 font-medium">
                      {job.originalJob.numberOfElevator || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Capacity</div>
                    <div className="text-gray-900 font-medium">
                      {job.originalJob.capasity || "N/A"} person
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Speed</div>
                    <div className="text-gray-900 font-medium">
                      {job.originalJob.speed || "N/A"} m/s
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-500 mb-1">Elevator Type</div>
                    <div className="text-gray-900 font-medium">
                      {job.originalJob.elevatorType || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Uploaded Photos */}
            {job.originalJob?.photo &&
              Array.isArray(job.originalJob.photo) &&
              job.originalJob.photo.length > 0 && (
                <div>
                  <h5 className="text-sm font-semibold text-gray-900 mb-3">
                    Uploaded Photos
                  </h5>
                  <div className="flex gap-3 flex-wrap">
                    {job.originalJob.photo.map(
                      (photoUrl: string, idx: number) => (
                        <img
                          key={idx}
                          src={photoUrl}
                          alt={`Job photo ${idx + 1}`}
                          className="w-20 h-20 object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      ),
                    )}
                  </div>
                </div>
              )}

            {/* Uploaded Documents */}
            {job.originalJob?.documents &&
              Array.isArray(job.originalJob.documents) &&
              job.originalJob.documents.length > 0 && (
                <div className="mt-6">
                  <h5 className="text-sm font-semibold text-gray-900 mb-3">
                    Uploaded Documents
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {job.originalJob.documents.map(
                      (docUrl: string, idx: number) => {
                        const fileName =
                          docUrl.split("/").pop() || `Document ${idx + 1}`;
                        return (
                          <a
                            key={idx}
                            href={docUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded text-xs font-medium flex items-center gap-1 hover:bg-blue-100 transition-colors"
                          >
                            <FileText className="w-3 h-3" />
                            {fileName}
                          </a>
                        );
                      },
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Bids Modal Component
const BidsModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  bids: Bid[];
  jobTitle: string;
}> = ({ isOpen, onClose, bids, jobTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">
              Bids
            </h3>
            <p className="text-xs text-gray-500 mt-1">{jobTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded focus:outline-none"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {bids.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              No bids available for this job
            </div>
          ) : (
            bids.map((bid) => (
              <div
                key={bid.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">
                      {bid.company}
                    </h4>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1 ${
                        bid.status === "accepted"
                          ? "bg-green-100 text-green-700"
                          : bid.status === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {bid.status === "accepted"
                        ? "Accepted"
                        : bid.status === "rejected"
                          ? "Rejected"
                          : "Pending"}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 mb-1">Bid Amount</div>
                    <div className="text-base font-bold text-gray-900">
                      {bid.amount}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">{bid.timeframe}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Job Row Component (Mobile Card)
const JobCard: React.FC<{ job: Job; onActionClick: (job: Job) => void }> = ({
  job,
  onActionClick,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "posted":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "in-progress":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate">
            {job.title}
          </h4>
          <p className="text-xs text-gray-500 truncate">{job.requester}</p>
          <p className="text-xs text-gray-400 truncate">{job.requesterEmail}</p>
        </div>
        <button
          onClick={() => onActionClick(job)}
          className="p-1 hover:bg-gray-100 rounded focus:outline-none flex-shrink-0"
        >
          <MoreHorizontal className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Status:</span>
          <span
            className={`px-2 py-1 rounded-full font-medium ${getStatusColor(job.status)}`}
          >
            {job.status}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Budget:</span>
          <span className="text-gray-900 font-medium">{job.budget}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Location:</span>
          <span className="text-gray-900">{job.location}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Bids:</span>
          <span className="text-gray-900 font-medium">{job.bids}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Posted:</span>
          <span className="text-gray-900">{job.posted}</span>
        </div>
      </div>
    </div>
  );
};

// Job Table Component
const JobsTable: React.FC<{
  jobs: Job[];
  onActionClick: (job: Job) => void;
}> = ({ jobs, onActionClick }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "posted":
        return "bg-blue-100 text-blue-700";
      case "completed":
        return "bg-green-100 text-green-700";
      case "in-progress":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <>
      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-3">
        {jobs.map((job) => (
          <JobCard key={job.id} job={job} onActionClick={onActionClick} />
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">
                  Job Title
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">
                  Requester
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">
                  Budget
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">
                  Location
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">
                  Bids
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">
                  Posted
                </th>
                <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="text-sm font-medium text-gray-900">
                      {job.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {job.requesterEmail}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm text-gray-900">{job.requester}</div>
                    <div className="text-xs text-gray-500">
                      {job.requesterEmail}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center text-nowrap px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">
                    {job.budget}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">
                    {job.location}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">
                    {job.bids}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">
                    {job.posted}
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => onActionClick(job)}
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
const JobsManagement: React.FC = () => {
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isBidsModalOpen, setIsBidsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch jobs from API
  const {
    data: jobsData,
    isLoading,
    isError,
    error,
  } = useGetAllJobByAdminQuery({
    page: currentPage,
    limit: itemsPerPage,
  });

  // Transform API response to match Job interface
  const jobs: Job[] = useMemo(() => {
    // API response structure: { success, message, data: { meta: {...}, data: [...] } }
    const jobsArray = jobsData?.data?.data || [];

    if (!jobsArray || jobsArray.length === 0) return [];

    return jobsArray.map((job: any, index: number) => {
      // Parse budget
      const parseBudget = (budgetStr?: string | number) => {
        if (!budgetStr && budgetStr !== 0) return "$0";

        // Handle numeric values
        if (typeof budgetStr === "number") {
          return `$${budgetStr.toLocaleString()}`;
        }

        // Handle string values
        if (typeof budgetStr === "string") {
          // Check if it's a range
          if (budgetStr.includes("-")) {
            const parts = budgetStr
              .split("-")
              .map((p) => p.trim().replace(/[^0-9.]/g, ""));
            if (parts.length === 2 && parts[0] && parts[1]) {
              const min = parseFloat(parts[0]);
              const max = parseFloat(parts[1]);
              if (!isNaN(min) && !isNaN(max)) {
                return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
              }
            }
          }
          // Single value
          const numericValue = parseFloat(budgetStr.replace(/[^0-9.]/g, ""));
          if (!isNaN(numericValue)) {
            return `$${numericValue.toLocaleString()}`;
          }
          return `$${budgetStr}`;
        }

        return "$0";
      };

      // Combine location fields
      const locationParts = [
        job.streetAddress,
        job.address,
        job.city,
        job.zipCode,
        job.state,
      ].filter(Boolean);
      const fullLocation =
        locationParts.join(", ") || job.location || "Location not specified";

      // Format date
      const formatDate = (dateStr?: string) => {
        if (!dateStr) return "Recently";
        try {
          const date = new Date(dateStr);
          return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        } catch {
          return "Recently";
        }
      };

      // Map status from API format to component format
      const mapStatus = (
        status?: string,
      ): "posted" | "completed" | "in-progress" => {
        if (!status) return "posted";
        const upperStatus = status.toUpperCase();
        if (upperStatus === "COMPLITE" || upperStatus === "COMPLETED")
          return "completed";
        if (upperStatus === "INPROGRESS" || upperStatus === "IN_PROGRESS")
          return "in-progress";
        if (upperStatus === "OPEN") return "posted";
        return "posted";
      };

      // Get requester info from user object
      const requesterName = job.user?.name || "Unknown";
      const requesterEmail = job.user?.email || "No email";

      // Generate a safe numeric ID from jobId UUID
      const generateId = () => {
        if (job.jobId) {
          // Extract first 8 characters and convert to number
          const hexStr = job.jobId.replace(/-/g, "").substring(0, 8);
          const num = parseInt(hexStr, 16);
          if (!isNaN(num)) return num;
        }
        return index + 1;
      };

      // Strip HTML from description
      const stripHtml = (html: string) => {
        if (!html) return "";
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
      };

      return {
        id: generateId(),
        title: job.jobTitle || "Untitled Job",
        requester: requesterName,
        requesterEmail: requesterEmail,
        status: mapStatus(job.jobStatus),
        budget: parseBudget(job.estimitedBudget),
        location: fullLocation,
        bids:
          job._count?.bids || (Array.isArray(job.bids) ? job.bids.length : 0),
        posted: formatDate(job.createdAt),
        description: stripHtml(job.projectDescription || ""),
        requirements: [],
        technicalRequirements: Array.isArray(
          job.technicalRequermentAndCertification,
        )
          ? job.technicalRequermentAndCertification
          : [],
        // Store original job data for modals
        originalJob: job,
      };
    });
  }, [jobsData]);

  // Filter jobs based on search and status
  const filteredJobs = useMemo(() => {
    let filtered = jobs;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchLower) ||
          job.requester.toLowerCase().includes(searchLower) ||
          job.requesterEmail.toLowerCase().includes(searchLower),
      );
    }

    if (statusFilter && statusFilter !== "Status") {
      filtered = filtered.filter(
        (job) => job.status === statusFilter.toLowerCase(),
      );
    }

    return filtered;
  }, [jobs, searchTerm, statusFilter]);

  // Calculate stats from filtered jobs
  const stats = useMemo(() => {
    const totalJobs = filteredJobs.length;
    const openJobs = filteredJobs.filter((j) => j.status === "posted").length;
    const totalBids = filteredJobs.reduce((sum, job) => sum + job.bids, 0);
    const totalValue = filteredJobs.reduce((sum, job) => {
      const budgetStr = job.budget.replace(/[^0-9-]/g, "");
      const parts = budgetStr.split("-");
      if (parts.length === 2) {
        return sum + (parseInt(parts[1]) || 0);
      }
      return sum + (parseInt(parts[0]) || 0);
    }, 0);

    return {
      totalJobs,
      openJobs,
      totalBids,
      totalValue: `$${(totalValue / 1000).toFixed(1)}K`,
    };
  }, [filteredJobs]);

  // Get bids from selected job's original data
  const bids: Bid[] = useMemo(() => {
    if (
      !selectedJob?.originalJob?.bids ||
      !Array.isArray(selectedJob.originalJob.bids)
    ) {
      return [];
    }

    return selectedJob.originalJob.bids.map((bid: any, index: number) => {
      const companyName =
        bid.user?.companyName || bid.user?.name || "Unknown Company";
      const amount =
        typeof bid.bidAmount === "number"
          ? `$${bid.bidAmount.toLocaleString()}`
          : `$${bid.bidAmount || "0"}`;
      const timeframe = bid.completionTimeline
        ? `Completion: ${bid.completionTimeline}`
        : bid.timeline
          ? `Est. ${bid.timeline} days completion timeframe`
          : "Timeline not specified";

      const bidStatus = bid.status?.toLowerCase() || "active";
      const status: "active" | "accepted" | "rejected" = bidStatus.includes(
        "accepted",
      )
        ? "accepted"
        : bidStatus.includes("rejected")
          ? "rejected"
          : "active";

      return {
        id: index + 1,
        company: companyName,
        amount: amount,
        timeframe: timeframe,
        status: status,
      };
    });
  }, [selectedJob]);

  const handleActionClick = (job: Job) => {
    setSelectedJob(job);
    setIsActionModalOpen(true);
  };

  const handleViewDetails = () => {
    setIsActionModalOpen(false);
    setIsDetailsModalOpen(true);
  };

  const handleViewBids = () => {
    setIsActionModalOpen(false);
    setIsBidsModalOpen(true);
  };

  return (
    <div className="bg-gray-50 p-4">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
            Jobs Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-600">
            Monitor all elevator jobs posted across the platform
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatsCard
            title="Total Jobs"
            value={stats.totalJobs}
            subtitle="Across all statuses"
            icon={<Briefcase className="w-5 h-5" />}
          />
          <StatsCard
            title="Open Jobs"
            value={stats.openJobs.toString().padStart(2, "0")}
            subtitle="Accepting bids"
            icon={<FolderOpen className="w-5 h-5" />}
          />
          <StatsCard
            title="Total Bids"
            value={stats.totalBids}
            subtitle={`Avg. ${stats.totalJobs > 0 ? Math.round(stats.totalBids / stats.totalJobs) : 0} bids per job`}
            icon={<Users className="w-5 h-5" />}
          />
          <StatsCard
            title="Total Value"
            value={stats.totalValue}
            subtitle="Combined job budgets"
            icon={<DollarSign className="w-5 h-5" />}
          />
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by job title or requester..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 focus:outline-none bg-white w-full sm:w-auto sm:min-w-[140px]"
          >
            <option value="">All Status</option>
            <option value="posted">Posted</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Section Title */}
        <div className="mb-4">
          <h2 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">
            All Jobs
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Track job status and manage visibility
          </p>
        </div>

        {/* Jobs Table */}
        {isLoading ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">Loading jobs...</p>
          </div>
        ) : isError ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-red-500">
              Error loading jobs. Please try again.
            </p>
            {error && "data" in error && (
              <p className="text-xs text-gray-500 mt-2">
                {(error.data as any)?.message || "Unknown error occurred"}
              </p>
            )}
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No jobs found.</p>
          </div>
        ) : (
          <JobsTable jobs={filteredJobs} onActionClick={handleActionClick} />
        )}

        {/* Pagination */}
        {jobsData?.data?.meta && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ‹ Previous
            </button>
            {Array.from(
              { length: Math.min(5, jobsData.data.meta.totalPage) },
              (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1.5 text-sm rounded ${
                      currentPage === pageNum
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              },
            )}
            {jobsData.data.meta.totalPage > 5 && (
              <>
                <span className="px-2 text-sm text-gray-600">...</span>
                <button
                  onClick={() => setCurrentPage(jobsData.data.meta.totalPage)}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded"
                >
                  {jobsData.data.meta.totalPage}
                </button>
              </>
            )}
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(jobsData.data.meta.totalPage, prev + 1),
                )
              }
              disabled={currentPage >= jobsData.data.meta.totalPage}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next ›
            </button>
          </div>
        )}

        {/* Modals */}
        <ActionModal
          isOpen={isActionModalOpen}
          onClose={() => setIsActionModalOpen(false)}
          onViewDetails={handleViewDetails}
          onViewBids={handleViewBids}
        />

        <JobDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          job={selectedJob}
        />

        <BidsModal
          isOpen={isBidsModalOpen}
          onClose={() => setIsBidsModalOpen(false)}
          bids={bids}
          jobTitle={selectedJob?.title || ""}
        />
      </div>
    </div>
  );
};

export default JobsManagement;
