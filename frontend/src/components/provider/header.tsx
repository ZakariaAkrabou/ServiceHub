import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {
  Bell,
  ChevronDown,
  LogOut,
  User,
  UserCircle,
} from "lucide-react";

import type { RootState } from "../../app/store/store";
import { logout } from "../../app/slices/AuthSlice";
import { useLogoutMutation } from "../../app/api/AuthApi";

import { latestNotificationPreviews } from "./providerNotificationMock";

const ProviderProfileBar: React.FC = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifyOpen, setNotifyOpen] = useState(false);

  const { user } = useSelector((state: RootState) => state.auth);

  const [logoutMutation] = useLogoutMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as HTMLElement;

      if (!t.closest(".pv-p-user")) {
        setShowDropdown(false);
      }

      if (!t.closest(".pv-p-notify-wrap")) {
        setNotifyOpen(false);
      }
    };

    window.addEventListener("click", onDocClick);

    return () => {
      window.removeEventListener("click", onDocClick);
    };
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
    <div className="flex items-center gap-2.5 shrink-0">
    
      <div className="pv-p-notify-wrap relative shrink-0">
        <button
          type="button"
          aria-expanded={notifyOpen}
          aria-haspopup="true"
          aria-label="Notifications"
          title="Notifications"
          onClick={(e) => {
            e.stopPropagation();
            setNotifyOpen((v) => !v);
            setShowDropdown(false);
          }}
          className="
            inline-flex h-10 w-10 shrink-0
            items-center justify-center
            rounded-lg
            border border-[#e9e3d3]
            bg-[#f8f6f1]
            p-0
            text-[#1a1a1a]
            transition-all duration-150

            hover:border-[#c9a84c]
            hover:bg-white
            hover:text-[#1a1a2e]
          "
        >
          <Bell size={20} strokeWidth={1.85} />
        </button>

      
        <div
          role="menu"
          className={`
            absolute right-0 top-[calc(100%+6px)]
            z-200
            w-[min(320px,calc(100vw-24px))]
            max-w-[calc(100vw-32px)]
            overflow-hidden
            rounded-xl
            border border-[#e9e3d3]
            bg-white
            shadow-[0_16px_40px_rgba(26,26,26,0.12)]

            ${notifyOpen ? "block" : "hidden"}
          `}
        >
        
          <div className="border-b border-[#eceae5] px-3.5 pb-2.5 pt-3 text-[13px] font-semibold text-[#1a1a1a]">
            Latest
          </div>

   
          <div className="max-h-[45vh] overflow-y-auto">
            {latestNotificationPreviews.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => {
                  setNotifyOpen(false);
                  navigate("/provider/notifications");
                }}
                className="
                  block w-full
                  border-b border-[#f4f1eb]
                  bg-white
                  px-3.5 py-2.5
                  text-left
                  transition-colors duration-150

                  last:border-b-0
                  hover:bg-[#f8f6f1]
                "
              >
               
                <div className="flex items-center gap-2 text-[13px] font-semibold text-[#1a1a1a]">
                  <span
                    aria-hidden
                    className={`
                      h-1.5 w-1.5 shrink-0 rounded-full
                      ${n.read ? "bg-[#d4d0c8]" : "bg-[#c9a84c]"}
                    `}
                  />

                  {n.title}
                </div>

              
                <div className="mt-1 text-xs leading-[1.4] text-[#5f5f5f]">
                  {n.body}
                </div>

               
                <div className="mt-1.5 text-[11px] text-[#9a9a9a]">
                  {n.time}
                </div>
              </button>
            ))}
          </div>

        
          <div className="border-t border-[#eceae5]">
            <Link
              to="/provider/notifications"
              onClick={() => setNotifyOpen(false)}
              className="
                block w-full
                bg-[#faf9f7]
                px-3.5 py-3
                text-center
                text-[13px] font-semibold
                text-[#1a1a2e]
                transition-all duration-150

                hover:bg-[#f0ebe0]
                hover:text-[#c9a84c]
              "
            >
              See all
            </Link>
          </div>
        </div>
      </div>

    
      <div className="pv-p-user relative shrink-0">
        <button
          type="button"
          aria-expanded={showDropdown}
          onClick={(e) => {
            e.stopPropagation();
            setShowDropdown((v) => !v);
            setNotifyOpen(false);
          }}
          className="
            inline-flex h-10 items-center justify-center gap-2
            rounded-lg
            border border-[#e9e3d3]
            bg-[#f8f6f1]
            pl-1 pr-2.5
            text-sm font-medium text-[#1a1a1a]
            transition-all duration-150

            hover:border-[#c9a84c]
            hover:bg-white
          "
        >
        
          <span
            className="
              flex h-8 w-8 shrink-0 items-center justify-center
              overflow-hidden rounded-full
              bg-[#f0ede6]
            "
          >
            {user?.image ? (
              <img
                src={user.image}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <User
                size={17}
                strokeWidth={1.75}
                color="#c9a84c"
              />
            )}
          </span>

   
          <span
            className="
              max-w-35
              overflow-hidden text-ellipsis whitespace-nowrap

              max-[700px]:max-w-20
              max-[700px]:text-[13px]

              max-[520px]:hidden
            "
          >
            {user?.firstName ?? "Account"}
          </span>

       
          <ChevronDown
            size={16}
            aria-hidden
            className={`
              shrink-0 opacity-55 transition-transform duration-200
              ${showDropdown ? "rotate-180" : ""}
            `}
          />
        </button>

    
        <div
          className={`
            absolute right-0 top-[calc(100%+6px)]
            z-200
            min-w-55
            rounded-xl
            border border-[#e9e3d3]
            bg-white
            p-2
            shadow-[0_16px_40px_rgba(26,26,26,0.1)]
            transition-all duration-200

            ${
              showDropdown
                ? "visible translate-y-0 opacity-100"
                : "invisible -translate-y-1 opacity-0"
            }
          `}
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
            className="
              flex w-full items-center gap-2.5
              rounded-lg
              px-3 py-2.5
              text-left text-sm
              text-[#1a1a1a]
              transition-colors duration-150

              hover:bg-[#f8f6f1]
            "
          >
            <UserCircle size={18} strokeWidth={1.75} />
            Account Settings
          </Link>

          {/* LOGOUT */}
          <button
            type="button"
            onClick={handleLogout}
            className="
              flex w-full items-center gap-2.5
              rounded-lg
              px-3 py-2.5
              text-left text-sm
              text-[#a33a3a]
              transition-all duration-150

              hover:bg-[#fdf5f5]
              hover:text-[#8b2020]
            "
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