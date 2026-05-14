import React from "react";
import ProviderLayouts from "../../components/provider/ProviderLayouts";

const ProviderServices: React.FC = () => (
  <ProviderLayouts>
    <h1
      className="text-3xl font-light tracking-tight mb-2"
      style={{ fontFamily: "'DM Serif Display', 'Times New Roman', serif", color: "#1a1a2e" }}
    >
      Services
    </h1>
    <p style={{ color: "#5c5c6a" }}>Manage the services you offer from this section.</p>
  </ProviderLayouts>
);

export default ProviderServices;
