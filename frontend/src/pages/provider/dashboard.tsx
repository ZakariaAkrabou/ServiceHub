import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store/store";
import ProviderLayouts from "../../components/provider/ProviderLayouts";

const ProviderDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <ProviderLayouts>
      <h1
        className="text-3xl md:text-4xl font-light tracking-tight mb-3"
        style={{ fontFamily: "'DM Serif Display', 'Times New Roman', serif", color: "#1a1a2e" }}
      >
        Welcome back{user?.firstName ? `, ${user.firstName}` : ""}
      </h1>
      <p className="text-base max-w-xl" style={{ color: "#5c5c6a" }}>
        Manage your services and bookings from this workspace.
      </p>
    </ProviderLayouts>
  );
};

export default ProviderDashboard;
