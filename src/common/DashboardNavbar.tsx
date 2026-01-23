import { FC, useState } from "react";
import { Menu, BellDot } from "lucide-react";
import logo from "@/assets/image/logo.png";
import {
  useGetAllOwnNotificationQuery,
  useMarkNotificationAsSeenMutation,
} from "@/Redux/features/ElevatorDa/notification/notificationApi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DashboardNavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const DashboardNavbar: FC<DashboardNavbarProps> = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  const [open, setOpen] = useState(false);

  const { data: notificationsData, isLoading } =
    useGetAllOwnNotificationQuery();
  const [markAsSeen] = useMarkNotificationAsSeenMutation();

  const notifications = notificationsData?.data?.data || [];
  // Calculate unread count from actual notifications (isSeen === false)
  const unreadCount = notifications.filter((n) => !n.isSeen).length;

  const handleNotificationClick = async (notificationId: string) => {
    try {
      await markAsSeen(notificationId).unwrap();
    } catch {
      // Silent fail
    }
    setOpen(false);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              >
                <BellDot size={22} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={8}
              className="w-80 sm:w-96 bg-white p-0 max-h-[min(24rem,70vh)] overflow-hidden flex flex-col"
            >
              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                {unreadCount > 0 && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {unreadCount} unread
                  </p>
                )}
              </div>
              <div className="overflow-y-auto flex-1">
                {isLoading ? (
                  <div className="px-4 py-8 text-center text-gray-500 text-sm">
                    Loading…
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500 text-sm">
                    No notifications yet
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {notifications.map((n) => {
                      const isSeen = !!n.isSeen;
                      return (
                        <li key={n.notificationId}>
                          <button
                            type="button"
                            onClick={() => handleNotificationClick(n.notificationId)}
                            className={cn(
                              "w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors block",
                              !isSeen && "bg-blue-50/50"
                            )}
                          >
                            <span
                              className={cn(
                                "text-sm block",
                                !isSeen
                                  ? "font-medium text-gray-900"
                                  : "text-gray-700"
                              )}
                            >
                              {n.title ?? n.description ?? "Notification"}
                            </span>
                            {n.description && n.title && n.title !== n.description && (
                              <span className="text-xs text-gray-500 mt-0.5 line-clamp-2 block">
                                {n.description}
                              </span>
                            )}
                            {n.createdAt && (
                              <span className="text-xs text-gray-400 mt-1 block">
                                {formatDate(n.createdAt)}
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
