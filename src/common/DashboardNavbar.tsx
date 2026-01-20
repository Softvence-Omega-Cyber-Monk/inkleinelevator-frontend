import { FC } from "react";
import { Menu, Building2, BellDot } from "lucide-react";
import logo from "@/assets/image/logo.png";

interface DashboardNavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const DashboardNavbar: FC<DashboardNavbarProps> = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  return (
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

          <div className="ml-4">
            <img src={logo} alt="logo" />
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
            <BellDot size={22} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
