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
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
            toast.error(err?.data?.message || "Login failed");
        }
    };

    return (
        <div className="h-screen overflow-hidden grid lg:grid-cols-[1.1fr_0.9fr] grid-cols-1 font-sans bg-white">
            <section className="relative bg-[url('https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center hidden lg:flex flex-col justify-center p-20 text-white">
                <div className="absolute inset-0 bg-linear-to-r from-brand-blue/60 to-brand-blue/30" />
                <div className="relative z-10 animate-fade-in-up">
                    <h2 className="font-serif text-[clamp(32px,4vw,56px)] leading-[1.1] mb-6 tracking-[-1px]">
                        The local help you need,<br />simplified.
                    </h2>
                    <p className="text-lg opacity-90 font-light max-w-120 leading-relaxed">
                        Join our community of satisfied users and professional service providers today.
                    </p>
                </div>
            </section>

            <section className="flex items-center justify-center p-10 bg-[#fdfdfd] overflow-hidden">
                <div className="w-full max-w-95 animate-fade-in-right">
                    <h1 className="font-serif text-[38px] text-[#1A1A1A] mb-2 tracking-[-0.5px]">Welcome back</h1>
                    <p className="text-[#6c757d] text-[15px] mb-8 font-light">Enter your credentials to access your account.</p>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-5">
                            <label className="block text-[13px] font-semibold text-[#333] mb-2 uppercase tracking-wider">Email</label>
                            <input 
                                type="email" 
                                className="w-full p-[14px_18px] border border-[#e9ecef] rounded-xl text-[15px] transition-all outline-none bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5" 
                                placeholder="name@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-5">
                            <label className="block text-[13px] font-semibold text-[#333] mb-2 uppercase tracking-wider">Password</label>
                            <div className="relative">
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    className="w-full p-[14px_18px] pr-12 border border-[#e9ecef] rounded-xl text-[15px] transition-all outline-none bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5" 
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#adb5bd] hover:text-brand-blue transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-7">
                            <label className="flex items-center gap-2 text-sm text-[#495057] cursor-pointer select-none">
                                <input type="checkbox" className="w-3.75 h-3.75 accent-brand-blue" />
                                Keep me logged in
                            </label>
                            <Link to="/forgot-password" title="Coming soon" className="text-sm text-brand-blue font-semibold hover:underline">Forgot password?</Link>
                        </div>

                        <button type="submit" className="w-full p-4 bg-brand-blue text-white rounded-xl text-base font-semibold shadow-[0_4px_12px_rgba(8,29,58,0.15)] hover:bg-[#1a2a4a] hover:-translate-y-px transition-all mb-6 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none" disabled={isLoading}>
                            {isLoading ? "Signing in..." : "Sign in"}
                        </button>

                        <div className="flex items-center mb-6 text-[#adb5bd] text-[11px] uppercase tracking-widest before:flex-1 before:h-px before:bg-[#f1f3f5] after:flex-1 after:h-px after:bg-[#f1f3f5]">
                            <span className="px-4">or continue with</span>
                        </div>

                        <div className="grid grid-cols-1 gap-3 mb-8">
                            <button type="button" className="flex items-center justify-center gap-3 p-3 border border-[#e9ecef] rounded-xl bg-white text-sm font-medium text-[#343a40] cursor-pointer hover:bg-[#f8f9fa] hover:border-[#dee2e6] transition-all">
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" width="18" alt="Google" />
                                Continue with Google
                            </button>
                        </div>

                        <p className="text-center text-sm text-[#6c757d]">
                            Don't have an account? 
                            <Link to="/register" className="text-brand-blue font-bold ml-2 border-b-2 border-brand-blue/10 hover:border-brand-blue">Create an account</Link>
                        </p>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Login;
