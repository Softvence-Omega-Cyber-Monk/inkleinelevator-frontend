import DetailsFileTab from "@/components/MyJobDetailesComponent/MyJobDetailesTab/DetailsFileTab";
import DetailsOverviewTab from "@/components/MyJobDetailesComponent/MyJobDetailesTab/DetailsOverviewTab";
import { useGetSingleJobByIdQuery } from "@/Redux/features/userDa/userJob/userJobApi";
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

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your vendor profile and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="px-8 py-4 border-b border-gray-200">
        <div className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
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
      <div className="px-8 py-6">
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
          <div className="text-gray-700">Bids content goes here</div>
        )}
      </div>
    </div>
  );
}
