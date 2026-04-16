import { useState } from "react";
import {
  mockBookings,
  type BookingStatus,
  type Booking,
} from "../Providers/data/bookingMockData";
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

function StatusBadge({ status }: { status: BookingStatus }) {
  let styles = "";
  switch (status) {
    case "Pending":
      styles = "bg-yellow-50 text-yellow-700 border border-yellow-200";
      break;
    case "Confirmed":
      styles = "bg-blue-50 text-blue-700 border border-blue-200";
      break;
    case "Completed":
      styles = "bg-green-50 text-green-700 border border-green-200";
      break;
    case "Cancelled":
      styles = "bg-red-50 text-red-700 border border-red-200";
      break;
  }
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold w-fit ${styles}`}
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
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const filtered = mockBookings.filter((b) => {
    const q = search.toLowerCase();
    const matchSearch =
      b.customerName.toLowerCase().includes(q) ||
      b.serviceName.toLowerCase().includes(q) ||
      b.provider.toLowerCase().includes(q);

    const matchStatus = statusFilter === "All" || b.status === statusFilter;

    let matchDate = true;
    if (dateFrom && b.bookingDate < dateFrom) matchDate = false;
    if (dateTo && b.bookingDate > dateTo) matchDate = false;

    return matchSearch && matchStatus && matchDate;
  });

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

      {/* Top Controls */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 sm:px-5 py-4 mb-5 flex flex-col gap-3">
        <div className="relative w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search by customer, service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition"
          />
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <FilterSelect
            label="Status:"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: "All", label: "All Statuses" },
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
              onChange={(e) => setDateFrom(e.target.value)}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition text-gray-700"
            />
            <span className="text-gray-400">-</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="text-sm border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition text-gray-700"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center text-gray-400 text-sm">
          No bookings match your search.
        </div>
      ) : (
        <>
          <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <div className="grid grid-cols-[minmax(180px,1.5fr)_minmax(150px,1.2fr)_minmax(150px,1.2fr)_minmax(120px,1fr)_minmax(110px,1fr)_minmax(100px,1fr)] gap-4 px-6 py-3 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide min-w-225">
                <span>Customer Name</span>
                <span>Service Name</span>
                <span>Provider</span>
                <span>Date</span>
                <span>Status</span>
                <span className="text-center">Action</span>
              </div>

              {filtered.map((booking, i) => (
                <div
                  key={booking.id}
                  className={`grid grid-cols-[minmax(180px,1.5fr)_minmax(150px,1.2fr)_minmax(150px,1.2fr)_minmax(120px,1fr)_minmax(110px,1fr)_minmax(100px,1fr)] gap-4 px-6 py-4 items-center border-b border-gray-50 hover:bg-gray-50/60 transition-colors min-w-225 ${
                    i === filtered.length - 1 ? "border-b-0" : ""
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-[#081D3A] font-bold shrink-0"
                      style={{ backgroundColor: "#F3F3F3" }}
                    >
                      {booking.avatar}
                    </div>
                    <div className="min-w-0">
                      <span className="block text-sm font-semibold text-gray-800 truncate">
                        {booking.customerName}
                      </span>
                      <span className="block text-xs text-gray-400 mt-0.5 truncate">
                        {booking.id}
                      </span>
                    </div>
                  </div>

                  <span className="text-sm text-gray-700 font-medium truncate">
                    {booking.serviceName}
                  </span>
                  <span className="text-sm text-gray-600 truncate">
                    {booking.provider}
                  </span>
                  <span className="text-sm text-gray-600 whitespace-nowrap">
                    {booking.bookingDate}
                  </span>

                  <div>
                    <StatusBadge status={booking.status} />
                  </div>
                  <div className="flex justify-center">
                    <button
                      className="px-3 py-1.5 rounded-lg bg-yellow-50 text-yellow-700 text-xs font-semibold border border-yellow-200 hover:bg-yellow-100 transition"
                      onClick={() => setSelectedBooking(booking)}
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile View */}
          <div className="lg:hidden flex flex-col gap-3">
            {filtered.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-[#081D3A] font-bold shrink-0"
                      style={{ backgroundColor: "#F3F3F3" }}
                    >
                      {booking.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {booking.customerName}
                      </p>
                      <p className="text-xs text-gray-400">{booking.id}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm border-t border-gray-50 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Service</span>
                    <span className="text-gray-700 font-medium">
                      {booking.serviceName}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Provider</span>
                    <span className="text-gray-700">{booking.provider}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Date</span>
                    <span className="text-gray-700">{booking.bookingDate}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <StatusBadge status={booking.status} />
                    <button
                      className="px-3 py-1.5 rounded-lg bg-yellow-50 text-yellow-700 text-xs font-semibold border border-yellow-200 hover:bg-yellow-100 transition"
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

      <p className="text-xs text-gray-400 mt-3 pl-1">
        Showing {filtered.length} of {mockBookings.length} bookings
      </p>

      {selectedBooking && (
        <BookingDetailModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
}
