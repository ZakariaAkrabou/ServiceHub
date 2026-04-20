import { X, Calendar, User, Briefcase } from "lucide-react";
import { type Booking } from "../Providers/data/bookingMockData";

interface BookingDetailModalProps {
  booking: Booking;
  onClose: () => void;
}

export default function BookingDetailModal({
  booking,
  onClose,
}: BookingDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#081D3A]/30 backdrop-blur-sm transition-opacity animate-in fade-in duration-200 r"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="h-24 bg-gray-50 border-b border-gray-100 flex items-start justify-between px-6 pt-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-[#081D3A] bg-[#F3F3F3] font-bold text-2xl shadow-sm border-2 border-white -mt-2">
              {booking.avatar}
            </div>
            <div className="pb-2">
              <h3 className="text-xl font-bold text-[#081D3A] leading-tight">
                Booking #{booking.id}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`inline-flex shrink-0 items-center justify-center text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                    booking.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : booking.status === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : booking.status === "Confirmed"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                  }`}
                >
                  {booking.status}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                  <User className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    Customer
                  </p>
                  <p className="font-semibold text-gray-900">
                    {booking.customerName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                  <Briefcase className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    Provider / Service
                  </p>
                  <p className="font-semibold text-gray-900">
                    {booking.provider} &bull;{" "}
                    <span className="text-gray-600 font-normal">
                      {booking.serviceName}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                  <Calendar className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    Booking Date
                  </p>
                  <p className="font-semibold text-gray-900">
                    {booking.bookingDate}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5 text-[13px] text-blue-800 font-medium">
                Booking ID <strong>{booking.id}</strong> is currently{" "}
                <strong>{booking.status}</strong>.
                {booking.status === "Pending" &&
                  " Administrator review or provider confirmation may be required."}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
