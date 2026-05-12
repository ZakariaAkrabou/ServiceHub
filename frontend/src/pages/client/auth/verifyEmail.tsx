import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useVerifyEmailMutation } from "../../../app/api/AuthApi";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

const VerifyEmail: React.FC = () => {
    const { token } = useParams<{ token: string }>();
    const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");
    const verificationStarted = useRef(false);

    useEffect(() => {
        const handleVerify = async () => {
            if (!token || verificationStarted.current) return;
            verificationStarted.current = true;
            try {
                await verifyEmail(token).unwrap();
                setStatus("success");
                setMessage("Your email has been successfully verified!");
            } catch (err: any) {
                setStatus("error");
                setMessage(err?.data?.message || "Verification failed. The link may be invalid or expired.");
            }
        };
        handleVerify();
    }, [token, verifyEmail]);

    return (
        <div className="h-screen overflow-hidden grid lg:grid-cols-[1.1fr_0.9fr] grid-cols-1 font-sans bg-white">
            <section className="relative bg-[url('https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center hidden lg:flex flex-col justify-center p-20 text-white">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/60 to-brand-blue/30" />
                <div className="relative z-10 animate-fade-in-up">
                    <h2 className="font-serif text-[clamp(32px,4vw,56px)] leading-[1.1] mb-6 tracking-[-1px]">
                        Verification<br />complete.
                    </h2>
                    <p className="text-lg opacity-90 font-light max-w-[480px] leading-relaxed">
                        Thank you for verifying your email. You can now access all features of ServiceHub.
                    </p>
                </div>
            </section>

            <section className="flex items-center justify-center p-10 bg-[#fdfdfd]">
                <div className="w-full max-w-[440px] animate-fade-in-right text-center">
                    {status === "loading" && (
                        <div className="py-12">
                            <Loader2 className="w-16 h-16 text-brand-blue animate-spin mx-auto mb-6" />
                            <h1 className="font-serif text-[32px] text-[#1A1A1A] mb-3 tracking-[-0.5px]">Verifying your email</h1>
                            <p className="text-[#6c757d] text-[15px] font-light">Please wait a moment while we confirm your account...</p>
                        </div>
                    )}

                    {status === "success" && (
                        <div className="py-12">
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8">
                                <CheckCircle className="w-10 h-10 text-green-500" />
                            </div>
                            <h1 className="font-serif text-[38px] text-[#1A1A1A] mb-4 tracking-[-1px]">Account Verified!</h1>
                            <p className="text-[#6c757d] text-[16px] mb-10 leading-relaxed font-light">
                                {message} You can now sign in to your account and start exploring services.
                            </p>
                            <Link to="/login" className="inline-block w-full p-4 bg-brand-blue text-white rounded-xl text-base font-bold shadow-[0_6px_20px_rgba(8,29,58,0.15)] hover:bg-[#1a2a4a] hover:-translate-y-px transition-all">
                                Go to Sign In
                            </Link>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="py-12">
                            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
                                <XCircle className="w-10 h-10 text-red-500" />
                            </div>
                            <h1 className="font-serif text-[38px] text-[#1A1A1A] mb-4 tracking-[-1px]">Oops!</h1>
                            <p className="text-[#6c757d] text-[16px] mb-10 leading-relaxed font-light">
                                {message}
                            </p>
                            <div className="space-y-4">
                                <Link to="/register" className="inline-block w-full p-4 bg-brand-blue text-white rounded-xl text-base font-bold shadow-[0_6px_20px_rgba(8,29,58,0.15)] hover:bg-[#1a2a4a] hover:-translate-y-px transition-all">
                                    Try Registering Again
                                </Link>
                                <Link to="/login" className="block text-brand-blue font-semibold hover:underline">
                                    Back to Login
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default VerifyEmail;
