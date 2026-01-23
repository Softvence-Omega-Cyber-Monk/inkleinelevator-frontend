import { Briefcase, DollarSign, FileText, Building2 } from "lucide-react";
import { useGetUserDashboardAnalyticsQuery } from "@/Redux/features/userDa/userDashboardAnalytics/userDashboardAnalyticsApi";

export default function UserDashboardAnalytics() {
  const { data: dashboardAnalyticsData, isLoading } =
    useGetUserDashboardAnalyticsQuery({});

  return (
    <div>
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-4
          gap-4 sm:gap-6
          mb-8
        "
      >
        {/* ================= SKELETON STATE ================= */}
        {isLoading ? (
          <>
            {/* Skeleton Card 1 */}
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 animate-pulse">
              <div className="flex items-start justify-between mb-4">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-4 w-4 bg-gray-200 rounded" />
              </div>
              <div className="h-8 w-16 bg-gray-200 rounded mb-2" />
            </div>

            {/* Skeleton Card 2 */}
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 animate-pulse">
              <div className="flex items-start justify-between mb-4">
                <div className="h-4 w-28 bg-gray-200 rounded" />
                <div className="h-4 w-4 bg-gray-200 rounded" />
              </div>
              <div className="h-8 w-24 bg-gray-200 rounded mb-2" />
            </div>

            {/* Skeleton Card 3 */}
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 animate-pulse">
              <div className="flex items-start justify-between mb-4">
                <div className="h-4 w-20 bg-gray-200 rounded" />
                <div className="h-4 w-4 bg-gray-200 rounded" />
              </div>
              <div className="h-8 w-14 bg-gray-200 rounded mb-2" />
            </div>

            {/* Skeleton Card 4 */}
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 animate-pulse">
              <div className="flex items-start justify-between mb-4">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-4 w-4 bg-gray-200 rounded" />
              </div>
              <div className="h-8 w-14 bg-gray-200 rounded mb-2" />
            </div>
          </>
        ) : (
          <>
            {/* ================= REAL DATA ================= */}

            {/* Card 1 */}
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="text-gray-600 text-sm font-medium">Active Jobs</div>
                <Briefcase size={18} className="text-gray-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                {dashboardAnalyticsData?.data?.totalActiveJob ?? 0}
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="text-gray-600 text-sm font-medium">
                  Total Invested
                </div>
                <DollarSign size={18} className="text-gray-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                {dashboardAnalyticsData?.data?.totalInvestment ?? 0}
              </div>
              {/* <div className="text-xs text-gray-500">Across 5 projects</div> */}
            </div>

            {/* Card 3 */}
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="text-gray-600 text-sm font-medium">
                  New Bids
                </div>
                <FileText size={18} className="text-gray-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                {dashboardAnalyticsData?.data?.totalBidCount ?? 0}
              </div>
              {/* <div className="text-xs text-gray-500">Awaiting review</div> */}
            </div>

            {/* Card 4 */}
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="text-gray-600 text-sm font-medium">Completed Projects</div>
                <Building2 size={18} className="text-gray-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                {dashboardAnalyticsData?.data?.totalCompleteJob ?? 0}
              </div>
              {/* <div className="text-xs text-gray-500">All time</div> */}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
