import DetailesBidsTab from "@/components/MyJobDetailesComponent/MyJobDetailesTab/DetailesBidsTab";
import DetailsFileTab from "@/components/MyJobDetailesComponent/MyJobDetailesTab/DetailsFileTab";
import DetailsOverviewTab from "@/components/MyJobDetailesComponent/MyJobDetailesTab/DetailsOverviewTab";
import { useGetSingleJobByIdQuery } from "@/Redux/features/userDa/userJob/userJobApi";
import {
  CalendarDays,
  CircleDollarSign,
  DollarSign,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function MyJobDetailesPage() {
  const { id } = useParams();

  console.log("i am the dynamic id ", id);
  const { data, isLoading } = useGetSingleJobByIdQuery(id);

  console.log("i am the single the data for job", data);
  const singleJobData = data?.data;
  console.log("h ehe ", singleJobData);
  const [activeTab, setActiveTab] = useState("Overview");

  const tabs = [
    { id: "Overview", label: "Overview" },
    { id: "Files", label: "Files" },
    {
      id: "Bids",
      label: `Bids (${singleJobData?.bids?.length || 0})`, // <-- use bids.length
    },
  ];

  // show time spend ago function
  function timeAgo(date: string | Date): string {
    const past = new Date(date).getTime();
    const now = Date.now();

    const diff = Math.floor((now - past) / 1000);

    if (diff < 60) return "Recently";
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;

    return `${Math.floor(diff / 86400)} days ago`;
  }

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="px-4 md:px-8 py-6">
        <div className="flex flex-wrap items-center gap-6">
          <h3 className="text-base sm:text-3xl font-semibold text-gray-900">
            {singleJobData?.jobTitle}
          </h3>
          <span
            className={`
                      text-white text-xs font-medium px-3 py-1 rounded-lg
                      ${
                        singleJobData?.jobStatus === "OPEN"
                          ? "bg-green-500"
                          : singleJobData?.jobStatus === "ACCEPTED"
                            ? "bg-blue-500"
                            : singleJobData?.jobStatus === "DECLINED"
                              ? "bg-red-500"
                              : singleJobData?.jobStatus === "PENDING_REVIEW"
                                ? "bg-yellow-500"
                                : singleJobData?.jobStatus === "INPROGRESS"
                                  ? "bg-orange-500"
                                  : singleJobData?.jobStatus === "COMPLITE"
                                    ? "bg-gray-500"
                                    : "bg-gray-300"
                      }
                    `}
          >
            {singleJobData?.jobStatus}
          </span>
        </div>

        <div className="mt-6  ">
          <span className="px-4 py-2 bg-[#D5FDFF] text-gray-900 rounded-2xl font-medium">
            {singleJobData?.jobType}
          </span>
          <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
            {/* bugget detiles  */}
            <div className="flex flex-col md:flex-row gap-6 mt-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#292D32]" />
                <span className="text-[#3B4861]">{singleJobData?.address}</span>
              </div>
              {/* time  */}
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-[#292D32]" />
                <span className="text-[#3B4861]">
                  <span>Posted {timeAgo(singleJobData?.createdAt)}</span>
                </span>
              </div>
              {/* bugget range  */}
              <div className="flex items-center gap-2">
                <CircleDollarSign className="w-5 h-5 text-[#292D32]" />
                <span className="text-[#3B4861] flex items-center gap-1">
                  Budget:
                  <DollarSign className="w-4 h-4 inline-block" />
                  {singleJobData?.estimitedBudget}
                </span>
              </div>
            </div>
            <div className="flex  gap-4">
              <button className="px-4 py-2 border  rounded-lg hover:bg-gray-900  hover:text-white cursor-pointer">
                Edit Job
              </button>
              <button className="px-4 py-2 bg-[#D70004] text-white rounded-lg hover:bg-gray-900  hover:text-white cursor-pointer">
                Close Job
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-8 py-4  mt-4">
        <div className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium cursor-pointer rounded-md transition-colors ${
                activeTab === tab.id
                  ? "bg-[#0A1A3A] text-white"
                  : "text-gray-700 hover:bg-gray-100 border"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-1 md:px-8 py-6">
        {activeTab === "Overview" && (
          <DetailsOverviewTab
            singleJobData={singleJobData}
            isLoading={isLoading}
          />
        )}

        {activeTab === "Files" && (
          <DetailsFileTab singleJobData={singleJobData} isLoading={isLoading} />
        )}

        {activeTab === "Bids" && (
          <DetailesBidsTab
            singleJobData={singleJobData}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}
