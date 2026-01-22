import { useState } from "react";

import UserSettingProfileTab from "@/components/userDashboardComponent/userSettingTabComponent/UserSettingProfileTab";
import UserSettingSecurityTab from "@/components/userDashboardComponent/userSettingTabComponent/UserSettingSecurityTab";

type TabType = "profile" | "security" | "stripe";

// Types for props (preparing for Redux API)

export default function SettingOverview({ isLoading = false }) {
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  // const handleToggleNotification = (field: "emailNotifications" | "smsNotifications" | "newBidsAlerts") => {
  //   const newValue = !formData[field];
  //   handleInputChange(field, newValue);
  //   if (onUpdateNotifications) {
  //     onUpdateNotifications({
  //       emailNotifications: formData.emailNotifications,
  //       smsNotifications: formData.smsNotifications,
  //       newBidsAlerts: formData.newBidsAlerts,
  //       [field]: newValue,
  //     });
  //   }
  // };

  const tabs: { id: TabType; label: string }[] = [
    { id: "profile", label: "Profile Settings" },
    { id: "security", label: "Security Settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-200 bg-white">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Settings
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your vendor profile and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="px-8 py-4 border-b border-gray-200 bg-white">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 font-medium text-sm rounded-lg transition-colors ${
                activeTab === tab.id
                  ? "bg-[#1e3a5f] text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-8 w-full">
        {activeTab === "profile" && (
          <UserSettingProfileTab isLoading={isLoading} />
        )}

        {/* Security Settings Tab Content */}
        {activeTab === "security" && <UserSettingSecurityTab />}

        {/* General Settings Tab Content */}
      </div>
    </div>
  );
}
