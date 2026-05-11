import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store/store";
import { socket } from "../utils/socket";
import { toast } from "react-toastify";
import { NotificationApi } from "../app/api/NotificationApi";
import { useDispatch } from "react-redux";

export default function AdminLayouts() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && user.role === "admin") {
      console.log("Setting up Admin socket...");
      
      const onConnect = () => {
        console.log("Admin socket connected, joining 'admin' room...");
        socket.emit("join", user._id, "admin");
      };

      const onDisconnect = (reason: string) => {
        console.log("Admin socket disconnected:", reason);
      };

      const onNewNotification = (notification: any) => {
        console.log("REAL-TIME NOTIFICATION:", notification);
        toast.info(notification.message || "New activity detected", {
          position: "top-right",
          autoClose: 5000,
        });
   
        console.log("Invalidating 'Notification' tags...");
        dispatch(NotificationApi.util.invalidateTags(["Notification"]));
      };

      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);
      socket.on("newNotification", onNewNotification);
      
      if (!socket.connected) {
        socket.connect();
      } else {
        onConnect();
      }

      return () => {
        console.log("Cleaning up Admin socket...");
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
        socket.off("newNotification", onNewNotification);
    
      };
    }
  }, [user, dispatch]);

  return (
    <div
      className="flex h-screen overflow-hidden p-4 lg:p-6.5 gap-4 lg:gap-7.5 relative"
      style={{
        backgroundColor: "#F3F3F3",
        fontFamily: "'Times New Roman', sans-serif, Geist, 'Geist Placeholder', Inter, 'Inter Placeholder', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji', ui-sans-serif, system-ui",
      }}
    >
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/40 z-30 transition-opacity xl:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <div 
        className={`fixed inset-y-4 left-4 z-40 transform transition-transform duration-300 ease-in-out xl:relative xl:inset-y-0 xl:left-0 xl:z-0 xl:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-[150%]"
        }`}
      >
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto w-full custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}