import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store/store";
import ProviderLayouts from "../../components/provider/ProviderLayouts";
import {
  Briefcase,
  CalendarCheck,
  Star,
  Users,
  TrendingUp,
  ArrowRight,
  MoreHorizontal
} from "lucide-react";
import {
  providerSummary,
  recentBookings,
  recentClients,
  servicesTable,
  type BookingRow,
} from "./data/providerOverviewMock";

function statusBadge(status: BookingRow["status"]) {
  const styles: Record<BookingRow["status"], string> = {
    pending: "bg-amber-50 text-amber-700 ring-amber-200/50",
    confirmed: "bg-blue-50 text-blue-700 ring-blue-200/50",
    completed: "bg-emerald-50 text-emerald-700 ring-emerald-200/50",
    rejected: "",
    cancelled: ""
  };
  
  const dotStyles: Record<BookingRow["status"], string> = {
    pending: "bg-amber-500",
    confirmed: "bg-blue-500",
    completed: "bg-emerald-500",
    rejected: "",
    cancelled: ""
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${styles[status]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dotStyles[status]}`} aria-hidden />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

const ProviderDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const first = user?.firstName ?? "there";

  return (
    <ProviderLayouts>
      <div className="flex w-full min-w-0 flex-col gap-8 pb-10">
        {/* Page header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between animate-fade-in-up">
          <div className="min-w-0 max-w-2xl">
            <h1 className="font-sans text-3xl font-bold tracking-tight text-[#1a1a1a] sm:text-4xl">
              Welcome back, <span className="text-transparent bg-clip-text bg-linear-to-r from-[#c9a84c] to-[#e4c97c] font-extrabold">{first}</span>
            </h1>
            <p className="mt-2 text-[15px] leading-relaxed text-[#5f5f5f] sm:text-base">
              Here's an overview of your <span className="font-medium text-[#1a1a1a]">services</span>, <span className="font-medium text-[#1a1a1a]">bookings</span>, and <span className="font-medium text-[#1a1a1a]">clients</span> — everything you need to manage your business effectively today.
            </p>
          </div>
          <Link
            to="/provider/bookings"
            className="group inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-full bg-[#1a1a1a] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-[#c9a84c] hover:shadow-md sm:self-auto"
          >
            View all bookings
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1 */}
          <div className="group relative overflow-hidden rounded-2xl border border-[#e9e3d3] bg-white p-4 sm:p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-linear-to-br from-[#fcfbf8] to-[#f4f1eb] opacity-50 transition-transform group-hover:scale-150" />
            <div className="relative">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#faf9f7] ring-1 ring-[#e9e3d3] transition-colors group-hover:bg-[#c9a84c]/10 group-hover:ring-[#c9a84c]/30">
                  <Briefcase className="h-4 w-4 text-[#c9a84c]" strokeWidth={2} />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs font-medium text-[#5f5f5f]">Services listed</p>
                <div className="mt-0.5 flex items-baseline gap-2">
                  <h3 className="font-serif text-2xl font-semibold text-[#1a1a1a]">{providerSummary.servicesListed}</h3>
                </div>
                <p className="mt-0.5 text-xs text-[#5f5f5f]"><span className="font-medium text-[#1a1a1a]">{providerSummary.activeServices}</span> active on profile</p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group relative overflow-hidden rounded-2xl border border-[#e9e3d3] bg-white p-4 sm:p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-linear-to-br from-[#fcfbf8] to-[#f4f1eb] opacity-50 transition-transform group-hover:scale-150" />
            <div className="relative">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#faf9f7] ring-1 ring-[#e9e3d3] transition-colors group-hover:bg-[#1a1a2e]/5 group-hover:ring-[#1a1a2e]/20">
                  <CalendarCheck className="h-4 w-4 text-[#1a1a2e]" strokeWidth={2} />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs font-medium text-[#5f5f5f]">Bookings this month</p>
                <div className="mt-0.5 flex items-baseline gap-2">
                  <h3 className="font-serif text-2xl font-semibold text-[#1a1a1a]">{providerSummary.bookingsThisMonth}</h3>
                </div>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-[#c9a84c] font-medium">
                  <TrendingUp className="h-3 w-3" />
                  {providerSummary.bookingsPending} pending confirmation
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group relative overflow-hidden rounded-2xl border border-[#e9e3d3] bg-white p-4 sm:p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-linear-to-br from-[#fcfbf8] to-[#f4f1eb] opacity-50 transition-transform group-hover:scale-150" />
            <div className="relative">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#faf9f7] ring-1 ring-[#e9e3d3] transition-colors group-hover:bg-[#d4b46a]/10 group-hover:ring-[#d4b46a]/30">
                  <Users className="h-4 w-4 text-[#8b6d27]" strokeWidth={2} />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs font-medium text-[#5f5f5f]">Total Clients (YTD)</p>
                <div className="mt-0.5 flex items-baseline gap-2">
                  <h3 className="font-serif text-2xl font-semibold text-[#1a1a1a]">{providerSummary.uniqueClientsYtd}</h3>
                </div>
                <p className="mt-0.5 text-xs text-[#5f5f5f]"><span className="font-medium text-[#1a1a1a]">{providerSummary.completedJobs}</span> jobs completed</p>
              </div>
            </div>
          </div>

          {/* Card 4 */}
          <div className="group relative overflow-hidden rounded-2xl border border-[#e9e3d3] bg-linear-to-b from-white to-[#faf9f7] p-4 sm:p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="absolute -right-3 -top-3 h-16 w-16 rounded-full bg-[#c9a84c]/5 transition-transform group-hover:scale-150" />
            <div className="relative">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 ring-1 ring-amber-200/50">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-500" strokeWidth={2} />
                </div>
                <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200/50">
                  Top Rated
                </span>
              </div>
              <div className="mt-3">
                <p className="text-xs font-medium text-[#5f5f5f]">Average Rating</p>
                <div className="mt-0.5 flex items-baseline gap-1">
                  <h3 className="font-serif text-2xl font-semibold text-[#1a1a1a]">{providerSummary.avgRating}</h3>
                  <span className="text-xs font-medium text-[#9a9a9a]">/5.0</span>
                </div>
                <p className="mt-0.5 text-xs text-[#5f5f5f]">Revenue: <span className="font-semibold text-[#1a1a1a]">${providerSummary.revenueThisMonth.toLocaleString()}</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Tables row */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          
          {/* Recent bookings */}
          <div className="flex flex-col rounded-2xl border border-[#e9e3d3] bg-white shadow-sm overflow-hidden min-w-0">
            <div className="flex items-center justify-between border-b border-[#eceae5] bg-[#faf9f7] px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold text-[#1a1a1a]">Recent Bookings</h2>
                <p className="text-xs text-[#5f5f5f] mt-0.5">Your latest client appointments</p>
              </div>
              <Link
                to="/provider/bookings"
                className="text-sm font-semibold text-[#c9a84c] transition-colors hover:text-[#b08a27]"
              >
                View all
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-[#eceae5] bg-white text-xs uppercase tracking-wider text-[#9a9a9a]">
                    <th className="px-4 py-3 font-semibold">Client</th>
                    <th className="px-4 py-3 font-semibold">Service</th>
                    <th className="hidden sm:table-cell px-4 py-3 font-semibold">Date</th>
                    <th className="px-4 py-3 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f4f1eb]">
                  {recentBookings.map((row) => (
                    <tr key={row.id} className="group transition-colors hover:bg-[#faf9f7]">
                      <td className="px-4 py-3">
                        <div className="font-medium text-[#1a1a1a]">{row.client}</div>
                        <div className="text-[11px] text-[#9a9a9a] mt-0.5 font-mono">{row.id}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-md bg-[#f4f1eb] px-2 py-0.5 text-[11px] font-medium text-[#5f5f5f] max-w-25 truncate sm:max-w-37.5 group-hover:bg-white group-hover:ring-1 group-hover:ring-[#e9e3d3]">
                          {row.service}
                        </span>
                      </td>
                      <td className="hidden sm:table-cell px-4 py-3 text-xs text-[#5f5f5f]">
                        {row.date}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {statusBadge(row.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Services */}
          <div className="flex flex-col rounded-2xl border border-[#e9e3d3] bg-white shadow-sm overflow-hidden min-w-0">
            <div className="flex items-center justify-between border-b border-[#eceae5] bg-[#faf9f7] px-5 py-4">
              <div>
                <h2 className="text-sm font-semibold text-[#1a1a1a]">Your Services</h2>
                <p className="text-xs text-[#5f5f5f] mt-0.5">Performance of your offerings</p>
              </div>
              <Link
                to="/provider/services"
                className="text-sm font-semibold text-[#c9a84c] transition-colors hover:text-[#b08a27]"
              >
                Manage
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-[#eceae5] bg-white text-xs uppercase tracking-wider text-[#9a9a9a]">
                    <th className="px-4 py-3 font-semibold">Service</th>
                    <th className="hidden sm:table-cell px-4 py-3 font-semibold">Price</th>
                    <th className="px-4 py-3 font-semibold">Bookings</th>
                    <th className="px-4 py-3 font-semibold text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f4f1eb]">
                  {servicesTable.map((s) => (
                    <tr key={s.id} className="group transition-colors hover:bg-[#faf9f7]">
                      <td className="px-4 py-3">
                        <div className="font-medium text-[#1a1a1a] max-w-30 truncate sm:max-w-45">{s.name}</div>
                        <div className="text-[11px] text-[#9a9a9a] mt-0.5">{s.category}</div>
                      </td>
                      <td className="hidden sm:table-cell px-4 py-3 font-medium text-[#1a1a1a] text-xs">
                        {s.price}
                      </td>
                      <td className="px-4 py-3 text-xs text-[#5f5f5f]">
                        {s.bookings}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {s.active ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200/50">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-neutral-50 px-2 py-0.5 text-[11px] font-semibold text-neutral-600 ring-1 ring-inset ring-neutral-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" aria-hidden />
                            Paused
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Clients */}
        <div className="rounded-2xl border border-[#e9e3d3] bg-white shadow-sm overflow-hidden animate-fade-in-up min-w-0" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center justify-between border-b border-[#eceae5] bg-[#faf9f7] px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-[#1a1a1a]">Clients You Work With</h2>
              <p className="text-xs text-[#5f5f5f] mt-0.5">Recent client activity and ratings</p>
            </div>
            <button className="flex h-8 w-8 items-center justify-center rounded-full text-[#9a9a9a] transition-colors hover:bg-[#e9e3d3] hover:text-[#1a1a1a]">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-[#eceae5] bg-white text-xs uppercase tracking-wider text-[#9a9a9a]">
                  <th className="px-4 py-3 font-semibold">Client Name</th>
                  <th className="px-4 py-3 font-semibold">Relationship</th>
                  <th className="hidden sm:table-cell px-4 py-3 font-semibold">Last Visit</th>
                  <th className="px-4 py-3 font-semibold text-right">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f4f1eb]">
                {recentClients.map((c) => (
                  <tr key={c.id} className="group transition-colors hover:bg-[#faf9f7]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f4f1eb] text-xs font-bold text-[#1a1a1a]">
                          {c.name.charAt(0)}
                        </div>
                        <span className="font-medium text-[#1a1a1a]">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#5f5f5f]">
                      {c.bookings}
                    </td>
                    <td className="hidden sm:table-cell px-4 py-3 text-xs text-[#5f5f5f]">
                      {c.lastVisit}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="inline-flex items-center justify-end gap-1 font-medium text-[#1a1a1a]">
                        {c.rating}
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" aria-hidden />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProviderLayouts>
  );
};

export default ProviderDashboard;
