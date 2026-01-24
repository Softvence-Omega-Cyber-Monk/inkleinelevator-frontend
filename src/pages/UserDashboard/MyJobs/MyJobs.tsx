import { useEffect, useState } from "react";
import {
  Search,
  Calendar,
  MoreVertical,
  ChevronDown,
  TriangleAlert,
  X,
} from "lucide-react";
import {
  useCloseJobMutation,
  useCompleteJobMutation,
  useGetAllMyJobsQuery,
  useRejectMutation,
} from "@/Redux/features/userDa/userJob/userJobApi";
import BeatLoader from "react-spinners/BeatLoader";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import pepole from "@/assets/image/people.png";
import ReviewModal from "@/components/userDashboardComponent/reviewModal/ReviewModal";

const MyJobs = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobType, setJobType] = useState("all");
  const [closeJob, { isLoading: closeLoading }] = useCloseJobMutation();
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [completeJob, { isLoading: completeLoading }] =
    useCompleteJobMutation();
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [selectedReviewJob, setSelectedReviewJob] = useState<any | null>(null);
  const [reject, { isLoading: rejectLoading }] = useRejectMutation();

  const { data, isLoading, refetch } = useGetAllMyJobsQuery({
    page: currentPage,
    limit: 10,
    search: searchQuery || undefined,
    jobType: jobType !== "all" ? jobType : undefined,
  });

  const myJobData = data?.data;
  console.log("amar job", myJobData);

  useEffect(() => {
    setCurrentPage(1); // reset page to 1
  }, [searchQuery, jobType]);

  // time calculated  functione
  function timeAgo(date: string | Date): string {
    const past = new Date(date).getTime();
    const now = Date.now();

    const diff = Math.floor((now - past) / 1000);

    if (diff < 60) return "Recently";
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;

    return `${Math.floor(diff / 86400)} days ago`;
  }

  // deleted handler
  const handleConfirm = async () => {
    if (!selectedJobId) return; // safety check

    try {
      const res = await closeJob(selectedJobId).unwrap(); // call API

      // Show toast based on backend response
      if (res.success) {
        refetch(); // refresh data
        toast.success(res.message); // ✅ backend message
      } else {
        toast.error(res.message || "Failed to close job");
      }

      setIsOpen(false); // close modal
      setSelectedJobId(null); // reset selected job
    } catch (err: any) {
      console.error(err);
      // if backend returns a message in error response
      toast.error(err?.data?.message || "Failed to close job");
    }
  };
  // handel compleated job
  const handleApproveComplete = async (job: any) => {
    try {
      const res = await completeJob(job.jobId).unwrap();

      if (res.success) {
        toast.success(res.message || "Job marked as completed");
        refetch();

        // ✅ OPEN REVIEW MODAL WITH FULL JOB
        setSelectedReviewJob(job);
        setIsReviewOpen(true);
      } else {
        toast.error(res.message || "Failed to complete job");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  // handel reject job
  const handleReject = async (job: any) => {
    try {
      const res = await reject(job.jobId).unwrap();

      if (res.success) {
        toast.success(res.message || "Job marked as rejected");
        refetch?.(); // refresh the job list

        // ✅ Optional: open review modal with full job
        setSelectedReviewJob(job);
        setIsReviewOpen(true);
      } else {
        toast.error(res.message || "Failed to reject job");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            My Jobs
          </h1>
          <p className="text-gray-600 text-sm">
            Overview of your elevator jobs, bids, and activity
          </p>
        </div>

        <button
          onClick={() => navigate("/user/createdPostElevatorJob")}
          className="
            w-full sm:w-auto
            flex items-center justify-center gap-2
            px-4 sm:px-6 py-2.5 sm:py-3
            bg-slate-900 text-white rounded-lg
            hover:bg-slate-800 transition
          "
        >
          <span className="text-xl">+</span>
          <span className="whitespace-nowrap">Post a New Elevator Job</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search Jobs by name, type ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
          />
        </div>
        <div className="relative w-full sm:w-auto">
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="appearance-none w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
          >
            <option value="all">All</option>
            <option value="OPEN">OPEN</option>
            <option value="ACCEPTED">ACCEPTED</option>
            <option value="DECLINED">DECLINED</option>
            <option value="PENDING_REVIEW">PENDING_REVIEW</option>
            <option value="INPROGRESS">INPROGRESS</option>
            <option value="COMPLITE">COMPLETED</option>
          </select>

          {/* Lucide arrow inside the select */}
          <ChevronDown
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
          />
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex justify-center py-10">
          <BeatLoader color="#0f172b" />
        </div>
      )}

      {/* No data message */}
      {!isLoading && myJobData?.jobs?.length === 0 && (
        <p className="text-center py-10 text-gray-500">No jobs found.</p>
      )}

      {/* Jobs List */}

      <div className="space-y-4 mb-6">
        {myJobData?.jobs?.map((job: any) => (
          <div
            key={job.jobId}
            className="
        bg-[#FFF] border border-gray-200 rounded-xl
        p-4 
        flex flex-col lg:flex-row
        gap-4 lg:gap-5
      "
          >
            {/* Job Image Placeholder */}
            <div className="w-full sm:w-40 lg:w-32 h-40 sm:h-28 lg:h-34 rounded-lg overflow-hidden flex-shrink-0 bg-gray-900 flex items-center justify-center text-gray-400">
              {job.photo && job.photo.length > 0 ? (
                <img
                  src={job.photo[0]}
                  alt={job.jobTitle}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>

            {/* Job Details */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                    {job?.jobTitle}
                  </h3>
                  <span
                    className={`
                      text-white text-xs font-medium px-3 py-1 rounded-lg
                      ${
                        job?.jobStatus === "OPEN"
                          ? "bg-green-500"
                          : job?.jobStatus === "ACCEPTED"
                            ? "bg-blue-500"
                            : job?.jobStatus === "DECLINED"
                              ? "bg-red-500"
                              : job?.jobStatus === "PENDING_REVIEW"
                                ? "bg-yellow-500"
                                : job?.jobStatus === "INPROGRESS"
                                  ? "bg-orange-500"
                                  : job?.jobStatus === "COMPLITE"
                                    ? "bg-gray-500"
                                    : "bg-gray-300"
                      }
                    `}
                  >
                    {job?.jobStatus}
                  </span>
                  {/* show button base on status */}
                  <div className="ml-4 flex gap-2">
                    {/* Reject button only for PENDING_REVIEW */}
                    {job?.jobStatus === "PENDING_REVIEW" && (
                      <button
                        onClick={() => handleReject(job)}
                        disabled={rejectLoading}
                        className="border-2 cursor-pointer border-gray-900 px-4 py-1 hover:bg-gray-900 hover:text-white rounded-lg disabled:opacity-50"
                      >
                        {rejectLoading ? "Processing..." : "Reject"}
                      </button>
                    )}

                    {/* Approve Complete button for INPROGRESS or PENDING_REVIEW */}
                    {(job?.jobStatus === "INPROGRESS" ||
                      job?.jobStatus === "PENDING_REVIEW") && (
                      <button
                        onClick={() => handleApproveComplete(job)}
                        disabled={completeLoading}
                        className="bg-gray-900 text-white px-4 py-1.5 rounded-lg hover:bg-gray-700 cursor-pointer disabled:opacity-50"
                      >
                        {completeLoading
                          ? "Processing..."
                          : "Approve Complete Project"}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap mt-6 items-center gap-3 sm:gap-6 text-sm text-gray-600">
                <span className="px-6 py-2 bg-[#D5FDFF] text-gray-900 rounded-2xl font-medium">
                  {job.jobType}
                </span>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  <span>{timeAgo(job?.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-6">
                <img src={pepole} alt="" />
                <h1 className="text-sm font-medium">{job?.bids.length}</h1>
              </div>
            </div>

            <div
              className="
          flex lg:flex-col
          gap-2 sm:gap-3
          w-full lg:w-auto
        "
            >
              <button
                onClick={() => navigate(`/user/my-jobs-details/${job.jobId}`)}
                className="
            w-full lg:w-auto
            px-5 py-2
            bg-slate-900 text-white text-sm font-medium
            rounded-lg hover:bg-slate-800 transition cursor-pointer
          "
              >
                Manage
              </button>

              <button
                onClick={() => {
                  setSelectedJobId(job.jobId); // save which job we are acting on
                  setIsOpen(true); // open modal
                }}
                className="w-full lg:w-auto p-2 hover:bg-gray-100 rounded-lg flex justify-center cursor-pointer"
              >
                <MoreVertical size={20} className="text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {/* Pagination */}
      {myJobData && myJobData.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {/* Previous */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ‹ Previous
          </button>

          {/* Page Numbers */}
          {Array.from({ length: Math.min(5, myJobData.totalPages) }, (_, i) => {
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
          })}

          {/* Ellipsis + Last Page */}
          {myJobData.totalPages > 5 && (
            <>
              <span className="px-2 text-sm text-gray-600">...</span>
              <button
                onClick={() => setCurrentPage(myJobData.totalPages)}
                className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded"
              >
                {myJobData.totalPages}
              </button>
            </>
          )}

          {/* Next */}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(myJobData.totalPages, prev + 1))
            }
            disabled={currentPage >= myJobData.totalPages}
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next ›
          </button>
        </div>
      )}

      {/* pagination end  */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-8">
            <div className="border-b border-gray-300 mb-4 flex justify-between items-center ">
              <h2 className="text-lg font-semibold mb-4">
                {" "}
                <TriangleAlert className="inline-block mr-2 text-red-600" />
                Close Job
              </h2>
              <X
                className=" cursor-pointer text-gray-500 hover:text-gray-800"
                size={20}
                onClick={() => setIsOpen(false)}
              />
            </div>
            <p className="text-gray-700 mb-2 text-lg font-medium text-center py-4">
              Are you sure you want to close this Job?
            </p>
            <p className="text-gray-500 text-sm mb-6 text-center pb-4">
              Closing this job will permanently stop all bidding and archive the
              job along with its related data.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-100 cursor-pointer"
                disabled={closeLoading} // disable cancel while loading
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={closeLoading} // disable confirm while loading
                className="px-4 py-2 bg-[#D70004] cursor-pointer text-white rounded-lg hover:bg-red-800 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {closeLoading ? (
                  <BeatLoader size={8} color="#fff" />
                ) : (
                  "Confirm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* review modal  */}
      {isReviewOpen && selectedReviewJob && (
        <ReviewModal
          job={selectedReviewJob}
          onClose={() => {
            setIsReviewOpen(false);
            setSelectedReviewJob(null);
          }}
        />
      )}
    </div>
  );
};

export default MyJobs;
