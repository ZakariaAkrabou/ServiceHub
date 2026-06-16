import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { Booking } from "../../../app/api/BookingApi";
import { useMemo } from "react";
import Header from "../../../components/client/Header";
import Footer from "../../../components/client/Footer";
import { useGetCustomerBookingsQuery, useSetContactMethodMutation } from "../../../app/api/BookingApi";
import { Calendar, Clock, X, Mail, MessageSquare, Tag, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-toastify";

const ClientBookings: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: bookingsData, isLoading, refetch } = useGetCustomerBookingsQuery();
  const [setContactMethod] = useSetContactMethodMutation();
  
  const [activeTab, setActiveTab] = useState("all");
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [highlightPending, setHighlightPending] = useState<boolean>(false);

  const bookings: Booking[] = useMemo(() => bookingsData?.data || [], [bookingsData?.data]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const highlightId = params.get("highlight");
    if (highlightId) {
      // mark that we want to highlight after bookings arrive
      setHighlightPending(true);
      refetch();
    }
  }, [location.search, refetch]);

  // when bookings data updates, if a highlight was requested, find and open it
  useEffect(() => {
    if (!highlightPending) return;
    const params = new URLSearchParams(location.search);
    const highlightId = params.get("highlight");
    if (!highlightId) return;

    const found = bookings.find((b) => b._id === highlightId);
    if (found) {
      setSelectedBookingId(highlightId);
      setHighlightPending(false);
      // Remove highlight from URL
      window.history.replaceState({}, "", "/bookings");
    }
  }, [bookings, highlightPending, location.search]);

  const filteredBookings = bookings.filter((b) => 
    activeTab === "all" ? true : b.status === activeTab
  );

  const selectedBooking = bookings.find((b) => b._id === selectedBookingId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "text-orange-500 bg-orange-50 border-orange-200";
      case "confirmed": return "text-blue-500 bg-blue-50 border-blue-200";
      case "completed": return "text-green-500 bg-green-50 border-green-200";
      case "cancelled": return "text-red-500 bg-red-50 border-red-200";
      default: return "text-gray-500 bg-gray-50 border-gray-200";
    }
  };

  const handleContactMethod = async (method: "email" | "chat") => {
    if (!selectedBooking) return;
    try {
      const res = await setContactMethod({ id: selectedBooking._id, method }).unwrap();
      refetch();
      if (method === "email" && res.providerEmail) {
        // eslint-disable-next-line react-hooks/immutability
        window.location.href = `mailto:${res.providerEmail}?subject=Booking Query: ${selectedBooking.service_id?.name || "Service"}`;
      } else if (method === "chat") {
        navigate(`/chat/${selectedBooking._id}`);
      }
    } catch (err: unknown) {
      type ErrShape = { data?: { message?: string } } | undefined;
      const e = err as ErrShape;
      toast.error(e?.data?.message || "Failed to set contact method");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-[#222325] flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-[1200px] w-full mx-auto px-6 pt-32 pb-16">
        <h1 className="text-3xl font-black mb-8 text-[#1a1a2e]">My Bookings</h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-[#e4e5e7] pb-4">
          {["all", "pending", "confirmed", "completed", "cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-colors ${
                activeTab === tab 
                  ? "bg-[#1a1a2e] text-white" 
                  : "bg-white text-[#74767e] border border-[#e4e5e7] hover:border-[#c9a84c] hover:text-[#c9a84c]"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* List */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#e4e5e7] border-t-[#c9a84c] rounded-full animate-spin" />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-[#e4e5e7]">
            <Calendar size={48} className="mx-auto text-[#c5c6c9] mb-4" />
            <h3 className="text-xl font-bold text-[#222325] mb-2">No bookings found</h3>
            <p className="text-[#74767e]">You don't have any {activeTab !== 'all' ? activeTab : ''} bookings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((booking) => (
              <div 
                key={booking._id}
                onClick={() => setSelectedBookingId(booking._id)}
                className="bg-white rounded-xl border border-[#e4e5e7] overflow-hidden hover:shadow-lg transition-shadow cursor-pointer flex flex-col"
              >
                <div className="h-40 overflow-hidden relative bg-gray-100">
                  {booking.service_id?.image ? (
                    <img src={booking.service_id.image} alt={booking.service_id.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold border capitalize backdrop-blur-md ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </div>
                </div>
                <div className="p-5 flex-grow flex flex-col">
                  <div className="text-xs font-bold text-[#c9a84c] uppercase tracking-wider mb-2">
                    {booking.service_id?.category || "Unknown"}
                  </div>
                  <h3 className="text-lg font-bold text-[#1a1a2e] mb-4 line-clamp-2">
                    {booking.service_id?.name || "Deleted Service"}
                  </h3>
                  
                  <div className="mt-auto space-y-3">
                    <div className="flex items-center gap-2 text-sm text-[#74767e]">
                      <Calendar size={16} />
                      {booking.booking_time ? new Date(booking.booking_time).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#74767e]">
                      <Clock size={16} />
                      {booking.booking_time ? new Date(booking.booking_time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : '-'}
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold text-[#1a1a2e] pt-3 border-t border-[#f0f0f0]">
                      <Tag size={16} className="text-[#c9a84c]" />
                      ${booking.service_id?.price || 0}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />

      {/* Booking Detail Modal */}
      {selectedBookingId && selectedBooking && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedBookingId(null)}></div>
          
          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-[#e4e5e7] bg-[#fafafa]">
              <h2 className="text-xl font-bold text-[#1a1a2e]">Booking Details</h2>
              <button onClick={() => setSelectedBookingId(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {/* Status Header */}
              <div className={`p-4 rounded-xl border mb-6 flex items-start gap-4 ${getStatusColor(selectedBooking.status)}`}>
                {selectedBooking.status === "pending" && (
                  <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin flex-shrink-0" />
                )}
                {selectedBooking.status === "confirmed" && <CheckCircle className="flex-shrink-0" size={32} />}
                {selectedBooking.status === "completed" && <CheckCircle className="flex-shrink-0" size={32} />}
                {selectedBooking.status === "cancelled" && <XCircle className="flex-shrink-0" size={32} />}
                
                <div>
                  <h3 className="font-bold text-lg capitalize mb-1">Status: {selectedBooking.status}</h3>
                  <p className="text-sm opacity-90">
                    {selectedBooking.status === "pending" && "Waiting for the provider to accept your request..."}
                    {selectedBooking.status === "confirmed" && "Provider has accepted! You can now contact them."}
                    {selectedBooking.status === "completed" && "This service has been completed."}
                    {selectedBooking.status === "cancelled" && "This booking was cancelled."}
                  </p>
                </div>
              </div>

              {/* Service Info */}
              <div className="flex gap-6 mb-8">
                {selectedBooking.service_id?.image && (
                  <img src={selectedBooking.service_id.image} alt="Service" className="w-24 h-24 rounded-lg object-cover border border-[#e4e5e7]" />
                )}
                <div>
                  <div className="text-xs font-bold text-[#c9a84c] uppercase tracking-wider mb-1">
                    {selectedBooking.service_id?.category || "Unknown"}
                  </div>
                  <h4 className="text-xl font-bold text-[#1a1a2e] mb-2">{selectedBooking.service_id?.name || "Deleted Service"}</h4>
                  <div className="text-sm text-[#74767e] space-y-1">
                    <p>Date: {selectedBooking.booking_time ? new Date(selectedBooking.booking_time).toLocaleString() : 'N/A'}</p>
                    <p>Price: ${selectedBooking.service_id?.price || 0}</p>
                  </div>
                </div>
              </div>

              {/* Contact Method Selection for Confirmed */}
              {selectedBooking.status === "confirmed" && (
                <div className="border-t border-[#e4e5e7] pt-6">
                  <h4 className="text-lg font-bold text-[#1a1a2e] mb-4">Contact Provider</h4>
                  
                  {selectedBooking.chosenContactMethod ? (
                    <div className="bg-[#f8f9fa] border border-[#e4e5e7] p-4 rounded-xl">
                      <p className="text-sm text-[#74767e] mb-3">You selected to be contacted via:</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1a1a2e] text-white flex items-center justify-center">
                          {selectedBooking.chosenContactMethod === "email" ? <Mail size={18} /> : <MessageSquare size={18} />}
                        </div>
                        <span className="font-bold capitalize text-[#1a1a2e]">{selectedBooking.chosenContactMethod}</span>
                        
                        {selectedBooking.chosenContactMethod === "chat" && (
                          <button 
                            onClick={() => navigate(`/chat/${selectedBooking._id}`)}
                            className="ml-auto px-4 py-2 bg-[#c9a84c] text-white text-sm font-bold rounded-lg hover:bg-[#b8963e]"
                          >
                            Open Chat
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Email Option */}
                      <div 
                        onClick={() => handleContactMethod("email")}
                        className="p-5 border-2 border-[#e4e5e7] rounded-xl hover:border-[#c9a84c] hover:bg-[#fffcf5] cursor-pointer transition-all flex flex-col items-center text-center group"
                      >
                        <div className="w-12 h-12 rounded-full bg-[#f8f9fa] group-hover:bg-[#c9a84c] group-hover:text-white text-[#74767e] flex items-center justify-center mb-4 transition-colors">
                          <Mail size={24} />
                        </div>
                        <h5 className="font-bold text-[#1a1a2e] mb-2">Contact via Email</h5>
                        <p className="text-xs text-[#74767e]">Provider will receive your email address to coordinate.</p>
                      </div>

                      {/* Chat Option */}
                      <div 
                        onClick={() => handleContactMethod("chat")}
                        className="p-5 border-2 border-[#e4e5e7] rounded-xl hover:border-[#c9a84c] hover:bg-[#fffcf5] cursor-pointer transition-all flex flex-col items-center text-center group"
                      >
                        <div className="w-12 h-12 rounded-full bg-[#f8f9fa] group-hover:bg-[#c9a84c] group-hover:text-white text-[#74767e] flex items-center justify-center mb-4 transition-colors">
                          <MessageSquare size={24} />
                        </div>
                        <h5 className="font-bold text-[#1a1a2e] mb-2">Open In-App Chat</h5>
                        <p className="text-xs text-[#74767e]">Chat directly with the provider on our platform.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientBookings;
