import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useGetMeMutation, useUpdateProfileMutation, useDeleteOwnProfileMutation, useChangePasswordMutation } from "@/Redux/features/auth/authApi";
import { useActiveStripeAccountMutation } from "@/Redux/features/ElevatorDa/stripe/stripeApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type TabType = "profile" | "security" | "stripe";

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
  // onUpdateNotifications,
  onDeleteAccount,
}: SettingOverviewProps = {} as SettingOverviewProps) {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [originalFormData, setOriginalFormData] = useState<SettingsFormData | null>(null);
  const [formData, setFormData] = useState<SettingsFormData>(
    propFormData || {
      name: " ",
      email: " ",
      phone: " ",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      emailNotifications: true,
      smsNotifications: true,
      newBidsAlerts: true,
    }
  );

  // API hooks
  const [getMe] = useGetMeMutation();
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const [deleteOwnProfile, { isLoading: isDeletingAccount }] = useDeleteOwnProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [activeStripeAccount, { isLoading: isLoadingStripe }] = useActiveStripeAccountMutation();
  const navigate = useNavigate();
  
  // State for Stripe URL
  const [stripeUrl, setStripeUrl] = useState<string | null>(null);
  
  // State for password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getMe({}).unwrap();
        if (response.success && response.data) {
          const userData = response.data;
          setFormData((prev) => ({
            ...prev,
            name: userData.name || prev.name,
            email: userData.email || prev.email,
            phone: userData.phone || prev.phone,
          }));
        }
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        toast.error(error?.data?.message || 'Failed to load profile');
      }
    };

    fetchProfile();
  }, [getMe]);

  // Fetch Stripe account URL when stripe tab is active
  useEffect(() => {
    if (activeTab === "stripe") {
      const fetchStripeUrl = async () => {
        try {
          const response = await activeStripeAccount().unwrap();
          if (response.url) {
            setStripeUrl(response.url);
          }
        } catch (error: any) {
          console.error('Error fetching Stripe URL:', error);
          toast.error(error?.data?.message || 'Failed to load Stripe account setup');
          setStripeUrl(null);
        }
      };
      fetchStripeUrl();
    }
  }, [activeTab, activeStripeAccount]);

  const handleInputChange = (field: keyof SettingsFormData, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditProfile = () => {
    // Save current values as original before editing
    setOriginalFormData({ ...formData });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    // Restore original values
    if (originalFormData) {
      setFormData(originalFormData);
    }
    setIsEditing(false);
    setOriginalFormData(null);
  };

  const handleSaveProfile = async () => {
    try {
      // Prepare update payload
      // Note: Sending name, email, and phone - API may accept these even if not in TypeScript DTO
      const updatePayload: any = {};

      if (formData.name) updatePayload.name = formData.name;
      if (formData.email) updatePayload.email = formData.email;
      if (formData.phone) updatePayload.phone = formData.phone;

      const response = await updateProfile(updatePayload).unwrap();
      
      if (response.success) {
        toast.success('Profile updated successfully');
        setIsEditing(false);
        setOriginalFormData(null);
        // Call the prop callback if provided
        if (onSaveProfile) {
          onSaveProfile({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          });
        }
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast.error(error?.data?.message || 'Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    // Validate passwords
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }

    try {
      const response = await changePassword({
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      }).unwrap();

      if (response.success) {
        toast.success(response.message || 'Password changed successfully');
        // Clear password fields
        setFormData((prev) => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }));
        // Call the prop callback if provided
        if (onChangePassword) {
          onChangePassword({
            currentPassword: '',
            newPassword: formData.newPassword,
            confirmPassword: formData.confirmPassword,
          });
        }
      }
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error(error?.data?.message || 'Failed to change password');
    }
  };

  const handleDeleteAccount = async () => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone. All your data will be permanently deleted."
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await deleteOwnProfile({}).unwrap();
      
      if (response.success) {
        toast.success('Account deleted successfully');
        // Call the prop callback if provided
        if (onDeleteAccount) {
          onDeleteAccount();
        }
        // Redirect to login page after successful deletion
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast.error(error?.data?.message || 'Failed to delete account');
    }
  };

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
    { id: "stripe", label: "Very Stripe Account" },
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
                    readOnly={!isEditing}
                    className={`w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      isEditing 
                        ? 'bg-gray-50 cursor-text' 
                        : 'bg-gray-100 cursor-not-allowed'
                    }`}
                  />
                </div>

                {/* Email Field */}
                {/* <div>
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
                    readOnly={!isEditing}
                    className={`w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      isEditing 
                        ? 'bg-gray-50 cursor-text' 
                        : 'bg-gray-100 cursor-not-allowed'
                    }`}
                  />
                </div> */}

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
                    readOnly={!isEditing}
                    className={`w-full px-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                      isEditing 
                        ? 'bg-gray-50 cursor-text' 
                        : 'bg-gray-100 cursor-not-allowed'
                    }`}
                  />
                </div>

                {/* Edit/Save/Cancel Buttons */}
                <div className="pt-4 flex gap-3">
                  {!isEditing ? (
                    <Button
                      onClick={handleEditProfile}
                      className="bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white px-6 py-2.5 rounded-lg font-medium"
                    >
                      Edit
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={handleSaveProfile}
                        disabled={isLoading || isUpdatingProfile}
                        className="bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white px-6 py-2.5 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {(isLoading || isUpdatingProfile) ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        disabled={isLoading || isUpdatingProfile}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2.5 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </Button>
                    </>
                  )}
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
                onClick={handleDeleteAccount}
                disabled={isLoading || isDeletingAccount}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeletingAccount ? "Deleting..." : "Delete Account"}
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
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={formData.currentPassword}
                    onChange={(e) =>
                      handleInputChange("currentPassword", e.target.value)
                    }
                    className="w-full px-4 py-3 pr-10 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={(e) =>
                      handleInputChange("newPassword", e.target.value)
                    }
                    className="w-full px-4 py-3 pr-10 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showNewPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className="w-full px-4 py-3 pr-10 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>
              <div className="pt-2">
                <Button
                  onClick={handleChangePassword}
                  disabled={isLoading || isChangingPassword}
                  className="bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white px-6 py-2.5 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {(isLoading || isChangingPassword) ? "Changing..." : "Change Password"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Stripe Settings Tab Content */}
        {activeTab === "stripe" && (
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Stripe Account Setup
            </h2>
            <div className="space-y-6">
              {isLoadingStripe ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Loading Stripe account setup...</p>
                </div>
              ) : stripeUrl ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Click the button below to complete your Stripe account setup. You will be redirected to Stripe's secure platform.
                  </p>
                  <div className="pt-4">
                    <Button
                      onClick={() => {
                        if (stripeUrl) {
                          window.location.href = stripeUrl;
                        }
                      }}
                      className="bg-[#1e3a5f] hover:bg-[#2d4a6f] text-white px-6 py-2.5 rounded-lg font-medium"
                    >
                      OK
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">Failed to load Stripe account setup. Please try again.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
