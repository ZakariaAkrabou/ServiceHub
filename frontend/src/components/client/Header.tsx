import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../app/store/store";
import { logout } from "../../app/slices/AuthSlice";
import { User, LogOut, ChevronDown, UserCircle, Settings, LayoutDashboard } from "lucide-react";
import logoServiceHub from "../../assets/log3.png";
import { useLogoutMutation } from "../../app/api/AuthApi";

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [logoutMutation] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        .header-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 28px 48px;
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: 'DM Sans', sans-serif;
          background: rgba(10, 10, 10, 0);
          backdrop-filter: blur(0px);
          -webkit-backdrop-filter: blur(0px);
          border-bottom: 1px solid transparent;
        }

        .header-container.scrolled {
          padding: 12px 48px;
          background: rgba(10, 10, 10, 0.4);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .logo-link {
          text-decoration: none;
          z-index: 1100;
          display: inline-flex;
          align-items: center;
        }

        .logo-img {
          height: 100px;
          width: auto;
          transition: all 0.4s ease;
          display: block;
        }

        .header-container.scrolled .logo-text {
          font-size: 22px;
        }

        .logo-link:hover .logo-text,
        .logo-link:hover .logo-img {
          transform: scale(1.05);
        }

        .logo-img {
          height: 40px;
          width: auto;
          transition: all 0.4s ease;
          display: block;
        }

        .header-container.scrolled .logo-img {
          height: 32px;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 40px;
          list-style: none;
          margin: 0;
          padding: 0;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }

        .nav-links a {
          color: #ffffff;
          text-decoration: none;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.03em;
          transition: all 0.3s ease;
          position: relative;
          padding: 8px 0;
        }

        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background: #c9a84c;
          transition: width 0.3s ease;
          border-radius: 2px;
        }

        .nav-links a:hover {
          color: #ffffff;
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
          font-weight: 500;
          padding: 10px 24px;
          border-radius: 100px;
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.05);
        }

        .btn-login:hover {
          background: rgba(255, 255, 255, 0.12);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-1px);
        }

        .btn-cta {
          background: #ffffff;
          color: #0a0a0a;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          padding: 12px 28px;
          border-radius: 100px;
          transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);
          box-shadow: 0 4px 15px rgba(246, 227, 4, 0.25);
        }

        .btn-cta:hover {
          background: #ffffff;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
        }

        .profile-dropdown-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .profile-trigger {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          padding: 6px;
          border-radius: 100px;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .profile-trigger:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .profile-image-circled {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #F6E304;
          background: #1a1a1a;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dropdown-menu {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: 240px;
          background: #1a1a1a;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5);
          opacity: 0;
          visibility: hidden;
          transform: translateY(10px);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .dropdown-menu.active {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
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
          font-weight: 600;
        }

        .user-role {
          display: block;
          color: rgba(255, 255, 255, 0.5);
          font-size: 12px;
          text-transform: capitalize;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          color: rgba(255, 255, 255, 0.8);
          text-decoration: none;
          font-size: 14px;
          border-radius: 10px;
          transition: all 0.2s ease;
          cursor: pointer;
          border: none;
          width: 100%;
          text-align: left;
          background: transparent;
        }

        .dropdown-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #F6E304;
        }

        .dropdown-item.logout {
          color: #ff4d4d;
        }

        .dropdown-item.logout:hover {
          background: rgba(255, 77, 77, 0.1);
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
          width: 26px;
          height: 2px;
          background: #ffffff;
          transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
          border-radius: 2px;
        }

        .mobile-btn.active span:nth-child(1) {
          transform: translateY(8px) rotate(45deg);
        }

        .mobile-btn.active span:nth-child(2) {
          opacity: 0;
          transform: translateX(-10px);
        }

        .mobile-btn.active span:nth-child(3) {
          transform: translateY(-8px) rotate(-45deg);
        }

        /* Mobile Overlay */
        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100vh;
          background: #0a0a0a;
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

        .mobile-overlay a {
          color: #c9a84c;
          font-family: 'DM Serif Display', serif;
          font-size: 32px;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .mobile-overlay a:hover {
          color: #c9a84c;
        }

        .mobile-overlay .mobile-auth {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 80%;
          align-items: center;
        }

        @media (max-width: 1100px) {
          .nav-links { gap: 25px; }
        }

        @media (max-width: 900px) {
          .header-container { padding: 20px 24px; }
          .nav-links, .auth-actions { display: none; }
          .mobile-btn { display: flex; }
        }
      `}</style>

      <header className={`header-container ${scrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="logo-link">
          <img src={logoServiceHub} alt="ServiceHub Logo" className="logo-img" />
        </Link>

        <nav className="nav-links">
          <Link to="/about">About</Link>
          <Link to="/services">Services</Link>
          <a href="#pricing">Pricing</a>
        </nav>

        <div className="auth-actions">
          {isAuthenticated ? (
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
                <ChevronDown size={16} className={`text-white transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
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
          <Link to="/about" onClick={() => setOpen(false)}>About</Link>
          <Link to="/services" onClick={() => setOpen(false)}>Services</Link>
          <a href="#pricing" onClick={() => setOpen(false)}>Pricing</a>
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