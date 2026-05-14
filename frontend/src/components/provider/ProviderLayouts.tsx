import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import ProviderProfileBar from "./header";
import ProviderSidebar from "./sidebar";
import logoServiceHub from "../../assets/log3.png";
import { Menu } from "lucide-react";

const SIDEBAR_WIDTH = 252;

const ProviderLayouts: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Serif+Display:ital@0;1&display=swap');

        .pl-root {
          --ink: #1a1a2e;
          --line: #e3e0d8;
          --paper: #faf9f7;
          --card: #ffffff;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--paper);
          color: var(--ink);
          font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .pl-top {
          display: flex;
          align-items: stretch;
          flex-shrink: 0;
          min-height: 56px;
          background: #fff;
          position: sticky;
          top: 0;
          z-index: 130;
        }

        .pl-top-brand {
          width: ${SIDEBAR_WIDTH}px;
          flex-shrink: 0;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 16px 0 18px;
          background: var(--paper);
          border-right: 1px solid var(--line);
        }

        .pl-top-menu {
          display: none;
          width: 40px;
          height: 40px;
          padding: 0;
          border: 1px solid var(--line);
          border-radius: 8px;
          background: #fff;
          color: var(--ink);
          cursor: pointer;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .pl-top-menu:hover {
          border-color: #c9a84c;
        }
        @media (max-width: 1024px) {
          .pl-top-menu { display: inline-flex; }
        }

        .pl-top-logo {
          display: inline-flex;
          align-items: center;
          height: 40px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .pl-top-logo img {
          height: 40px;
          width: auto;
          display: block;
          object-fit: contain;
          object-position: left center;
        }

        .pl-top-rest {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          padding: 0 20px;
          min-width: 0;
          background: #fff;
        }

        .pl-body {
          display: flex;
          flex: 1;
          min-height: 0;
        }

        .pl-sidebar-wrap {
          width: ${SIDEBAR_WIDTH}px;
          flex-shrink: 0;
          background: var(--paper);
          border-right: 1px solid var(--line);
        }

        .pl-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          min-height: 0;
          background: var(--card);
        }

        .pl-content {
          flex: 1;
          padding: 28px 36px 48px;
        }

        @media (max-width: 1024px) {
          .pl-sidebar-wrap {
            position: fixed;
            top: 56px;
            bottom: 0;
            left: 0;
            width: min(${SIDEBAR_WIDTH}px, 90vw);
            z-index: 200;
            transform: translateX(-100%);
            transition: transform 0.3s ease;
            pointer-events: none;
            box-shadow: 8px 0 32px rgba(26, 26, 46, 0.08);
          }
          .pl-sidebar-wrap.pl-sidebar-open {
            transform: translateX(0);
            pointer-events: auto;
          }
          .pl-content {
            padding: 22px 20px 40px;
          }
        }
      `}</style>

      <div className="pl-root">
        <div className="pl-top">
          <div className="pl-top-brand">
            <button
              type="button"
              className="pl-top-menu"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={20} strokeWidth={2} />
            </button>
            <Link to="/" className="pl-top-logo">
              <img src={logoServiceHub} alt="" />
            </Link>
          </div>
          <div className="pl-top-rest">
            <ProviderProfileBar />
          </div>
        </div>

        <div className="pl-body">
          {sidebarOpen && (
            <button
              type="button"
              className="fixed inset-0 z-190 lg:hidden border-0 cursor-pointer p-0 m-0"
              style={{ background: "rgba(26, 26, 46, 0.22)", top: "56px" }}
              aria-label="Close menu"
              onClick={closeSidebar}
            />
          )}

          <div className={`pl-sidebar-wrap ${sidebarOpen ? "pl-sidebar-open" : ""}`}>
            <ProviderSidebar width={SIDEBAR_WIDTH} onNavigate={closeSidebar} />
          </div>

          <div className="pl-main">
            <main className="pl-content">{children}</main>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProviderLayouts;
