import React from "react";
import { useSelector } from "react-redux";
import ProviderLayouts from "../../components/provider/ProviderLayouts";
import {
  useGetProviderNotificationsQuery,
  useMarkProviderNotificationReadMutation,
  useMarkAllProviderNotificationsReadMutation,
} from "../../app/api/NotificationApi";
import { selectAuthToken } from "../../app/slices/AuthSlice";
import { Bell, CalendarCheck, Loader2, Check } from "lucide-react";

const ProviderNotifications: React.FC = () => {
  const token = useSelector(selectAuthToken);
  const { data: notifResponse, isLoading } = useGetProviderNotificationsQuery(
    undefined,
    { skip: !token }
  );
  
  const [markRead] = useMarkProviderNotificationReadMutation();
  const [markAllRead] = useMarkAllProviderNotificationsReadMutation();

  const notifications = notifResponse?.data ?? [];
  const unreadCount = notifications.filter((n: any) => !n.is_read).length;

  const handleMarkRead = async (id: string) => {
    try {
      await markRead(id).unwrap();
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead().unwrap();
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  const formatTime = (iso: string) => {
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const typeIcon: Record<string, React.ReactNode> = {
    new_booking: <CalendarCheck size={16} className="text-[#c9a84c]" />,
    booking_updated: <CalendarCheck size={16} className="text-blue-500" />,
    booking_cancelled: <CalendarCheck size={16} className="text-red-500" />,
  };

  return (
    <ProviderLayouts>
      <div className="max-w-3xl pb-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl font-light tracking-tight text-[#1a1a1a]">Notifications</h1>
            <p className="text-sm text-[#5f5f5f] mt-1">Manage and view all your service alerts.</p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#e9e3d3] bg-white px-4 py-2 text-xs font-semibold text-[#1a1a1a] shadow-sm transition hover:bg-[#faf9f7]"
            >
              <Check size={14} className="text-[#c9a84c]" />
              Mark all as read
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex h-48 items-center justify-center rounded-2xl border border-[#e9e3d3] bg-white">
            <Loader2 className="h-8 w-8 animate-spin text-[#c9a84c]" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 px-4 text-center rounded-2xl border border-[#e9e3d3] bg-white">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f4f1eb]">
              <Bell size={24} className="text-[#c9a84c]" />
            </div>
            <p className="text-base font-semibold text-[#1a1a1a]">No notifications yet</p>
            <p className="text-xs text-[#9a9a9a]">New client bookings and updates will show up here.</p>
          </div>
        ) : (
          <ul className="divide-y divide-[#eceae5] rounded-2xl border border-[#e9e3d3] bg-white shadow-sm overflow-hidden">
            {notifications.map((n: any) => (
              <li
                key={n._id}
                onClick={() => !n.is_read && handleMarkRead(n._id)}
                className={`flex gap-4 px-5 py-4.5 items-start transition-all cursor-pointer ${
                  !n.is_read ? "bg-[#fffcf5] hover:bg-[#fff9eb]" : "bg-white hover:bg-[#faf9f7]"
                }`}
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f4f1eb]">
                  {typeIcon[n.type] ?? <Bell size={16} className="text-[#9a9a9a]" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm ${!n.is_read ? "font-semibold text-[#1a1a1a]" : "text-[#5f5f5f]"}`}>
                      {n.message}
                    </p>
                    {!n.is_read && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-[#c9a84c]" title="Unread" />
                    )}
                  </div>
                  <p className="mt-1 text-xs text-[#9a9a9a]">{formatTime(n.createdAt)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </ProviderLayouts>
  );
};

export default ProviderNotifications;
