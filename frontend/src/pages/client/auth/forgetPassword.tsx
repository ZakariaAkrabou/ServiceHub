import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForgotPasswordMutation } from "../../../app/api/AuthApi";
import { toast } from "react-toastify";

const ForgetPassword: React.FC = () => {
    const [email, setEmail] = useState("");
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await forgotPassword(email).unwrap();
            toast.success("Reset link sent to your email!");
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to send reset link");
        }
    };

    return (
        <div className="h-screen overflow-hidden grid lg:grid-cols-[1.1fr_0.9fr] grid-cols-1 font-sans bg-white">
            <section className="relative bg-[url('https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center hidden lg:flex flex-col justify-center p-20 text-white">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/60 to-brand-blue/30" />
                <div className="relative z-10 animate-fade-in-up">
                    <h2 className="font-serif text-[clamp(32px,4vw,56px)] leading-[1.1] mb-6 tracking-[-1px]">
                        Recover your<br />access.
                    </h2>
                    <p className="text-lg opacity-90 font-light max-w-[480px] leading-relaxed">
                        Don't worry, it happens to the best of us. We'll help you get back to your bookings in no time.
                    </p>
                </div>
            </section>

            <section className="flex items-center justify-center p-10 bg-[#fdfdfd]">
                <div className="w-full max-w-[400px] animate-fade-in-right">
                    <h1 className="font-serif text-[42px] text-[#1A1A1A] mb-3 tracking-[-0.5px]">Forgot password?</h1>
                    <p className="text-[#6c757d] text-[15px] mb-10 font-light">Enter your email and we'll send you a recovery link.</p>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-[13px] font-semibold text-[#333] mb-2 uppercase tracking-wider">Email Address</label>
                            <input 
                                type="email" 
                                className="w-full p-[16px_20px] border border-[#e9ecef] rounded-[14px] text-[15px] transition-all outline-none bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5" 
                                placeholder="name@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="w-full p-[18px] bg-brand-blue text-white rounded-[12px] text-base font-semibold shadow-[0_4px_15px_rgba(8,29,58,0.15)] hover:bg-[#1a2a4a] hover:-translate-y-[2px] transition-all mb-8 disabled:opacity-60 disabled:cursor-not-allowed" disabled={isLoading}>
                            {isLoading ? "Sending..." : "Send Reset Link"}
                        </button>

                        <p className="text-center text-sm text-[#6c757d]">
                            Remember your password? 
                            <Link to="/login" className="text-brand-blue font-bold ml-2 border-b-2 border-brand-blue/10 hover:border-brand-blue">Sign in</Link>
                        </p>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default ForgetPassword;
