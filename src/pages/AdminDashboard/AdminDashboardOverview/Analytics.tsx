 import pepol from "@/assets/people.png";
import dollerBag from "@/assets/money-bag-02.png";
import bits from "@/assets/bits.png";
import profit from "@/assets/profit.png";
import { useGetAdminAllAnalyticsQuery } from '@/Redux/features/AdminDashboard/adminApi'

export default function Analytics() {
    const { data: analytics, isLoading: isAnalyticsLoading, isError: isAnalyticsError, error: analyticsError } = useGetAdminAllAnalyticsQuery({})

        if (isAnalyticsLoading) {
            // Show 4 skeleton cards to match the layout
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                    {[1, 2, 3, 4].map((_, index) => <SkeletonCard key={index} />)}
                </div>
            )
        }

        if (isAnalyticsError) {
            console.log(analyticsError)
            return <div className="text-red-500 font-medium">Failed to load analytics!</div>
        }
    const stats =  [
        {
            title: "Total Users",
            value: analytics.data.dashboard.totalUser,
            // subtitle: "892 Requesters, 355 Contractors",
            icon: pepol,
            // persent: "+12.5%",
        },
        {
            title: "Active Jobs",
            value: analytics.data.dashboard.totalActiveJobs,
            // subtitle: `${analytics.data.jobsManagements.totalOpenJob} Open, 67 In Progress`,
            icon: dollerBag,
            // persent: "+12.5%",
        },
        {
            title: "Total Bids",
            value: analytics.data.dashboard.totalBid,
            // subtitle: "Avg. 15 bids per job",
            icon: bits,
            // persent: "+12.5%",
        },
        {
            title: "Platform Revenue",
            value: analytics.data.dashboard.totalPlatformRevenue,
            // subtitle: "From 10% commission",
            icon: profit,
            // persent: "+12.5%",
        },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {stats.map((stat, index) => (
            <div key={index} className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200" >
                {/* Title + Icon */}
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="text-gray-600 text-sm font-medium">
                    {stat.title}
                </div>
                <img
                    src={stat.icon}
                    alt={stat.title}
                    className="w-5 h-5 sm:w-6 sm:h-6"
                />
                </div>

                {/* Value */}
                <div className="text-2xl sm:text-3xl font-medium text-gray-900 mb-1">
                {stat.value}
                </div>

                {/* Subtitle + Percent */}
                {/* <div className="text-xs sm:text-sm text-gray-500 leading-tight mt-2">
                <span className="inline-flex items-center gap-1 text-green-500">
                    <ArrowUpRight className="w-3 h-3 shrink-0" />
                    <span>{stat.persent}</span>
                </span>{" "}
                {stat.subtitle}
                </div> */}
            </div>
            ))}
        </div>
    )
}


function SkeletonCard() {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg border border-gray-200 animate-pulse">
        <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
        </div>
        <div className="h-8 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-32 mt-2"></div>
    </div>
  )
}

