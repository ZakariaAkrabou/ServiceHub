import {
  LayoutGrid,
  BarChart2,
  Ticket,
  FileText,
  CalendarDays,
  LineChart,
  Bell,
  Settings,
  LogOut
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutGrid },
    { name: "Analytics", href: "/analytics", icon: BarChart2 },
    { name: "Tickets", href: "/tickets", icon: Ticket },
    { name: "Documents", href: "/docs", icon: FileText },
    { name: "Calendar", href: "/calendar", icon: CalendarDays },
    { name: "Reports", href: "/reports", icon: LineChart },
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-[90px] h-full bg-white rounded-[2rem] shadow-sm flex flex-col items-center py-4 shrink-0 z-10 box-border overflow-hidden">
      {/* Logo */}
      <div className="flex flex-col items-center gap-1.5 mb-4 w-full">
        <div className="w-10 h-10 rounded-full bg-[#4F46E5] flex items-center justify-center shadow-md shadow-indigo-200 shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>
        <span className="font-semibold text-[13px] text-gray-900 leading-none">Base</span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 flex flex-col items-center justify-center gap-2 w-full">
        {navigation.map((item) => {
          const isActive = item.href === "/"
            ? location.pathname === "/" || location.pathname === "/admin" || location.pathname === "/admin/"
            : location.pathname.includes(item.href);

          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.href}
              className={`w-[40px] h-[40px] shrink-0 rounded-2xl flex items-center justify-center transition-all ${isActive ? "bg-[#EEF2FF] text-[#4F46E5]" : "text-[#A0AEC0] hover:bg-gray-50 hover:text-gray-600"
                }`}
              title={item.name}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
            </Link>
          );
        })}
      </nav>

      {/* Profile & Logout */}
      <div className="flex flex-col items-center gap-3 mt-auto pt-4 w-full">
        <div className="w-10 h-10 shrink-0 rounded-[14px] bg-[#FFE4E6] flex items-center justify-center overflow-hidden ring-2 ring-white shadow-sm">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=transparent"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <Link
          to="/admin/login"
          className="w-10 h-10 shrink-0 flex items-center justify-center text-[#A0AEC0] hover:text-gray-600 hover:bg-gray-50 rounded-2xl transition-all"
          title="Sign out"
        >
          <LogOut className="w-5 h-5" />
        </Link>
      </div>
    </aside>
  );
}
