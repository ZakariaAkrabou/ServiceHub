import { useState } from "react";
import { useFilterBookingsQuery } from "../../../app/api/BookingApi";
import BookingDetailModal from "./BookingDetailModal";

const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const ChevronIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

function StatusBadge({ status }: { status: string }) {
  let styles = "";
  const s = status?.toLowerCase();

  switch (s) {
    case "pending":
      styles = "bg-yellow-50 text-yellow-700 border border-yellow-200";
      break;
    case "confirmed":
      styles = "bg-blue-50 text-blue-700 border border-blue-200";
      break;
    case "completed":
      styles = "bg-green-50 text-green-700 border border-green-200";
      break;
    case "cancelled":
      styles = "bg-red-50 text-red-700 border border-red-200";
      break;
    default:
      styles = "bg-gray-50 text-gray-700 border border-gray-200";
  }
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold w-fit capitalize ${styles}`}
    >
      {status}
    </span>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="appearance-none pl-3 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 bg-white cursor-pointer transition"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <ChevronIcon />
        </span>
      </div>
    </div>
  );
}

export default function BookingManagement() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [page, setPage] = useState(1);
  const limit = 6;

  const {
    data: filterData,
    isLoading: isFilterLoading,
    isError: isFilterError,
  } = useFilterBookingsQuery(
    {
      status: statusFilter === "All" ? undefined : statusFilter.toLowerCase(),
      page: page,
      limit: limit,
    },
    {
      skip: false,
    },
  );

  const bookings = filterData?.data || [];

  const filtered = bookings.filter((b: any) => {
    const q = search.toLowerCase();
    const customerName =
      `${b.customer_id?.firstName} ${b.customer_id?.lastName}`.toLowerCase();
    const serviceName = b.service_id?.name?.toLowerCase() || "";
    const providerName =
      `${b.service_id?.provider_id?.firstName} ${b.service_id?.provider_id?.lastName}`.toLowerCase();

    const matchSearch =
      customerName.includes(q) ||
      serviceName.includes(q) ||
      providerName.includes(q);

    let matchDate = true;
    const bDate = b.booking_time?.split("T")[0];
    if (dateFrom && bDate < dateFrom) matchDate = false;
    if (dateTo && bDate > dateTo) matchDate = false;

    return matchSearch && matchDate;
  });

  const totalPages = filterData?.totalPages || 1;
  const totalBookings = filterData?.totalBookings || 0;

  const handleSearchChange = (val: string) => {
    setSearch(val);
    setPage(1);
  };

  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
    setPage(1);
  };

  const handleDateChange = (type: "from" | "to", val: string) => {
    if (type === "from") setDateFrom(val);
    else setDateTo(val);
    setPage(1);
  };

  return (
    <div
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="min-h-screen bg-gray-50 p-4 sm:p-6"
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Bookings
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Manage and monitor all service bookings
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 sm:px-5 py-4 mb-5 flex flex-col gap-3">
        <div className="relative w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search by customer, service..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition"
          />
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <FilterSelect
            label="Status:"
            value={statusFilter}
            onChange={handleStatusChange}
            options={[
              { value: "All", label: "All statuses" },
              { value: "Pending", label: "Pending" },
              { value: "Confirmed", label: "Confirmed" },
              { value: "Completed", label: "Completed" },
              { value: "Cancelled", label: "Cancelled" },
            ]}
          />

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
              Date:
            </span>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => handleDateChange("from", e.target.value)}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition text-gray-700"
            />
            <span className="text-gray-400">-</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => handleDateChange("to", e.target.value)}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition text-gray-700"
            />
          </div>
        </div>
      </div>

      {isFilterLoading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center text-gray-400">
          Loading bookings...
        </div>
      ) : isFilterError ? (
        <div className="bg-white rounded-2xl border border-red-100 shadow-sm py-16 text-center text-red-500">
          An error occurred while loading data.
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center text-gray-400 text-sm">
          No bookings match your search.
        </div>
      ) : (
        <>
          {/* Vue Table Desktop */}
          <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <div className="grid grid-cols-[minmax(180px,1.5fr)_minmax(150px,1.2fr)_minmax(150px,1.2fr)_minmax(120px,1fr)_minmax(110px,1fr)_minmax(100px,1fr)] gap-4 px-6 py-3 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide min-w-225">
                <span>Customer Name</span>
                <span>Service</span>
                <span>Provider</span>
                <span>Date</span>
                <span>Status</span>
                <span className="text-center">Action</span>
              </div>

              {filtered.map((booking: any, i: number) => (
                <div
                  key={booking._id}
                  className={`grid grid-cols-[minmax(180px,1.5fr)_minmax(150px,1.2fr)_minmax(150px,1.2fr)_minmax(120px,1fr)_minmax(110px,1fr)_minmax(100px,1fr)] gap-4 px-6 py-4 items-center border-b border-gray-50 hover:bg-gray-50/60 transition-colors min-w-225 ${
                    i === filtered.length - 1 ? "border-b-0" : ""
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[#081D3A] font-bold shrink-0 bg-[#F3F3F3]">
                      {booking.customer_id?.firstName?.charAt(0) || "U"}
                    </div>
                    <div className="min-w-0">
                      <span className="block text-sm font-semibold text-gray-800 truncate">
                        {booking.customer_id?.firstName}{" "}
                        {booking.customer_id?.lastName}
                      </span>
                      <span className="block text-[10px] text-gray-400 mt-0.5 truncate uppercase">
                        ID: {booking._id?.slice(-6)}
                      </span>
                    </div>
                  </div>

                  <span className="text-sm text-gray-700 font-medium truncate">
                    {booking.service_id?.name}
                  </span>
                  <span className="text-sm text-gray-600 truncate">
                    {booking.service_id?.provider_id?.firstName}{" "}
                    {booking.service_id?.provider_id?.lastName}
                  </span>

                  <span className="text-sm text-gray-600 whitespace-nowrap">
                    {booking.booking_time
                      ? new Date(booking.booking_time).toLocaleDateString(
                          "en-US",
                        )
                      : "—"}
                  </span>

                  <div>
                    <StatusBadge status={booking.status} />
                  </div>
                  <div className="flex justify-center">
                    <button
                      className="px-3 py-1.5 rounded-lg bg-yellow-50 text-yellow-700 text-xs font-semibold border border-yellow-200 hover:bg-yellow-100 transition cursor-pointer"
                      onClick={() => setSelectedBooking(booking)}
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vue Mobile */}
          <div className="lg:hidden flex flex-col gap-3">
            {filtered.map((booking: any) => (
              <div
                key={booking._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-[#081D3A] font-bold shrink-0 bg-[#F3F3F3]">
                      {booking.customer_id?.firstName?.charAt(0) || "U"}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {booking.customer_id?.firstName}{" "}
                        {booking.customer_id?.lastName}
                      </p>
                      <p className="text-xs text-gray-400">
                        ID: {booking._id?.slice(-6)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm border-t border-gray-50 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Service</span>
                    <span className="text-gray-700 font-medium">
                      {booking.service_id?.name}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Date</span>
                    {/* ✅ BUG 4 CORRIGÉ */}
                    <span className="text-gray-700">
                      {booking.booking_time
                        ? new Date(booking.booking_time).toLocaleDateString(
                            "en-US",
                          )
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    {/* ✅ Champ "status" corrigé */}
                    <StatusBadge status={booking.status} />
                    <button
                      className="px-3 py-1.5 rounded-lg bg-yellow-50 text-yellow-700 text-xs font-semibold border border-yellow-200 hover:bg-yellow-100 transition cursor-pointer"
                      onClick={() => setSelectedBooking(booking)}
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {totalPages > 0 && (
        <div className="px-8 py-6 border-t border-slate-50 bg-slate-50/30 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Page Results
            </span>
            <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-[#081D3A]">
              {(page - 1) * limit + 1}-{Math.min(page * limit, totalBookings)}{" "}
              of {totalBookings}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-6 py-2.5 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Prev
            </button>
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 rounded-xl text-[10px] font-black transition-all cursor-pointer ${page === i + 1 ? "bg-[#081D3A] text-white shadow-lg shadow-[#081D3A]/20" : "bg-white text-slate-400 hover:bg-slate-50 border border-slate-100"}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-6 py-2.5 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
}
