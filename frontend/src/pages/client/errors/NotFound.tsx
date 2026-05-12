import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const NotFound: React.FC = () => {
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            setMousePos({ x, y });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="notfound-wrapper">
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600&display=swap');

                .notfound-wrapper {
                    height: 100vh;
                    width: 100vw;
                    background-color: #0a0a0a;
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-family: 'DM Sans', sans-serif;
                }

                .background-image {
                    position: absolute;
                    inset: 0;
                    background-image: url('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1920&q=80');
                    background-size: cover;
                    background-position: center;
                    filter: brightness(0.8) contrast(1.1);
                    opacity: 0.9;
                }

                .flashlight-overlay {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(
                        circle 280px at ${mousePos.x}% ${mousePos.y}%, 
                        transparent 0%, 
                        rgba(0, 0, 0, 0.96) 100%
                    );
                    z-index: 1;
                    pointer-events: none;
                    transition: background 0.05s linear;
                }

                .content {
                    position: relative;
                    z-index: 2;
                    text-align: center;
                    max-width: 650px;
                    padding: 40px;
                    pointer-events: auto;
                }

                .error-code {
                    font-family: 'DM Serif Display', serif;
                    font-size: clamp(100px, 18vw, 220px);
                    line-height: 0.8;
                    margin-bottom: 20px;
                    letter-spacing: -4px;
                    opacity: 1;
                    color: #ffffff;
                    text-shadow: 0 10px 40px rgba(0,0,0,0.8);
                }

                .error-title {
                    font-family: 'DM Serif Display', serif;
                    font-size: clamp(36px, 6vw, 56px);
                    margin-bottom: 24px;
                    letter-spacing: -1px;
                    color: #ffffff;
                }

                .error-desc {
                    font-size: 19px;
                    font-weight: 300;
                    color: rgba(255, 255, 255, 0.8);
                    margin-bottom: 48px;
                    line-height: 1.6;
                    max-width: 500px;
                    margin-left: auto;
                    margin-right: auto;
                }

                .back-home {
                    display: inline-block;
                    padding: 18px 48px;
                    background: #ffffff;
                    color: #081D3A;
                    text-decoration: none;
                    border-radius: 12px;
                    font-weight: 700;
                    font-size: 16px;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                }

                .back-home:hover {
                    transform: translateY(-4px) scale(1.02);
                    box-shadow: 0 20px 50px rgba(255, 255, 255, 0.15);
                    background: #081D3A;
                    color: #ffffff;
                }

                .cursor-hint {
                    position: absolute;
                    bottom: 50px;
                    left: 0;
                    right: 0;
                    text-align: center;
                    font-size: 12px;
                    opacity: 0.5;
                    letter-spacing: 4px;
                    text-transform: uppercase;
                    z-index: 2;
                    animation: pulse 2s infinite ease-in-out;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.6; }
                }

                @media (max-width: 768px) {
                    .flashlight-overlay {
                        background: radial-gradient(
                            circle 180px at ${mousePos.x}% ${mousePos.y}%, 
                            transparent 0%, 
                            rgba(0, 0, 0, 0.92) 100%
                        );
                    }
                    .content { padding: 20px; }
                    .error-desc { font-size: 16px; }
                }
            `}</style>

            <div className="background-image" />
            <div className="flashlight-overlay" />

            <div className="content">
                <h1 className="error-code">404</h1>
                <h2 className="error-title">Page not found</h2>
                <p className="error-desc">
                    It looks like this page has gone missing. Don't worry, 
                    our experts are on it. Let's get you back on track.
                </p>
                <Link to="/" className="back-home">
                    Back to Home
                </Link>
            </div>

            <div className="cursor-hint">Move your cursor to explore</div>
        </div>
    );
};

export default NotFound;
