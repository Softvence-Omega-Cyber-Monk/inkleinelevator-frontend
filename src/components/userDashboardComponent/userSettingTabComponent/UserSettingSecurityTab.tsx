import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useUserChangePasswordMutation } from "@/Redux/features/userDa/userProfileUpdated/userProfileUpdatedApi";
import { toast } from "sonner";

export default function UserSettingSecurityTab() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [userChangePassword, { isLoading }] = useUserChangePasswordMutation();

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    try {
      const res = await userChangePassword({
        oldPassword: currentPassword,
        newPassword: newPassword,
      }).unwrap();

      if (res.success) {
        toast.success(res.message || "Password changed successfully!");
        // Clear fields after success
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(res.message || "Failed to change password");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to change password");
    }
  };

  return (
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
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
  );
}
