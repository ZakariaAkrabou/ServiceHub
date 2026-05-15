import React from "react";
import ProviderLayouts from "../../components/provider/ProviderLayouts";
import { allNotifications } from "../../components/provider/providerNotificationMock";

const ProviderNotifications: React.FC = () => (
  <ProviderLayouts>
    <div className="max-w-2xl">
      <h1 className="mb-1 font-serif text-3xl font-light tracking-tight text-[#1a1a1a]">Notifications</h1>
      <p className="mb-6 text-sm text-[#5f5f5f] sm:text-base">All alerts for your account (mock data).</p>
      <ul className="divide-y divide-[#eceae5] rounded-2xl border border-[#e9e3d3] bg-white shadow-sm">
        {allNotifications.map((n) => (
          <li key={n.id} className="flex gap-3 px-4 py-4 first:rounded-t-2xl last:rounded-b-2xl sm:px-5">
            <span
              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-neutral-300" : "bg-[#c9a84c]"}`}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-[#1a1a1a]">{n.title}</p>
              <p className="mt-0.5 text-sm text-[#5f5f5f]">{n.body}</p>
              <p className="mt-2 text-xs text-neutral-400">{n.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </ProviderLayouts>
);

export default ProviderNotifications;
