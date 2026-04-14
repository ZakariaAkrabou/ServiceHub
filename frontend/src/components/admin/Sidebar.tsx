import {
  LayoutGrid,
  Users,
  HandCoins,
  FileText,
  Star,
  Bell,
  Settings,
  LogOut,
  Briefcase,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutGrid },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Providers", href: "/admin/providers", icon: HandCoins },
    { name: "Bookings", href: "/admin/bookings", icon: FileText },
    { name: "Services", href: "/admin/services", icon: Briefcase },
    { name: "Reviews", href: "/admin/reviews", icon: Star },
    { name: "Notifications", href: "/admin/notifications", icon: Bell },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className="w-22.5 h-full bg-white rounded-4xl shadow-sm flex flex-col items-center py-4 shrink-0 z-10 box-border overflow-hidden">
      {/* Logo */}
      <div className="flex flex-col items-center gap-1.5 mb-4 w-full">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm shrink-0"
          style={{ backgroundColor: "#F6E304" }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000000"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>
        <span className="font-semibold text-[13px] text-gray-900 leading-none">
          Base
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 flex flex-col items-center justify-center gap-2 w-full">
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
              className="w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center transition-all"
              style={
                isActive
                  ? { backgroundColor: "#081D3A", color: "#F6E304" }
                  : { color: "#17171A", opacity: 0.7 }
              }
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = "rgba(8, 29, 58, 0.05)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = "transparent";
              }}
              title={item.name}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
            </Link>
          );
        })}
      </nav>

      {/* Profile & Logout */}
      <div className="flex flex-col items-center gap-3 mt-auto pt-4 w-full">
        <Link
          to="/admin/profile"
          className="w-10 h-10 shrink-0 rounded-[14px] flex items-center justify-center overflow-hidden ring-2 ring-white shadow-sm transition-all hover:ring-[#F6E304]"
          style={{ backgroundColor: "#F3F3F3" }}
          title="Profile"
        >
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=transparent"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </Link>
        <Link
          to="/admin/login"
          className="w-10 h-10 shrink-0 flex items-center justify-center transition-all"
          style={{ color: "#17171A", opacity: 0.7 }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(8, 29, 58, 0.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </Link>
      </div>
    </aside>
  );
}
