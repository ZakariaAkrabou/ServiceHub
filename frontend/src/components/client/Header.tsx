import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../app/store/store";
import { logout } from "../../app/slices/AuthSlice";
import { User, LogOut, ChevronDown, UserCircle, Settings, LayoutDashboard, Bell, MessageSquare } from "lucide-react";
import logoServiceHub from "../../assets/log3.png";
import logoBleu from "../../assets/logobleu.png";
import { useLogoutMutation } from "../../app/api/AuthApi";
import { useGetCustomerNotificationsQuery, useMarkCustomerNotificationReadMutation, useMarkAllCustomerNotificationsReadMutation } from "../../app/api/NotificationApi";
import { useSocket, getSocket } from "../../hooks/useSocket";
import { toast } from "react-toastify";

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [logoutMutation] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isLight = location.pathname === "/profile" || location.pathname.startsWith("/services") || location.pathname.startsWith("/bookings") || location.pathname.startsWith("/chat");
  const isCustomer = user?.role === "customer";

  const { data: notifData, refetch: refetchNotifs } = useGetCustomerNotificationsQuery(undefined, { skip: !isAuthenticated || !isCustomer });
  const [markRead] = useMarkCustomerNotificationReadMutation();
  const [markAllRead] = useMarkAllCustomerNotificationsReadMutation();

  type NotificationItem = {
    _id: string;
    is_read: boolean;
    message?: string;
    createdAt?: string;
    booking_id?: { _id?: string } | string | null;
  };

  const notifications: NotificationItem[] = notifData?.data || [];
  const unreadCount = notifications.filter((n: NotificationItem) => !n.is_read).length;

  useSocket(user?._id, user?.role);

  useEffect(() => {
    const socket = getSocket();

    const handleBookingUpdate = (data: { message?: string }) => {
      if (isCustomer) {
        toast.info(data.message || "Booking status updated");
        refetchNotifs();
      }
    };

    socket.on("bookingUpdate", handleBookingUpdate);

    return () => {
      socket.off("bookingUpdate", handleBookingUpdate);
    };
  }, [isCustomer, refetchNotifs]);

  const handleNotifClick = async (notif: NotificationItem) => {
    if (!notif.is_read) {
      await markRead(notif._id);
      refetchNotifs();
    }
    setShowNotifPanel(false);
    const bookingId = typeof notif.booking_id === 'string' ? notif.booking_id : notif.booking_id?._id;
    navigate(`/bookings?highlight=${bookingId}`);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.profile-dropdown-container')) {
        setShowDropdown(false);
      }
    };
    window.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", handleClickOutside);
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

  const headerBase = "fixed top-0 left-0 right-0 z-[1000] flex items-center justify-between font-sans transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]";
  const headerPadding = scrolled
    ? "py-2.5 px-12 max-[1100px]:px-8 max-[1100px]:py-3 max-[900px]:px-6 max-[900px]:py-2.5"
    : "py-3 px-12 max-[1100px]:px-8 max-[1100px]:py-5 max-[900px]:px-6 max-[900px]:py-4";

  let headerBg = "";
  if (isLight) {
    headerBg = scrolled
      ? "bg-white/98 backdrop-blur-xl border-b border-black/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)]"
      : "bg-white/95 backdrop-blur-xl border-b border-black/5 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)]";
  } else {
    headerBg = scrolled
      ? "bg-[#0a0e1c]/75 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]"
      : "bg-[#0a0e1c]/0 backdrop-blur-none border-b border-transparent";
  }
  const headerClass = `${headerBase} ${headerPadding} ${headerBg}`;

  const logoLinkClass = "z-[1100] inline-flex items-center transition-transform duration-300 hover:scale-105 no-underline";
  const logoImgClass = `block w-auto transition-[height] duration-300 ${scrolled ? 'h-8' : 'h-[38px]'}`;

  const navLinksContainerClass = "flex items-center gap-12 m-0 p-0 absolute left-1/2 -translate-x-1/2 list-none max-[1100px]:gap-8 max-[900px]:hidden";

  const getNavLinkClass = (isActive: boolean) => `
    relative py-2 text-[15px] font-medium transition-all duration-300 ease-in-out no-underline
    ${isLight ? 'text-[#1a1a2e] hover:text-[#c9a84c]' : 'text-white/90 hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]'}
    ${isActive && !isLight ? 'text-white' : ''}
    after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:bg-[#c9a84c] after:transition-all after:duration-300 after:ease-[cubic-bezier(0.4,0,0.2,1)] after:rounded-sm after:shadow-[0_0_8px_rgba(201,168,76,0.5)]
    ${isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full'}
  `.replace(/\s+/g, ' ').trim();

  const authActionsClass = "flex items-center gap-5 max-[900px]:hidden";

  const btnLoginClass = `
    text-[14px] font-semibold px-6 py-2.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] backdrop-blur-sm border no-underline inline-block
    ${isLight
      ? 'text-[#1a1a2e] border-[#1a1a2e]/15 bg-[#1a1a2e]/5 hover:bg-[#1a1a2e]/10 hover:-translate-y-[1px]'
      : 'text-white border-white/15 bg-white/5 hover:bg-white/10 hover:border-[#c9a84c]/60 hover:text-[#c9a84c] hover:-translate-y-[1px]'}
  `.replace(/\s+/g, ' ').trim();

  const btnCtaClass = `
    bg-gradient-to-br from-[#c9a84c] to-[#b89539] text-[#1a1a2e] text-[14px] font-bold px-7 py-[11px] rounded-full 
    transition-all duration-300 shadow-[0_4px_15px_rgba(201,168,76,0.25)] border border-white/30 no-underline inline-block
    hover:from-[#d8b75c] hover:to-[#c9a84c] hover:-translate-y-0.5 hover:scale-105 hover:shadow-[0_8px_25px_rgba(201,168,76,0.45)]
  `.replace(/\s+/g, ' ').trim();

  const profileDropdownContainerClass = "profile-dropdown-container relative flex items-center";
  const profileTriggerClass = "flex items-center gap-3 cursor-pointer py-1.5 pl-1.5 pr-3 rounded-full transition-all duration-300 bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-[#c9a84c]/40";
  const profileImgCircledClass = "w-9 h-9 rounded-full object-cover border-2 border-[#c9a84c] bg-[#1a1a2e] flex items-center justify-center overflow-hidden";
  const dropdownMenuClass = `
    absolute top-[calc(100%+14px)] right-0 w-[250px] bg-[#0a0e1c]/95 backdrop-blur-[20px] border border-white/10 rounded-2xl p-3 
    shadow-[0_15px_40px_rgba(0,0,0,0.6)] origin-top-right transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
    ${showDropdown ? 'opacity-100 visible translate-y-0 scale-100' : 'opacity-0 invisible translate-y-3 scale-95'}
  `.replace(/\s+/g, ' ').trim();
  const dropdownHeaderClass = "px-3 pt-2 pb-4 border-b border-white/10 mb-2";
  const userNameClass = "block text-white text-[15px] font-bold tracking-[0.02em]";
  const userRoleClass = "block text-[#c9a84c]/90 text-[12px] font-medium capitalize mt-0.5";
  const dropdownItemClass = "flex items-center gap-3 p-3 text-white/85 text-[14px] font-medium rounded-[10px] transition-all duration-200 cursor-pointer border-none w-full text-left bg-transparent no-underline hover:bg-[#c9a84c]/10 hover:text-[#c9a84c] hover:translate-x-1";
  const dropdownItemLogoutClass = "flex items-center gap-3 p-3 text-[#ff6b6b] text-[14px] font-medium rounded-[10px] transition-all duration-200 cursor-pointer border-none w-full text-left bg-transparent no-underline hover:bg-[#ff6b6b]/10 hover:text-[#ff4d4d] hover:translate-x-1";

  const mobileBtnClass = "hidden max-[900px]:flex bg-transparent border-none cursor-pointer p-2.5 z-[1100] flex-col gap-1.5 group";
  const getMobileSpanClass = (index: number) => {
    const base = `block w-7 h-0.5 transition-all duration-300 ease-in-out rounded-sm group-hover:bg-[#c9a84c]`;
    const bg = open
      ? 'bg-[#c9a84c] shadow-none'
      : (isLight ? 'bg-[#1a1a2e] shadow-none' : 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.5)]');
    if (open) {
      if (index === 1) return `${base} ${bg} translate-y-2 rotate-45`;
      if (index === 2) return `${base} ${bg} opacity-0 translate-x-2.5`;
      if (index === 3) return `${base} ${bg} -translate-y-2 -rotate-45`;
    }
    return `${base} ${bg}`;
  };

  const mobileOverlayClass = `
    fixed top-0 left-0 w-full h-screen bg-[#0a0e1c]/96 backdrop-blur-[25px] flex flex-col items-center justify-center gap-8
    transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] z-[1050]
    ${open ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
  `.replace(/\s+/g, ' ').trim();

  const getMobileNavItemClass = (isActive: boolean, delay: string) => `
    text-white/80 font-sans text-[28px] font-semibold no-underline transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${delay}
    ${open ? 'translate-y-0 opacity-100' : 'translate-y-[30px] opacity-0'}
    hover:text-[#c9a84c] hover:scale-105 hover:-translate-y-[2px]
    ${isActive ? 'text-[#c9a84c] scale-105 -translate-y-[2px]' : ''}
  `.replace(/\s+/g, ' ').trim();

  const mobileAuthClass = `
    mt-[30px] flex flex-col gap-4 w-[80%] max-w-[320px] items-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] delay-200
    ${open ? 'translate-y-0 opacity-100' : 'translate-y-[30px] opacity-0'}
  `.replace(/\s+/g, ' ').trim();

  return (
    <header className={headerClass}>
      <Link to="/" className={logoLinkClass}>
        <img src={isLight ? logoBleu : logoServiceHub} alt="ServiceHub Logo" className={logoImgClass} />
      </Link>

      <nav className={navLinksContainerClass}>
        <Link to="/" className={getNavLinkClass(location.pathname === '/')}>Home</Link>
        <Link to="/services" className={getNavLinkClass(location.pathname.startsWith('/services'))}>Services</Link>
        <Link to="/about" className={getNavLinkClass(location.pathname === '/about')}>About</Link>
      </nav>

      <div className={authActionsClass}>
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            {/* Chat Icon */}
            <Link to="/chat" className="no-underline">
              <button
                className={`w-9.5 h-9.5 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 ${isLight
                    ? 'bg-[#1A1A2E]/5 border border-[#1A1A2E]/10 hover:bg-[#1A1A2E]/10'
                    : 'bg-white/10 border border-white/10 hover:bg-white/20'
                  }`}
                aria-label="Messages"
              >
                <MessageSquare size={16} color={isLight ? '#1A1A2E' : '#ffffff'} />
              </button>
            </Link>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifPanel(!showNotifPanel)}
                className={`w-9.5 h-9.5 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200 ${isLight
                    ? 'bg-[#1A1A2E]/5 border border-[#1A1A2E]/10 hover:bg-[#1A1A2E]/10'
                    : 'bg-white/10 border border-white/10 hover:bg-white/20'
                  }`}
                aria-label="Notifications"
              >
                <Bell size={16} color={isLight ? '#1A1A2E' : '#ffffff'} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#e74c3c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification mini panel */}
              {showNotifPanel && (
                <div className="absolute top-[calc(100%+10px)] right-0 w-[320px] bg-white rounded-[14px] border border-black/5 shadow-[0_12px_32px_rgba(0,0,0,0.12)] p-3 z-2000">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#1A1A2E]">Notifications</span>
                    <div className="flex gap-2">
                      {unreadCount > 0 && (
                        <button onClick={async () => { await markAllRead(); refetchNotifs(); }} className="bg-transparent border-none cursor-pointer text-[#3498db] text-[11px] font-semibold">Mark all read</button>
                      )}
                      <button onClick={() => setShowNotifPanel(false)} className="bg-transparent border-none cursor-pointer text-[#888] text-[16px] leading-none">&times;</button>
                    </div>
                  </div>

                  {notifications.length > 0 ? (
                    <div className="max-h-75 overflow-y-auto flex flex-col gap-2 custom-scrollbar">
                      {notifications.map((notif: NotificationItem) => (
                        <div
                          key={notif._id}
                          onClick={() => handleNotifClick(notif)}
                          className={`p-2.5 rounded-lg cursor-pointer flex items-start gap-2.5 transition-all duration-200 ${notif.is_read
                              ? 'bg-transparent border border-transparent'
                              : 'bg-[#c9a84c]/5 border border-[#c9a84c]/20'
                            }`}
                        >
                          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.is_read ? 'bg-transparent' : 'bg-[#c9a84c]'}`}></div>
                          <div>
                            <p className={`m-0 text-[13px] text-[#1a1a2e] leading-[1.4] ${notif.is_read ? 'font-normal' : 'font-semibold'}`}>
                              {notif.message}
                            </p>
                            <span className="text-[11px] text-[#888] mt-1 block">
                              {notif.createdAt ? new Date(notif.createdAt).toLocaleString() : ''}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5 text-black/35 text-[12px]">
                      <Bell size={20} className="mx-auto mb-1.5 opacity-30" />
                      <p>No new notifications</p>
                    </div>
                  )}

                  <Link
                    to="/bookings"
                    onClick={() => setShowNotifPanel(false)}
                    className="block text-center mt-3 text-[12px] font-bold text-[#C9A84C] no-underline py-2 border-t border-black/5"
                  >
                    View All Bookings &rarr;
                  </Link>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className={profileDropdownContainerClass}>
              <div className={profileTriggerClass} onClick={(e) => {
                e.stopPropagation();
                setShowDropdown(!showDropdown);
              }}>
                <div className={profileImgCircledClass}>
                  {user?.image ? (
                    <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={20} className="text-[#c9a84c]" />
                  )}
                </div>
                <ChevronDown size={16} className={`transition-transform duration-300 ${isLight ? 'text-[#1A1A2E]' : 'text-white'} ${showDropdown ? 'rotate-180' : ''}`} />
              </div>

              <div className={dropdownMenuClass}>
                <div className={dropdownHeaderClass}>
                  <span className={userNameClass}>{user?.firstName} {user?.lastName}</span>
                  <span className={userRoleClass}>{user?.role?.replace('_', ' ')}</span>
                </div>
                <Link to="/profile" className={dropdownItemClass}>
                  <UserCircle size={18} />
                  My Profile
                </Link>
                {user?.role === 'service_provider' && (
                  <Link to="/provider/dashboard" className={dropdownItemClass}>
                    <LayoutDashboard size={18} />
                    Provider Dashboard
                  </Link>
                )}
                <Link to="/settings" className={dropdownItemClass}>
                  <Settings size={18} />
                  Settings
                </Link>
                <button onClick={handleLogout} className={dropdownItemLogoutClass}>
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <Link to="/login" className={btnLoginClass}>Login</Link>
            <Link to="/register?tab=provider" className={btnCtaClass}>Join as Provider</Link>
          </>
        )}
      </div>

      <button
        className={mobileBtnClass}
        onClick={() => setOpen(!open)}
        aria-label="Toggle Menu"
      >
        <span className={getMobileSpanClass(1)}></span>
        <span className={getMobileSpanClass(2)}></span>
        <span className={getMobileSpanClass(3)}></span>
      </button>

      <div className={mobileOverlayClass}>
        <Link to="/" className={getMobileNavItemClass(location.pathname === '/', 'delay-100')} onClick={() => setOpen(false)}>Home</Link>
        <Link to="/services" className={getMobileNavItemClass(location.pathname.startsWith('/services'), 'delay-150')} onClick={() => setOpen(false)}>Services</Link>
        <Link to="/about" className={getMobileNavItemClass(location.pathname === '/about', 'delay-200')} onClick={() => setOpen(false)}>About</Link>

        <div className={mobileAuthClass}>
          {isAuthenticated ? (
            <Link to="/profile" className={btnCtaClass + " w-full text-center block"} onClick={() => setOpen(false)}>My Profile</Link>
          ) : (
            <>
              <Link to="/login" className="text-white font-semibold text-[15px] no-underline py-2" onClick={() => setOpen(false)}>Login</Link>
              <Link to="/register?tab=provider" className={btnCtaClass + " w-full text-center block"} onClick={() => setOpen(false)}>Join as Provider</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;