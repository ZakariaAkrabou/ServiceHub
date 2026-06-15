import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useRegisterMutation } from "../../../app/api/AuthApi";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const Register: React.FC = () => {
    const [searchParams] = useSearchParams();
    const initialTab = searchParams.get("tab") === "provider" ? "provider" : "customer";
    const [role, setRole] = useState(initialTab);
    const [showPassword, setShowPassword] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        serviceCategory: "",
        serviceDescription: "",
        location: ""
    });

    const [register, { isLoading }] = useRegisterMutation();
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const submissionData = {
                ...formData,
                role: role === "customer" ? "customer" : "service_provider"
            };
            await register(submissionData).unwrap();
            setShowSuccess(true);
            toast.success("Account created! Please check your email.");
        } catch (err: any) {
            setError(err?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="h-screen overflow-hidden grid lg:grid-cols-2 grid-cols-1 font-sans bg-white">
            <style>{`
                @keyframes pageFadeUp {
                    from { opacity: 0; transform: translateY(14px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <section className="relative bg-[url('https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center hidden lg:flex flex-col justify-center p-16 text-white">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628]/95 via-[#0a1628]/75 to-transparent" />
                <div className="relative z-10 animate-[pageFadeUp_0.6s_ease-out]">
                    <span className="text-[#C9A84C] font-bold tracking-widest uppercase text-sm mb-4 block">Join Our Network</span>
                    <h2 className="font-serif text-[clamp(32px,3.5vw,50px)] font-black leading-[1.1] mb-6 tracking-tight text-white">
                        Expert help,<br />at your service.
                    </h2>
                    <p className="text-lg opacity-90 font-medium max-w-[480px] leading-relaxed text-white/80">
                        Join ServiceHub today and connect with thousands of customers or skilled professionals in your area.
                    </p>
                    <div className="mt-8 h-[3px] w-16 bg-[#C9A84C] rounded-full" />
                </div>
            </section>

            <section className="flex flex-col p-[16px_32px] sm:p-[16px_40px] bg-[#F5F0E8]/20 justify-center overflow-y-auto">
                <div className="w-full max-w-[460px] m-auto animate-[pageFadeUp_0.8s_ease-out]">
                    <div className="mb-6 lg:hidden flex justify-center mt-4">
                        <span className="text-3xl font-black text-[#1A1A2E] font-serif">Service<span className="text-[#C9A84C]">Hub</span></span>
                    </div>

                    {showSuccess ? (
                        <div className="py-10 text-center">
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L22 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h1 className="font-serif text-[38px] font-black text-[#1A1A2E] mb-4 tracking-tight">Check your email</h1>
                            <p className="text-black/50 text-[16px] mb-10 leading-relaxed font-medium">
                                We've sent a verification link to <span className="font-bold text-[#1A1A2E]">{formData.email}</span>. 
                                Please click the link to confirm your account and start using ServiceHub.
                            </p>
                            <Link to="/login" className="inline-block w-full p-4 bg-[#1A1A2E] text-white rounded-xl text-sm uppercase tracking-widest font-bold shadow-[0_8px_20px_rgba(26,26,46,0.15)] hover:bg-[#C9A84C] hover:text-[#1A1A2E] hover:-translate-y-1 transition-all duration-300">
                                Back to Sign In
                            </Link>
                        </div>
                    ) : (
                        <>
                            <h1 className="font-serif text-[36px] font-black text-[#1A1A2E] mb-2 tracking-tight">Create Account</h1>
                            <p className="text-black/50 text-[15px] mb-5 font-medium">Join our community and get things done.</p>

                            <div className="grid grid-cols-2 gap-2 mb-4 bg-black/5 p-1.5 rounded-xl">
                                <div 
                                    className={`p-2.5 text-center rounded-lg cursor-pointer text-[12px] font-bold uppercase tracking-wider transition-all duration-300 ${role === "customer" ? "bg-white text-[#1A1A2E] shadow-sm" : "text-black/40 hover:text-black/60"}`}
                                    onClick={() => setRole("customer")}
                                >
                                    Customer
                                </div>
                                <div 
                                    className={`p-2.5 text-center rounded-lg cursor-pointer text-[12px] font-bold uppercase tracking-wider transition-all duration-300 ${role === "provider" ? "bg-[#1A1A2E] text-[#C9A84C] shadow-sm" : "text-black/40 hover:text-black/60"}`}
                                    onClick={() => setRole("provider")}
                                >
                                    Service Provider
                                </div>
                            </div>

                            {error && (
                                <div className="mb-4 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                                    <p className="text-sm text-red-600 font-bold">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-2 gap-[12px_16px]">
                                    <div className="mb-0">
                                        <label className="block text-[11px] font-bold text-black/50 mb-1.5 uppercase tracking-widest">First Name</label>
                                        <input 
                                            type="text" 
                                            name="firstName"
                                            className="w-full p-[12px_16px] border border-black/10 rounded-xl text-[14px] font-medium transition-all outline-none bg-white focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/10 text-[#1A1A2E] placeholder-black/20" 
                                            placeholder="John"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-0">
                                        <label className="block text-[11px] font-bold text-black/50 mb-1.5 uppercase tracking-widest">Last Name</label>
                                        <input 
                                            type="text" 
                                            name="lastName"
                                            className="w-full p-[12px_16px] border border-black/10 rounded-xl text-[14px] font-medium transition-all outline-none bg-white focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/10 text-[#1A1A2E] placeholder-black/20" 
                                            placeholder="Doe"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-0">
                                        <label className="block text-[11px] font-bold text-black/50 mb-1.5 uppercase tracking-widest">Email Address</label>
                                        <input 
                                            type="email" 
                                            name="email"
                                            className="w-full p-[12px_16px] border border-black/10 rounded-xl text-[14px] font-medium transition-all outline-none bg-white focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/10 text-[#1A1A2E] placeholder-black/20" 
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-0">
                                        <label className="block text-[11px] font-bold text-black/50 mb-1.5 uppercase tracking-widest">Phone</label>
                                        <input 
                                            type="tel" 
                                            name="phone"
                                            className="w-full p-[12px_16px] border border-black/10 rounded-xl text-[14px] font-medium transition-all outline-none bg-white focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/10 text-[#1A1A2E] placeholder-black/20" 
                                            placeholder="+212 600..."
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-span-2 mb-0">
                                        <label className="block text-[11px] font-bold text-black/50 mb-1.5 uppercase tracking-widest">Password</label>
                                        <div className="relative">
                                            <input 
                                                type={showPassword ? "text" : "password"} 
                                                name="password"
                                                className="w-full p-[12px_16px] pr-10 border border-black/10 rounded-xl text-[14px] font-medium transition-all outline-none bg-white focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/10 text-[#1A1A2E] placeholder-black/20" 
                                                placeholder="••••••••"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 hover:text-[#C9A84C] transition-colors cursor-pointer"
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    {role === "provider" && (
                                        <>
                                            <div className="mb-0">
                                                <label className="block text-[11px] font-bold text-black/50 mb-1.5 uppercase tracking-widest">Category</label>
                                                <select 
                                                    name="serviceCategory"
                                                    className="w-full p-[12px_16px] border border-black/10 rounded-xl text-[14px] font-medium transition-all outline-none bg-white focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/10 text-[#1A1A2E]" 
                                                    value={formData.serviceCategory}
                                                    onChange={handleChange}
                                                    required
                                                >
                                                    <option value="">Choose...</option>
                                                    <option value="Plumber">Plumber</option>
                                                    <option value="Electrician">Electrician</option>
                                                    <option value="Cleaning">Cleaning</option>
                                                    <option value="Painter">Painter</option>
                                                </select>
                                            </div>

                                            <div className="mb-0">
                                                <label className="block text-[11px] font-bold text-black/50 mb-1.5 uppercase tracking-widest">Location</label>
                                                <input 
                                                    type="text" 
                                                    name="location"
                                                    className="w-full p-[12px_16px] border border-black/10 rounded-xl text-[14px] font-medium transition-all outline-none bg-white focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/10 text-[#1A1A2E] placeholder-black/20" 
                                                    placeholder="Rabat"
                                                    value={formData.location}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>

                                            <div className="col-span-2 mb-0">
                                                <label className="block text-[11px] font-bold text-black/50 mb-1.5 uppercase tracking-widest">Description</label>
                                                <textarea 
                                                    name="serviceDescription"
                                                    className="w-full p-[12px_16px] border border-black/10 rounded-xl text-[14px] font-medium transition-all outline-none bg-white focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/10 text-[#1A1A2E] placeholder-black/20 min-h-14 resize-y" 
                                                    placeholder="Briefly describe your services..."
                                                    value={formData.serviceDescription}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>

                                <button type="submit" className="w-full p-4 bg-[#1A1A2E] text-white rounded-xl text-sm uppercase tracking-widest font-bold shadow-[0_8px_20px_rgba(26,26,46,0.15)] hover:bg-[#C9A84C] hover:text-[#1A1A2E] hover:-translate-y-1 transition-all duration-300 mt-6 mb-4 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer" disabled={isLoading}>
                                    {isLoading ? "Creating Account..." : "Sign Up"}
                                </button>

                                <p className="text-center text-sm font-medium text-black/50 pb-4 lg:pb-0">
                                    Already have an account? 
                                    <Link to="/login" className="text-[#C9A84C] font-bold ml-2 hover:text-[#1A1A2E] transition-colors">Sign in</Link>
                                </p>
                            </form>
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

export default Register;
