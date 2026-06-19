import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Bell, ChevronDown, LogOut, User, UserCircle, CalendarCheck, MessageSquare } from "lucide-react";

import type { RootState } from "../../app/store/store";
import { logout, selectAuthToken } from "../../app/slices/AuthSlice";
import { useLogoutMutation } from "../../app/api/AuthApi";
import {
  useGetProviderNotificationsQuery,
  useMarkAllProviderNotificationsReadMutation,
  useMarkProviderNotificationReadMutation,
} from "../../app/api/NotificationApi";
import { bookingApi, useGetUnreadChatCountQuery } from "../../app/api/BookingApi";
import { getSocket } from "../../hooks/useSocket";
import { useBootstrapping } from "../../app/BootContext";

const ProviderProfileBar: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);

  const { user } = useSelector((state: RootState) => state.auth);
  const token = useSelector(selectAuthToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutMutation] = useLogoutMutation();
  const [markAllRead] = useMarkAllProviderNotificationsReadMutation();
  const [markRead] = useMarkProviderNotificationReadMutation();

  const bootstrapping = useBootstrapping();

  const { data: notifResponse, refetch: refetchNotifications } = useGetProviderNotificationsQuery(
    undefined, { skip: !token || bootstrapping }
  );

  const { data: chatUnreadData, refetch: refetchChatUnread } = useGetUnreadChatCountQuery(
    undefined, { skip: !token || bootstrapping }
  );

  const allNotifications = notifResponse?.data ?? [];

  const unreadCount = allNotifications.filter((n: any) => !n.is_read).length;
  const chatUnreadCount = chatUnreadData?.count || 0;

  // ── Socket setup ──────────────────────────────────────────────────────────
  const socketRef = useRef(getSocket());

  useEffect(() => {
    if (!user?._id) return;
    const socket = socketRef.current;

    if (!socket.connected) socket.connect();
    socket.emit("join", user._id, user.role);

    const handleNewBooking = () => {
      // Invalidate RTK Query cache so bookings list auto-refreshes
      dispatch(bookingApi.util.invalidateTags([{ type: "Booking", id: "LIST" }]));
      // Re-fetch server notifications
      refetchNotifications();
    };

    const handleBookingUpdate = () => {
      dispatch(bookingApi.util.invalidateTags([{ type: "Booking", id: "LIST" }]));
      refetchNotifications();
    };

    const handleNewChatMessage = () => {
      refetchChatUnread();
      dispatch(bookingApi.util.invalidateTags([{ type: "Booking", id: "LIST" }]));
    };

    socket.on("newBooking", handleNewBooking);
    socket.on("bookingUpdate", handleBookingUpdate);
    socket.on("bookingCancelled", handleBookingUpdate);
    socket.on("receive_message", handleNewChatMessage);

    return () => {
      socket.off("newBooking", handleNewBooking);
      socket.off("bookingUpdate", handleBookingUpdate);
      socket.off("bookingCancelled", handleBookingUpdate);
      socket.off("receive_message", handleNewChatMessage);
    };
  }, [user?._id, user?.role, dispatch, refetchNotifications, refetchChatUnread]);

  // ── Click-outside close ────────────────────────────────────────────────────
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest(".pv-p-user")) setShowDropdown(false);
      if (!t.closest(".pv-p-notify-wrap")) setNotifyOpen(false);
    };
    window.addEventListener("click", onDocClick);
    return () => window.removeEventListener("click", onDocClick);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutMutation({}).unwrap();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      dispatch(logout());
      setShowDropdown(false);
      navigate("/login");
    }
  };

  const handleOpenNotifications = useCallback(() => {
    setNotifyOpen((v) => !v);
    setShowDropdown(false);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await markAllRead().unwrap();
    } catch (err) {
      console.error("Failed to mark all read:", err);
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
    new_booking: <CalendarCheck size={14} className="text-[#c9a84c]" />,
    booking_updated: <CalendarCheck size={14} className="text-blue-500" />,
    booking_cancelled: <CalendarCheck size={14} className="text-red-500" />,
  };

  return (
    <div className="flex items-center gap-2.5 shrink-0">

      {/* ── Chat Notification ── */}
      <Link to="/provider/contact" className="relative shrink-0">
        <button
          type="button"
          aria-label="Messages"
          title="Messages"
          className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#e9e3d3] bg-[#f8f6f1] p-0 text-[#1a1a1a] transition-all duration-150 hover:border-[#c9a84c] hover:bg-white hover:text-[#1a1a2e]"
        >
          <MessageSquare size={20} strokeWidth={1.85} />
          {chatUnreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#c9a84c] text-[10px] font-bold text-[#1a1a1a] shadow-sm">
              {chatUnreadCount > 9 ? "9+" : chatUnreadCount}
            </span>
          )}
        </button>
      </Link>

      {/* ── Notification Bell ── */}
      <div className="pv-p-notify-wrap relative shrink-0">
        <button
          type="button"
          aria-expanded={notifyOpen}
          aria-haspopup="true"
          aria-label="Notifications"
          title="Notifications"
          onClick={(e) => { e.stopPropagation(); handleOpenNotifications(); }}
          className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#e9e3d3] bg-[#f8f6f1] p-0 text-[#1a1a1a] transition-all duration-150 hover:border-[#c9a84c] hover:bg-white hover:text-[#1a1a2e]"
        >
          <Bell size={20} strokeWidth={1.85} />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#c9a84c] text-[10px] font-bold text-[#1a1a1a] shadow-sm">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* Dropdown */}
        <div
          role="menu"
          className={`absolute right-0 top-[calc(100%+6px)] z-200 w-[min(340px,calc(100vw-24px))] max-w-[calc(100vw-32px)] overflow-hidden rounded-xl border border-[#e9e3d3] bg-white shadow-[0_16px_40px_rgba(26,26,26,0.12)] ${notifyOpen ? "block" : "hidden"}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#eceae5] px-3.5 py-3">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-[#1a1a1a]">Notifications</span>
              {unreadCount > 0 && (
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#c9a84c] text-[10px] font-bold text-[#1a1a1a]">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] font-semibold text-[#c9a84c] hover:text-[#b08a27] transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications list */}
          <div className="max-h-[45vh] overflow-y-auto">
            {allNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-8 px-4 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f4f1eb]">
                  <Bell size={18} className="text-[#c9a84c]" />
                </div>
                <p className="text-sm font-medium text-[#1a1a1a]">No notifications yet</p>
                <p className="text-xs text-[#9a9a9a]">New booking requests will appear here.</p>
              </div>
            ) : (
              allNotifications.slice(0, 8).map((n: any) => (
                <button
                  key={n._id}
                  type="button"
                  onClick={async () => {
                    setNotifyOpen(false);
                    if (!n.is_read) {
                      try {
                        await markRead(n._id).unwrap();
                      } catch (err) {
                        console.error("Failed to mark notification as read:", err);
                      }
                    }
                    navigate("/provider/bookings");
                  }}
                  className={`block w-full border-b border-[#f4f1eb] px-3.5 py-3 text-left transition-colors duration-150 last:border-b-0 hover:bg-[#f8f6f1] ${!n.is_read ? "bg-[#fffcf5]" : "bg-white"}`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f4f1eb]">
                      {typeIcon[n.type] ?? <Bell size={14} className="text-[#9a9a9a]" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        {!n.is_read && (
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#c9a84c]" />
                        )}
                        <span className="text-[13px] font-semibold text-[#1a1a1a] truncate">
                          {n.type === "new_booking" ? "New Booking Request" :
                           n.type === "booking_updated" ? "Booking Updated" :
                           n.type === "booking_cancelled" ? "Booking Cancelled" : "Notification"}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs leading-[1.4] text-[#5f5f5f] line-clamp-2">
                        {n.message}
                      </p>
                      <p className="mt-1 text-[11px] text-[#9a9a9a]">
                        {formatTime(n.createdAt)}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-[#eceae5]">
            <Link
              to="/provider/bookings"
              onClick={() => setNotifyOpen(false)}
              className="block w-full bg-[#faf9f7] px-3.5 py-3 text-center text-[13px] font-semibold text-[#1a1a2e] transition-all duration-150 hover:bg-[#f0ebe0] hover:text-[#c9a84c]"
            >
              See all bookings
            </Link>
          </div>
        </div>
      </div>

      {/* ── User Profile Dropdown ── */}
      <div className="pv-p-user relative shrink-0">
        <button
          type="button"
          aria-expanded={showDropdown}
          onClick={(e) => { e.stopPropagation(); setShowDropdown((v) => !v); setNotifyOpen(false); }}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#e9e3d3] bg-[#f8f6f1] pl-1 pr-2.5 text-sm font-medium text-[#1a1a1a] transition-all duration-150 hover:border-[#c9a84c] hover:bg-white"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f0ede6]">
            {user?.image ? (
              <img src={user.image} alt="" className="h-full w-full object-cover" />
            ) : (
              <User size={17} strokeWidth={1.75} color="#c9a84c" />
            )}
          </span>
          <span className="max-w-35 overflow-hidden text-ellipsis whitespace-nowrap max-[700px]:max-w-20 max-[700px]:text-[13px] max-[520px]:hidden">
            {user?.firstName ?? "Account"}
          </span>
          <ChevronDown
            size={16}
            aria-hidden
            className={`shrink-0 opacity-55 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}
          />
        </button>

        <div
          className={`absolute right-0 top-[calc(100%+6px)] z-200 min-w-55 rounded-xl border border-[#e9e3d3] bg-white p-2 shadow-[0_16px_40px_rgba(26,26,26,0.1)] transition-all duration-200 ${showDropdown ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"}`}
        >
          <div className="mb-1 border-b border-[#eceae5] px-3 pb-3 pt-2.5">
            <span className="block text-sm font-semibold text-[#1a1a1a]">
              {user?.firstName} {user?.lastName}
            </span>
            <span className="mt-0.5 block text-xs capitalize text-[#5f5f5f]">
              {(user?.role ?? "").replace(/_/g, " ")}
            </span>
          </div>

          <Link
            to="/provider/settings"
            onClick={() => setShowDropdown(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-[#1a1a1a] transition-colors duration-150 hover:bg-[#f8f6f1]"
          >
            <UserCircle size={18} strokeWidth={1.75} />
            Account Settings
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-[#a33a3a] transition-all duration-150 hover:bg-[#fdf5f5] hover:text-[#8b2020]"
          >
            <LogOut size={18} strokeWidth={1.75} />
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfileBar;