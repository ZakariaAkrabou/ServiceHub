import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLogoutMutation } from "../../app/api/AuthApi";
import { logout } from "../../app/slices/AuthSlice";
import { LayoutDashboard, CalendarDays, Briefcase, Settings, LogOut } from "lucide-react";

type Item = {
  to: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  end?: boolean;
};

const items: Item[] = [
  { to: "/provider/dashboard", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/provider/bookings", label: "Bookings", icon: CalendarDays },
  { to: "/provider/services", label: "Services", icon: Briefcase },
  { to: "/provider/settings", label: "Settings", icon: Settings },
];

type ProviderSidebarProps = {
  width: number;
  onNavigate?: () => void;
};

const ProviderSidebar: React.FC<ProviderSidebarProps> = ({ width, onNavigate }) => {
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
    <>
      <style>{`
        .pv-s {
          width: ${width}px;
          min-height: calc(100vh - 56px);
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          padding: 16px 0 24px;
          background: #faf9f7;
          border-right: none;
          position: sticky;
          top: 56px;
          align-self: flex-start;
          z-index: 210;
        }
        @media (max-width: 1024px) {
          .pv-s {
            position: relative;
            top: 0;
            min-height: 100%;
          }
        }
        .pv-s-nav {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
          padding: 0 12px 0;
        }
        .pv-s-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 14px;
          margin: 0 4px;
          border-radius: 8px;
          text-decoration: none;
          color: #5c5c6a;
          font-size: 14px;
          font-weight: 500;
          border: 1px solid transparent;
          transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
        }
        .pv-s-link:hover {
          color: #1a1a2e;
          background: rgba(255, 255, 255, 0.7);
          border-color: #e8e5df;
        }
        .pv-s-link.pv-s-on {
          color: #1a1a2e;
          background: #ffffff;
          border-color: #e3e0d8;
          box-shadow:
            inset 3px 0 0 0 #c9a84c,
            0 1px 0 rgba(26, 26, 46, 0.04);
        }
        .pv-s-foot {
          margin-top: auto;
          padding: 20px 20px 0;
        }
        .pv-s-logout {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          width: 100%;
          padding: 12px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 500;
          font-family: inherit;
          color: #5c5c6a;
          border: 1px solid #e3e0d8;
          background: #fff;
          cursor: pointer;
          box-sizing: border-box;
          transition: border-color 0.15s ease, color 0.15s ease, background 0.15s ease;
        }
        .pv-s-logout:hover {
          color: #8b2020;
          border-color: #d4a5a5;
          background: #fdf5f5;
        }
      `}</style>

      <aside className="pv-s">
        <nav className="pv-s-nav" aria-label="Provider">
          {items.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onNavigate}
              className={({ isActive }) => `pv-s-link ${isActive ? "pv-s-on" : ""}`}
            >
              <Icon size={19} strokeWidth={1.75} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="pv-s-foot">
          <button type="button" className="pv-s-logout" onClick={handleLogout}>
            Log out
            <LogOut size={17} strokeWidth={2} />
          </button>
        </div>
      </aside>
    </>
  );
};

export default ProviderSidebar;
