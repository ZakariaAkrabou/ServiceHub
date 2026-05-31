import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../app/store/store";
import { logout } from "../../app/slices/AuthSlice";
import { User, LogOut, ChevronDown, UserCircle, Settings, LayoutDashboard, Bell } from "lucide-react";
import logoServiceHub from "../../assets/log3.png";
import logoBleu from "../../assets/logobleu.png";
import { useLogoutMutation } from "../../app/api/AuthApi";

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

  const isLight = location.pathname === "/profile";

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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&display=swap');

        .header-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 24px 48px;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: 'DM Sans', sans-serif;
          background: rgba(10, 14, 28, 0);
          backdrop-filter: blur(0px);
          -webkit-backdrop-filter: blur(0px);
          border-bottom: 1px solid transparent;
        }

        .header-container.scrolled {
          padding: 14px 48px;
          background: rgba(10, 14, 28, 0.75);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.5);
        }

        .logo-link {
          text-decoration: none;
          z-index: 1100;
          display: inline-flex;
          align-items: center;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .logo-link:hover {
          transform: scale(1.05);
        }

        .logo-img {
          height: 45px;
          width: auto;
          transition: height 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          display: block;
          filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
        }

        .header-container.scrolled .logo-img {
          height: 36px;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 48px;
          list-style: none;
          margin: 0;
          padding: 0;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }

        .nav-links a {
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
          font-size: 14.5px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          transition: all 0.3s ease;
          position: relative;
          padding: 8px 0;
        }

        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: #c9a84c;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateX(-50%);
          border-radius: 2px;
          box-shadow: 0 0 8px rgba(201, 168, 76, 0.5);
        }

        .nav-links a:hover {
          color: #ffffff;
          text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
        }

        .nav-links a:hover::after {
          width: 100%;
        }

        .auth-actions {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .btn-login {
          color: #ffffff;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          padding: 10px 24px;
          border-radius: 100px;
          transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(4px);
        }

        .btn-login:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(201, 168, 76, 0.6);
          color: #c9a84c;
          transform: translateY(-1px);
        }

        .btn-cta {
          background: linear-gradient(135deg, #c9a84c 0%, #b89539 100%);
          color: #1a1a2e;
          text-decoration: none;
          font-size: 14px;
          font-weight: 700;
          padding: 11px 28px;
          border-radius: 100px;
          transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
          box-shadow: 0 4px 15px rgba(201, 168, 76, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .btn-cta:hover {
          background: linear-gradient(135deg, #d8b75c 0%, #c9a84c 100%);
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 25px rgba(201, 168, 76, 0.45);
        }

        .profile-dropdown-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .profile-trigger {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          padding: 6px 12px 6px 6px;
          border-radius: 100px;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
        }

        .profile-trigger:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(201, 168, 76, 0.4);
        }

        .profile-image-circled {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #c9a84c;
          background: #1a1a2e;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 10px rgba(201, 168, 76, 0.3);
        }

        .dropdown-menu {
          position: absolute;
          top: calc(100% + 14px);
          right: 0;
          width: 250px;
          background: rgba(10, 14, 28, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 12px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
          opacity: 0;
          visibility: hidden;
          transform: translateY(12px) scale(0.95);
          transform-origin: top right;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .dropdown-menu.active {
          opacity: 1;
          visibility: visible;
          transform: translateY(0) scale(1);
        }

        .dropdown-header {
          padding: 8px 12px 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          margin-bottom: 8px;
        }

        .user-name {
          display: block;
          color: #ffffff;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .user-role {
          display: block;
          color: rgba(201, 168, 76, 0.9);
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 2px;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          color: rgba(255, 255, 255, 0.85);
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          border-radius: 10px;
          transition: all 0.2s ease;
          cursor: pointer;
          border: none;
          width: 100%;
          text-align: left;
          background: transparent;
        }

        .dropdown-item:hover {
          background: rgba(201, 168, 76, 0.1);
          color: #c9a84c;
          transform: translateX(4px);
        }

        .dropdown-item.logout {
          color: #ff6b6b;
        }

        .dropdown-item.logout:hover {
          background: rgba(255, 107, 107, 0.1);
          color: #ff4d4d;
        }

        .header-container.light {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .header-container.light.scrolled {
          background: rgba(255, 255, 255, 0.98);
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.1);
        }



        .header-container.light .nav-links a {
          color: #1a1a2e;
        }

        .header-container.light .nav-links a:hover {
          color: #c9a84c;
          text-shadow: none;
        }

        .header-container.light .btn-login {
          color: #1a1a2e;
          border-color: rgba(26,26,46,0.15);
          background: rgba(26,26,46,0.05);
        }

        .header-container.light .btn-login:hover {
          background: rgba(26,26,46,0.1);
        }

        .header-container.light .mobile-btn span {
          background: #1a1a2e;
        }

        .header-container.light .mobile-btn.active span {
          background: #c9a84c;
        }

        /* Mobile Menu Button */
        .mobile-btn {
          display: none;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 10px;
          z-index: 1100;
          flex-direction: column;
          gap: 6px;
        }

        .mobile-btn span {
          display: block;
          width: 28px;
          height: 2px;
          background: #ffffff;
          transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          border-radius: 2px;
        }

        .mobile-btn:hover span {
          background: #c9a84c;
        }

        .mobile-btn.active span:nth-child(1) {
          transform: translateY(8px) rotate(45deg);
          background: #c9a84c;
        }

        .mobile-btn.active span:nth-child(2) {
          opacity: 0;
          transform: translateX(10px);
        }

        .mobile-btn.active span:nth-child(3) {
          transform: translateY(-8px) rotate(-45deg);
          background: #c9a84c;
        }

        /* Mobile Overlay */
        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: rgba(10, 14, 28, 0.96);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 32px;
          opacity: 0;
          visibility: hidden;
          transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
          z-index: 1050;
        }

        .mobile-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        .mobile-overlay a.nav-item {
          color: rgba(255, 255, 255, 0.8);
          font-family: 'DM Sans', sans-serif;
          font-size: 28px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          transform: translateY(30px);
          opacity: 0;
        }

        .mobile-overlay.active a.nav-item {
          transform: translateY(0);
          opacity: 1;
        }

        .mobile-overlay.active a.nav-item:nth-child(1) { transition-delay: 0.1s; }
        .mobile-overlay.active a.nav-item:nth-child(2) { transition-delay: 0.15s; }
        .mobile-overlay.active a.nav-item:nth-child(3) { transition-delay: 0.2s; }

        .mobile-overlay a.nav-item:hover {
          color: #c9a84c;
          transform: scale(1.05) translateY(-2px);
        }

        .mobile-overlay .mobile-auth {
          margin-top: 30px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 80%;
          max-width: 320px;
          align-items: center;
          transform: translateY(30px);
          opacity: 0;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.25s;
        }

        .mobile-overlay.active .mobile-auth {
          transform: translateY(0);
          opacity: 1;
        }

        @media (max-width: 1100px) {
          .nav-links { gap: 32px; }
          .header-container { padding: 20px 32px; }
          .header-container.scrolled { padding: 12px 32px; }
        }

        @media (max-width: 900px) {
          .header-container { padding: 16px 24px; }
          .header-container.scrolled { padding: 10px 24px; }
          .nav-links, .auth-actions { display: none; }
          .mobile-btn { display: flex; }
        }
      `}</style>

      <header className={`header-container ${scrolled ? 'scrolled' : ''} ${isLight ? 'light' : ''}`}>
        <Link to="/" className="logo-link">
          <img src={isLight ? logoBleu : logoServiceHub} alt="ServiceHub Logo" className="logo-img" />
        </Link>

        <nav className="nav-links">
            <a href="/">Home</a>
        
          <Link to="/services">Services</Link>
            <Link to="/about">About</Link>
        
        </nav>

        <div className="auth-actions">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Notification Bell */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowNotifPanel(!showNotifPanel)}
                  style={{
                    width: 38, height: 38, borderRadius: '50%',
                    background: isLight ? 'rgba(26,26,46,0.05)' : 'rgba(255,255,255,0.08)',
                    border: isLight ? '1px solid rgba(26,26,46,0.12)' : '1px solid rgba(255,255,255,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.2s ease'
                  }}
                  aria-label="Notifications"
                >
                  <Bell size={16} color={isLight ? '#1A1A2E' : '#ffffff'} />
                </button>
                {/* Notification mini panel */}
                {showNotifPanel && (
                  <div style={{
                    position: 'absolute', top: 'calc(100% + 10px)', right: 0,
                    width: 280, background: '#ffffff', borderRadius: 14,
                    border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
                    padding: '12px', zIndex: 2000
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#1A1A2E' }}>Notifications</span>
                      <button onClick={() => setShowNotifPanel(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 16 }}>×</button>
                    </div>
                    <div style={{ textAlign: 'center', padding: '20px 0', color: 'rgba(0,0,0,0.35)', fontSize: 12 }}>
                      <Bell size={20} style={{ margin: '0 auto 6px', opacity: 0.3 }} />
                      <p>No new notifications</p>
                    </div>
                    <Link
                      to="/bookings"
                      onClick={() => setShowNotifPanel(false)}
                      style={{
                        display: 'block', textAlign: 'center', marginTop: 8,
                        fontSize: 11, fontWeight: 700, color: '#C9A84C',
                        textDecoration: 'none', padding: '6px 0'
                      }}
                    >
                      View My Bookings →
                    </Link>
                  </div>
                )}
              </div>

              {/* Profile dropdown */}
              <div className="profile-dropdown-container">
                <div className="profile-trigger" onClick={(e) => {
                  e.stopPropagation();
                  setShowDropdown(!showDropdown);
                }}>
                  <div className="profile-image-circled">
                    {user?.image ? (
                      <img src={user.image} alt="Profile" className="w-full h-full rounded-full" />
                    ) : (
                      <User size={20} className="text-[#F6E304]" />
                    )}
                  </div>
                  <ChevronDown size={16} className={`transition-transform ${isLight ? 'text-[#1A1A2E]' : 'text-white'} ${showDropdown ? 'rotate-180' : ''}`} />
                </div>

                <div className={`dropdown-menu ${showDropdown ? 'active' : ''}`}>
                  <div className="dropdown-header">
                    <span className="user-name">{user?.firstName} {user?.lastName}</span>
                    <span className="user-role">{user?.role?.replace('_', ' ')}</span>
                  </div>
                  <Link to="/profile" className="dropdown-item">
                    <UserCircle size={18} />
                    My Profile
                  </Link>
                  {user?.role === 'service_provider' && (
                    <Link to="/provider/dashboard" className="dropdown-item">
                      <LayoutDashboard size={18} />
                      Provider Dashboard
                    </Link>
                  )}
                  <Link to="/settings" className="dropdown-item">
                    <Settings size={18} />
                    Settings
                  </Link>
                  <button onClick={handleLogout} className="dropdown-item logout">
                    <LogOut size={18} />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-login">Login</Link>
              <a href="#contact" className="btn-cta">Contact us</a>
            </>
          )}
        </div>

        <button 
          className={`mobile-btn ${open ? 'active' : ''}`} 
          onClick={() => setOpen(!open)}
          aria-label="Toggle Menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`mobile-overlay ${open ? 'active' : ''}`}>
          <a href="/" className="nav-item" onClick={() => setOpen(false)}>Home</a>
          
          <Link to="/services" className="nav-item" onClick={() => setOpen(false)}>Services</Link>
          <Link to="/about" className="nav-item" onClick={() => setOpen(false)}>About</Link>
    
          <div className="mobile-auth">
            <Link to="/login" className="btn-login" style={{ width: '100%', textAlign: 'center' }} onClick={() => setOpen(false)}>Login</Link>
            <a href="#contact" className="btn-cta" style={{ width: '100%', textAlign: 'center' }} onClick={() => setOpen(false)}>Contact us</a>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;