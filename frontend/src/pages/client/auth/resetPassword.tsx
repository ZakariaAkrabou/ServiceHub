import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useResetPasswordMutation } from "../../../app/api/AuthApi";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const ResetPassword: React.FC = () => {
    const { token } = useParams();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resetPassword, { isLoading }] = useResetPasswordMutation();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        try {
            await resetPassword({ token, newPassword }).unwrap();
            toast.success("Password updated successfully!");
            navigate("/login");
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to reset password");
        }
    };

    return (
        <div className="h-screen overflow-hidden grid lg:grid-cols-[1.1fr_0.9fr] grid-cols-1 font-sans bg-white">
            <section className="relative bg-[url('https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center hidden lg:flex flex-col justify-center p-20 text-white">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/60 to-brand-blue/30" />
                <div className="relative z-10 animate-fade-in-up">
                    <h2 className="font-serif text-[clamp(32px,4vw,56px)] leading-[1.1] mb-6 tracking-[-1px]">
                        Secure your<br />account.
                    </h2>
                    <p className="text-lg opacity-90 font-light max-w-[480px] leading-relaxed">
                        Set a strong password to protect your personal information and service history.
                    </p>
                </div>
            </section>

            <section className="flex items-center justify-center p-10 bg-[#fdfdfd]">
                <div className="w-full max-w-[400px] animate-fade-in-right">
                    <h1 className="font-serif text-[42px] text-[#1A1A1A] mb-3 tracking-[-0.5px]">Reset Password</h1>
                    <p className="text-[#6c757d] text-[15px] mb-10 font-light">Enter your new password below to regain access.</p>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-[13px] font-semibold text-[#333] mb-2 uppercase tracking-wider">New Password</label>
                            <div className="relative">
                                <input 
                                    type={showNewPassword ? "text" : "password"} 
                                    className="w-full p-[16px_20px] pr-12 border border-[#e9ecef] rounded-[14px] text-[15px] transition-all outline-none bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5" 
                                    placeholder="••••••••"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#adb5bd] hover:text-brand-blue transition-colors"
                                >
                                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-[13px] font-semibold text-[#333] mb-2 uppercase tracking-wider">Confirm Password</label>
                            <div className="relative">
                                <input 
                                    type={showConfirmPassword ? "text" : "password"} 
                                    className="w-full p-[16px_20px] pr-12 border border-[#e9ecef] rounded-[14px] text-[15px] transition-all outline-none bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5" 
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#adb5bd] hover:text-brand-blue transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="w-full p-[18px] bg-brand-blue text-white rounded-[12px] text-base font-semibold shadow-[0_4px_15px_rgba(8,29,58,0.15)] hover:bg-[#1a2a4a] hover:-translate-y-[2px] transition-all mb-8 disabled:opacity-60 disabled:cursor-not-allowed" disabled={isLoading}>
                            {isLoading ? "Updating..." : "Update Password"}
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default ResetPassword;
