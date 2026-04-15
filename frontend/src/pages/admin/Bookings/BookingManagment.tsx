import { useState } from "react";
import { mockBookings, type BookingStatus, type PaymentStatus, type Booking } from "../Providers/data/bookingMockData";
import BookingDetailModal from "./BookingDetailModal";
import BookingDeleteConfirmationModal from "./BookingDeleteConfirmationModal";
import BookingApproveConfirmationModal from "./BookingApproveConfirmationModal";
import BookingRejectConfirmationModal from "./BookingRejectConfirmationModal";

const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
);
const ChevronIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m6 9 6 6 6-6" />
    </svg>
);
const EyeIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
);
const CheckIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 6L9 17l-5-5" />
    </svg>
);
const XIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 6L6 18M6 6l12 12" />
    </svg>
);
const TrashIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6M14 11v6" />
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
);

// --- Components ---

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
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold w-fit ${styles}`}>
            {status}
        </span>
    );
}

function PaymentBadge({ status }: { status: PaymentStatus }) {
    const styles = status === "Paid"
        ? "bg-green-50 text-green-700 border border-green-200"
        : "bg-gray-50 text-gray-700 border border-gray-200";

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold w-fit ${styles}`}>
            {status}
        </span>
    );
}

// function ActionButtons({ onView, onApprove, onReject, onDelete }: { onView: () => void, onApprove: () => void, onReject: () => void, onDelete: () => void }) {
//     return (
//         <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
//             <button title="View Details" onClick={onView} className="cursor-pointer text-gray-400 hover:text-indigo-600 transition p-1.5 rounded-lg hover:bg-indigo-50">
//                 <EyeIcon />
//             </button>
//             <button title="Approve" onClick={onApprove} className="cursor-pointer text-green-500 hover:text-green-600 transition p-1.5 rounded-lg hover:bg-green-50">
//                 <CheckIcon />
//             </button>
//             <button title="Reject" onClick={onReject} className="cursor-pointer text-orange-400 hover:text-orange-500 transition p-1.5 rounded-lg hover:bg-orange-50">
//                 <XIcon />
//             </button>
//             <button title="Delete" onClick={onDelete} className="cursor-pointer text-gray-400 hover:text-red-500 transition p-1.5 rounded-lg hover:bg-red-50">
//                 <TrashIcon />
//             </button>
//         </div>
//     );
// }

function FilterSelect({
    label, value, onChange, options,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
}) {
    return (
        <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 font-medium whitespace-nowrap">{label}</span>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="appearance-none pl-3 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 bg-white cursor-pointer transition"
                >
                    {options.map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                </select>
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <ChevronIcon />
                </span>
            </div>
        </div>
    );
}

// --- Main Page ---

export default function BookingManagement() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);
    const [bookingToApprove, setBookingToApprove] = useState<Booking | null>(null);
    const [bookingToReject, setBookingToReject] = useState<Booking | null>(null);

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
        <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="min-h-screen bg-gray-50 p-4 sm:p-6">
            <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

            <div className="mb-5">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Bookings</h1>
                <p className="text-sm text-gray-500 mt-0.5">Manage and monitor all service bookings</p>
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
                        <span className="text-sm text-gray-500 font-medium whitespace-nowrap">Date:</span>
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
                            <div className="grid grid-cols-[minmax(180px,1.5fr)_minmax(150px,1.2fr)_minmax(150px,1.2fr)_minmax(120px,1fr)_minmax(110px,1fr)_minmax(100px,1fr)_auto] gap-4 px-6 py-3 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide min-w-[900px]">
                                <span>Customer Name</span>
                                <span>Service Name</span>
                                <span>Provider</span>
                                <span>Date</span>
                                <span>Status</span>
                                <span>Payment</span>
                                {/* <span className="text-right pr-2">Action</span> */}
                            </div>

                            {filtered.map((booking, i) => (
                                <div
                                    key={booking.id}
                                    className={`grid grid-cols-[minmax(180px,1.5fr)_minmax(150px,1.2fr)_minmax(150px,1.2fr)_minmax(120px,1fr)_minmax(110px,1fr)_minmax(100px,1fr)_auto] gap-4 px-6 py-4 items-center border-b border-gray-50 hover:bg-gray-50/60 transition-colors min-w-[900px] ${i === filtered.length - 1 ? "border-b-0" : ""
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
                                            <span className="block text-sm font-semibold text-gray-800 truncate">{booking.customerName}</span>
                                            <span className="block text-xs text-gray-400 mt-0.5 truncate">{booking.id}</span>
                                        </div>
                                    </div>

                                    <span className="text-sm text-gray-700 font-medium truncate">{booking.serviceName}</span>
                                    <span className="text-sm text-gray-600 truncate">{booking.provider}</span>
                                    <span className="text-sm text-gray-600 whitespace-nowrap">{booking.bookingDate}</span>

                                    <div>
                                        <StatusBadge status={booking.status} />
                                    </div>
                                    <div>
                                        <PaymentBadge status={booking.paymentStatus} />
                                    </div>

                                    {/* <div className="flex justify-end">
                                        <ActionButtons
                                            onView={() => setSelectedBooking(booking)}
                                            onApprove={() => setBookingToApprove(booking)}
                                            onReject={() => setBookingToReject(booking)}
                                            onDelete={() => setBookingToDelete(booking)}
                                        />
                                    </div> */}
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
                                    {/* <ActionButtons
                                        onView={() => setSelectedBooking(booking)}
                                        onApprove={() => setBookingToApprove(booking)}
                                        onReject={() => setBookingToReject(booking)}
                                        onDelete={() => setBookingToDelete(booking)}
                                    /> */}
                                </div>

                                <div className="space-y-2 text-sm border-t border-gray-50 pt-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400">Service</span>
                                        <span className="text-gray-700 font-medium">{booking.serviceName}</span>
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
                                        <PaymentBadge status={booking.paymentStatus} />
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

            {/* {selectedBooking && (
                <BookingDetailModal
                    booking={selectedBooking}
                    onClose={() => setSelectedBooking(null)}
                />
            )} */}

            {/* {bookingToDelete && (
                <BookingDeleteConfirmationModal
                    booking={bookingToDelete}
                    onClose={() => setBookingToDelete(null)}
                    onConfirm={() => {
                        console.log("Delete booking", bookingToDelete.id);

                    }}
                />
            )} */}

            {/* {bookingToApprove && (
                <BookingApproveConfirmationModal
                    booking={bookingToApprove}
                    onClose={() => setBookingToApprove(null)}
                    onConfirm={() => {
                        console.log("Approve booking", bookingToApprove.id);
                    }}
                />
            )} */}

            {/* {bookingToReject && (
                <BookingRejectConfirmationModal
                    booking={bookingToReject}
                    onClose={() => setBookingToReject(null)}
                    onConfirm={() => {
                        console.log("Reject booking", bookingToReject.id);
                    }}
                />
            )} */}
        </div>
    );
}
