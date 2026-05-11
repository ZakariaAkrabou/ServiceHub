import React, { useState } from "react";

const Header: React.FC = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

        .header-wrapper {
          position: relative;
          z-index: 100;
          font-family: 'DM Sans', sans-serif;
        }

        .hero-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 48px;
          background: transparent;
        }

        .hero-nav-logo {
          font-family: 'DM Serif Display', serif;
          font-size: 22px;
          color: #f6e304;
          letter-spacing: -0.5px;
        }

        .hero-nav-links {
          display: flex;
          gap: 28px;
          list-style: none;
          margin: 0;
          padding: 0;
          align-items: center;
        }
        .hero-nav-links a {
          text-decoration: none;
          color: #ffffff;
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 0.01em;
          transition: color 0.2s;
        }
        .hero-nav-links a:hover { color: #f6e304; }

        .hero-nav-cta {
          background: #ffffff;
          color: #1a1a1a;
          border: none;
          padding: 10px 18px;
          border-radius: 100px;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
        }
        .hero-nav-cta:hover { background: #f0ede8; transform: scale(1.02); }

        /* ── Hamburger ── */
        .menu-toggle {
          display: none;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 8px;
          z-index: 110;
        }
        .menu-toggle .bar {
          display: block;
          width: 22px;
          height: 2px;
          margin: 5px 0;
          background: #ffffff;
          border-radius: 2px;
          transition: transform 0.25s ease, opacity 0.2s ease;
        }

        /* ── Mobile menu — hidden by default ── */
        .mobile-menu {
          display: none;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: rgba(10, 10, 10, 0.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          padding: 20px 24px 24px;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
          border-top: 1px solid rgba(255,255,255,0.08);
          animation: slideDown 0.22s ease forwards;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .mobile-menu.open { display: block; }

        .mobile-menu ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .mobile-menu li a {
          display: block;
          color: #ffffff;
          text-decoration: none;
          font-size: 16px;
          font-weight: 400;
          padding: 10px 4px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          transition: color 0.18s;
        }
        .mobile-menu li:last-child a {
          border-bottom: none;
        }
        .mobile-menu li a:hover { color: #f6e304; }

        .mobile-cta {
          display: block;
          margin-top: 16px;
          background: #ffffff;
          color: #1a1a1a !important;
          border-radius: 100px;
          text-align: center;
          padding: 12px 18px !important;
          font-weight: 500 !important;
          font-size: 14px !important;
          border-bottom: none !important;
        }
        .mobile-cta:hover { background: #f0ede8; color: #1a1a1a !important; }

        /* ── Breakpoint ── */
        @media (max-width: 768px) {
          .hero-nav {
            padding: 14px 20px;
          }
          .hero-nav-links { display: none; }
          .hero-nav-cta   { display: none; }
          .menu-toggle    { display: block; }
        }
      `}</style>

            <div className="header-wrapper">
                <nav className="hero-nav">
                    <div className="hero-nav-logo">SERVICES</div>

                
                    <ul className="hero-nav-links">
                        <li><a href="#">About</a></li>
                        <li><a href="#">Services</a></li>
                        <li><a href="#">Pricing</a></li>
                    </ul>

                    <button
                        className="menu-toggle"
                        aria-label="Toggle menu"
                        aria-expanded={open}
                        onClick={() => setOpen(!open)}
                    >
                        <span className="bar" style={{ transform: open ? 'rotate(45deg) translate(0, 7px)' : 'none' }} />
                        <span className="bar" style={{ opacity: open ? 0 : 1, transform: open ? 'scaleX(0)' : 'none' }} />
                        <span className="bar" style={{ transform: open ? 'rotate(-45deg) translate(0, -7px)' : 'none' }} />
                    </button>

                  
                    <button className="hero-nav-cta">Contact us</button>
                </nav>

                <div className={"mobile-menu" + (open ? " open" : "")} role="navigation" aria-label="Mobile menu">
                    <ul>
                        <li><a href="#" onClick={() => setOpen(false)}>About</a></li>
                        <li><a href="#" onClick={() => setOpen(false)}>Services</a></li>
                        <li><a href="#" onClick={() => setOpen(false)}>Pricing</a></li>
                        <li><a href="#" onClick={() => setOpen(false)} className="mobile-cta">Contact us</a></li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Header;