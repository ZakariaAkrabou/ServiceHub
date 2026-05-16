import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
  LayoutDashboard,
  CalendarDays,
  Briefcase,
  Settings,
  LogOut,
} from "lucide-react";

import { useLogoutMutation } from "../../app/api/AuthApi";
import { logout } from "../../app/slices/AuthSlice";

type Item = {
  to: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  end?: boolean;
};

const items: Item[] = [
  {
    to: "/provider/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
    end: true,
  },
   {
    to: "/provider/services",
    label: "Services",
    icon: Briefcase,
  },
  {
    to: "/provider/bookings",
    label: "Bookings",
    icon: CalendarDays,
  },
 
  {
    to: "/provider/settings",
    label: "Settings",
    icon: Settings,
  },
];

type ProviderSidebarProps = {
  width: number;
  onNavigate?: () => void;
  sidebarOpen?: boolean;
};

const ProviderSidebar: React.FC<ProviderSidebarProps> = ({
  width,
  onNavigate,
}) => {
  const [logoutMutation] = useLogoutMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutMutation({}).unwrap();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      dispatch(logout());
      onNavigate?.();
      navigate("/login");
    }
  };

  return (
    <aside
      style={{ width }}
      className="
        sticky top-14
        flex min-h-[calc(100vh-56px)] flex-col
        self-start
        bg-[#f8f6f1]
        border-r border-[#eceae5]
        py-6

        max-lg:min-h-full
        max-lg:w-full
        max-lg:py-4
        max-lg:border-r-0
      "
    >
   
      <nav
        aria-label="Provider"
        className="flex flex-1 flex-col gap-2 px-4"
      >
        <div className="mb-2 px-3 text-xs font-bold uppercase tracking-wider text-[#9a9a9a]">
          Menu
        </div>
        
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `
                group relative flex items-center gap-3.5
                rounded-xl
                px-4 py-3
                text-[15px] font-semibold
                transition-all duration-200 ease-out

                ${
                  isActive
                    ? `
                      bg-white
                      text-[#1a1a2e]
                      shadow-sm ring-1 ring-[#e9e3d3]
                    `
                    : `
                      text-[#5f5f5f]
                      hover:bg-white/60
                      hover:text-[#1a1a2e]
                    `
                }
              `
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[#c9a84c]" />
                )}
                <Icon 
                  size={20} 
                  strokeWidth={isActive ? 2.5 : 2} 
                  className={`
                    transition-transform duration-200 group-hover:scale-110 
                    ${isActive ? "text-[#c9a84c]" : "text-[#9a9a9a] group-hover:text-[#c9a84c]"}
                  `} 
                />
                <span className={isActive ? "font-bold" : ""}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* FOOTER */}
      <div className="mt-auto px-4 pt-6 max-md:pt-4">
        <button
          type="button"
          onClick={handleLogout}
          className="
            group flex w-full items-center justify-between gap-3
            rounded-xl
            bg-white
            px-4 py-3.5
            text-sm font-semibold
            text-[#1a1a2e]
            shadow-sm ring-1 ring-[#e9e3d3]
            transition-all duration-200 ease-out

            hover:bg-[#fdf5f5]
            hover:text-[#a33a3a]
            hover:ring-red-100
          "
        >
          <span>Sign Out</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#faf9f7] transition-colors group-hover:bg-red-50">
            <LogOut size={16} strokeWidth={2.5} className="text-[#5f5f5f] transition-colors group-hover:text-[#a33a3a]" />
          </div>
        </button>
      </div>
    </aside>
  );
};

export default ProviderSidebar;