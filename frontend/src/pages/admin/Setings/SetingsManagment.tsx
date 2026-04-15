import React, { useState } from "react";
import {
  User,
  Bell,
  Lock,
  Globe,
  Save,
  Shield,
  Smartphone,
  Mail,
  Moon,
  Sun,
  Layout
} from "lucide-react";
import {
  generalSettingsData,
  notificationsData,
  localizationOptions,
} from "../Providers/data/SetingsMockData";

export default function SetingsManagment() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="flex flex-col gap-6 pb-6 h-full">
      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Manage your account settings and preferences
          </p>
        </div>
        <button
          className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-colors hover:opacity-90"
          style={{ backgroundColor: "#081D3A", color: "#F3F3F3" }}
        >
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-64 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 shrink-0 h-fit">
          <nav className="flex flex-col gap-1">
            <button
              onClick={() => setActiveTab("general")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === "general"
                  ? "bg-gray-50 text-[#081D3A]"
                  : "text-gray-500 hover:bg-gray-50/50 hover:text-gray-700"
              }`}
            >
              <User className="w-4 h-4" />
              General
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === "security"
                  ? "bg-gray-50 text-[#081D3A]"
                  : "text-gray-500 hover:bg-gray-50/50 hover:text-gray-700"
              }`}
            >
              <Lock className="w-4 h-4" />
              Security
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === "notifications"
                  ? "bg-gray-50 text-[#081D3A]"
                  : "text-gray-500 hover:bg-gray-50/50 hover:text-gray-700"
              }`}
            >
              <Bell className="w-4 h-4" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab("appearance")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === "appearance"
                  ? "bg-gray-50 text-[#081D3A]"
                  : "text-gray-500 hover:bg-gray-50/50 hover:text-gray-700"
              }`}
            >
              <Layout className="w-4 h-4" />
              Appearance
            </button>
            <button
              onClick={() => setActiveTab("localization")}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === "localization"
                  ? "bg-gray-50 text-[#081D3A]"
                  : "text-gray-500 hover:bg-gray-50/50 hover:text-gray-700"
              }`}
            >
              <Globe className="w-4 h-4" />
              Localization
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === "general" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-5">
                General Information
              </h2>
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200">
                    <User className="w-8 h-8" />
                  </div>
                  <div>
                    <button className="text-sm font-medium px-4 py-2 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200">
                      Change Avatar
                    </button>
                    <p className="text-xs text-gray-400 mt-2">
                      JPG, GIF or PNG. 1MB max.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      defaultValue={generalSettingsData.firstName}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#f6e304]/50 focus:border-[#081D3A] transition-shadow"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      defaultValue={generalSettingsData.lastName}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#f6e304]/50 focus:border-[#081D3A] transition-shadow"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue={generalSettingsData.email}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#f6e304]/50 focus:border-[#081D3A] transition-shadow"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="flex flex-col gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-base font-semibold text-gray-800 mb-1">
                  Change Password
                </h2>
                <p className="text-xs text-gray-400 mb-5">
                  Update your password associated with your account
                </p>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#f6e304]/50 focus:border-[#081D3A] transition-shadow"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#f6e304]/50 focus:border-[#081D3A] transition-shadow"
                    />
                  </div>
                  <div className="mt-2 text-right">
                    <button className="text-sm font-medium px-4 py-2 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200">
                      Update Password
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-base font-semibold text-gray-800 mb-1">
                  Two-Factor Authentication
                </h2>
                <p className="text-xs text-gray-400 mb-5">
                  Add an extra layer of security to your account
                </p>
                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Authenticator App
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Use an app like Google Authenticator
                      </p>
                    </div>
                  </div>
                  <button className="text-xs font-medium px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg border border-gray-200 hover:bg-gray-100">
                    Enable
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-1">
                Notification Preferences
              </h2>
              <p className="text-xs text-gray-400 mb-5">
                Choose how you receive updates and alerts
              </p>
              
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-gray-100 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Email Notifications
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Receive daily summaries and important alerts via email.
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" className="sr-only peer" defaultChecked={notificationsData.email} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#081D3A]"></div>
                  </label>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-gray-100 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Push Notifications
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Get real-time alerts on your mobile device.
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input type="checkbox" className="sr-only peer" defaultChecked={notificationsData.push} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#081D3A]"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-1">
                Theme Interface
              </h2>
              <p className="text-xs text-gray-400 mb-5">
                Customize the visual appearance of your dashboard
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-[#081D3A] rounded-xl p-4 cursor-pointer relative">
                  <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-[#081D3A] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <Sun className="w-5 h-5 text-amber-500" />
                    <p className="text-sm font-medium text-gray-800">Light Mode</p>
                  </div>
                  <div className="h-24 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden flex flex-col">
                    <div className="h-4 bg-white border-b border-gray-200"></div>
                    <div className="flex-1 flex px-2 py-2 gap-2">
                      <div className="w-6 bg-white rounded border border-gray-200"></div>
                      <div className="flex-1 bg-white rounded border border-gray-200"></div>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-transparent rounded-xl p-4 cursor-pointer hover:border-gray-200 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <Moon className="w-5 h-5 text-indigo-500" />
                    <p className="text-sm font-medium text-gray-800">Dark Mode</p>
                  </div>
                  <div className="h-24 bg-gray-900 rounded-lg border border-gray-700 overflow-hidden flex flex-col">
                    <div className="h-4 bg-gray-800 border-b border-gray-700"></div>
                    <div className="flex-1 flex px-2 py-2 gap-2">
                      <div className="w-6 bg-gray-800 rounded border border-gray-700"></div>
                      <div className="flex-1 bg-gray-800 rounded border border-gray-700"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "localization" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-base font-semibold text-gray-800 mb-1">
                Language & Region
              </h2>
              <p className="text-xs text-gray-400 mb-5">
                Set your preferred language and timezone
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Language
                  </label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#f6e304]/50 focus:border-[#081D3A] appearance-none">
                    {localizationOptions.languages.map((lang) => (
                      <option key={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Timezone
                  </label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#f6e304]/50 focus:border-[#081D3A] appearance-none">
                    {localizationOptions.timezones.map((tz) => (
                      <option key={tz}>{tz}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
