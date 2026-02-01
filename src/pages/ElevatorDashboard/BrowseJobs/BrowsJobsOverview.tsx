import { useState } from "react";
import { Search } from "lucide-react";
import BrowseJobsContent from "./BrowseJobsContent";
import MyJobsContent from "./MyJobsContent";

const BrowsJobsOverview = () => {
  const [activeTab, setActiveTab] = useState("browse");
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [sortOption, setSortOption] = useState("Newest First");

  // Reset filters when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchQuery("");
    setLocationFilter("");
    setJobTypeFilter("");
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Browse Elevator Jobs
          </h1>
          <p className="text-xs md:text-sm text-gray-500 mt-1">
            Overview of your elevator jobs and Bids.
          </p>
        </div>
        {/* <div className="relative w-full sm:w-auto">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-full sm:w-48 px-3 md:px-4 py-2 border border-gray-300 rounded-lg text-xs md:text-sm appearance-none bg-white pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Newest First</option>
            <option>Oldest First</option>
            <option>Budget: High to Low</option>
            <option>Budget: Low to High</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path
                d="M1 1.5L6 6.5L11 1.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div> */}
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        <div className="relative sm:col-span-2 md:col-span-2">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search elevator jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 md:pr-4 py-2 md:py-2.5 border border-gray-300 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        {/* <input
          type="text"
          placeholder="Location"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="w-full px-3 md:px-4 py-2 md:py-2.5 border border-gray-300 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="relative">
          <select
            value={jobTypeFilter}
            onChange={(e) => setJobTypeFilter(e.target.value)}
            className="w-full px-3 md:px-4 py-2 md:py-2.5 border border-gray-300 rounded-lg text-xs md:text-sm appearance-none bg-white pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Job Type</option>
            <option>Modernization</option>
            <option>Maintenance</option>
            <option>Repairs</option>
            <option>Installation</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
              <path
                d="M1 1.5L6 6.5L11 1.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div> */}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        <button
          onClick={() => handleTabChange("browse")}
          className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === "browse"
              ? "bg-[#1e3a5f] text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          Browse Jobs
        </button>
        <button
          onClick={() => handleTabChange("my-jobs")}
          className={`px-4 md:px-6 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-medium transition-colors whitespace-nowrap ${
            activeTab === "my-jobs"
              ? "bg-[#1e3a5f] text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
        >
          My Jobs
        </button>
      </div>

      {/* Render Content Based on Active Tab */}
      {activeTab === "browse" ? <BrowseJobsContent /> : <MyJobsContent />}
    </div>
  );
};

export default BrowsJobsOverview;
