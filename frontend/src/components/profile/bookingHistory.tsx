import React, { useState } from "react";
import { 
  Calendar, Clock, MessageSquare, Mail, Phone, 
  ChevronDown, ChevronUp, RefreshCw, Check, X,
  MapPin, ShieldCheck, AlertCircle
} from "lucide-react";

interface MockBooking {
  _id: string;
  serviceName: string;
  category: string;
  providerName: string;
  providerEmail: string;
  providerPhone: string;
  providerAvatar: string;
  providerTier: string;
  bookingTime: string;
  price: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

const initialBookings: MockBooking[] = [
  {
    _id: "B-8829",
    serviceName: "Deep Home Cleaning",
    category: "Cleaning",
    providerName: "Sarah Jenkins",
    providerEmail: "sarah@servicehub.com",
    providerPhone: "+1 (555) 123-4567",
    providerAvatar: "SJ",
    providerTier: "Pro Expert",
    bookingTime: "2026-05-26T10:00:00.000Z",
    price: 120,
    status: "pending",
    createdAt: "2026-05-22T21:00:00.000Z"
  },
  {
    _id: "B-7412",
    serviceName: "Smart Lock Installation",
    category: "Smart Home",
    providerName: "Marcus Vance",
    providerEmail: "marcus@servicehub.com",
    providerPhone: "+1 (555) 987-6543",
    providerAvatar: "MV",
    providerTier: "Top Rated",
    bookingTime: "2026-05-24T14:30:00.000Z",
    price: 85,
    status: "confirmed",
    createdAt: "2026-05-21T09:15:00.000Z"
  },
  {
    _id: "B-5301",
    serviceName: "Wall Mounting - 65\" TV",
    category: "Handyman",
    providerName: "David Russo",
    providerEmail: "david@servicehub.com",
    providerPhone: "+1 (555) 456-7890",
    providerAvatar: "DR",
    providerTier: "Elite Tasker",
    bookingTime: "2026-05-15T11:00:00.000Z",
    price: 65,
    status: "completed",
    createdAt: "2026-05-12T14:00:00.000Z"
  }
];

export default function BookingHistory() {
  const [bookings, setBookings] = useState<MockBooking[]>(initialBookings);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "completed" | "cancelled">("all");
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);

  const filteredBookings = bookings.filter(b => filter === "all" || b.status === filter);

  const formatDateTime = (isoStr: string) => {
    const d = new Date(isoStr);
    return d.toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "numeric", minute: "2-digit", hour12: true
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedBookingId(prev => prev === id ? null : id);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#EBE6DD] p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A2E] font-serif">My Bookings</h2>
          <p className="text-sm text-[#1A1A2E]/60 mt-1">Manage your service requests and view provider details.</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 border-b border-[#EBE6DD] scrollbar-none">
        {(["all", "pending", "confirmed", "completed", "cancelled"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
              filter === status
                ? "bg-[#C9A84C] text-white shadow-md"
                : "bg-[#FDFBF7] text-[#1A1A2E]/60 border border-[#EBE6DD] hover:border-[#C9A84C] hover:text-[#1A1A2E]"
            }`}
          >
            {status} ({bookings.filter(b => status === "all" || b.status === status).length})
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {filteredBookings.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-[#EBE6DD] rounded-xl bg-[#FDFBF7]">
            <Calendar className="h-10 w-10 text-[#C9A84C]/50 mx-auto mb-3" />
            <p className="text-[#1A1A2E] font-medium">No bookings found</p>
            <p className="text-sm text-[#1A1A2E]/50 mt-1">Try changing your filters to see more results.</p>
          </div>
        ) : (
          filteredBookings.map(booking => (
            <div key={booking._id} className="border border-[#EBE6DD] rounded-xl bg-[#FDFBF7] overflow-hidden transition-all hover:shadow-md">
              <div 
                className="p-5 flex flex-col sm:flex-row gap-5 cursor-pointer"
                onClick={() => toggleExpand(booking._id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-black uppercase tracking-widest text-[#C9A84C]">
                      {booking.category}
                    </span>
                    <span className="text-xs text-[#1A1A2E]/40 font-medium">ID: {booking._id}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">{booking.serviceName}</h3>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-[#1A1A2E]/70 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-[#C9A84C]" />
                      {formatDateTime(booking.bookingTime)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-[#1A1A2E] text-white flex items-center justify-center text-[10px] font-bold">
                        {booking.providerAvatar}
                      </div>
                      {booking.providerName}
                    </span>
                  </div>
                </div>

                <div className="flex flex-row sm:flex-col justify-between items-center sm:items-end border-t sm:border-t-0 border-[#EBE6DD] pt-4 sm:pt-0">
                  <div className="text-xl font-black text-[#1A1A2E]">${booking.price}</div>
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
                          Please wait until <strong>{booking.providerName}</strong> accepts your booking request. Once confirmed, you will be able to access their contact information (email, phone) or initiate an in-app chat.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-[#FDFBF7] border border-[#EBE6DD] rounded-xl p-4">
                        <p className="text-xs text-[#1A1A2E]/50 font-bold uppercase tracking-wider mb-3">Direct Contact</p>
                        <div className="flex flex-col gap-3">
                          <a href={`mailto:${booking.providerEmail}`} className="flex items-center gap-3 text-sm font-medium text-[#1A1A2E] hover:text-[#C9A84C] transition-colors">
                            <div className="w-8 h-8 rounded-full bg-white border border-[#EBE6DD] shadow-sm flex items-center justify-center">
                              <Mail className="h-4 w-4" />
                            </div>
                            {booking.providerEmail}
                          </a>
                          <a href={`tel:${booking.providerPhone}`} className="flex items-center gap-3 text-sm font-medium text-[#1A1A2E] hover:text-[#C9A84C] transition-colors">
                            <div className="w-8 h-8 rounded-full bg-white border border-[#EBE6DD] shadow-sm flex items-center justify-center">
                              <Phone className="h-4 w-4" />
                            </div>
                            {booking.providerPhone}
                          </a>
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
    </div>
  );
}
