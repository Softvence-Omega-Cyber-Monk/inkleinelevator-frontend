import { useState } from "react";
import { Button } from "@/components/ui/button";

type TabType = "profile" | "security" | "general";

// Types for props (preparing for Redux API)
interface SettingsFormData {
  name: string;
  email: string;
  phone: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  newBidsAlerts: boolean;
}

interface SettingOverviewProps {
  formData?: SettingsFormData;
  isLoading?: boolean;
  onSaveProfile?: (data: { name: string; email: string; phone: string }) => void;
  onChangePassword?: (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => void;
  onUpdateNotifications?: (data: { emailNotifications: boolean; smsNotifications: boolean; newBidsAlerts: boolean }) => void;
  onDeleteAccount?: () => void;
}

export default function SettingOverview({
  formData: propFormData,
  isLoading = false,
  onSaveProfile,
  onChangePassword,
  onUpdateNotifications,
  onDeleteAccount,
}: SettingOverviewProps = {} as SettingOverviewProps) {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [formData, setFormData] = useState<SettingsFormData>(
    propFormData || {
      name: "PropLink Vendor",
      email: "vendor@gmail.com",
      phone: "+44 7700 900000",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      emailNotifications: true,
      smsNotifications: true,
      newBidsAlerts: true,
    }
  );

  const handleInputChange = (field: keyof SettingsFormData, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = () => {
    if (onSaveProfile) {
      onSaveProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });
    }
  };

  const handleChangePassword = () => {
    if (onChangePassword) {
      onChangePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });
    }
  };

  const handleToggleNotification = (field: "emailNotifications" | "smsNotifications" | "newBidsAlerts") => {
    const newValue = !formData[field];
    handleInputChange(field, newValue);
    if (onUpdateNotifications) {
      onUpdateNotifications({
        emailNotifications: formData.emailNotifications,
        smsNotifications: formData.smsNotifications,
        newBidsAlerts: formData.newBidsAlerts,
        [field]: newValue,
      });
    }
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: "profile", label: "Profile Settings" },
    { id: "security", label: "Security Settings" },
    { id: "general", label: "General Settings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="px-8 py-6 border-b border-gray-200 bg-white">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Settings</h1>
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
          <>
            {/* Profile Information Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Profile Information
              </h2>

              <div className="space-y-6">
                {/* Name Field */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  />
                </div>

                {/* Phone Number Field */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  />
                </div>

                {/* Save Changes Button */}
                <div className="pt-4">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white px-6 py-2.5 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Delete Account Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Delete Account
              </h2>
              <p className="text-sm text-gray-600 mb-2">
                Permanently delete your account and all data
              </p>
              <p className="text-sm text-gray-600 mb-6">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <Button
                onClick={onDeleteAccount}
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Account
              </Button>
            </div>
          </>
        )}

        {/* Security Settings Tab Content */}
        {activeTab === "security" && (
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Security Information
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) =>
                    handleInputChange("currentPassword", e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) =>
                    handleInputChange("newPassword", e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="pt-2">
                <Button
                  onClick={handleChangePassword}
                  disabled={isLoading}
                  className="bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white px-6 py-2.5 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Changing..." : "Change Password"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* General Settings Tab Content */}
        {activeTab === "general" && (
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Notification
            </h2>
            <div className="space-y-6">
              {/* Email Notification */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    Email Notification
                  </p>
                  <p className="text-sm text-gray-500">
                    Receive lead alerts via email
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleNotification("emailNotifications")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    formData.emailNotifications ? "bg-[#1e3a5f]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.emailNotifications ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* SMS Notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">SMS Notifications</p>
                  <p className="text-sm text-gray-500">
                    Receive urgent alerts via SMS
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleNotification("smsNotifications")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    formData.smsNotifications ? "bg-[#1e3a5f]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.smsNotifications ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* New Bids Alerts */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">New Bids Alerts</p>
                  <p className="text-sm text-gray-500">
                    Get notified immediately when new leads arrive
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleNotification("newBidsAlerts")}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    formData.newBidsAlerts ? "bg-[#1e3a5f]" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      formData.newBidsAlerts ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
