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

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();

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
      <div className="flex items-center gap-3 mb-6 w-full px-6.25 group-hover:px-6 transition-all duration-300">
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
        <span className="font-bold text-xl text-gray-900 leading-none whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Base
        </span>
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
              className="h-10 flex items-center rounded-2xl transition-all duration-200 overflow-hidden w-10 group-hover:w-full shrink-0"
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
              <div className="w-10 h-10 shrink-0 flex items-center justify-center">
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
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
