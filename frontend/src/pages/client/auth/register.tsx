import React, { useState } from "react";
import { Link} from "react-router-dom";
import { useRegisterMutation } from "../../../app/api/AuthApi";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const Register: React.FC = () => {
    const [role, setRole] = useState("customer");
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const submissionData = {
                ...formData,
                role: role === "customer" ? "customer" : "service_provider"
            };
            await register(submissionData).unwrap();
            setShowSuccess(true);
            toast.success("Account created! Please check your email.");
        } catch (err: any) {
            toast.error(err?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="h-screen overflow-hidden grid lg:grid-cols-2 grid-cols-1 font-sans bg-white">
            <section className="relative bg-[url('https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center hidden lg:flex flex-col justify-center p-16 text-white">
                <div className="absolute inset-0 bg-linear-to-r from-brand-blue/70 to-brand-blue/40" />
                <div className="relative z-10 animate-fade-in-up">
                    <h2 className="font-serif text-[clamp(32px,3.5vw,50px)] leading-[1.1] mb-4 tracking-[-1px]">
                        Expert help,<br />at your service.
                    </h2>
                    <p className="text-base opacity-90 font-light max-w-110 leading-relaxed">
                        Join ServiceHub today and connect with thousands of customers or skilled professionals in your area.
                    </p>
                </div>
            </section>

            <section className="flex flex-col p-[16px_40px] bg-[#fdfdfd] justify-center">
                <div className="w-full max-w-120 m-auto animate-fade-in-right text-center">
                    {showSuccess ? (
                        <div className="py-10">
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L22 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h1 className="font-serif text-[36px] text-[#1A1A1A] mb-4 tracking-[-1px]">Check your email</h1>
                            <p className="text-[#6c757d] text-[16px] mb-10 leading-relaxed font-light">
                                We've sent a verification link to <span className="font-semibold text-brand-blue">{formData.email}</span>. 
                                Please click the link to confirm your account and start using ServiceHub.
                            </p>
                            <Link to="/login" className="inline-block w-full p-4 bg-brand-blue text-white rounded-xl text-base font-bold shadow-[0_6px_20px_rgba(8,29,58,0.15)] hover:bg-[#1a2a4a] hover:-translate-y-px transition-all">
                                Back to Sign In
                            </Link>
                        </div>
                    ) : (
                        <>
                            <h1 className="font-serif text-[32px] text-[#1A1A1A] mb-0 tracking-[-0.5px]">Create Account</h1>
                            <p className="text-[#6c757d] text-sm mb-3 font-light">Join our community and get things done.</p>

                            <div className="grid grid-cols-2 gap-2 mb-3 bg-[#f1f3f5] p-1 rounded-[10px]">
                                <div 
                                    className={`p-2 text-center rounded-[7px] cursor-pointer text-[12px] font-semibold transition-all duration-300 ${role === "customer" ? "bg-white text-brand-blue shadow-[0_3px_6px_rgba(0,0,0,0.05)]" : "text-[#6c757d]"}`}
                                    onClick={() => setRole("customer")}
                                >
                                    Customer
                                </div>
                                <div 
                                    className={`p-2 text-center rounded-[7px] cursor-pointer text-[12px] font-semibold transition-all duration-300 ${role === "provider" ? "bg-white text-brand-blue shadow-[0_3px_6px_rgba(0,0,0,0.05)]" : "text-[#6c757d]"}`}
                                    onClick={() => setRole("provider")}
                                >
                                    Service Provider
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-2 gap-[10px_16px]">
                                    <div className="mb-0">
                                        <label className="block text-[10px] font-semibold text-[#333] mb-1 uppercase tracking-wider">First Name</label>
                                        <input 
                                            type="text" 
                                            name="firstName"
                                            className="w-full p-[8px_12px] border border-[#e9ecef] rounded-lg text-sm transition-all outline-none bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5" 
                                            placeholder="John"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-0">
                                        <label className="block text-[10px] font-semibold text-[#333] mb-1 uppercase tracking-wider">Last Name</label>
                                        <input 
                                            type="text" 
                                            name="lastName"
                                            className="w-full p-[8px_12px] border border-[#e9ecef] rounded-lg text-sm transition-all outline-none bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5" 
                                            placeholder="Doe"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-0">
                                        <label className="block text-[10px] font-semibold text-[#333] mb-1 uppercase tracking-wider">Email Address</label>
                                        <input 
                                            type="email" 
                                            name="email"
                                            className="w-full p-[8px_12px] border border-[#e9ecef] rounded-lg text-sm transition-all outline-none bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5" 
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-0">
                                        <label className="block text-[10px] font-semibold text-[#333] mb-1 uppercase tracking-wider">Phone</label>
                                        <input 
                                            type="tel" 
                                            name="phone"
                                            className="w-full p-[8px_12px] border border-[#e9ecef] rounded-lg text-sm transition-all outline-none bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5" 
                                            placeholder="+212 600..."
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-span-2 mb-0">
                                        <label className="block text-[10px] font-semibold text-[#333] mb-1 uppercase tracking-wider">Password</label>
                                        <div className="relative">
                                            <input 
                                                type={showPassword ? "text" : "password"} 
                                                name="password"
                                                className="w-full p-[8px_12px] pr-10 border border-[#e9ecef] rounded-lg text-sm transition-all outline-none bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5" 
                                                placeholder="••••••••"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                            />
                                            <button 
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#adb5bd] hover:text-brand-blue transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    {role === "provider" && (
                                        <>
                                            <div className="mb-0">
                                                <label className="block text-[10px] font-semibold text-[#333] mb-1 uppercase tracking-wider">Category</label>
                                                <select 
                                                    name="serviceCategory"
                                                    className="w-full p-[8px_12px] border border-[#e9ecef] rounded-lg text-sm transition-all outline-none bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5" 
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
                                                <label className="block text-[10px] font-semibold text-[#333] mb-1 uppercase tracking-wider">Location</label>
                                                <input 
                                                    type="text" 
                                                    name="location"
                                                    className="w-full p-[8px_12px] border border-[#e9ecef] rounded-lg text-sm transition-all outline-none bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5" 
                                                    placeholder="Rabat"
                                                    value={formData.location}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>

                                            <div className="col-span-2 mb-0">
                                                <label className="block text-[10px] font-semibold text-[#333] mb-1 uppercase tracking-wider">Description</label>
                                                <textarea 
                                                    name="serviceDescription"
                                                    className="w-full p-[8px_12px] border border-[#e9ecef] rounded-lg text-sm transition-all outline-none bg-white focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 min-h-12.5 resize-y" 
                                                    placeholder="Briefly describe your services..."
                                                    value={formData.serviceDescription}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>

                                <button type="submit" className="w-full p-3.5 bg-brand-blue text-white rounded-lg text-sm font-bold shadow-[0_6px_20px_rgba(8,29,58,0.15)] hover:bg-[#1a2a4a] hover:-translate-y-px transition-all mt-4 mb-2 disabled:opacity-60 disabled:cursor-not-allowed" disabled={isLoading}>
                                    {isLoading ? "Creating Account..." : "Sign Up"}
                                </button>

                                <p className="text-center text-[13px] text-[#6c757d]">
                                    Already have an account? 
                                    <Link to="/login" className="text-brand-blue font-bold ml-2 border-b-2 border-brand-blue/10 hover:border-brand-blue">Sign in</Link>
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
