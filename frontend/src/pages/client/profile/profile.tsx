import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store/store";
import Header from "../../../components/client/Header";
import Footer from "../../../components/client/Footer";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  Edit3,
  Save,
  X,
  Check,
  Bell,
  Trash2,
  CalendarDays,
  Award,
  ChevronRight,
  MessageSquare,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface MockBooking {
  _id: string;
  serviceName: string;
  category: string;
  providerName: string;
  providerAvatar: string;
  providerTier: string;
  bookingTime: string;
  price: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

interface MockNotification {
  _id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning";
  timestamp: string;
  isUnread: boolean;
}

export default function Profile() {

  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);


  const [activeTab, setActiveTab] = useState<"info" | "bookings" | "notifications">("info");

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "124 Park Avenue, Apt 4B, New York, NY 10016",
    bio: "Homeowner looking for reliable professional help with smart device installations, mounting, and seasonal deep cleaning.",
    receiveEmailNotifs: true,
    receiveSmsNotifs: false
  });

  
  useEffect(() => {
    if (isAuthenticated && user) {
      setProfileData((prev) => ({
        ...prev,
        firstName: user.firstName || "Zakaria",
        lastName: user.lastName || "Akrabou",
        email: user.email || "zakaria@example.com",
        phone: user.phone || "+1 (555) 349-2041"
      }));
    } else {
      
      setProfileData((prev) => ({
        ...prev,
        firstName: "Zakaria",
        lastName: "Akrabou",
        email: "zakaria@example.com",
        phone: "+1 (555) 349-2041"
      }));
    }
  }, [isAuthenticated, user]);

  // Form edit temp state
  const [editForm, setEditForm] = useState({ ...profileData });

  // Notifications or toast messages
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Mock Bookings State
  const [bookings, setBookings] = useState<MockBooking[]>([
    {
      _id: "B-8829",
      serviceName: "Deep Home Cleaning & Sanitization",
      category: "Cleaning",
      providerName: "Sarah Jenkins",
      providerAvatar: "SJ",
      providerTier: "Pro Expert",
      bookingTime: "2026-05-26T10:00:00.000Z",
      price: 120,
      status: "pending",
      createdAt: "2026-05-22T21:00:00.000Z"
    },
    {
      _id: "B-7412",
      serviceName: "Smart Lock Installation & Setup",
      category: "Smart Home",
      providerName: "Marcus Vance",
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
      providerAvatar: "DR",
      providerTier: "Elite Tasker",
      bookingTime: "2026-05-15T11:00:00.000Z",
      price: 65,
      status: "completed",
      createdAt: "2026-05-12T14:00:00.000Z"
    },
    {
      _id: "B-2104",
      serviceName: "Emergency Plumbing Leak Repair",
      category: "Plumbing",
      providerName: "Arthur Pendelton",
      providerAvatar: "AP",
      providerTier: "Licensed Plumber",
      bookingTime: "2026-04-28T16:00:00.000Z",
      price: 150,
      status: "cancelled",
      createdAt: "2026-04-27T10:30:00.000Z"
    }
  ]);

  // Bookings filter state
  const [bookingFilter, setBookingFilter] = useState<"all" | "pending" | "confirmed" | "completed" | "cancelled">("all");

  // Mock Notifications State
  const [notifications, setNotifications] = useState<MockNotification[]>([
    {
      _id: "N-001",
      title: "Booking Request Delivered",
      message: "Your request for 'Deep Home Cleaning & Sanitization' has been sent to Sarah Jenkins. You will be notified once they accept or propose adjustments.",
      type: "info",
      timestamp: "10 minutes ago",
      isUnread: true
    },
    {
      _id: "N-002",
      title: "Smart Lock Installation Confirmed!",
      message: "Marcus Vance has confirmed your booking for 'Smart Lock Installation & Setup' on May 24th at 2:30 PM. Your payment remains secured in escrow.",
      type: "success",
      timestamp: "2 hours ago",
      isUnread: true
    },
    {
      _id: "N-003",
      title: "Job Complete & Payment Released",
      message: "David Russo completed the 'Wall Mounting - 65\" TV' task. The payment of $65 has been successfully released from Stripe escrow.",
      type: "success",
      timestamp: "1 week ago",
      isUnread: false
    },
    {
      _id: "N-004",
      title: "Security Update",
      message: "Your profile information was accessed from a new browser device. If this wasn't you, please reset your password.",
      type: "warning",
      timestamp: "2 weeks ago",
      isUnread: false
    }
  ]);

  // Toast Helper
  const showToast = (type: "success" | "error", text: string) => {
    setToast({ type, text });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Profile Save Action
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileData({ ...editForm });
    setIsEditing(false);
    showToast("success", "Your profile details have been updated successfully.");

    // Add a mock notification for profile update
    const newNotif: MockNotification = {
      _id: `N-${Date.now()}`,
      title: "Profile Settings Saved",
      message: "You successfully updated your personal information and contact preferences.",
      type: "info",
      timestamp: "Just now",
      isUnread: true
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Cancel Booking Action
  const handleCancelBooking = (bookingId: string, serviceName: string) => {
    setBookings((prev) =>
      prev.map((bk) => (bk._id === bookingId ? { ...bk, status: "cancelled" } : bk))
    );
    showToast("success", `Booking ${bookingId} has been successfully cancelled.`);

    // Add a mock notification for cancellation
    const newNotif: MockNotification = {
      _id: `N-${Date.now()}`,
      title: "Booking Cancelled",
      message: `You cancelled the booking request for '${serviceName}' (ID: ${bookingId}).`,
      type: "warning",
      timestamp: "Just now",
      isUnread: true
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Mark all notifications as read
  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((nt) => ({ ...nt, isUnread: false })));
    showToast("success", "All notifications marked as read.");
  };

  // Clear specific notification
  const handleDismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((nt) => nt._id !== id));
  };

  // Format timestamp helper
  const formatDateTime = (isoStr: string) => {
    const d = new Date(isoStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  };

  // Filters bookings list
  const filteredBookings = bookings.filter((bk) => {
    if (bookingFilter === "all") return true;
    return bk.status === bookingFilter;
  });

  const unreadCount = notifications.filter((nt) => nt.isUnread).length;

  return (
    <div className="services-page-nav min-h-screen bg-[#F5F0E8]/20 font-sans antialiased text-[#1A1A2E]">
      <Header />

      {/* Global CSS for Animations and Custom Overrides */}
      <style>{`
        @keyframes profileFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-profile-fade {
          animation: profileFadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .text-font-primary {
          font-family: "Times New Roman", sans-serif, "Geist", "Inter";
        }
      `}</style>

      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-[#1A1A2E] text-white p-4 border border-[#C9A84C]/35 shadow-2xl animate-bounce">
          {toast.type === "success" ? (
            <CheckCircle className="h-5 w-5 text-[#C9A84C]" />
          ) : (
            <AlertCircle className="h-5 w-5 text-red-400" />
          )
          }
          <span className="text-sm font-semibold tracking-wide">{toast.text}</span>
        </div>
      )}

    
     <main className="max-w-screen-2xl mx-auto px-15 pt-30 pb-24">
        
        
        <div className="mb-10 anim-profile-fade">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#C9A84C] block mb-1">
            Client Portal
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A2E] leading-tight text-font-primary">
            My <span className="text-transparent bg-clip-text bg-linear-to-r from-[#1A1A2E] to-[#C9A84C]">Profile</span>
          </h1>
          <p className="text-sm text-[#1A1A2E]/60 mt-1">
            Manage your personal data, check booking schedules, and review system updates.
          </p>
        </div>

       
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
   
          <div className="lg:col-span-1 flex flex-col gap-6 anim-profile-fade" style={{ animationDelay: "50ms" }}>
            
       
            <div className="rounded-2xl border border-[#e9e3d3] bg-white p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-2 bg-linear-to-r from-[#1A1A2E] via-[#C9A84C] to-[#1A1A2E]" />
              
             
              <div className="h-24 w-24 rounded-full border-4 border-[#F5F0E8] bg-[#1A1A2E] text-[#C9A84C] flex items-center justify-center text-3xl font-bold font-serif mb-4 shadow-sm select-none">
                {profileData.firstName[0]}{profileData.lastName[0]}
              </div>

              <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center gap-1.5 justify-center">
                {profileData.firstName} {profileData.lastName}
                <ShieldCheck className="h-5 w-5 text-[#C9A84C] shrink-0" aria-label="Verified Customer" />
              </h2>
              
              <span className="text-[11px] font-extrabold uppercase tracking-widest bg-[#F5F0E8] text-[#1A1A2E]/70 px-3 py-1 rounded-full mt-2">
                Client Level I
              </span>

              <div className="w-full border-t border-black/5 my-5" />

           
              <div className="w-full flex flex-col gap-3 text-left text-xs">
                <div className="flex items-center justify-between text-[#1A1A2E]/60">
                  <span className="flex items-center gap-2 font-medium">
                    <Mail className="h-3.5 w-3.5 text-[#C9A84C]" /> Email
                  </span>
                  <span className="font-bold text-[#1A1A2E] truncate max-w-45" title={profileData.email}>
                    {profileData.email}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#1A1A2E]/60">
                  <span className="flex items-center gap-2 font-medium">
                    <Phone className="h-3.5 w-3.5 text-[#C9A84C]" /> Phone
                  </span>
                  <span className="font-bold text-[#1A1A2E]">
                    {profileData.phone || "Not set"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[#1A1A2E]/60">
                  <span className="flex items-center gap-2 font-medium">
                    <Calendar className="h-3.5 w-3.5 text-[#C9A84C]" /> Registry
                  </span>
                  <span className="font-bold text-[#1A1A2E]">May 2025</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl border border-[#e9e3d3] bg-white p-3 text-center shadow-xs">
                <span className="block text-xl font-black text-[#1A1A2E]">
                  {bookings.length}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-[#1A1A2E]/50 font-bold">
                  Total
                </span>
              </div>
              <div className="rounded-xl border border-[#e9e3d3] bg-white p-3 text-center shadow-xs">
                <span className="block text-xl font-black text-[#C9A84C]">
                  {bookings.filter((b) => b.status === "pending").length}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-[#1A1A2E]/50 font-bold">
                  Pending
                </span>
              </div>
              <div className="rounded-xl border border-[#e9e3d3] bg-white p-3 text-center shadow-xs">
                <span className="block text-xl font-black text-emerald-600">
                  {bookings.filter((b) => b.status === "confirmed").length}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-[#1A1A2E]/50 font-bold">
                  Active
                </span>
              </div>
            </div>

           
            <div className="rounded-2xl border border-[#e9e3d3] bg-white p-2.5 shadow-sm flex flex-col gap-1">
              <button
                onClick={() => setActiveTab("info")}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl text-left text-sm font-bold transition-all ${
                  activeTab === "info"
                    ? "bg-[#1A1A2E] text-white"
                    : "text-[#1A1A2E] hover:bg-[#F5F0E8]/40"
                }`}
              >
                <span className="flex items-center gap-3">
                  <User className="h-4 w-4 shrink-0" /> Personal Account Info
                </span>
                <ChevronRight className={`h-4 w-4 opacity-40 ${activeTab === "info" ? "rotate-90 text-[#C9A84C] opacity-100" : ""}`} />
              </button>

              <button
                onClick={() => setActiveTab("bookings")}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl text-left text-sm font-bold transition-all ${
                  activeTab === "bookings"
                    ? "bg-[#1A1A2E] text-white"
                    : "text-[#1A1A2E] hover:bg-[#F5F0E8]/40"
                }`}
              >
                <span className="flex items-center gap-3">
                  <CalendarDays className="h-4 w-4 shrink-0" /> My Booking History
                </span>
                <ChevronRight className={`h-4 w-4 opacity-40 ${activeTab === "bookings" ? "rotate-90 text-[#C9A84C] opacity-100" : ""}`} />
              </button>

              <button
                onClick={() => setActiveTab("notifications")}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl text-left text-sm font-bold transition-all ${
                  activeTab === "notifications"
                    ? "bg-[#1A1A2E] text-white"
                    : "text-[#1A1A2E] hover:bg-[#F5F0E8]/40"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Bell className="h-4 w-4 shrink-0" /> Live Notification Center
                  {unreadCount > 0 && (
                    <span className="bg-[#C9A84C] text-[#1A1A2E] text-[10px] font-black px-2 py-0.5 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </span>
                <ChevronRight className={`h-4 w-4 opacity-40 ${activeTab === "notifications" ? "rotate-90 text-[#C9A84C] opacity-100" : ""}`} />
              </button>
            </div>

            {/* Premium Escrow Notice Box */}
            <div className="rounded-2xl border border-black/5 bg-[#F5F0E8]/30 p-5">
              <h3 className="text-xs uppercase font-extrabold tracking-wider text-[#1A1A2E] mb-2 flex items-center gap-1.5">
                <Award className="h-4 w-4 text-[#C9A84C]" /> Secure Hub Guarantee
              </h3>
              <p className="text-xs text-[#1A1A2E]/70 leading-relaxed">
                Stripe release protection is active on all transactions. Funds are held in security escrow and released only after you verify task completion.
              </p>
            </div>

          </div>

          
          <div className="lg:col-span-2 anim-profile-fade" style={{ animationDelay: "100ms" }}>
            
      
            <div className="rounded-2xl border border-[#e9e3d3] bg-white p-6 sm:p-8 shadow-sm min-h-125">
              
         
              {activeTab === "info" && (
                <div>
                  <div className="flex items-center justify-between border-b border-black/5 pb-4 mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-[#1A1A2E] text-font-primary">
                        Account Details
                      </h2>
                      <p className="text-xs text-[#1A1A2E]/50 mt-0.5">
                        Manage details we use to coordinate services at your location.
                      </p>
                    </div>
                    {!isEditing && (
                      <button
                        onClick={() => {
                          setEditForm({ ...profileData });
                          setIsEditing(true);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-[#C9A84C]/45 px-4 py-2 text-xs font-bold text-[#1A1A2E] bg-white hover:bg-[#F5F0E8]/20 transition cursor-pointer"
                      >
                        <Edit3 className="h-3.5 w-3.5 text-[#C9A84C]" /> Edit Info
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    /* EDITING STATE FORM */
                    <form onSubmit={handleSaveProfile} className="flex flex-col gap-5">
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="mb-1.5 block text-xs font-bold uppercase text-[#1A1A2E]/60 tracking-wider">
                            First Name
                          </label>
                          <input
                            type="text"
                            required
                            value={editForm.firstName}
                            onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                            className="h-11 w-full rounded-xl border border-[#e9e3d3] bg-[#faf9f7] px-4 text-sm text-[#1A1A2E] outline-none transition-all focus:border-[#C9A84C] focus:bg-white focus:ring-2 focus:ring-[#C9A84C]/25"
                          />
                        </div>

                        <div>
                          <label className="mb-1.5 block text-xs font-bold uppercase text-[#1A1A2E]/60 tracking-wider">
                            Last Name
                          </label>
                          <input
                            type="text"
                            required
                            value={editForm.lastName}
                            onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                            className="h-11 w-full rounded-xl border border-[#e9e3d3] bg-[#faf9f7] px-4 text-sm text-[#1A1A2E] outline-none transition-all focus:border-[#C9A84C] focus:bg-white focus:ring-2 focus:ring-[#C9A84C]/25"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="mb-1.5 block text-xs font-bold uppercase text-[#1A1A2E]/60 tracking-wider">
                            Email Address
                          </label>
                          <input
                            type="email"
                            required
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            className="h-11 w-full rounded-xl border border-[#e9e3d3] bg-[#faf9f7] px-4 text-sm text-[#1A1A2E] outline-none transition-all focus:border-[#C9A84C] focus:bg-white focus:ring-2 focus:ring-[#C9A84C]/25"
                          />
                        </div>

                        <div>
                          <label className="mb-1.5 block text-xs font-bold uppercase text-[#1A1A2E]/60 tracking-wider">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            value={editForm.phone}
                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            placeholder="+1 (555) 000-0000"
                            className="h-11 w-full rounded-xl border border-[#e9e3d3] bg-[#faf9f7] px-4 text-sm text-[#1A1A2E] outline-none transition-all focus:border-[#C9A84C] focus:bg-white focus:ring-2 focus:ring-[#C9A84C]/25"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-bold uppercase text-[#1A1A2E]/60 tracking-wider">
                          Primary Service Address
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-[#C9A84C]" />
                          <textarea
                            value={editForm.address}
                            onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                            rows={2}
                            required
                            className="w-full rounded-xl border border-[#e9e3d3] bg-[#faf9f7] pl-10 pr-4 py-3 text-sm text-[#1A1A2E] outline-none transition-all focus:border-[#C9A84C] focus:bg-white focus:ring-2 focus:ring-[#C9A84C]/25 resize-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-xs font-bold uppercase text-[#1A1A2E]/60 tracking-wider">
                          Bio / Instructions
                        </label>
                        <textarea
                          value={editForm.bio}
                          onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                          rows={3}
                          className="w-full rounded-xl border border-[#e9e3d3] bg-[#faf9f7] px-4 py-3 text-sm text-[#1A1A2E] outline-none transition-all focus:border-[#C9A84C] focus:bg-white focus:ring-2 focus:ring-[#C9A84C]/25 resize-none"
                        />
                      </div>

                      <div className="border-t border-black/5 pt-4 mt-2">
                        <h3 className="text-xs uppercase font-extrabold tracking-wider text-[#1A1A2E] mb-3">
                          Notification Preferences
                        </h3>
                        <div className="flex flex-col gap-3">
                          <label className="flex items-center gap-3 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={editForm.receiveEmailNotifs}
                              onChange={(e) => setEditForm({ ...editForm, receiveEmailNotifs: e.target.checked })}
                              className="h-4.5 w-4.5 rounded border-[#e9e3d3] text-[#1A1A2E] focus:ring-[#C9A84C]"
                            />
                            <span className="text-sm text-[#1A1A2E]/80 font-medium">Receive booking updates via Email</span>
                          </label>
                          <label className="flex items-center gap-3 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={editForm.receiveSmsNotifs}
                              onChange={(e) => setEditForm({ ...editForm, receiveSmsNotifs: e.target.checked })}
                              className="h-4.5 w-4.5 rounded border-[#e9e3d3] text-[#1A1A2E] focus:ring-[#C9A84C]"
                            />
                            <span className="text-sm text-[#1A1A2E]/80 font-medium">Receive immediate SMS notifications</span>
                          </label>
                        </div>
                      </div>

                      {/* Form Actions */}
                      <div className="flex items-center justify-end gap-3 border-t border-black/5 pt-5 mt-3">
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl border border-black/10 px-5 text-sm font-bold text-[#1A1A2E]/70 hover:bg-[#F5F0E8]/40 transition"
                        >
                          <X className="h-4 w-4" /> Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-[#1A1A2E] text-white hover:bg-[#C9A84C] hover:text-[#1A1A2E] px-6 text-sm font-bold shadow-sm transition"
                        >
                          <Save className="h-4 w-4" /> Save Changes
                        </button>
                      </div>

                    </form>
                  ) : (
                    /* VIEW PROFILE STATE */
                    <div className="flex flex-col gap-6">
                      
                      {/* Personal Data Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-widest text-[#1A1A2E]/40 block mb-1">
                            First Name
                          </span>
                          <p className="text-sm font-bold text-[#1A1A2E]">
                            {profileData.firstName}
                          </p>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-widest text-[#1A1A2E]/40 block mb-1">
                            Last Name
                          </span>
                          <p className="text-sm font-bold text-[#1A1A2E]">
                            {profileData.lastName}
                          </p>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-widest text-[#1A1A2E]/40 block mb-1">
                            Email Address
                          </span>
                          <p className="text-sm font-bold text-[#1A1A2E]">
                            {profileData.email}
                          </p>
                        </div>

                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-widest text-[#1A1A2E]/40 block mb-1">
                            Phone Number
                          </span>
                          <p className="text-sm font-bold text-[#1A1A2E]">
                            {profileData.phone || "Not configured"}
                          </p>
                        </div>
                      </div>

                      {/* Primary Address */}
                      <div className="border-t border-black/5 pt-5">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#1A1A2E]/40 block mb-1.5">
                          Primary Service Address
                        </span>
                        <div className="flex items-start gap-2 text-sm text-[#1A1A2E] font-medium leading-relaxed bg-[#F5F0E8]/20 p-4 rounded-xl border border-[#e9e3d3]/60">
                          <MapPin className="h-5 w-5 text-[#C9A84C] shrink-0 mt-0.5" />
                          <p>{profileData.address}</p>
                        </div>
                      </div>

                      {/* Bio Statement */}
                      <div className="border-t border-black/5 pt-5">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#1A1A2E]/40 block mb-1.5">
                          About Client / Service Notes
                        </span>
                        <p className="text-sm text-[#1A1A2E]/70 leading-relaxed italic">
                          "{profileData.bio}"
                        </p>
                      </div>

                      {/* Notification Sub-Card */}
                      <div className="border-t border-black/5 pt-5">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#1A1A2E]/40 block mb-3">
                          Subscription Settings
                        </span>
                        <div className="flex flex-wrap gap-4 text-xs font-bold">
                          <span className={`px-4 py-2.5 rounded-xl border flex items-center gap-2 ${
                            profileData.receiveEmailNotifs 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                              : "bg-gray-50 text-gray-400 border-gray-100"
                          }`}>
                            <Check className="h-4 w-4" /> Email Updates: {profileData.receiveEmailNotifs ? "ON" : "OFF"}
                          </span>
                          <span className={`px-4 py-2.5 rounded-xl border flex items-center gap-2 ${
                            profileData.receiveSmsNotifs 
                              ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                              : "bg-gray-50 text-gray-400 border-gray-100"
                          }`}>
                            <Check className="h-4 w-4" /> SMS Updates: {profileData.receiveSmsNotifs ? "ON" : "OFF"}
                          </span>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: BOOKING HISTORY */}
              {activeTab === "bookings" && (
                <div>
                  
                  {/* Tab Title Section */}
                  <div className="border-b border-black/5 pb-4 mb-6">
                    <h2 className="text-xl font-bold text-[#1A1A2E] text-font-primary">
                      My Bookings
                    </h2>
                    <p className="text-xs text-[#1A1A2E]/50 mt-0.5">
                      Review progress on service requests and past order completions.
                    </p>
                  </div>

                  {/* Booking Filter Buttons */}
                  <div className="flex gap-2 pb-5 overflow-x-auto scrollbar-none mb-4 border-b border-black/5">
                    {(["all", "pending", "confirmed", "completed", "cancelled"] as const).map((status) => {
                      const isActive = bookingFilter === status;
                      const count = status === "all" 
                        ? bookings.length 
                        : bookings.filter((b) => b.status === status).length;
                      return (
                        <button
                          key={status}
                          onClick={() => setBookingFilter(status)}
                          className={`h-9 px-4 rounded-full text-xs font-bold transition-all shrink-0 uppercase tracking-wider cursor-pointer border ${
                            isActive
                              ? "bg-[#1A1A2E] border-[#1A1A2E] text-white font-black"
                              : "bg-[#F5F0E8]/40 border-[#e9e3d3] text-[#1A1A2E]/60 hover:bg-[#F5F0E8]/80 hover:text-[#1A1A2E]"
                          }`}
                        >
                          {status} ({count})
                        </button>
                      );
                    })}
                  </div>

                  {/* Bookings List */}
                  {filteredBookings.length === 0 ? (
                    <div className="text-center py-16 text-[#1A1A2E]/40 flex flex-col items-center">
                      <Calendar className="h-12 w-12 opacity-25 mb-4 text-[#C9A84C]" />
                      <p className="text-sm font-bold">No bookings found</p>
                      <p className="text-xs opacity-80 mt-1">There are no bookings matching the selected status filter.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-5">
                      {filteredBookings.map((bk) => (
                        <div
                          key={bk._id}
                          className="rounded-xl border border-[#e9e3d3] bg-[#faf9f7]/40 hover:bg-white p-5 transition-all shadow-2xs hover:shadow-sm"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                            
                            {/* Booking Info Panel */}
                            <div className="flex gap-4 items-start">
                              
                              {/* Icon placeholder corresponding to category */}
                              <div className="w-12 h-12 rounded-xl bg-[#1A1A2E] text-[#C9A84C] flex items-center justify-center font-bold text-sm shrink-0 border border-[#C9A84C]/20 shadow-inner">
                                {bk.category[0]}
                              </div>

                              <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#C9A84C]">
                                  {bk.category} • ID: {bk._id}
                                </span>
                                <h3 className="text-base font-extrabold text-[#1A1A2E] mt-0.5 leading-tight">
                                  {bk.serviceName}
                                </h3>
                                
                                {/* Date and Time details */}
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2.5 text-xs text-[#1A1A2E]/60 font-medium">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3.5 w-3.5 text-[#C9A84C]" />
                                    {formatDateTime(bk.bookingTime)}
                                  </span>
                                  <span className="flex items-center gap-1.5">
                                    <span className="h-5 w-5 rounded-full bg-[#1A1A2E] text-[#C9A84C] flex items-center justify-center text-[9px] font-bold">
                                      {bk.providerAvatar}
                                    </span>
                                    Provider: <strong>{bk.providerName}</strong>
                                    <span className="text-[9px] text-[#C9A84C] border border-[#C9A84C]/35 px-1.5 py-0.2 rounded font-black uppercase">
                                      {bk.providerTier}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Booking Price & Status */}
                            <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-black/5 pt-3 sm:pt-0 shrink-0">
                              <div>
                                <span className="text-xs text-[#1A1A2E]/40 block uppercase tracking-wider font-semibold">Total Price</span>
                                <span className="text-xl font-black text-[#1A1A2E] block mt-0.5">${bk.price}</span>
                              </div>
                              
                              <div className="mt-2">
                                {bk.status === "pending" && (
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-100">
                                    <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Awaiting Approval
                                  </span>
                                )}
                                {bk.status === "confirmed" && (
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-100 animate-pulse">
                                    <Check className="h-3.5 w-3.5" /> Confirmed
                                  </span>
                                )}
                                {bk.status === "completed" && (
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 border border-blue-100">
                                    <Check className="h-3.5 w-3.5" /> Job Completed
                                  </span>
                                )}
                                {bk.status === "cancelled" && (
                                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600 border border-red-100">
                                    <X className="h-3.5 w-3.5" /> Cancelled
                                  </span>
                                )}
                              </div>
                            </div>

                          </div>

                          {/* Action Bar inside Card */}
                          <div className="border-t border-black/5 pt-4 mt-5 flex items-center justify-end gap-2.5">
                            
                            {/* Actions conditional on status */}
                            {bk.status === "pending" && (
                              <button
                                onClick={() => handleCancelBooking(bk._id, bk.serviceName)}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition cursor-pointer"
                              >
                                <X className="h-3.5 w-3.5" /> Cancel Booking
                              </button>
                            )}

                            <button
                              onClick={() => showToast("success", `Chat initiated with ${bk.providerName}`)}
                              className="inline-flex items-center gap-1.5 rounded-xl border border-black/10 px-4 py-2 text-xs font-bold text-[#1A1A2E]/70 hover:bg-[#F5F0E8]/40 transition cursor-pointer"
                            >
                              <MessageSquare className="h-3.5 w-3.5" /> Contact
                            </button>

                            <button
                              onClick={() => showToast("success", `Details opened for booking ${bk._id}`)}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-[#1A1A2E] text-white hover:bg-[#C9A84C] hover:text-[#1A1A2E] px-4 py-2 text-xs font-bold transition cursor-pointer"
                            >
                              Details
                            </button>

                          </div>

                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}

              {/* TAB 3: NOTIFICATIONS CENTER */}
              {activeTab === "notifications" && (
                <div>
                  
                  {/* Tab Title Section */}
                  <div className="border-b border-black/5 pb-4 mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-[#1A1A2E] text-font-primary">
                        Notification Center
                      </h2>
                      <p className="text-xs text-[#1A1A2E]/50 mt-0.5">
                        Track booking approvals and system updates here.
                      </p>
                    </div>
                    {notifications.length > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-xs font-extrabold text-[#C9A84C] hover:text-[#1A1A2E] transition uppercase tracking-widest cursor-pointer"
                      >
                        Mark All Read
                      </button>
                    )}
                  </div>

                  {/* Notification feed */}
                  {notifications.length === 0 ? (
                    <div className="text-center py-16 text-[#1A1A2E]/40 flex flex-col items-center">
                      <Bell className="h-12 w-12 opacity-25 mb-4 text-[#C9A84C]" />
                      <p className="text-sm font-bold">Inbox is empty</p>
                      <p className="text-xs opacity-80 mt-1">There are no updates or alerts to view right now.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {notifications.map((nt) => (
                        <div
                          key={nt._id}
                          className={`rounded-xl border p-4.5 transition-all flex items-start gap-4 ${
                            nt.isUnread
                              ? "bg-[#C9A84C]/5 border-[#C9A84C]/30 shadow-2xs"
                              : "bg-white border-[#e9e3d3] opacity-80 hover:opacity-100"
                          }`}
                        >
                          
                          {/* Alert indicator dot */}
                          <div className="pt-1.5 shrink-0">
                            {nt.type === "success" && (
                              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-sm" />
                            )}
                            {nt.type === "warning" && (
                              <div className="h-2.5 w-2.5 rounded-full bg-amber-500 shadow-sm" />
                            )}
                            {nt.type === "info" && (
                              <div className="h-2.5 w-2.5 rounded-full bg-blue-500 shadow-sm" />
                            )}
                          </div>

                          {/* Message details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-3 mb-1">
                              <h3 className={`text-sm font-extrabold text-[#1A1A2E] leading-tight truncate ${nt.isUnread ? "font-black" : ""}`}>
                                {nt.title}
                              </h3>
                              <span className="text-[10px] text-[#1A1A2E]/40 whitespace-nowrap">
                                {nt.timestamp}
                              </span>
                            </div>
                            <p className="text-xs text-[#1A1A2E]/70 leading-relaxed font-medium">
                              {nt.message}
                            </p>
                          </div>

                          {/* Action panel */}
                          <div className="shrink-0 flex gap-2">
                            {nt.isUnread && (
                              <button
                                onClick={() => {
                                  setNotifications((prev) =>
                                    prev.map((n) => (n._id === nt._id ? { ...n, isUnread: false } : n))
                                  );
                                  showToast("success", "Notification marked as read.");
                                }}
                                className="h-7 w-7 rounded-lg border border-[#C9A84C]/25 text-[#1A1A2E]/60 hover:text-[#C9A84C] flex items-center justify-center hover:bg-white transition cursor-pointer"
                                title="Mark as Read"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDismissNotification(nt._id)}
                              className="h-7 w-7 rounded-lg border border-black/10 text-black/30 hover:text-red-500 flex items-center justify-center hover:bg-red-50 hover:border-red-100 transition cursor-pointer"
                              title="Dismiss Alert"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}

                </div>
              )}

            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
