import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Building2,
  Flag,
  // Fuel,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Search,
  Settings,
} from "lucide-react";
import DashboardNavbar from "@/common/DashboardNavbar";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import { logout, selectCurrentUser } from "@/Redux/features/auth/authSlice";
import { useGetMeUserWonDataQuery } from "@/Redux/features/userDa/userProfileUpdated/userProfileUpdatedApi";

const ElevatorDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: any) => {
    if (path === "/elevator" && location.pathname === "/elevator") return true;
    if (path !== "/elevator" && location.pathname === path) return true;
    return false;
  };

  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  console.log("iam the user from redux", user);

  const { data } = useGetMeUserWonDataQuery({});
  console.log(data);
  const handleLogout = () => {
    dispatch(logout()); // Clear user and token from Redux
    localStorage.removeItem("accessToken"); // optional if you store token locally
    navigate("/login"); // redirect to login page
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        {/* User Profile */}
        <div className="m-4 mb-6">
          <div className="bg-[#0f1729] rounded-2xl p-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden ">
                <img
                  src={data?.data?.profile || (user as any)?.profile}
                  alt=""
                  className="w-9 h-9 rounded-full"
                />
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-400 mb-1">Company</div>
                  <div className="font-semibold text-sm text-white">
                    {user?.name || data?.data?.name || "John Doe"}
                  </div>
                  <div className="text-xs text-gray-400 truncate">
                    {user?.email}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <button
            onClick={() => navigate("/elevator")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-colors ${
              isActive("/elevator")
                ? "bg-[#0f1729] text-white"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <LayoutDashboard size={20} />
            {sidebarOpen && <span>Dashboard</span>}
          </button>
          <button
            onClick={() => navigate("/elevator/browse-jobs")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-colors ${
              isActive("/elevator/browse-jobs")
                ? "bg-[#0f1729] text-white"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Search size={20} />
            {sidebarOpen && <span>Browse Jobs</span>}
          </button>
          <button
            onClick={() => navigate("/elevator/my-bids")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-colors ${
              isActive("/elevator/my-bids")
                ? "bg-[#0f1729] text-white"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Flag size={20} />
            {sidebarOpen && <span>My Bids</span>}
          </button>
          {/* <button
            onClick={() => navigate("/elevator/billing")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-colors ${
              isActive("/elevator/billing")
                ? "bg-[#0f1729] text-white"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Fuel size={20} />
            {sidebarOpen && <span>Billing</span>}
          </button> */}
          <button
            onClick={() => navigate("/elevator/company-profile")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-colors ${
              isActive("/elevator/company-profile")
                ? "bg-[#0f1729] text-white"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Building2 size={20} />
            {sidebarOpen && <span>Company Profile</span>}
          </button>
          <button
            onClick={() => navigate("/elevator/meassages")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-colors ${
              isActive("/elevator/meassages")
                ? "bg-[#0f1729] text-white"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <MessageSquare size={20} />
            {sidebarOpen && <span>Messages</span>}
          </button>
          <button
            onClick={() => navigate("/elevator/settings")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-colors ${
              isActive("/elevator/settings")
                ? "bg-[#0f1729] text-white"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Settings size={20} />
            {sidebarOpen && <span>Settings</span>}
          </button>
        </nav>

        {/* Logout */}
        <div className="p-2 pb-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <LogOut size={20} />
            {sidebarOpen && (
              <span className="text-sm font-medium">Log out</span>
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <DashboardNavbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Dashboard Content - This will render child routes */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ElevatorDashboard;
