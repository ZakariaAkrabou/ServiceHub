import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store/store";
import Header from "../../../components/client/Header";
import Footer from "../../../components/client/Footer";
import BookingHistory from "../../../components/profile/bookingHistory";
import { 
  User, CalendarDays, MapPin, Edit3, Save, Mail, Phone, ShieldCheck, Camera
} from "lucide-react";

export default function Profile() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState<"info" | "bookings">("info");
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "Zakaria",
    lastName: "Akrabou",
    email: "zakaria@example.com",
    phone: "+1 (555) 349-2041",
    address: "124 Park Avenue, Apt 4B, New York, NY 10016",
    bio: "Homeowner looking for reliable professional help with smart device installations."
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
    }
  }, [isAuthenticated, user]);

  const [editForm, setEditForm] = useState({ ...profileData });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileData({ ...editForm });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans text-[#1A1A2E] flex flex-col">
      <Header />
      
      <main className="grow max-w-7xl mx-auto w-full px-4 sm:px-6 pt-32 pb-24 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar */}
        <aside className="w-full md:w-80 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-[#EBE6DD] overflow-hidden sticky top-32">
            
            {/* User Info Header */}
            <div className="p-6 text-center border-b border-[#EBE6DD] bg-[#FDFBF7]">
              <div className="w-24 h-24 mx-auto rounded-full bg-[#1A1A2E] border-4 border-white shadow-md flex items-center justify-center text-[#C9A84C] text-3xl font-serif font-bold relative mb-4">
                {profileData.firstName[0]}{profileData.lastName[0]}
                <button className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full border border-[#EBE6DD] shadow-sm text-[#1A1A2E] hover:text-[#C9A84C] transition-colors cursor-pointer">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h2 className="text-xl font-bold text-[#1A1A2E] flex items-center justify-center gap-1.5">
                {profileData.firstName} {profileData.lastName}
                <ShieldCheck className="w-5 h-5 text-[#C9A84C]" />
              </h2>
              <p className="text-sm text-[#1A1A2E]/60 mt-1">Client Level I</p>
            </div>

            {/* Navigation */}
            <div className="p-3 flex flex-col gap-1">
              <button
                onClick={() => setActiveTab("info")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "info" 
                    ? "bg-[#1A1A2E] text-white shadow-sm" 
                    : "text-[#1A1A2E]/70 hover:bg-[#FDFBF7] hover:text-[#1A1A2E]"
                }`}
              >
                <User className={`w-5 h-5 ${activeTab === "info" ? "text-[#C9A84C]" : "text-[#1A1A2E]/40"}`} />
                My Profile
              </button>
              <button
                onClick={() => setActiveTab("bookings")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  activeTab === "bookings" 
                    ? "bg-[#1A1A2E] text-white shadow-sm" 
                    : "text-[#1A1A2E]/70 hover:bg-[#FDFBF7] hover:text-[#1A1A2E]"
                }`}
              >
                <CalendarDays className={`w-5 h-5 ${activeTab === "bookings" ? "text-[#C9A84C]" : "text-[#1A1A2E]/40"}`} />
                Booking History
              </button>
            </div>

          </div>
        </aside>

        {/* Main Content Area */}
        <section className="grow min-w-0">
          {activeTab === "info" ? (
            <div className="bg-white rounded-2xl shadow-sm border border-[#EBE6DD] p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-[#1A1A2E] font-serif">Personal Information</h2>
                  <p className="text-sm text-[#1A1A2E]/60 mt-1">Update your contact details and address.</p>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => {
                      setEditForm({ ...profileData });
                      setIsEditing(true);
                    }}
                    className="flex items-center gap-2 bg-[#FDFBF7] border border-[#EBE6DD] text-[#1A1A2E] px-4 py-2 rounded-xl text-sm font-bold hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" /> Edit Profile
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSaveProfile} className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#1A1A2E]/50">First Name</label>
                      <input
                        type="text" required
                        value={editForm.firstName}
                        onChange={e => setEditForm({...editForm, firstName: e.target.value})}
                        className="px-4 py-3 bg-[#FDFBF7] border border-[#EBE6DD] rounded-xl text-sm font-medium focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#1A1A2E]/50">Last Name</label>
                      <input
                        type="text" required
                        value={editForm.lastName}
                        onChange={e => setEditForm({...editForm, lastName: e.target.value})}
                        className="px-4 py-3 bg-[#FDFBF7] border border-[#EBE6DD] rounded-xl text-sm font-medium focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#1A1A2E]/50">Email Address</label>
                      <input
                        type="email" required
                        value={editForm.email}
                        onChange={e => setEditForm({...editForm, email: e.target.value})}
                        className="px-4 py-3 bg-[#FDFBF7] border border-[#EBE6DD] rounded-xl text-sm font-medium focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#1A1A2E]/50">Phone Number</label>
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={e => setEditForm({...editForm, phone: e.target.value})}
                        className="px-4 py-3 bg-[#FDFBF7] border border-[#EBE6DD] rounded-xl text-sm font-medium focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1A1A2E]/50">Address</label>
                    <input
                      type="text" required
                      value={editForm.address}
                      onChange={e => setEditForm({...editForm, address: e.target.value})}
                      className="px-4 py-3 bg-[#FDFBF7] border border-[#EBE6DD] rounded-xl text-sm font-medium focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1A1A2E]/50">Bio</label>
                    <textarea
                      rows={4}
                      value={editForm.bio}
                      onChange={e => setEditForm({...editForm, bio: e.target.value})}
                      className="px-4 py-3 bg-[#FDFBF7] border border-[#EBE6DD] rounded-xl text-sm font-medium focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EBE6DD]">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-5 py-2.5 rounded-xl text-sm font-bold text-[#1A1A2E] hover:bg-[#FDFBF7] transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-6 py-2.5 bg-[#1A1A2E] text-white rounded-xl text-sm font-bold shadow-sm hover:bg-[#C9A84C] transition-colors cursor-pointer"
                    >
                      <Save className="w-4 h-4" /> Save Changes
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-8 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex items-start gap-4 p-4 rounded-xl bg-[#FDFBF7] border border-[#EBE6DD]">
                      <div className="w-10 h-10 rounded-full bg-white border border-[#EBE6DD] flex items-center justify-center text-[#C9A84C] shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[#1A1A2E]/40 mb-1">Full Name</p>
                        <p className="text-sm font-bold text-[#1A1A2E]">{profileData.firstName} {profileData.lastName}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-xl bg-[#FDFBF7] border border-[#EBE6DD]">
                      <div className="w-10 h-10 rounded-full bg-white border border-[#EBE6DD] flex items-center justify-center text-[#C9A84C] shrink-0">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[#1A1A2E]/40 mb-1">Email Address</p>
                        <p className="text-sm font-bold text-[#1A1A2E]">{profileData.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-xl bg-[#FDFBF7] border border-[#EBE6DD]">
                      <div className="w-10 h-10 rounded-full bg-white border border-[#EBE6DD] flex items-center justify-center text-[#C9A84C] shrink-0">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[#1A1A2E]/40 mb-1">Phone Number</p>
                        <p className="text-sm font-bold text-[#1A1A2E]">{profileData.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 p-4 rounded-xl bg-[#FDFBF7] border border-[#EBE6DD]">
                      <div className="w-10 h-10 rounded-full bg-white border border-[#EBE6DD] flex items-center justify-center text-[#C9A84C] shrink-0">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[#1A1A2E]/40 mb-1">Address</p>
                        <p className="text-sm font-bold text-[#1A1A2E]">{profileData.address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-[#FDFBF7] border border-[#EBE6DD]">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#1A1A2E]/40 mb-2">Bio / Notes</p>
                    <p className="text-sm font-medium text-[#1A1A2E]/80 leading-relaxed">
                      {profileData.bio}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <BookingHistory />
          )}
        </section>

      </main>

      <Footer />
    </div>
  );
}
