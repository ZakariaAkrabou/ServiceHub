import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header";

export default function AdminLayouts() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div
      className="flex h-screen overflow-hidden p-4 lg:p-6.5 gap-4 lg:gap-7.5 relative"
      style={{
        backgroundColor: "#F3F3F3",
        fontFamily: "'Times New Roman', sans-serif, Geist, 'Geist Placeholder', Inter, 'Inter Placeholder', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji', ui-sans-serif, system-ui",
      }}
    >
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/40 z-30 transition-opacity xl:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <div 
        className={`fixed inset-y-4 left-4 z-40 transform transition-transform duration-300 ease-in-out xl:relative xl:inset-y-0 xl:left-0 xl:z-0 xl:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-[150%]"
        }`}
      >
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto w-full custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}