import { Button } from "@/components/ui/button";

interface UserSettingSecurityTabProps {
  isLoading: boolean;
}

export default function UserSettingSecurityTab({
  isLoading,
}: UserSettingSecurityTabProps) {
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
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="pt-2">
          <Button
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
