import {
  LayoutGrid,
  Users,
  HandCoins,
  FileText,
  Bell,
  Settings,
  LogOut,
  Briefcase,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../../app/api/AuthApi";
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "../../app/slices/AuthSlice";
import { useGetUnreadNotificationCountQuery } from "../../app/api/NotificationApi";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const { data: unreadCountResponse } = useGetUnreadNotificationCountQuery(undefined, {
    pollingInterval: 15000, // Poll every 15 seconds as a fallback
    refetchOnMountOrArgChange: true,
  });
  const unreadCount = unreadCountResponse?.count || 0;

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
    { name: "Users", href: "/admin/customers", icon: Users },
    { name: "Providers", href: "/admin/providers", icon: HandCoins },
    { name: "Bookings", href: "/admin/bookings", icon: FileText },
    { name: "Services", href: "/admin/services", icon: Briefcase },
    { name: "Notifications", href: "/admin/notifications", icon: Bell },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className="group w-22.5 hover:w-64 h-full bg-white rounded-4xl shadow-sm flex flex-col py-4 shrink-0 z-10 box-border overflow-hidden transition-all duration-300">
      {/* Logo */}
      <div className="flex items-center mb-10 w-full px-4 transition-all duration-300 overflow-hidden h-24">
        <Link to="/admin/dashboard" className="flex items-center justify-center w-full group-hover:justify-start transition-all duration-300">
          <img 
            src="/logo.png" 
            alt="Services Hub" 
            className="h-12 w-auto group-hover:h-20 transition-all duration-500 object-contain shrink-0" 
          />
        </Link>
      </div>

      {/* Nav items */}
      <nav className="flex-1 flex flex-col gap-2 w-full px-6.25 group-hover:px-4 transition-all duration-300">
        {navigation.map((item) => {
          const isActive =
            item.name === "Dashboard"
              ? location.pathname === "/admin/dashboard" ||
                location.pathname === "/admin" ||
                location.pathname === "/admin/"
              : location.pathname.includes(item.href);

          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.href}
              className="h-10 flex items-center rounded-2xl transition-all duration-200 overflow-hidden w-10 group-hover:w-full shrink-0 relative"
              style={
                isActive
                  ? { backgroundColor: "#081D3A", color: "#F6E304" }
                  : { color: "#17171A", opacity: 0.7 }
              }
              onMouseEnter={(e) => {
                if (!isActive)
                  e.currentTarget.style.backgroundColor =
                    "rgba(8, 29, 58, 0.05)";
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  e.currentTarget.style.backgroundColor = "transparent";
              }}
              title={item.name}
            >
              <div className="w-10 h-10 shrink-0 flex items-center justify-center relative">
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                {item.name === "Notifications" && unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-bold min-w-[16px] h-[16px] flex items-center justify-center rounded-full border border-white shadow-sm">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </div>
              <span className="font-medium whitespace-nowrap ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Profile & Logout */}
      <div className="flex flex-col gap-2 mt-auto pt-4 w-full px-6.25 group-hover:px-4 transition-all duration-300 border-t border-gray-50/50">
        <Link
          to="/admin/settings"
          className="h-10 flex items-center rounded-2xl transition-all duration-200 overflow-hidden w-10 group-hover:w-full shrink-0"
          style={{ color: "#17171A" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(8, 29, 58, 0.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
        >
          <div
            className="w-10 h-10 shrink-0 rounded-[14px] flex items-center justify-center overflow-hidden ring-2 ring-white shadow-sm transition-all hover:ring-[#F6E304]"
            style={{ backgroundColor: "#F3F3F3" }}
          >
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=transparent"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-medium whitespace-nowrap ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Profile
          </span>
        </Link>

        <button
          type="button"
          className="h-10 flex items-center rounded-2xl transition-all duration-200 overflow-hidden w-10 group-hover:w-full shrink-0 bg-transparent border-none outline-none"
          style={{ color: "#17171A", cursor: "pointer" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(8, 29, 58, 0.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          onClick={async () => {
            try {
              await logout({}).unwrap();
              dispatch(logoutAction());
              navigate("/admin/login");
            } catch (err) {}
          }}
        >
          <div className="w-10 h-10 shrink-0 flex items-center justify-center opacity-70">
            <LogOut className="w-5 h-5" />
          </div>
          <span className="font-medium whitespace-nowrap ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
}
