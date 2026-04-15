import { XCircle, X } from "lucide-react";
import { type Booking } from "../Providers/data/bookingMockData";

interface BookingRejectConfirmationModalProps {
  booking: Booking;
  onClose: () => void;
  onConfirm: () => void;
}

export default function BookingRejectConfirmationModal({ booking, onClose, onConfirm }: BookingRejectConfirmationModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#081D3A]/30 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
              <XCircle className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 leading-tight">Reject Booking?</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-white border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-900 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600">
            Are you sure you want to reject Booking <strong className="text-gray-900">#{booking.id}</strong>? The status will be updated to "Cancelled" and the customer will be notified.
          </p>
        </div>

        <div className="bg-gray-50 border-t border-gray-100 p-4 px-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-all shadow-sm"
          >
            Yes, Reject
          </button>
        </div>
      </div>
    </div>
  );
}
