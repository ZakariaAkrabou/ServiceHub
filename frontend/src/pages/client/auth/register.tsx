import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../../../app/api/AuthApi";
import { toast } from "react-toastify";

const Register: React.FC = () => {
    const [role, setRole] = useState("client");
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
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const submissionData = {
                ...formData,
                role: role === "client" ? "user" : "service_provider"
            };
            await register(submissionData).unwrap();
            toast.success("Account created successfully!");
            navigate("/login");
        } catch (err: any) {
            toast.error(err?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="register-wrapper">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600&display=swap');

                .register-wrapper {
                    height: 100vh;
                    overflow: hidden;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
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
                    padding: 60px;
                    color: #ffffff;
                }

                .image-section::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to right, rgba(8, 29, 58, 0.7) 0%, rgba(8, 29, 58, 0.4) 100%);
                }

                .image-content {
                    position: relative;
                    z-index: 2;
                }

                .image-title {
                    font-family: 'DM Serif Display', serif;
                    font-size: clamp(32px, 3.5vw, 50px);
                    line-height: 1.1;
                    margin-bottom: 16px;
                    letter-spacing: -1px;
                }

                .image-quote {
                    font-size: 16px;
                    opacity: 0.9;
                    font-weight: 300;
                    max-width: 440px;
                    line-height: 1.5;
                }

                /* Right Side - Form Section */
                .form-section {
                    display: flex;
                    flex-direction: column;
                    padding: 24px 60px;
                    background: #fdfdfd;
                    overflow-y: auto;
                }

                .form-container {
                    width: 100%;
                    max-width: 500px;
                    margin: auto;
                    animation: fadeInRight 0.8s ease-out;
                }

                @keyframes fadeInRight {
                    from { opacity: 0; transform: translateX(20px); }
                    to { opacity: 1; transform: translateX(0); }
                }

                .welcome-text {
                    font-family: 'DM Serif Display', serif;
                    font-size: 32px;
                    color: #1A1A1A;
                    margin-bottom: 4px;
                    letter-spacing: -0.5px;
                }

                .sub-text {
                    color: #6c757d;
                    font-size: 14px;
                    margin-bottom: 20px;
                    font-weight: 300;
                }

                /* Role Selector */
                .role-selector {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8px;
                    margin-bottom: 20px;
                    background: #f1f3f5;
                    padding: 5px;
                    border-radius: 12px;
                }

                .role-option {
                    padding: 10px;
                    text-align: center;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 600;
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    color: #6c757d;
                }

                .role-option.active {
                    background: #ffffff;
                    color: #081D3A;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.05);
                }

                .input-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px 20px;
                }

                .input-group {
                    margin-bottom: 0; /* Managed by grid gap */
                }

                .full-width { grid-column: span 2; }

                .input-label {
                    display: block;
                    font-size: 11px;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 6px;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .text-input, .select-input, .textarea-input {
                    width: 100%;
                    padding: 10px 14px;
                    border: 1px solid #e9ecef;
                    border-radius: 8px;
                    font-size: 14px;
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                    outline: none;
                    background: #ffffff;
                    box-sizing: border-box;
                }

                .textarea-input {
                    resize: vertical;
                    min-height: 60px;
                }

                .text-input:focus, .select-input:focus, .textarea-input:focus {
                    border-color: #081D3A;
                    box-shadow: 0 0 0 4px rgba(8, 29, 58, 0.05);
                }

                .submit-btn {
                    width: 100%;
                    padding: 14px;
                    background: #081D3A;
                    color: #ffffff;
                    border: none;
                    border-radius: 8px;
                    font-size: 15px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.3s;
                    box-shadow: 0 6px 20px rgba(8, 29, 58, 0.15);
                    margin-top: 24px;
                    margin-bottom: 16px;
                }

                .submit-btn:hover {
                    background: #1a2a4a;
                    transform: translateY(-1px);
                }

                .footer-text {
                    text-align: center;
                    font-size: 13px;
                    color: #6c757d;
                }

                .footer-text a {
                    color: #081D3A;
                    font-weight: 700;
                    text-decoration: none;
                    margin-left: 6px;
                    border-bottom: 2px solid rgba(8, 29, 58, 0.1);
                }

                @media (max-width: 1024px) {
                    .register-wrapper { grid-template-columns: 1fr; height: auto; overflow: visible; }
                    .image-section { display: none; }
                    .form-section { padding: 40px 20px; }
                }
            `}</style>

            <section className="image-section">
                <div className="image-content">
                    <h2 className="image-title">Expert help,<br />at your service.</h2>
                    <p className="image-quote">
                        Join ServiceHub today and connect with thousands of customers or skilled professionals in your area.
                    </p>
                </div>
            </section>

            <section className="form-section">
                <div className="form-container">
                    <h1 className="welcome-text">Create Account</h1>
                    <p className="sub-text">Join our community and get things done.</p>

                    <div className="role-selector">
                        <div 
                            className={`role-option ${role === "client" ? "active" : ""}`}
                            onClick={() => setRole("client")}
                        >
                            Client
                        </div>
                        <div 
                            className={`role-option ${role === "provider" ? "active" : ""}`}
                            onClick={() => setRole("provider")}
                        >
                            Service Provider
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="input-grid">
                            <div className="input-group">
                                <label className="input-label">First Name</label>
                                <input 
                                    type="text" 
                                    name="firstName"
                                    className="text-input" 
                                    placeholder="John"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label className="input-label">Last Name</label>
                                <input 
                                    type="text" 
                                    name="lastName"
                                    className="text-input" 
                                    placeholder="Doe"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Email Address</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    className="text-input" 
                                    placeholder="john@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Phone</label>
                                <input 
                                    type="tel" 
                                    name="phone"
                                    className="text-input" 
                                    placeholder="+212 600..."
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="input-group full-width">
                                <label className="input-label">Password</label>
                                <input 
                                    type="password" 
                                    name="password"
                                    className="text-input" 
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {role === "provider" && (
                                <>
                                    <div className="input-group">
                                        <label className="input-label">Category</label>
                                        <select 
                                            name="serviceCategory"
                                            className="select-input"
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

                                    <div className="input-group">
                                        <label className="input-label">Location</label>
                                        <input 
                                            type="text" 
                                            name="location"
                                            className="text-input" 
                                            placeholder="Rabat"
                                            value={formData.location}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="input-group full-width">
                                        <label className="input-label">Description</label>
                                        <textarea 
                                            name="serviceDescription"
                                            className="textarea-input" 
                                            placeholder="Briefly describe your services..."
                                            value={formData.serviceDescription}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        <button type="submit" className="submit-btn" disabled={isLoading}>
                            {isLoading ? "Creating Account..." : "Sign Up"}
                        </button>

                        <p className="footer-text">
                            Already have an account? 
                            <Link to="/login">Sign in</Link>
                        </p>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Register;
