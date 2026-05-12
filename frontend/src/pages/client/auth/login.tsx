import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../../app/api/AuthApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../../app/slices/AuthSlice";
import { toast } from "react-toastify";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [login, { isLoading }] = useLoginMutation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const result = await login({ email, password }).unwrap();
            dispatch(setCredentials({ user: result.user, token: result.token }));
            toast.success("Welcome back!");
            navigate("/");
        } catch (err: any) {
            toast.error(err?.data?.message || "Login failed");
        }
    };

    return (
        <div className="login-wrapper">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600&display=swap');

                .login-wrapper {
                    height: 100vh;
                    overflow: hidden;
                    display: grid;
                    grid-template-columns: 1.1fr 0.9fr;
                    font-family: 'DM Sans', sans-serif;
                    background: #ffffff;
                }

                /* Left Side - Image Section */
                .image-section {
                    position: relative;
                    background-image: url('/src/assets/login-bg.png');
                    background-size: cover;
                    background-position: center;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 80px;
                    color: #ffffff;
                }

                .image-section::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to right, rgba(8, 29, 58, 0.6) 0%, rgba(8, 29, 58, 0.3) 100%);
                }

                .image-content {
                    position: relative;
                    z-index: 2;
                    animation: fadeInUp 1s ease-out both;
                }

                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .image-title {
                    font-family: 'DM Serif Display', serif;
                    font-size: clamp(32px, 4vw, 56px);
                    line-height: 1.1;
                    margin-bottom: 24px;
                    letter-spacing: -1px;
                }

                .image-quote {
                    font-size: 18px;
                    opacity: 0.9;
                    font-weight: 300;
                    max-width: 480px;
                    line-height: 1.6;
                }

                /* Right Side - Form Section */
                .form-section {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px;
                    background: #fdfdfd;
                    overflow: hidden;
                }

                .form-container {
                    width: 100%;
                    max-width: 380px;
                    animation: fadeInRight 0.8s ease-out;
                }

                @keyframes fadeInRight {
                    from { opacity: 0; transform: translateX(20px); }
                    to { opacity: 1; transform: translateX(0); }
                }

                .welcome-text {
                    font-family: 'DM Serif Display', serif;
                    font-size: 38px;
                    color: #1A1A1A;
                    margin-bottom: 8px;
                    letter-spacing: -0.5px;
                }

                .sub-text {
                    color: #6c757d;
                    font-size: 15px;
                    margin-bottom: 32px;
                    font-weight: 300;
                }

                .input-group {
                    margin-bottom: 20px;
                }

                .input-label {
                    display: block;
                    font-size: 13px;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 8px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .text-input {
                    width: 100%;
                    padding: 14px 18px;
                    border: 1px solid #e9ecef;
                    border-radius: 12px;
                    font-size: 15px;
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    outline: none;
                    background: #ffffff;
                }

                .text-input:focus {
                    border-color: #081D3A;
                    box-shadow: 0 0 0 4px rgba(8, 29, 58, 0.05);
                }

                .form-actions {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 28px;
                }

                .remember-me {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 14px;
                    color: #495057;
                    cursor: pointer;
                    user-select: none;
                }

                .forgot-pw {
                    font-size: 14px;
                    color: #081D3A;
                    text-decoration: none;
                    font-weight: 600;
                }

                .submit-btn {
                    width: 100%;
                    padding: 16px;
                    background: #081D3A;
                    color: #ffffff;
                    border: none;
                    border-radius: 12px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s;
                    box-shadow: 0 4px 12px rgba(8, 29, 58, 0.15);
                    margin-bottom: 24px;
                }

                .submit-btn:hover {
                    background: #1a2a4a;
                    transform: translateY(-1px);
                    box-shadow: 0 6px 15px rgba(8, 29, 58, 0.2);
                }

                .submit-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }

                .divider {
                    display: flex;
                    align-items: center;
                    margin-bottom: 24px;
                    color: #adb5bd;
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                }

                .divider::before, .divider::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: #f1f3f5;
                }

                .divider span { padding: 0 16px; }

                .social-btns {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 12px;
                    margin-bottom: 32px;
                }

                .social-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    padding: 12px;
                    border: 1px solid #e9ecef;
                    border-radius: 12px;
                    background: #ffffff;
                    font-size: 14px;
                    font-weight: 500;
                    color: #343a40;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .social-btn:hover {
                    background: #f8f9fa;
                    border-color: #dee2e6;
                }

                .footer-text {
                    text-align: center;
                    font-size: 14px;
                    color: #6c757d;
                }

                .footer-text a {
                    color: #081D3A;
                    font-weight: 700;
                    text-decoration: none;
                    margin-left: 6px;
                    border-bottom: 2px solid rgba(8, 29, 58, 0.1);
                }

                .footer-text a:hover {
                    border-bottom-color: #081D3A;
                }

                @media (max-width: 1024px) {
                    .login-wrapper { grid-template-columns: 1fr; height: auto; overflow: visible; }
                    .image-section { display: none; }
                    .form-section { padding: 40px 20px; height: auto; overflow: visible; }
                }
            `}</style>

            <section className="image-section">
                <div className="image-content">
                    <h2 className="image-title">The local help you need,<br />simplified.</h2>
                    <p className="image-quote">
                        Join our community of satisfied users and professional service providers today.
                    </p>
                </div>
            </section>

            <section className="form-section">
                <div className="form-container">
                    <h1 className="welcome-text">Welcome back</h1>
                    <p className="sub-text">Enter your credentials to access your account.</p>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label className="input-label">Email</label>
                            <input 
                                type="email" 
                                className="text-input" 
                                placeholder="name@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label className="input-label">Password</label>
                            <input 
                                type="password" 
                                className="text-input" 
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-actions">
                            <label className="remember-me">
                                <input type="checkbox" style={{ accentColor: '#081D3A', width: '15px', height: '15px' }} />
                                Keep me logged in
                            </label>
                            <Link to="/forgot-password" className="forgot-pw">Forgot password?</Link>
                        </div>

                        <button type="submit" className="submit-btn" disabled={isLoading}>
                            {isLoading ? "Signing in..." : "Sign in"}
                        </button>

                        <div className="divider">
                            <span>or continue with</span>
                        </div>

                        <div className="social-btns">
                            <button type="button" className="social-btn">
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" width="18" alt="Google" />
                                Continue with Google
                            </button>
                        </div>

                        <p className="footer-text">
                            Don't have an account? 
                            <Link to="/register">Create an account</Link>
                        </p>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Login;
