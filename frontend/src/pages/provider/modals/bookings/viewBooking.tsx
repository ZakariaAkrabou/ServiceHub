import React from "react";
import { X, User, Briefcase, Calendar, Hash } from "lucide-react";
import type { BookingRow } from "../../data/providerOverviewMock";

interface ViewBookingModalProps {
  open: boolean;
  onClose: () => void;
  booking: BookingRow | null;
  onUpdateStatus?: (id: string, status: BookingRow["status"]) => void;
}

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
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${styles[status]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dotStyles[status]}`} aria-hidden />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

const ViewBookingModal: React.FC<ViewBookingModalProps> = ({
  open,
  onClose,
  booking,
  onUpdateStatus,
}) => {
  if (!open || !booking) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#1a1a1a]/70" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-[#c9a84c] via-[#e4c97c] to-[#c9a84c]" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-5">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#1a1a1a]">
              Booking Details
            </h2>
            <p className="mt-1.5 text-sm font-medium text-[#5f5f5f]">
              Review all information regarding this appointment.
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#faf9f7] text-[#5f5f5f] transition-colors hover:bg-[#f0ebe0] hover:text-[#1a1a1a]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 sm:px-8 pb-8">
          <div className="flex flex-col gap-4">
            
            {/* Status Section */}
            <div className="flex items-center justify-between rounded-2xl bg-[#faf9f7] p-5 border border-[#e9e3d3]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-[#9a9a9a]">Current Status</p>
                <p className="text-sm font-medium text-[#1a1a1a] mt-0.5">Booking is currently {booking.status}</p>
              </div>
              <div>{statusBadge(booking.status)}</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* ID */}
              <div className="flex flex-col rounded-2xl border border-[#e9e3d3] p-4 bg-white shadow-sm">
                <div className="flex items-center gap-2 text-[#5f5f5f] mb-1">
                  <Hash className="h-4 w-4 text-[#c9a84c]" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Booking ID</span>
                </div>
                <p className="font-mono text-[15px] font-medium text-[#1a1a1a]">{booking.id}</p>
              </div>

              {/* Client */}
              <div className="flex flex-col rounded-2xl border border-[#e9e3d3] p-4 bg-white shadow-sm">
                <div className="flex items-center gap-2 text-[#5f5f5f] mb-1">
                  <User className="h-4 w-4 text-[#c9a84c]" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Client</span>
                </div>
                <p className="text-[15px] font-medium text-[#1a1a1a]">{booking.client}</p>
              </div>

              {/* Service */}
              <div className="flex flex-col rounded-2xl border border-[#e9e3d3] p-4 bg-white shadow-sm">
                <div className="flex items-center gap-2 text-[#5f5f5f] mb-1">
                  <Briefcase className="h-4 w-4 text-[#c9a84c]" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Service</span>
                </div>
                <p className="text-[15px] font-medium text-[#1a1a1a]">{booking.service}</p>
              </div>

              {/* Date & Time */}
              <div className="flex flex-col rounded-2xl border border-[#e9e3d3] p-4 bg-white shadow-sm">
                <div className="flex items-center gap-2 text-[#5f5f5f] mb-1">
                  <Calendar className="h-4 w-4 text-[#c9a84c]" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Date & Time</span>
                </div>
                <p className="text-[15px] font-medium text-[#1a1a1a]">{booking.date}</p>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#eceae5] bg-[#faf9f7] px-6 sm:px-8 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[#e9e3d3] bg-white px-6 text-[15px] font-semibold text-[#1a1a1a] transition-colors hover:bg-[#faf9f7] hover:text-[#5f5f5f] w-full sm:w-auto shadow-sm"
            >
              Close
            </button>
            {onUpdateStatus && booking.status === "pending" && (
              <>
                <button
                  onClick={() => {
                    onUpdateStatus(booking.id, "rejected");
                    onClose();
                  }}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-red-50 px-6 text-[15px] font-semibold text-red-600 transition-colors hover:bg-red-100 w-full sm:w-auto"
                >
                  Decline
                </button>
                <button
                  onClick={() => {
                    onUpdateStatus(booking.id, "confirmed");
                    onClose();
                  }}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-[#c9a84c] px-6 text-[15px] font-semibold text-[#1a1a1a] shadow-sm transition-colors hover:bg-[#d6b45d] hover:shadow-md w-full sm:w-auto"
                >
                  Accept Booking
                </button>
              </>
            )}
            {onUpdateStatus && booking.status === "confirmed" && (
              <button
                onClick={() => {
                  onUpdateStatus(booking.id, "completed");
                  onClose();
                }}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-50 border border-blue-200 px-6 text-[15px] font-semibold text-blue-700 transition-colors hover:bg-blue-100 w-full sm:w-auto shadow-sm"
              >
                Mark as Completed
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewBookingModal;
