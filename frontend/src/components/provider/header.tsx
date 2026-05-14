import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../app/store/store";
import { logout } from "../../app/slices/AuthSlice";
import { useLogoutMutation } from "../../app/api/AuthApi";
import { ChevronDown, LogOut, User, UserCircle } from "lucide-react";

/** Profile menu only — sits in the top bar next to the divider (see ProviderLayouts). */
const ProviderProfileBar: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const [logoutMutation] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest(".pv-p-user")) setShowDropdown(false);
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

  return (
    <>
      <style>{`
        .pv-p-user {
          position: relative;
          flex-shrink: 0;
        }
        .pv-p-trigger {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          height: 40px;
          padding: 0 10px 0 4px;
          margin: 0;
          border: 1px solid #e3e0d8;
          border-radius: 8px;
          background: #faf9f7;
          color: #1a1a2e;
          cursor: pointer;
          font-family: inherit;
          font-size: 14px;
          font-weight: 500;
          box-sizing: border-box;
        }
        .pv-p-trigger:hover {
          border-color: #c9a84c;
          background: #fff;
        }
        .pv-p-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          overflow: hidden;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0efec;
        }
        .pv-p-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .pv-p-name {
          max-width: 140px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        @media (max-width: 520px) {
          .pv-p-name { display: none; }
        }
        .pv-p-chev {
          opacity: 0.55;
          flex-shrink: 0;
          transition: transform 0.2s ease;
        }
        .pv-p-trigger[aria-expanded="true"] .pv-p-chev {
          transform: rotate(180deg);
        }
        .pv-p-dd {
          position: absolute;
          top: calc(100% + 6px);
          right: 0;
          min-width: 220px;
          padding: 8px;
          background: #fff;
          border: 1px solid #e3e0d8;
          border-radius: 12px;
          box-shadow: 0 16px 40px rgba(26, 26, 46, 0.12);
          opacity: 0;
          visibility: hidden;
          transform: translateY(-4px);
          transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
        }
        .pv-p-dd.pv-p-dd-open {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        .pv-p-dd-top {
          padding: 10px 12px 12px;
          border-bottom: 1px solid #eceae5;
          margin-bottom: 4px;
        }
        .pv-p-dd-name {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #1a1a2e;
        }
        .pv-p-dd-role {
          display: block;
          font-size: 12px;
          color: #5c5c6a;
          text-transform: capitalize;
          margin-top: 2px;
        }
        .pv-p-dd-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 10px 12px;
          border: none;
          border-radius: 8px;
          background: transparent;
          color: #1a1a2e;
          font-size: 14px;
          font-family: inherit;
          text-align: left;
          cursor: pointer;
          text-decoration: none;
          box-sizing: border-box;
        }
        .pv-p-dd-btn:hover {
          background: #faf9f7;
        }
        .pv-p-dd-out {
          color: #a33a3a;
        }
        .pv-p-dd-out:hover {
          background: #fdf5f5;
          color: #8b2020;
        }
      `}</style>

      <div className="pv-p-user">
        <button
          type="button"
          className="pv-p-trigger"
          aria-expanded={showDropdown}
          onClick={(e) => {
            e.stopPropagation();
            setShowDropdown((v) => !v);
          }}
        >
          <span className="pv-p-avatar">
            {user?.image ? (
              <img src={user.image} alt="" />
            ) : (
              <User size={17} strokeWidth={1.75} color="#c9a84c" />
            )}
          </span>
          <span className="pv-p-name">{user?.firstName ?? "Account"}</span>
          <ChevronDown size={16} className="pv-p-chev" aria-hidden />
        </button>

        <div className={`pv-p-dd ${showDropdown ? "pv-p-dd-open" : ""}`}>
          <div className="pv-p-dd-top">
            <span className="pv-p-dd-name">
              {user?.firstName} {user?.lastName}
            </span>
            <span className="pv-p-dd-role">{(user?.role ?? "").replace(/_/g, " ")}</span>
          </div>
          <Link to="/provider/dashboard" className="pv-p-dd-btn" onClick={() => setShowDropdown(false)}>
            <UserCircle size={18} strokeWidth={1.75} />
            Dashboard
          </Link>
          <Link to="/" className="pv-p-dd-btn" onClick={() => setShowDropdown(false)}>
            <UserCircle size={18} strokeWidth={1.75} />
            Home
          </Link>
          <button type="button" className="pv-p-dd-btn pv-p-dd-out" onClick={handleLogout}>
            <LogOut size={18} strokeWidth={1.75} />
            Sign out
          </button>
        </div>
      </div>
    </>
  );
};

export default ProviderProfileBar;
