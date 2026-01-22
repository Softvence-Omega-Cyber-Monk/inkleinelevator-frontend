import React from 'react'
import { useGetAdminsRecentActivityQuery } from '@/Redux/features/AdminDashboard/adminApi';
import { timeAgo } from '@/utils/timeAgo';

export default function RecentActivity() {
    const { data: recentActivity, isLoading: isRecentActivityLoading, isError: isRecentActivityError, error: recentActivityError } = useGetAdminsRecentActivityQuery({})

    if (isRecentActivityLoading) {
        // Show 5 skeleton rows
        return (
            <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4"> Recent Activity </h2>
                <div className="space-y-4">
                    {[1,2,3,4,5].map((_, index) => <SkeletonActivity key={index} />)}
                </div>
            </div>
        )
    }

    if (isRecentActivityError) {
        console.log(recentActivityError)
        return <div className="text-red-500 font-medium">Failed to load recent activity!</div>
    }
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4"> Recent Activity </h2>
        <div className="space-y-4">
        {recentActivity.data.map((activity, index) => (
            <div
            key={activity.recentActivityId}
            className="flex flex-col sm:flex-row justify-between py-3 border-b border-gray-100 last:border-0 gap-2 sm:gap-0"
            >
            <div className="font-medium text-gray-900 text-sm sm:text-base mb-1 sm:mb-0">
                {activity.description}
            </div>
            <div className="text-xs sm:text-sm text-gray-500">
                {timeAgo(activity.createdAt)}
            </div>
            </div>
        ))}
        </div>
    </div>
  )
}

function SkeletonActivity() {
  return (
    <div className="flex flex-col sm:flex-row justify-between py-3 border-b border-gray-100 last:border-0 gap-2 sm:gap-0 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 sm:w-1/2 mb-1 sm:mb-0"></div>
      <div className="h-3 bg-gray-200 rounded w-1/4 sm:w-1/6"></div>
    </div>
  )
}
