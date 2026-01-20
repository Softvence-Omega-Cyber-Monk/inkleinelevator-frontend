import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Building2,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  User,
  Search,
} from "lucide-react";

const UserDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: any) => {
    if (path === "/user" && location.pathname === "/user") return true;
    if (path !== "/user" && location.pathname === path) return true;
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        {/* User Profile Card */}
        <div className="m-4 mb-6">
          <div className="bg-[#0f1729] rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0">
                <User size={20} className="text-gray-600" />
              </div>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-gray-400 mb-1">Company</div>
                  <div className="font-semibold text-sm text-white">
                    Jane Contractor
                  </div>
                  <div className="text-xs text-gray-400 truncate">
                    tim.jennings@example.com
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4">
          <button
            onClick={() => navigate("/user")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-colors ${
              isActive("/user")
                ? "bg-[#0f1729] text-white"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Building2 size={20} />
            {sidebarOpen && (
              <span className="text-sm font-medium">Dashboard</span>
            )}
          </button>
          <button
            onClick={() => navigate("/user/my-jobs")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-colors ${
              isActive("/user/my-jobs")
                ? "bg-[#0f1729] text-white"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Search size={20} />
            {sidebarOpen && (
              <span className="text-sm font-medium">Browse Jobs</span>
            )}
          </button>

          <button
            onClick={() => navigate("/user/message")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-colors ${
              isActive("/user/message")
                ? "bg-[#0f1729] text-white"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <MessageSquare size={20} />
            {sidebarOpen && (
              <span className="text-sm font-medium">Messages</span>
            )}
          </button>
          <button
            onClick={() => navigate("/user/setting")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
              isActive("/user/setting")
                ? "bg-[#0f1729] text-white"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Settings size={20} />
            {sidebarOpen && (
              <span className="text-sm font-medium">Settings</span>
            )}
          </button>
        </nav>

        {/* Logout */}
        <div className="p-4 pb-6">
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
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            {/* LEFT */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu size={22} />
              </button>

              <div className="flex items-center gap-2">
                <Building2 className="text-blue-600" size={22} />
                <span className="font-bold text-lg sm:text-xl whitespace-nowrap">
                  IN KLEIN
                </span>

                {/* hide subtitle on small screens */}
                <span className="hidden md:inline text-xs text-gray-500 ml-2">
                  ELEVATOR SOFTWARE
                </span>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search..."
                className="
          w-full sm:w-64 lg:w-80
          px-3 py-2
          border border-gray-300 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-blue-500
        "
              />

              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
                <User size={22} />
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content - This will render child routes */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
