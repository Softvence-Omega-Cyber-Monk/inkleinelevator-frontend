import { useState } from "react";

import UserSettingProfileTab from "@/components/userDashboardComponent/userSettingTabComponent/UserSettingProfileTab";
import UserSettingSecurityTab from "@/components/userDashboardComponent/userSettingTabComponent/UserSettingSecurityTab";
import UserSettingGeneralTab from "@/components/userDashboardComponent/userSettingTabComponent/UserStripeTab";
import { useAppSelector } from "@/Redux/hooks";
import { selectCurrentUser } from "@/Redux/features/auth/authSlice";

// type TabType = "profile" | "security" | "stripe";

// Types for props (preparing for Redux API)

export default function SettingOverview({ isLoading = false }) {
  const [activeTab, setActiveTab] = useState("profile");
  const user = useAppSelector(selectCurrentUser);
  const role = user?.role;

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

  // const tabs: { id: TabType; label: string }[] = [
  //   { id: "profile", label: "Profile Settings" },
  //   { id: "security", label: "Security Settings" },
  //   { id: "stripe", label: "Stripe Settings" },
  // ];

  const tabs = [
    { id: "profile", label: "Profile Settings" },
    { id: "security", label: "Security Settings" },
    ...(role === "ELEVATOR"
      ? [{ id: "stripe", label: "Stripe Settings" }]
      : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="px-8 py-6 ">
        <h1 className="text-2xl md:text-3xl font-medium text-gray-900">
          Settings
        </h1>
        <p className="text-base text-[#191919] mt-1">
          Manage your vendor profile and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="px-8 py-4 inline-block  rounded-full bg-white">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2.5 font-bold text-sm cursor-pointer rounded-full transition-colors ${
                activeTab === tab.id
                  ? "bg-[#0A1A3A] text-white rounded-full"
                  : "bg-white text-gray-900  border border-gray-300 hover:bg-gray-50 rounded-full"
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
        {activeTab === "stripe" && <UserSettingGeneralTab />}
      </div>
    </div>
  );
}
