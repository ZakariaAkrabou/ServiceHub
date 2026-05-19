import React, { useState, useRef, useEffect } from "react";
import ProviderLayouts from "../../components/provider/ProviderLayouts";
import { User, Mail, Lock, Phone, Upload, CheckCircle, Loader2, AlertCircle, Bell } from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store/store";
import { useUpdateProfileMutation, useChangePasswordMutation } from "../../app/api/ProfileApi";

const ProviderSettings: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const [personalInfo, setPersonalInfo] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(user?.image || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setPersonalInfo({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
      });
      setImagePreview(user.image || null);
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const formData = new FormData();
    formData.append("firstName", personalInfo.firstName);
    formData.append("lastName", personalInfo.lastName);
    formData.append("email", personalInfo.email);
    formData.append("phone", personalInfo.phone);
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await updateProfile(formData).unwrap();
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err: any) {
      setMessage({ type: "error", text: err?.data?.message || "Failed to update profile." });
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    try {
      await changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      }).unwrap();
      setMessage({ type: "success", text: "Password updated successfully!" });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setMessage({ type: "error", text: err?.data?.message || "Failed to update password." });
    }
  };

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

        {message && (
          <div className={`flex items-center gap-3 rounded-xl p-4 border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
            {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <p className="text-sm font-medium">{message.text}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            <section className="rounded-2xl border border-[#e9e3d3] bg-white shadow-sm overflow-hidden">
              <div className="border-b border-[#eceae5] bg-[#faf9f7] px-6 py-4">
                <h2 className="text-lg font-bold text-[#1a1a1a] flex items-center gap-2">
                  <User className="h-5 w-5 text-[#c9a84c]" /> Personal Information
                </h2>
              </div>
              <form onSubmit={handleSaveProfile} className="p-6 flex flex-col gap-6">
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-[#e9e3d3] bg-[#faf9f7]">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Profile" className="h-full w-full object-cover" />
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
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageChange} 
                        className="hidden" 
                        accept="image/*"
                      />
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#faf9f7] px-3 py-1.5 text-sm font-semibold text-[#1a1a1a] border border-[#e9e3d3] hover:bg-[#f0ebe0] transition"
                      >
                        <Upload className="h-4 w-4" /> Upload New
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#1a1a1a]">First Name</label>
                    <div className="group relative">
                      <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9a9a]" />
                      <input
                        type="text"
                        required
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
                        required
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
                        required
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
                  <button 
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#c9a84c] px-6 text-sm font-semibold text-[#1a1a1a] shadow-sm transition hover:bg-[#d6b45d] disabled:opacity-50"
                  >
                    {isUpdatingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                    Save Profile
                  </button>
                </div>
              </form>
            </section>

            <section className="rounded-2xl border border-[#e9e3d3] bg-white shadow-sm overflow-hidden">
              <div className="border-b border-[#eceae5] bg-[#faf9f7] px-6 py-4">
                <h2 className="text-lg font-bold text-[#1a1a1a] flex items-center gap-2">
                  <Lock className="h-5 w-5 text-[#c9a84c]" /> Security & Password
                </h2>
              </div>
              <form onSubmit={handleUpdatePassword} className="p-6 flex flex-col gap-5">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#1a1a1a]">Current Password</label>
                  <div className="group relative max-w-md">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9a9a]" />
                    <input
                      type="password"
                      required
                      value={passwords.currentPassword}
                      onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
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
                        required
                        minLength={6}
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
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
                        required
                        value={passwords.confirmPassword}
                        onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                        placeholder="••••••••"
                        className="h-11 w-full rounded-xl border border-[#e9e3d3] bg-[#faf9f7] pl-10 pr-4 text-sm text-[#1a1a1a] outline-none transition-colors focus:border-[#c9a84c] focus:bg-white focus:ring-2 focus:ring-[#c9a84c]/20"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-start pt-2">
                  <button 
                    type="submit"
                    disabled={isChangingPassword}
                    className="inline-flex h-10 items-center justify-center rounded-xl border border-[#e9e3d3] bg-white px-6 text-sm font-semibold text-[#1a1a1a] shadow-sm transition hover:bg-[#faf9f7] disabled:opacity-50"
                  >
                    {isChangingPassword ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Update Password
                  </button>
                </div>
              </form>
            </section>
          </div>

          <div className="flex flex-col gap-8">
            {/* Preferences Section (Currently Static but styled) */}
            <section className="rounded-2xl border border-[#e9e3d3] bg-white shadow-sm overflow-hidden">
              <div className="border-b border-[#eceae5] bg-[#faf9f7] px-6 py-4">
                <h2 className="text-lg font-bold text-[#1a1a1a] flex items-center gap-2">
                  <Bell className="h-5 w-5 text-[#c9a84c]" /> Preferences
                </h2>
              </div>
              <div className="p-6 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-[#1a1a1a]">Email Notifications</h4>
                    <p className="text-xs text-[#5f5f5f] mt-0.5">Receive booking updates via email.</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" className="peer sr-only" defaultChecked />
                    <div className="peer h-5 w-9 rounded-full bg-[#d4d0c8] after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#c9a84c] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                  </label>
                </div>
                {/* ... other preference toggles ... */}
              </div>
            </section>
          </div>
        </div>
      </div>
    </ProviderLayouts>
  );
};

export default ProviderSettings;
