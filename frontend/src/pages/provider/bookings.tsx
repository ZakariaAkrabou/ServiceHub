import React, { useMemo, useState } from "react";
import ProviderLayouts from "../../components/provider/ProviderLayouts";
import ViewBookingModal from "./modals/bookings/viewBooking";
import { recentBookings, type BookingRow } from "./data/providerOverviewMock";
import { Search, Filter, Check, X, Eye } from "lucide-react";

const PAGE_SIZE = 6;
const gold = "#c9a84c";

function statusBadge(status: BookingRow["status"]) {
  const styles: Record<BookingRow["status"], string> = {
    pending: "bg-amber-50 text-amber-700 ring-amber-200/50",
    confirmed: "bg-blue-50 text-blue-700 ring-blue-200/50",
    completed: "bg-emerald-50 text-emerald-700 ring-emerald-200/50",
    rejected: "bg-red-50 text-red-700 ring-red-200/50",
    cancelled: "bg-neutral-50 text-neutral-700 ring-neutral-200/50",
  };

  const dotStyles: Record<BookingRow["status"], string> = {
    pending: "bg-amber-500",
    confirmed: "bg-blue-500",
    completed: "bg-emerald-500",
    rejected: "bg-red-500",
    cancelled: "bg-neutral-500",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] sm:text-xs font-semibold ring-1 ring-inset ${styles[status]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dotStyles[status]}`} aria-hidden />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

const ProviderBookings: React.FC = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingRow | null>(null);
  const [bookings, setBookings] = useState<BookingRow[]>(
    // Let's multiply the recent bookings to show pagination if needed
    [...recentBookings, ...recentBookings.map(b => ({ ...b, id: `${b.id}-2` }))]
  );

  // Filtered and searched bookings
  const filtered = useMemo(() => {
    let rows = bookings;
    if (filter !== "all") {
      rows = rows.filter((b) => b.status === filter);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(
        (b) =>
          b.client.toLowerCase().includes(q) ||
          b.service.toLowerCase().includes(q) ||
          b.id.toLowerCase().includes(q)
      );
    }
    return rows;
  }, [bookings, search, filter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Actions
  const handleUpdateStatus = (id: string, newStatus: BookingRow["status"]) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
  };

  return (
    <ProviderLayouts>
      <ViewBookingModal 
        open={viewModalOpen} 
        onClose={() => {
          setViewModalOpen(false);
          setSelectedBooking(null);
        }} 
        booking={selectedBooking} 
        onUpdateStatus={handleUpdateStatus}
      />
      <div className="flex flex-col gap-6 pb-10">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="min-w-0">
            <h1
              className="font-sans text-2xl font-bold tracking-tight text-[#1a1a1a] sm:text-3xl"
              style={{ letterSpacing: "-0.5px" }}
            >
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#c9a84c] to-[#e4c97c]">Bookings</span> Management
            </h1>
            <p className="mt-1 text-sm sm:text-base text-[#5f5f5f]">
              Review, accept, and manage all your client appointments.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between w-full">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:min-w-60">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9a9a]" />
              <input
                type="text"
                placeholder="Search client or ID..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-[#e9e3d3] pl-10 pr-4 py-2 text-sm focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20 outline-none bg-white transition-all"
                style={{ color: "#1a1a1a" }}
              />
            </div>
            <div className="relative w-full sm:w-auto">
              <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9a9a]" />
              <select
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-lg border border-[#e9e3d3] pl-10 pr-8 py-2 text-sm bg-white text-[#1a1a1a] focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20 appearance-none outline-none transition-all cursor-pointer"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#e9e3d3] bg-white shadow-sm w-full">
          <table className="w-full min-w-125 lg:min-w-150 text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#eceae5] bg-[#faf9f7] text-[11px] sm:text-xs uppercase tracking-wider text-[#9a9a9a]">
                <th className="px-5 py-4 font-semibold">Client & ID</th>
                <th className="hidden md:table-cell px-5 py-4 font-semibold">Service</th>
                <th className="px-5 py-4 font-semibold">Date & Time</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f1eb]">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-[#9a9a9a] bg-white">
                    <div className="flex flex-col items-center justify-center">
                      <div className="h-12 w-12 rounded-full bg-[#f4f1eb] flex items-center justify-center mb-3">
                        <Search className="h-5 w-5 text-[#c9a84c]" />
                      </div>
                      <p className="font-medium text-[#1a1a1a]">No bookings found</p>
                      <p className="text-xs mt-1 text-[#5f5f5f]">Try adjusting your search or filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((b) => (
                  <tr key={b.id} className="group transition-colors hover:bg-[#faf9f7] bg-white">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f4f1eb] text-xs font-bold text-[#1a1a1a]">
                          {b.client.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-[#1a1a1a]">{b.client}</div>
                          <div className="text-[11px] text-[#9a9a9a] mt-0.5 font-mono">{b.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-5 py-4">
                      <span className="inline-flex items-center rounded-md bg-[#f4f1eb] px-2.5 py-1 text-xs font-medium text-[#5f5f5f] max-w-45 truncate group-hover:bg-white group-hover:ring-1 group-hover:ring-[#e9e3d3]">
                        {b.service}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-[#1a1a1a] text-sm">{b.date.split(',')[0]}</div>
                      <div className="text-[11px] text-[#5f5f5f] mt-0.5">{b.date.split(',')[1]}</div>
                      <div className="md:hidden text-[11px] text-[#c9a84c] mt-0.5 max-w-30 truncate">{b.service}</div>
                    </td>
                    <td className="px-5 py-4">
                      {statusBadge(b.status)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 sm:gap-2">
                        {b.status === "pending" && (
                          <>
                            <button
                              title="Accept Booking"
                              onClick={() => handleUpdateStatus(b.id, "confirmed")}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 transition-colors hover:bg-emerald-100"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              title="Decline Booking"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-600 transition-colors hover:bg-red-100"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {b.status === "confirmed" && (
                          <button
                            title="Mark as Completed"
                            onClick={() => handleUpdateStatus(b.id, "completed")}
                            className="inline-flex px-3 py-1.5 items-center justify-center rounded-full bg-blue-50 text-blue-600 text-xs font-medium transition-colors hover:bg-blue-100"
                          >
                            Complete
                          </button>
                        )}
                        <button
                          title="View Details"
                          onClick={() => {
                            setSelectedBooking(b);
                            setViewModalOpen(true);
                          }}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f4f1eb] text-[#5f5f5f] transition-colors hover:bg-[#e9e3d3] hover:text-[#1a1a1a]"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end items-center gap-2 mt-4">
          <button
            className="rounded-lg border border-[#e9e3d3] px-3 py-1.5 text-sm text-[#1a1a1a] bg-white disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Prev
          </button>
          <span className="text-[#5f5f5f] text-sm">
            Page <span style={{ color: gold, fontWeight: 600 }}>{page}</span> of{" "}
            {totalPages}
          </span>
          <button
            className="rounded-lg border border-[#e9e3d3] px-3 py-1.5 text-sm text-[#1a1a1a] bg-white disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </ProviderLayouts>
  );
};

export default ProviderBookings;