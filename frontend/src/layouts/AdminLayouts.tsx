import { Outlet } from "react-router-dom";
import Sidebar from "../components/admin/Sidebar";
import Header from "../components/admin/Header";

export default function AdminLayouts() {
  return (
    <div 
      className="flex h-screen overflow-hidden p-[26px] gap-[30px]"
      style={{ 
        backgroundColor: "#F2F5F9",
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto w-full custom-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
