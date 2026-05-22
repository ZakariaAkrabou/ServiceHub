import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForgotPasswordMutation } from "../../../app/api/AuthApi";
import { toast } from "react-toastify";

const ForgetPassword: React.FC = () => {
    const [email, setEmail] = useState("");
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await forgotPassword(email).unwrap();
            toast.success("Reset link sent to your email!");
        } catch (err: any) {
            setError(err?.data?.message || "Failed to send reset link");
        }
    };

    return (
        <div className="h-screen overflow-hidden grid lg:grid-cols-[1.1fr_0.9fr] grid-cols-1 font-sans bg-white">
            <style>{`
                @keyframes pageFadeUp {
                    from { opacity: 0; transform: translateY(14px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <section className="relative bg-[url('https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center hidden lg:flex flex-col justify-center p-20 text-white">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628]/95 via-[#0a1628]/75 to-transparent" />
                <div className="relative z-10 animate-[pageFadeUp_0.6s_ease-out]">
                    <span className="text-[#C9A84C] font-bold tracking-widest uppercase text-sm mb-4 block">Account Recovery</span>
                    <h2 className="font-serif text-[clamp(32px,4vw,56px)] font-black leading-[1.1] mb-6 tracking-tight text-white">
                        Recover your<br />access.
                    </h2>
                    <p className="text-lg opacity-90 font-medium max-w-[480px] leading-relaxed text-white/80">
                        Don't worry, it happens to the best of us. We'll help you get back to your bookings in no time.
                    </p>
                    <div className="mt-8 h-[3px] w-16 bg-[#C9A84C] rounded-full" />
                </div>
            </section>

            <section className="flex items-center justify-center p-6 sm:p-10 bg-[#F5F0E8]/20 overflow-y-auto">
                <div className="w-full max-w-[420px] animate-[pageFadeUp_0.8s_ease-out]">
                    <div className="mb-8 lg:hidden flex justify-center">
                        <span className="text-3xl font-black text-[#1A1A2E] font-serif">Service<span className="text-[#C9A84C]">Hub</span></span>
                    </div>

                    <h1 className="font-serif text-[38px] font-black text-[#1A1A2E] mb-2 tracking-tight">Forgot password?</h1>
                    <p className="text-black/50 text-[15px] mb-8 font-medium">Enter your email and we'll send you a recovery link.</p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                            <p className="text-sm text-red-600 font-bold">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-8">
                            <label className="block text-[11px] font-bold text-black/50 mb-2 uppercase tracking-widest">Email Address</label>
                            <input 
                                type="email" 
                                className="w-full p-[14px_18px] border border-black/10 rounded-xl text-[15px] font-medium transition-all outline-none bg-white focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/10 text-[#1A1A2E] placeholder-black/20" 
                                placeholder="name@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="w-full p-4 bg-[#1A1A2E] text-white rounded-xl text-sm uppercase tracking-widest font-bold shadow-[0_8px_20px_rgba(26,26,46,0.15)] hover:bg-[#C9A84C] hover:text-[#1A1A2E] hover:-translate-y-1 transition-all duration-300 mb-8 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer" disabled={isLoading}>
                            {isLoading ? "Sending..." : "Send Reset Link"}
                        </button>

                        <p className="text-center text-sm font-medium text-black/50">
                            Remember your password? 
                            <Link to="/login" className="text-[#C9A84C] font-bold ml-2 hover:text-[#1A1A2E] transition-colors">Sign in</Link>
                        </p>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default ForgetPassword;
