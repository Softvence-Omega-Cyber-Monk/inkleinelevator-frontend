import ActivitySkeleton from "@/common/Skeleton/ActivitySkeleton";
import TermsModal from "@/components/TrmsModal/TermsModal";
import UserDashboardAnalytics from "@/components/userDashboardComponent/UserDashboardAnalytics";

import { useGetAllActiveJobsUserDashboardQuery } from "@/Redux/features/userDa/userJob/userJobApi";
import { useGetUserAllRecentActivityQuery } from "@/Redux/features/userDa/userRecentActivity/userRecentActivityApi";
import { useState } from "react";

import { useNavigate } from "react-router-dom";

const UserDashboardOverview = () => {
  const navigate = useNavigate();
  const { data: activity, isLoading: activityLoading } =
    useGetUserAllRecentActivityQuery({});
  const recentActivity = activity?.data;
  console.log("iam  activity", recentActivity);
  const { data: activeJobsData, isLoading: activeJobsLoading } =
    useGetAllActiveJobsUserDashboardQuery({});
  const activeJobs = activeJobsData?.data;
  console.log("i amt activ job", activeJobs);

  function timeAgo(date: string | Date): string {
    const past = new Date(date).getTime();
    const now = Date.now();

    const diff = Math.floor((now - past) / 1000);

    if (diff < 60) return "Recently";

    if (diff < 3600) {
      const minutes = Math.floor(diff / 60);
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    }

    if (diff < 86400) {
      const hours = Math.floor(diff / 3600);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    }

    const days = Math.floor(diff / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  // for this  trms condition modal
  const [showTerms, setShowTerms] = useState(false);

  // useEffect(() => {
  //   if (user && user.termsAccepted === false) {
  //     setShowTerms(true);
  //   }
  // }, [user]);
  return (
    <>
      <TermsModal open={showTerms} onClose={() => setShowTerms(false)} />
      <div>
        {/* trmas modal here  */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between  pt-8 mb-10">
          {/* LEFT */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p className="text-gray-600 text-sm">
              Overview of your elevator jobs, bids, and activity
            </p>
          </div>

          {/* RIGHT */}
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
        {/* dashboard analitics cards */}
        <div>
          <UserDashboardAnalytics />
        </div>
        <div
          className="
  grid
  grid-cols-1
  lg:grid-cols-2
  gap-4 sm:gap-6
"
        >
          {/* Active Jobs */}
          {/* Active Jobs */}
          <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
              Active Jobs
            </h2>

            <div className="space-y-3 sm:space-y-4 h-96 overflow-y-auto">
              {activeJobsLoading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <ActivitySkeleton key={index} />
                  ))
                : activeJobs?.map((job: any) => (
                    <div
                      key={job?.jobId}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 border-b border-gray-100 last:border-0"
                    >
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 text-sm mb-1">
                          {job.jobTitle}
                        </div>
                        <div className="text-xs text-gray-500">
                          {job.bids?.length || 0} Bids Received
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          navigate(`/user/my-jobs-details/${job.jobId}`)
                        }
                        className="w-full cursor-pointer sm:w-auto px-4 py-2 bg-slate-900 text-white text-sm rounded hover:bg-slate-800 transition mr-4"
                      >
                        View
                      </button>
                    </div>
                  ))}

              {/* Show message if no active jobs */}
              {!activeJobsLoading &&
                (!activeJobsData?.data || activeJobsData.data.length === 0) && (
                  <div className="text-sm text-gray-400 py-4">
                    No active jobs found
                  </div>
                )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className=" p-4 sm:p-6 rounded-lg border border-gray-200 ">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4">
              Recent Activity
            </h2>

            <div className="space-y-3 sm:space-y-4 h-96 overflow-y-auto">
              {activityLoading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <ActivitySkeleton key={index} />
                  ))
                : recentActivity?.map((activity: any) => (
                    <div
                      key={activity.notificationId}
                      className="py-3 border-b border-gray-100 last:border-0"
                    >
                      <div className="font-normal text-[#0A0A0A] text-sm mb-1">
                        {activity.description}
                      </div>
                      <div className="text-xs text-gray-500">
                        {timeAgo(activity.createdAt)}
                      </div>
                    </div>
                  ))}

              {/* if recent activity is empty display no activity found message  */}
              {!activityLoading &&
                (!recentActivity || recentActivity.length === 0) && (
                  <div className="text-sm text-gray-400 py-4">
                    No recent activity found
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboardOverview;
