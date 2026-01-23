import { useState } from "react";

import HeroSectionTab from "@/components/adminDashboard/contentManagementTabComponent/HeroSectionTab";
import AboutSectionTab from "@/components/adminDashboard/contentManagementTabComponent/AboutSectionTab";
import ProcessStepsTab from "@/components/adminDashboard/contentManagementTabComponent/ProcessStepsTab";
import WhyUsSectionTab from "@/components/adminDashboard/contentManagementTabComponent/WhyUsSectionTab";
import FAQsSectionTab from "@/components/adminDashboard/contentManagementTabComponent/FAQsSectionTab";
import UploadMediaTab from "@/components/adminDashboard/contentManagementTabComponent/UploadMediaTab";

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState("hero");

  const tabs = [
    { id: "hero", label: "Hero Section" },
    { id: "about", label: "About Section" },
    { id: "process", label: "Process Steps" },
    { id: "whyus", label: "Why Us For" },
    { id: "faqs", label: "FAQ & Contact" },
    { id: "media", label: "Upload Media" },
  ];

  return (
    <div className="bg-gray-50">
      <div className="mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold mb-1">
            Content Management
          </h1>
          <p className="text-sm text-gray-600">
            Manage all landing page content from one place
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-full shadow-sm p-1.5 mb-6 inline-flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-[#1a2332] text-white"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === "hero" && <HeroSectionTab />}
          {activeTab === "about" && <AboutSectionTab />}
          {activeTab === "process" && <ProcessStepsTab />}
          {activeTab === "whyus" && <WhyUsSectionTab />}
          {activeTab === "faqs" && <FAQsSectionTab />}
          {activeTab === "media" && <UploadMediaTab />}
        </div>
      </div>
    </div>
  );
};

export default ContentManagement;
