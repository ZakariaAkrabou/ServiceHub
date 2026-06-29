import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store/store";
import Header from "../../../components/client/Header";
import Footer from "../../../components/client/Footer";
import BookingHistory from "../../../components/profile/bookingHistory";
import {
  User, CalendarDays, MapPin, Edit3, Save, Mail, Phone,
  ShieldCheck, Camera, Bell, Settings, Lock,
  FileText, BadgeCheck, ChevronRight, X
} from "lucide-react";

type TabType = "info" | "bookings" | "notifications" | "settings";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
}

export default function Profile() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState<TabType>("info");
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "Zakaria",
    lastName: "Akrabou",
    email: "zakaria@example.com",
    phone: "+1 (555) 349-2041",
    address: "124 Park Avenue, Apt 4B, New York, NY 10016",
    bio: "Homeowner looking for reliable professional help with smart device installations.",
  });

  const [editForm, setEditForm] = useState<ProfileData>({ ...profileData });

  useEffect(() => {
    if (isAuthenticated && user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProfileData((prev) => ({
        ...prev,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [isAuthenticated, user]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileData({ ...editForm });
    setIsEditing(false);
  };

  const initials = `${profileData.firstName[0]}${profileData.lastName[0]}`;

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "info", label: "My Profile", icon: <User className="w-4 h-4" /> },
    { id: "bookings", label: "Booking History", icon: <CalendarDays className="w-4 h-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="w-4 h-4" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#F5F3EF] text-[#1A1A2E] flex flex-col" style={{fontFamily: '"Times New Roman", sans-serif, "Geist", "Geist Placeholder", "Inter", "Inter Placeholder", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'}}>
      <Header />

      <main className="grow w-full px-6 md:px-8 lg:px-12 pt-32 pb-24 flex flex-col md:flex-row gap-6">

        {/* ── Sidebar ── */}
        <aside className="w-full md:w-80 shrink-0 flex flex-col gap-4">

          {/* User card */}
          <div className="bg-white rounded-2xl border border-[#E8E4DC] overflow-hidden sticky top-32">

            {/* Avatar + name */}
            <div className="px-5 pt-7 pb-5 flex flex-col items-center gap-3 border-b border-[#E8E4DC]">
              <div className="relative">
                <div className="w-17 h-17 rounded-full bg-[#1A1A2E] flex items-center justify-center text-[#C9A84C] text-xl font-semibold tracking-wide select-none">
                  {initials}
                </div>
                <button
                  aria-label="Change avatar"
                  className="absolute bottom-0 right-0 w-5.5 h-5.5 bg-white border border-[#E8E4DC] rounded-full flex items-center justify-center text-[#1A1A2E]/50 hover:text-[#C9A84C] transition-colors cursor-pointer"
                >
                  <Camera className="w-3 h-3" />
                </button>
              </div>

              <div className="text-center">
                <p className="text-[15px] font-semibold text-[#1A1A2E]">
                  {profileData.firstName} {profileData.lastName}
                </p>
                <div className="mt-1.5 inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#C9A84C] bg-[#C9A84C]/10 border border-[#C9A84C]/25 rounded-full px-2.5 py-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 divide-x divide-[#E8E4DC] border-b border-[#E8E4DC]">
              {[
                { num: "12", label: "Bookings" },
                { num: "2y", label: "Member" },
              ].map(({ num, label }) => (
                <div key={label} className="py-3 flex flex-col items-center">
                  <span className="text-[17px] font-semibold text-[#1A1A2E]">{num}</span>
                  <span className="text-[10px] text-[#1A1A2E]/45 mt-0.5">{label}</span>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <nav className="p-2 flex flex-col gap-0.5">
              {navItems.map(({ id, label, icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all cursor-pointer text-left ${
                    activeTab === id
                      ? "bg-[#1A1A2E] text-white"
                      : "text-[#1A1A2E]/60 hover:bg-[#F5F3EF] hover:text-[#1A1A2E]"
                  }`}
                >
                  <span className={activeTab === id ? "text-[#C9A84C]" : ""}>
                    {icon}
                  </span>
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* ── Main content ── */}
        <section className="grow min-w-0">

          {activeTab === "info" && (
            <div className="bg-white rounded-2xl border border-[#E8E4DC] overflow-hidden">

              {/* Header */}
              <div className="px-6 py-5 flex items-start justify-between border-b border-[#E8E4DC]">
                <div>
                  <h2 className="text-[17px] font-semibold text-[#1A1A2E]">Personal information</h2>
                  <p className="text-[12px] text-[#1A1A2E]/45 mt-0.5">Manage your contact details and preferences</p>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => {
                      setEditForm({ ...profileData });
                      setIsEditing(true);
                    }}
                    className="flex items-center gap-1.5 text-[12px] font-medium text-[#1A1A2E]/60 border border-[#E8E4DC] hover:border-[#1A1A2E]/30 hover:text-[#1A1A2E] rounded-xl px-3.5 py-2 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit profile
                  </button>
                )}
              </div>

              {isEditing ? (
                /* ── Edit form ── */
                <form onSubmit={handleSaveProfile} className="p-6 flex flex-col gap-5">
                  <SectionTag icon={<BadgeCheck className="w-3 h-3" />} label="Identity" />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="First name" icon={<User className="w-3.5 h-3.5" />}>
                      <input
                        type="text"
                        required
                        value={editForm.firstName}
                        onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Last name" icon={<User className="w-3.5 h-3.5" />}>
                      <input
                        type="text"
                        required
                        value={editForm.lastName}
                        onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Email address" icon={<Mail className="w-3.5 h-3.5" />}>
                      <input
                        type="email"
                        required
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className={inputCls}
                      />
                    </Field>
                    <Field label="Phone number" icon={<Phone className="w-3.5 h-3.5" />}>
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className={inputCls}
                      />
                    </Field>
                    <div className="sm:col-span-2">
                      <Field label="Address" icon={<MapPin className="w-3.5 h-3.5" />}>
                        <input
                          type="text"
                          required
                          value={editForm.address}
                          onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                          className={inputCls}
                        />
                      </Field>
                    </div>
                  </div>

                  <div className="border-t border-[#E8E4DC] pt-5">
                    <SectionTag icon={<FileText className="w-3 h-3" />} label="Bio" />
                    <div className="mt-3">
                      <textarea
                        rows={4}
                        value={editForm.bio}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                        className={`${inputCls} resize-none`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E8E4DC]">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium text-[#1A1A2E]/60 hover:text-[#1A1A2E] rounded-xl transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-5 py-2 bg-[#1A1A2E] text-white text-[13px] font-medium rounded-xl hover:bg-[#C9A84C] transition-colors cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      Save changes
                    </button>
                  </div>
                </form>
              ) : (
                /* ── View mode ── */
                <div>
                  <div className="px-6 pt-5 pb-1">
                    <SectionTag icon={<BadgeCheck className="w-3 h-3" />} label="Identity" />
                  </div>
                  <div className="px-6 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <InfoField label="First name" icon={<User className="w-3.5 h-3.5" />} value={profileData.firstName} />
                    <InfoField label="Last name" icon={<User className="w-3.5 h-3.5" />} value={profileData.lastName} />
                    <InfoField label="Email address" icon={<Mail className="w-3.5 h-3.5" />} value={profileData.email} />
                    <InfoField label="Phone number" icon={<Phone className="w-3.5 h-3.5" />} value={profileData.phone} />
                    <div className="sm:col-span-2">
                      <InfoField label="Address" icon={<MapPin className="w-3.5 h-3.5" />} value={profileData.address} />
                    </div>
                  </div>

                  <div className="mx-6 border-t border-[#E8E4DC]" />

                  <div className="px-6 pt-5 pb-6">
                    <SectionTag icon={<FileText className="w-3 h-3" />} label="Bio" />
                    <p className="mt-3 text-[13px] text-[#1A1A2E]/60 leading-relaxed">{profileData.bio}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "bookings" && <BookingHistory />}

          {activeTab === "notifications" && (
            <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6">
              <h2 className="text-[17px] font-semibold text-[#1A1A2E] mb-1">Notifications</h2>
              <p className="text-[12px] text-[#1A1A2E]/45">Manage your notification preferences.</p>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="bg-white rounded-2xl border border-[#E8E4DC] overflow-hidden">
              <div className="px-6 py-5 border-b border-[#E8E4DC]">
                <h2 className="text-[17px] font-semibold text-[#1A1A2E]">Settings</h2>
                <p className="text-[12px] text-[#1A1A2E]/45 mt-0.5">Manage your account settings and security.</p>
              </div>
              <div className="p-4 flex flex-col gap-1">
                <div className="flex items-center gap-3 px-3 py-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 shrink-0" />
                  <span className="text-[14px] text-[#1A1A2E]/70 font-medium">Active account</span>
                </div>
                {[
                  { icon: <Lock className="w-4 h-4" />, label: "Password & security", desc: "Update your password and manage 2FA" },
                ].map(({ icon, label, desc }) => (
                  <button
                    key={label}
                    className="w-full flex items-center justify-between gap-3 px-3 py-3.5 rounded-xl text-left hover:bg-[#F5F3EF] transition-colors cursor-pointer group"
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-xl bg-[#F5F3EF] group-hover:bg-white flex items-center justify-center text-[#1A1A2E]/50 group-hover:text-[#C9A84C] transition-colors shrink-0">{icon}</span>
                      <span className="flex flex-col">
                        <span className="text-[13px] font-semibold text-[#1A1A2E]">{label}</span>
                        <span className="text-[11px] text-[#1A1A2E]/40">{desc}</span>
                      </span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#1A1A2E]/25 group-hover:text-[#C9A84C] transition-colors shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

/* ── Shared input class ── */
const inputCls =
  "w-full px-3.5 py-2.5 bg-[#F5F3EF] border border-[#E8E4DC] rounded-xl text-[13px] text-[#1A1A2E] placeholder:text-[#1A1A2E]/30 focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] transition-all";

/* ── Sub-components ── */
function SectionTag({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-[#C9A84C] bg-[#C9A84C]/08 border border-[#C9A84C]/20 rounded px-2 py-1">
      {icon}
      {label}
    </div>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#1A1A2E]/40">
        <span className="text-[#1A1A2E]/30">{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}

function InfoField({
  label,
  icon,
  value,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
}) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#1A1A2E]/40 mb-1.5">
        <span className="text-[#1A1A2E]/30">{icon}</span>
        {label}
      </p>
      <p className="text-[13px] text-[#1A1A2E] font-medium">{value}</p>
    </div>
  );
}