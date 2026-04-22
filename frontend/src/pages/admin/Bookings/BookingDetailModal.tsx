import { X, Calendar, User, Briefcase, Hash } from "lucide-react";

interface BookingDetailModalProps {
  booking: any;
  onClose: () => void;
}

export default function BookingDetailModal({ booking, onClose }: BookingDetailModalProps) {
  const customerName =
    `${booking.customer_id?.firstName ?? ""} ${booking.customer_id?.lastName ?? ""}`.trim() || "Inconnu";
  const avatar = booking.customer_id?.firstName?.charAt(0)?.toUpperCase() || "?";
  const serviceName = booking.service_id?.name || "—";
  const providerName =
    `${booking.service_id?.provider_id?.firstName ?? ""} ${booking.service_id?.provider_id?.lastName ?? ""}`.trim() || "—";

 
  const bookingDate = booking.booking_time
    ? new Date(booking.booking_time).toLocaleDateString("fr-FR", {
        year: "numeric", month: "long", day: "numeric",
        hour: "2-digit", minute: "2-digit",
      })
    : "—";

 
  const status = booking.status || "unknown";
  const bookingId = booking._id?.slice(-6) || "—";

  const statusStyles: Record<string, string> = {
    completed: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    cancelled: "bg-red-100 text-red-700",
  };
  const badgeStyle = statusStyles[status.toLowerCase()] ?? "bg-gray-100 text-gray-700";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#081D3A]/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-xl flex flex-col overflow-hidden">
        <div className="h-24 bg-gray-50 border-b border-gray-100 flex items-start justify-between px-6 pt-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-[#081D3A] bg-[#F3F3F3] font-bold text-2xl shadow-sm border-2 border-white -mt-2">
              {avatar}
            </div>
            <div className="pb-2">
              <h3 className="text-xl font-bold text-[#081D3A]">Réservation #{bookingId}</h3>
              <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider mt-1 ${badgeStyle}`}>
                {status}
              </span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 rounded-full cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                  <User className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Client</p>
                  <p className="font-semibold text-gray-900">{customerName}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                  <Briefcase className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Prestataire / Service</p>
                  <p className="font-semibold text-gray-900">{providerName} &bull; <span className="font-normal text-gray-600">{serviceName}</span></p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                  <Calendar className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Date de réservation</p>
                  <p className="font-semibold text-gray-900">{bookingDate}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                  <Hash className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ID Complet</p>
                  <p className="font-mono text-xs text-gray-600 break-all">{booking._id}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5 text-[13px] text-blue-800 font-medium">
                La réservation <strong>#{bookingId}</strong> est actuellement <strong>{status}</strong>.
                {status.toLowerCase() === "pending" && " Une confirmation peut être requise."}
              </div>
              {booking.chosenContactMethod && (
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 text-[13px] text-gray-700">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Méthode de contact</p>
                  <p className="capitalize">{booking.chosenContactMethod}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}