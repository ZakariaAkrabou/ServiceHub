import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";

import ProviderProfileBar from "./header";
import ProviderSidebar from "./sidebar";

import logoServiceHub from "../../assets/log3.png";

const SIDEBAR_WIDTH = 252;

const ProviderLayouts: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f6f1] text-[#1a1a2e] font-sans">
      {/* TOPBAR */}
      <header className="sticky top-0 z-130 flex min-h-14 items-center bg-white">
        {/* LEFT BRAND */}
        <div
          className="
            flex min-h-14 shrink-0 items-center
            border-r border-[#e9e3d3]
            bg-[#f8f6f1]
            px-4.5
            lg:w-63
          "
        >
          {/* MOBILE MENU */}
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
            className="
              hidden
              h-10 w-10
              items-center justify-center
              rounded-lg
              border border-[#e9e3d3]
              bg-white
              text-[#1a1a2e]
              transition-colors
              hover:border-[#c9a84c]

              max-lg:inline-flex
            "
          >
            <Menu size={20} strokeWidth={2} />
          </button>

          {/* LOGO */}
          <Link
            to="/"
            className="
              inline-flex h-10 items-center

              max-lg:hidden
            "
          >
            <img
              src={logoServiceHub}
              alt="ServiceHub"
              className="h-10 w-auto object-contain object-left"
            />
          </Link>
        </div>

        {/* RIGHT */}
        <div
          className="
            flex flex-1 items-center justify-end
            bg-white
            px-5

            max-lg:min-w-0
            max-lg:px-3
          "
        >
          <ProviderProfileBar />
        </div>
      </header>

      {/* BODY */}
      <div className="flex flex-1 min-h-0">
        {/* MOBILE OVERLAY */}
        {sidebarOpen && (
          <button
            type="button"
            aria-label="Close menu"
            onClick={closeSidebar}
            className="
              fixed inset-0 z-190
              border-0 p-0 m-0
              cursor-pointer
              bg-[rgba(26,26,46,0.22)]

              lg:hidden
            "
            style={{ top: "56px" }}
          />
        )}

        <aside
          className={`
            bg-[#f8f6f1]
            border-r border-[#e9e3d3]
            shrink-0

            lg:relative
            lg:translate-x-0
            lg:w-63

            max-lg:fixed
            max-lg:left-0
            max-lg:top-14
            max-lg:bottom-0
            max-lg:z-200
            max-lg:w-[min(252px,90vw)]
            max-lg:shadow-[8px_0_32px_rgba(26,26,46,0.08)]
            max-lg:transition-transform
            max-lg:duration-300
            ${sidebarOpen ? "pv-s-open max-lg:translate-x-0" : "max-lg:-translate-x-full"}
          `}
        >
          <ProviderSidebar
            width={SIDEBAR_WIDTH}
            onNavigate={closeSidebar}
            sidebarOpen={sidebarOpen}
          />
        </aside>

        {/* MAIN */}
        <div className="flex flex-1 min-w-0 flex-col bg-white">
          <main
            className="
              flex-1
              px-9
              pt-7
              pb-12

              max-lg:px-5
              max-lg:pt-5.5
              max-lg:pb-10
            "
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProviderLayouts;
