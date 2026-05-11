
import {
  Bell,
  Check,
  Clock,
  UserPlus,
  Briefcase,
  Calendar,
  AlertCircle,

  CheckCheck,
} from "lucide-react";
import {
  useGetAdminNotificationsQuery,
  useMarkNotificationAsReadMutation,
  useMarkAllNotificationsAsReadMutation,
} from "../../../app/api/NotificationApi";
import { format } from "date-fns";

const Notification = () => {
  const { data: notificationsResponse, isLoading } = useGetAdminNotificationsQuery();
  const [markAsRead] = useMarkNotificationAsReadMutation();
  const [markAllAsRead] = useMarkAllNotificationsAsReadMutation();

  const notifications = notificationsResponse?.data || [];

  const getIcon = (type: string) => {
    switch (type) {
      case "new_provider":
        return <UserPlus className="w-5 h-5 text-blue-500" />;
      case "new_service":
        return <Briefcase className="w-5 h-5 text-purple-500" />;
      case "new_booking":
        return <Calendar className="w-5 h-5 text-green-500" />;
      case "booking_cancelled":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id).unwrap();
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#081D3A]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#081D3A]">Notifications</h1>
          <p className="text-gray-500 mt-1">Stay updated with the latest platform activities</p>
        </div>
        <button
          onClick={handleMarkAllAsRead}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#081D3A] bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
        >
          <CheckCheck className="w-4 h-4" />
          Mark all as read
        </button>
      </div>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No notifications yet</h3>
            <p className="text-gray-500 mt-1">We'll notify you when something happens</p>
          </div>
        ) : (
          notifications.map((notif: any) => (
            <div
              key={notif._id}
              className={`group relative flex items-start gap-4 p-5 rounded-2xl transition-all duration-300 border ${
                notif.is_read
                  ? "bg-white/60 border-gray-100 opacity-75"
                  : "bg-white border-blue-100 shadow-md scale-[1.01]"
              }`}
            >
              <div
                className={`p-3 rounded-xl shrink-0 ${
                  notif.is_read ? "bg-gray-50" : "bg-blue-50"
                }`}
              >
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-400">
                    {notif.type.replace("_", " ").toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {format(new Date(notif.createdAt), "MMM d, h:mm a")}
                  </span>
                </div>
                <h4
                  className={`text-base leading-relaxed ${
                    notif.is_read ? "text-gray-600" : "text-[#081D3A] font-semibold"
                  }`}
                >
                  {notif.message}
                </h4>
              </div>

              {!notif.is_read && (
                <button
                  onClick={() => handleMarkAsRead(notif._id)}
                  className="shrink-0 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Mark as read"
                >
                  <Check className="w-5 h-5" />
                </button>
              )}
              
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-[#081D3A] rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notification;
