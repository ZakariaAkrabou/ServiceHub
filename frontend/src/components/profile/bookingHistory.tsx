import React, { useState, useMemo } from "react";
import {
  Calendar, Clock, MessageSquare, Mail, Phone,
  ChevronDown, ChevronUp, RefreshCw, Check, X,
  AlertCircle, ChevronLeft, ChevronRight, Loader2
} from "lucide-react";
import { useGetCustomerBookingsQuery, type Booking } from "../../app/api/BookingApi";

const PAGE_SIZE = 3;

type StatusFilter = "all" | "pending" | "confirmed" | "completed" | "cancelled";

export default function BookingHistory() {
  const { data, isLoading, isError, refetch } = useGetCustomerBookingsQuery();

  const [filter, setFilter] = useState<StatusFilter>("all");
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const bookings: Booking[] = data?.data ?? [];

  const filteredBookings = useMemo(
    () => bookings.filter((b) => filter === "all" || b.status === filter),
    [bookings, filter]
  );

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const pagedBookings = filteredBookings.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const countFor = (s: StatusFilter) =>
    s === "all" ? bookings.length : bookings.filter((b) => b.status === s).length;

  const formatDateTime = (isoStr?: string) => {
    if (!isoStr) return "—";
    const d = new Date(isoStr);
    return d.toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "numeric", minute: "2-digit", hour12: true,
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedBookingId((prev) => (prev === id ? null : id));
  };

  const handleFilterChange = (s: StatusFilter) => {
    setFilter(s);
    setCurrentPage(1);
    setExpandedBookingId(null);
  };

  const providerFullName = (b: Booking) => {
    const p = b.service_id?.provider_id;
    if (!p) return "—";
    return `${p.firstName} ${p.lastName}`;
  };

  const providerInitials = (b: Booking) => {
    const p = b.service_id?.provider_id;
    if (!p) return "?";
    return `${p.firstName?.[0] ?? ""}${p.lastName?.[0] ?? ""}`.toUpperCase();
  };

  /* ─── Loading state ─── */
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-[#EBE6DD] p-6 lg:p-8 flex flex-col items-center justify-center min-h-[320px] gap-4">
        <Loader2 className="h-10 w-10 text-[#C9A84C] animate-spin" />
        <p className="text-[#1A1A2E]/60 text-sm font-medium">Loading your bookings…</p>
      </div>
    );
  }

  /* ─── Error state ─── */
  if (isError) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-[#EBE6DD] p-6 lg:p-8 flex flex-col items-center justify-center min-h-[320px] gap-4">
        <AlertCircle className="h-10 w-10 text-red-400" />
        <p className="text-[#1A1A2E] font-bold">Failed to load bookings</p>
        <p className="text-[#1A1A2E]/60 text-sm">Something went wrong while fetching your booking history.</p>
        <button
          onClick={() => refetch()}
          className="mt-2 px-5 py-2 bg-[#C9A84C] text-white rounded-xl text-sm font-bold shadow hover:bg-[#b8943d] transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#EBE6DD] p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A2E] font-serif">My Bookings</h2>
          <p className="text-sm text-[#1A1A2E]/60 mt-1">Manage your service requests and view provider details.</p>
        </div>
        <button
          onClick={() => refetch()}
          title="Refresh"
          className="p-2 rounded-lg border border-[#EBE6DD] text-[#1A1A2E]/50 hover:text-[#C9A84C] hover:border-[#C9A84C] transition-all"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 border-b border-[#EBE6DD] scrollbar-none">
        {(["all", "pending", "confirmed", "completed", "cancelled"] as const).map((status) => (
          <button
            key={status}
            onClick={() => handleFilterChange(status)}
            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
              filter === status
                ? "bg-[#C9A84C] text-white shadow-md"
                : "bg-[#FDFBF7] text-[#1A1A2E]/60 border border-[#EBE6DD] hover:border-[#C9A84C] hover:text-[#1A1A2E]"
            }`}
          >
            {status} ({countFor(status)})
          </button>
        ))}
      </div>

      {/* Booking Cards */}
      <div className="flex flex-col gap-4">
        {pagedBookings.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-[#EBE6DD] rounded-xl bg-[#FDFBF7]">
            <Calendar className="h-10 w-10 text-[#C9A84C]/50 mx-auto mb-3" />
            <p className="text-[#1A1A2E] font-medium">No bookings found</p>
            <p className="text-sm text-[#1A1A2E]/50 mt-1">Try changing your filters to see more results.</p>
          </div>
        ) : (
          pagedBookings.map((booking) => (
            <div
              key={booking._id}
              className="border border-[#EBE6DD] rounded-xl bg-[#FDFBF7] overflow-hidden transition-all hover:shadow-md"
            >
              <div
                className="p-5 flex flex-col sm:flex-row gap-5 cursor-pointer"
                onClick={() => toggleExpand(booking._id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-black uppercase tracking-widest text-[#C9A84C]">
                      {booking.service_id?.category ?? "Service"}
                    </span>
                    <span className="text-xs text-[#1A1A2E]/40 font-medium">
                      ID: {booking._id.slice(-6).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">
                    {booking.service_id?.name ?? "Unnamed Service"}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-[#1A1A2E]/70 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-[#C9A84C]" />
                      {formatDateTime(booking.booking_time)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-[#1A1A2E] text-white flex items-center justify-center text-[10px] font-bold">
                        {providerInitials(booking)}
                      </div>
                      {providerFullName(booking)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col justify-between items-center sm:items-end border-t sm:border-t-0 border-[#EBE6DD] pt-4 sm:pt-0">
                  <div className="text-xl font-black text-[#1A1A2E]">
                    {booking.service_id?.price != null ? `${booking.service_id.price} MAD` : "—"}
                  </div>
                  <div className="mt-2">
                    {booking.status === "pending" && (
                      <span className="inline-flex items-center gap-1.5 bg-[#FDFBF7] border border-[#C9A84C]/30 text-[#C9A84C] px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Pending
                      </span>
                    )}
                    {booking.status === "confirmed" && (
                      <span className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                        <Check className="h-3.5 w-3.5" /> Confirmed
                      </span>
                    )}
                    {booking.status === "completed" && (
                      <span className="inline-flex items-center gap-1.5 bg-gray-100 border border-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                        <Check className="h-3.5 w-3.5" /> Completed
                      </span>
                    )}
                    {booking.status === "cancelled" && (
                      <span className="inline-flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-600 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                        <X className="h-3.5 w-3.5" /> Cancelled
                      </span>
                    )}
                  </div>
                  <div className="ml-auto sm:ml-0 mt-2 sm:mt-1 text-[#1A1A2E]/30">
                    {expandedBookingId === booking._id
                      ? <ChevronUp className="h-4 w-4" />
                      : <ChevronDown className="h-4 w-4" />}
                  </div>
                </div>
              </div>

              {/* Expandable Section */}
              {expandedBookingId === booking._id && (
                <div className="border-t border-[#EBE6DD] bg-white p-5 animate-in slide-in-from-top-2">
                  <h4 className="text-sm font-bold text-[#1A1A2E] mb-4 uppercase tracking-wider">Provider Contact</h4>

                  {booking.status === "pending" ? (
                    <div className="bg-[#FDFBF7] border border-[#EBE6DD] rounded-xl p-4 flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-[#C9A84C] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-[#1A1A2E]">Awaiting Provider Acceptance</p>
                        <p className="text-sm text-[#1A1A2E]/70 mt-1 leading-relaxed">
                          Please wait until <strong>{providerFullName(booking)}</strong> accepts your booking request.
                          Once confirmed, you will be able to access their contact information (email, phone) or initiate an in-app chat.
                        </p>
                      </div>
                    </div>
                  ) : booking.status === "cancelled" ? (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3">
                      <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-[#1A1A2E]">Booking Cancelled</p>
                        <p className="text-sm text-[#1A1A2E]/70 mt-1 leading-relaxed">
                          This booking has been cancelled. Contact support if you have any questions.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-[#FDFBF7] border border-[#EBE6DD] rounded-xl p-4">
                        <p className="text-xs text-[#1A1A2E]/50 font-bold uppercase tracking-wider mb-3">Direct Contact</p>
                        <div className="flex flex-col gap-3">
                          {booking.service_id?.provider_id?.email && (
                            <a
                              href={`mailto:${booking.service_id.provider_id.email}`}
                              className="flex items-center gap-3 text-sm font-medium text-[#1A1A2E] hover:text-[#C9A84C] transition-colors"
                            >
                              <div className="w-8 h-8 rounded-full bg-white border border-[#EBE6DD] shadow-sm flex items-center justify-center">
                                <Mail className="h-4 w-4" />
                              </div>
                              {booking.service_id.provider_id.email}
                            </a>
                          )}
                          {booking.customer_id?.phone && (
                            <a
                              href={`tel:${booking.customer_id.phone}`}
                              className="flex items-center gap-3 text-sm font-medium text-[#1A1A2E] hover:text-[#C9A84C] transition-colors"
                            >
                              <div className="w-8 h-8 rounded-full bg-white border border-[#EBE6DD] shadow-sm flex items-center justify-center">
                                <Phone className="h-4 w-4" />
                              </div>
                              {booking.customer_id.phone}
                            </a>
                          )}
                          {!booking.service_id?.provider_id?.email && !booking.customer_id?.phone && (
                            <p className="text-sm text-[#1A1A2E]/50">No contact info available.</p>
                          )}
                        </div>
                      </div>

                      <div className="bg-[#FDFBF7] border border-[#EBE6DD] rounded-xl p-4 flex flex-col justify-center items-center text-center">
                        <MessageSquare className="h-8 w-8 text-[#C9A84C] mb-2" />
                        <p className="text-sm font-bold text-[#1A1A2E] mb-3">Prefer messaging?</p>
                        <button className="bg-[#1A1A2E] text-white px-5 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-[#C9A84C] transition-colors w-full sm:w-auto">
                          Open Chat
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#EBE6DD]">
          <p className="text-sm text-[#1A1A2E]/50 font-medium">
            Showing{" "}
            <span className="font-bold text-[#1A1A2E]">
              {(safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filteredBookings.length)}
            </span>{" "}
            of <span className="font-bold text-[#1A1A2E]">{filteredBookings.length}</span> bookings
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="p-2 rounded-lg border border-[#EBE6DD] text-[#1A1A2E]/60 hover:text-[#C9A84C] hover:border-[#C9A84C] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                  page === safePage
                    ? "bg-[#C9A84C] text-white shadow-md"
                    : "border border-[#EBE6DD] text-[#1A1A2E]/60 hover:border-[#C9A84C] hover:text-[#1A1A2E]"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="p-2 rounded-lg border border-[#EBE6DD] text-[#1A1A2E]/60 hover:text-[#C9A84C] hover:border-[#C9A84C] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
