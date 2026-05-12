import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/log3.png"; 

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          height: 50px;
          width: auto;
          transition: all 0.4s ease;
          display: block;
        }

        .logo-link:hover .logo-img {
          transform: scale(1.05);
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
          color: rgba(255, 255, 255, 0.7);
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
          color: #ffffff;
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
          <img src={logo} alt="Service Hub" className="logo-img" />
        </Link>

        <nav className="nav-links">
          <Link to="/about">About</Link>
          <a href="#services">Services</a>
          <a href="#pricing">Pricing</a>
        </nav>

        <div className="auth-actions">
          <Link to="/login" className="btn-login">Login</Link>
          <a href="#contact" className="btn-cta">Contact us</a>
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
          <a href="#services" onClick={() => setOpen(false)}>Services</a>
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