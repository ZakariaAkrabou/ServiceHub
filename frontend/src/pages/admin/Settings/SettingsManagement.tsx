import { useState, useEffect } from "react";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} from "../../../app/api/ProfileApi";
import { toast } from "react-toastify";
import {
  User,
  Lock,
  Bell,
  Layout,
  Globe,
  Save,
  Mail,
  Smartphone,
  Sun,
  Moon,
  Loader2,
} from "lucide-react";
import {
  localizationOptions,
  notificationsData,
} from "../Providers/data/SetingsMockData";

export default function SettingsManagement() {
  const [activeTab, setActiveTab] = useState("general");
  const { data, isLoading, isError } = useGetProfileQuery(undefined);
  const [updateProfile, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();

  const profile = data?.user;

  // General Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  // Security Form State
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
      });
    }
  }, [profile]);

  const handleGeneralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(formData).unwrap();
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to update profile");
    }
  };

  const handleSecuritySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (securityData.newPassword !== securityData.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    try {
      await changePassword({
        currentPassword: securityData.currentPassword,
        newPassword: securityData.newPassword,
      }).unwrap();
      toast.success("Password changed successfully");
      setSecurityData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-6 h-full font-sans">
      {/* ── Page header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Manage your account settings and preferences
          </p>
        </div>
        {activeTab === "general" && (
          <button
            onClick={handleGeneralSubmit}
            disabled={isUpdatingProfile}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 cursor-pointer"
            style={{ backgroundColor: "#081D3A", color: "#F3F3F3" }}
          >
            {isUpdatingProfile ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Changes
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-64 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 shrink-0 h-fit">
          <nav className="flex flex-col gap-1">
            {[
              { id: "general", icon: User, label: "General" },
              { id: "security", icon: Lock, label: "Security" },
              { id: "notifications", icon: Bell, label: "Notifications" },
              { id: "appearance", icon: Layout, label: "Appearance" },
              { id: "localization", icon: Globe, label: "Localization" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-gray-50 text-[#081D3A]"
                    : "text-gray-500 hover:bg-gray-50/50 hover:text-gray-700"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === "general" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-base font-semibold text-gray-800 mb-5">
                General Information
              </h2>
              {isLoading ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-8 h-8 animate-spin text-[#081D3A]" />
                </div>
              ) : isError || !profile ? (
                <div className="text-red-500 text-sm bg-red-50 p-4 rounded-xl border border-red-100">
                  Failed to load profile data. Please try again.
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 border border-gray-100 shadow-inner overflow-hidden relative group">
                      {profile.image ? (
                        <img
                          src={profile.image}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8" />
                      )}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                        <span className="text-[10px] text-white font-medium">
                          Edit
                        </span>
                      </div>
                    </div>
                    <div>
                      <button className="text-sm font-medium px-4 py-2 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200 cursor-pointer">
                        Change Avatar
                      </button>
                      <p className="text-xs text-gray-400 mt-2">
                        JPG, GIF or PNG. 1MB max.
                      </p>
                    </div>
                  </div>

                  <form
                    onSubmit={handleGeneralSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2"
                  >
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#f6e304]/50 focus:border-[#081D3A] transition-all"
                        placeholder="Enter first name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#f6e304]/50 focus:border-[#081D3A] transition-all"
                        placeholder="Enter last name"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#f6e304]/50 focus:border-[#081D3A] transition-all"
                        placeholder="Enter email address"
                      />
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {activeTab === "security" && (
            <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-base font-semibold text-gray-800 mb-1">
                  Change Password
                </h2>
                <p className="text-xs text-gray-400 mb-5">
                  Update your password associated with your account
                </p>
                <form
                  onSubmit={handleSecuritySubmit}
                  className="flex flex-col gap-4"
                >
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={securityData.currentPassword}
                      onChange={(e) =>
                        setSecurityData({
                          ...securityData,
                          currentPassword: e.target.value,
                        })
                      }
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#f6e304]/50 focus:border-[#081D3A] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={securityData.newPassword}
                      onChange={(e) =>
                        setSecurityData({
                          ...securityData,
                          newPassword: e.target.value,
                        })
                      }
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#f6e304]/50 focus:border-[#081D3A] transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={securityData.confirmPassword}
                      onChange={(e) =>
                        setSecurityData({
                          ...securityData,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#f6e304]/50 focus:border-[#081D3A] transition-all"
                      required
                    />
                  </div>
                  <div className="mt-2 text-right">
                    <button
                      type="submit"
                      disabled={isChangingPassword}
                      className="text-sm font-medium px-4 py-2 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 transition-all border border-gray-200 active:scale-95 disabled:opacity-50 flex items-center gap-2 ml-auto cursor-pointer"
                    >
                      {isChangingPassword && (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      )}
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-base font-semibold text-gray-800 mb-1">
                Notification Preferences
              </h2>
              <p className="text-xs text-gray-400 mb-5">
                Choose how you receive updates and alerts
              </p>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50/30 transition-colors">
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
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked={notificationsData.email}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#081D3A]"></div>
                  </label>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50/30 transition-colors">
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
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked={notificationsData.push}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#081D3A]"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <h2 className="text-base font-semibold text-gray-800 mb-1">
                Theme Interface
              </h2>
              <p className="text-xs text-gray-400 mb-5">
                Customize the visual appearance of your dashboard
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border-2 border-[#081D3A] rounded-xl p-4 cursor-pointer relative shadow-sm">
                  <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-[#081D3A] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <Sun className="w-5 h-5 text-amber-500" />
                    <p className="text-sm font-medium text-gray-800">
                      Light Mode
                    </p>
                  </div>
                  <div className="h-24 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden flex flex-col">
                    <div className="h-4 bg-white border-b border-gray-200"></div>
                    <div className="flex-1 flex px-2 py-2 gap-2">
                      <div className="w-6 bg-white rounded border border-gray-200 shadow-sm"></div>
                      <div className="flex-1 bg-white rounded border border-gray-200 shadow-sm"></div>
                    </div>
                  </div>
                </div>

                <div className="border-2 border-transparent rounded-xl p-4 cursor-pointer hover:border-gray-200 transition-all hover:shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <Moon className="w-5 h-5 text-indigo-500" />
                    <p className="text-sm font-medium text-gray-800">
                      Dark Mode
                    </p>
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
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
                  <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#f6e304]/50 focus:border-[#081D3A] appearance-none transition-all cursor-pointer">
                    {localizationOptions.languages.map((lang) => (
                      <option key={lang}>{lang}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">
                    Timezone
                  </label>
                  <select className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#f6e304]/50 focus:border-[#081D3A] appearance-none transition-all cursor-pointer">
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
