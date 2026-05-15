import React, { useState } from "react";
import ProviderLayouts from "../../components/provider/ProviderLayouts";
import { User, Mail, Lock, Phone, Upload, Bell, CheckCircle } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store/store";

const ProviderSettings: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const [personalInfo, setPersonalInfo] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    promotions: true,
  });

  return (
    <ProviderLayouts>
      <div className="flex flex-col gap-6 pb-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="min-w-0">
            <h1
              className="font-sans text-2xl font-bold tracking-tight text-[#1a1a1a] sm:text-3xl"
              style={{ letterSpacing: "-0.5px" }}
            >
              Account <span className="text-transparent bg-clip-text bg-linear-to-r from-[#c9a84c] to-[#e4c97c]">Settings</span>
            </h1>
            <p className="mt-1 text-sm sm:text-base text-[#5f5f5f]">
              Manage your personal information, security, and preferences.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
         
          <div className="lg:col-span-2 flex flex-col gap-8">
            
          
            <section className="rounded-2xl border border-[#e9e3d3] bg-white shadow-sm overflow-hidden">
              <div className="border-b border-[#eceae5] bg-[#faf9f7] px-6 py-4">
                <h2 className="text-lg font-bold text-[#1a1a1a] flex items-center gap-2">
                  <User className="h-5 w-5 text-[#c9a84c]" /> Personal Information
                </h2>
              </div>
              <div className="p-6 flex flex-col gap-6">
                
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-[#e9e3d3] bg-[#faf9f7]">
                    {user?.image ? (
                      <img src={user.image} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <User className="h-8 w-8 text-[#c9a84c]" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#1a1a1a]">Profile Photo</h3>
                    <p className="text-xs text-[#9a9a9a] mt-1 mb-3">Recommended size 256x256px.</p>
                    <div className="flex gap-2">
                      <button className="inline-flex items-center gap-1.5 rounded-lg bg-[#faf9f7] px-3 py-1.5 text-sm font-semibold text-[#1a1a1a] border border-[#e9e3d3] hover:bg-[#f0ebe0] transition">
                        <Upload className="h-4 w-4" /> Upload New
                      </button>
                      <button className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold text-[#a33a3a] hover:bg-[#fdf5f5] transition">
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

                {/* Info Form */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#1a1a1a]">First Name</label>
                    <div className="group relative">
                      <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9a9a]" />
                      <input
                        type="text"
                        value={personalInfo.firstName}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                        className="h-11 w-full rounded-xl border border-[#e9e3d3] bg-[#faf9f7] pl-10 pr-4 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#c9a84c] focus:bg-white focus:ring-2 focus:ring-[#c9a84c]/20"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#1a1a1a]">Last Name</label>
                    <div className="group relative">
                      <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9a9a]" />
                      <input
                        type="text"
                        value={personalInfo.lastName}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                        className="h-11 w-full rounded-xl border border-[#e9e3d3] bg-[#faf9f7] pl-10 pr-4 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#c9a84c] focus:bg-white focus:ring-2 focus:ring-[#c9a84c]/20"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#1a1a1a]">Email Address</label>
                    <div className="group relative">
                      <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9a9a]" />
                      <input
                        type="email"
                        value={personalInfo.email}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                        className="h-11 w-full rounded-xl border border-[#e9e3d3] bg-[#faf9f7] pl-10 pr-4 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#c9a84c] focus:bg-white focus:ring-2 focus:ring-[#c9a84c]/20"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#1a1a1a]">Phone Number</label>
                    <div className="group relative">
                      <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9a9a]" />
                      <input
                        type="tel"
                        value={personalInfo.phone}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="h-11 w-full rounded-xl border border-[#e9e3d3] bg-[#faf9f7] pl-10 pr-4 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#c9a84c] focus:bg-white focus:ring-2 focus:ring-[#c9a84c]/20"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end pt-2">
                  <button className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#c9a84c] px-6 text-sm font-semibold text-[#1a1a1a] shadow-sm transition hover:bg-[#d6b45d]">
                    <CheckCircle className="h-4 w-4" /> Save Profile
                  </button>
                </div>
              </div>
            </section>

            {/* Security Section */}
            <section className="rounded-2xl border border-[#e9e3d3] bg-white shadow-sm overflow-hidden">
              <div className="border-b border-[#eceae5] bg-[#faf9f7] px-6 py-4">
                <h2 className="text-lg font-bold text-[#1a1a1a] flex items-center gap-2">
                  <Lock className="h-5 w-5 text-[#c9a84c]" /> Security & Password
                </h2>
              </div>
              <div className="p-6 flex flex-col gap-5">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#1a1a1a]">Current Password</label>
                  <div className="group relative max-w-md">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9a9a]" />
                    <input
                      type="password"
                      value={passwords.current}
                      onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                      placeholder="••••••••"
                      className="h-11 w-full rounded-xl border border-[#e9e3d3] bg-[#faf9f7] pl-10 pr-4 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#c9a84c] focus:bg-white focus:ring-2 focus:ring-[#c9a84c]/20"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#1a1a1a]">New Password</label>
                    <div className="group relative">
                      <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9a9a]" />
                      <input
                        type="password"
                        value={passwords.new}
                        onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                        placeholder="••••••••"
                        className="h-11 w-full rounded-xl border border-[#e9e3d3] bg-[#faf9f7] pl-10 pr-4 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#c9a84c] focus:bg-white focus:ring-2 focus:ring-[#c9a84c]/20"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#1a1a1a]">Confirm New Password</label>
                    <div className="group relative">
                      <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9a9a]" />
                      <input
                        type="password"
                        value={passwords.confirm}
                        onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                        placeholder="••••••••"
                        className="h-11 w-full rounded-xl border border-[#e9e3d3] bg-[#faf9f7] pl-10 pr-4 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#c9a84c] focus:bg-white focus:ring-2 focus:ring-[#c9a84c]/20"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-start pt-2">
                  <button className="inline-flex h-10 items-center justify-center rounded-xl border border-[#e9e3d3] bg-white px-6 text-sm font-semibold text-[#1a1a1a] shadow-sm transition hover:bg-[#faf9f7]">
                    Update Password
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar Column */}
          <div className="flex flex-col gap-8">
            
            {/* Preferences / Notifications */}
            <section className="rounded-2xl border border-[#e9e3d3] bg-white shadow-sm overflow-hidden">
              <div className="border-b border-[#eceae5] bg-[#faf9f7] px-6 py-4">
                <h2 className="text-lg font-bold text-[#1a1a1a] flex items-center gap-2">
                  <Bell className="h-5 w-5 text-[#c9a84c]" /> Preferences
                </h2>
              </div>
              <div className="p-6 flex flex-col gap-6">
                
                {/* Email Notifications Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-[#1a1a1a]">Email Notifications</h4>
                    <p className="text-xs text-[#5f5f5f] mt-0.5">Receive booking updates via email.</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={notifications.email}
                      onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                    />
                    <div className="peer h-5 w-9 rounded-full bg-[#d4d0c8] after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#c9a84c] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                  </label>
                </div>

                {/* SMS Notifications Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-[#1a1a1a]">SMS Alerts</h4>
                    <p className="text-xs text-[#5f5f5f] mt-0.5">Get urgent texts for new bookings.</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={notifications.sms}
                      onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                    />
                    <div className="peer h-5 w-9 rounded-full bg-[#d4d0c8] after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#c9a84c] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                  </label>
                </div>

                {/* Promotions Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-[#1a1a1a]">Marketing Emails</h4>
                    <p className="text-xs text-[#5f5f5f] mt-0.5">Tips on growing your business.</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={notifications.promotions}
                      onChange={(e) => setNotifications({ ...notifications, promotions: e.target.checked })}
                    />
                    <div className="peer h-5 w-9 rounded-full bg-[#d4d0c8] after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#c9a84c] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                  </label>
                </div>

              </div>
            </section>

          </div>
        </div>
      </div>
    </ProviderLayouts>
  );
};

export default ProviderSettings;
