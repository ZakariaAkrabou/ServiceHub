import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../../app/api/AuthApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../../app/slices/AuthSlice";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [login, { isLoading }] = useLoginMutation();
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            const result = await login({ email, password }).unwrap();
            dispatch(setCredentials({ user: result.user, token: result.token }));
            toast.success("Welcome back!");
            
            if (result.user.role === "service_provider") {
                navigate("/provider/dashboard");
            } else {
                navigate("/");
            }
        } catch (err: any) {
            setError(err?.data?.message || "Login failed");
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
                    <span className="text-[#C9A84C] font-bold tracking-widest uppercase text-sm mb-4 block">Welcome to ServiceHub</span>
                    <h2 className="font-serif text-[clamp(32px,4vw,56px)] font-black leading-[1.1] mb-6 tracking-tight text-white">
                        The local help you need,<br />simplified.
                    </h2>
                    <p className="text-lg opacity-90 font-medium max-w-[480px] leading-relaxed text-white/80">
                        Join our community of satisfied users and professional service providers today. Experience premium service at your fingertips.
                    </p>
                    <div className="mt-8 h-[3px] w-16 bg-[#C9A84C] rounded-full" />
                </div>
            </section>

            <section className="flex items-center justify-center p-6 sm:p-10 bg-[#F5F0E8]/20 overflow-y-auto">
                <div className="w-full max-w-[420px] animate-[pageFadeUp_0.8s_ease-out]">
                    <div className="mb-8 lg:hidden flex justify-center">
                        <span className="text-3xl font-black text-[#1A1A2E] font-serif">Service<span className="text-[#C9A84C]">Hub</span></span>
                    </div>

                    <h1 className="font-serif text-[38px] font-black text-[#1A1A2E] mb-2 tracking-tight">Welcome back</h1>
                    <p className="text-black/50 text-[15px] mb-8 font-medium">Enter your credentials to access your account.</p>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" />
                            <p className="text-sm text-red-600 font-bold">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-5">
                            <label className="block text-[11px] font-bold text-black/50 mb-2 uppercase tracking-widest">Email</label>
                            <input 
                                type="email" 
                                className="w-full p-[14px_18px] border border-black/10 rounded-xl text-[15px] font-medium transition-all outline-none bg-white focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/10 text-[#1A1A2E] placeholder-black/20" 
                                placeholder="name@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-5">
                            <label className="block text-[11px] font-bold text-black/50 mb-2 uppercase tracking-widest">Password</label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    className="w-full p-[14px_18px] pr-12 border border-black/10 rounded-xl text-[15px] font-medium transition-all outline-none bg-white focus:border-[#C9A84C] focus:ring-4 focus:ring-[#C9A84C]/10 text-[#1A1A2E] placeholder-black/20" 
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black/30 hover:text-[#C9A84C] transition-colors cursor-pointer"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-8">
                            <label className="flex items-center gap-2 text-sm text-black/60 font-medium cursor-pointer select-none">
                                <input type="checkbox" className="w-4 h-4 accent-[#C9A84C] rounded border-black/20 cursor-pointer" />
                                Keep me logged in
                            </label>
                            <Link to="/forgot-password" title="Coming soon" className="text-sm text-[#C9A84C] font-bold hover:text-[#1A1A2E] transition-colors">Forgot password?</Link>
                        </div>

                        <button type="submit" className="w-full p-4 bg-[#1A1A2E] text-white rounded-xl text-xs uppercase tracking-widest font-bold shadow-[0_8px_20px_rgba(26,26,46,0.15)] hover:bg-[#C9A84C] hover:text-[#1A1A2E] hover:-translate-y-1 transition-all duration-300 mb-6 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer" disabled={isLoading}>
                            {isLoading ? "Signing in..." : "Sign in"}
                        </button>

                        <div className="flex items-center mb-6 text-black/30 text-[10px] font-bold uppercase tracking-widest before:flex-1 before:h-px before:bg-black/5 after:flex-1 after:h-px after:bg-black/5">
                            <span className="px-4">or continue with</span>
                        </div>

                        <div className="grid grid-cols-1 gap-3 mb-8">
                            <button type="button" className="flex items-center justify-center gap-3 p-3.5 border border-black/10 rounded-xl bg-white text-sm font-bold text-[#1A1A2E] cursor-pointer hover:bg-[#F5F0E8] hover:border-black/20 transition-all duration-300">
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" width="20" alt="Google" />
                                Continue with Google
                            </button>
                        </div>

                        <p className="text-center text-sm font-medium text-black/50">
                            Don't have an account? 
                            <Link to="/register" className="text-[#C9A84C] font-bold ml-2 hover:text-[#1A1A2E] transition-colors">Create an account</Link>
                        </p>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Login;
