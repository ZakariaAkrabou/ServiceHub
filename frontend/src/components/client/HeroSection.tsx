import React, { useState, useEffect, useRef } from "react";
import Header from "./Header";

const slides = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1650&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1650&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1650&q=80",
  "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1650&q=80",
];

const HeroSection: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);


  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
        setAnimating(false);
      }, 600);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      rafRef.current = requestAnimationFrame(() => {
        const section = sectionRef.current;
        if (!section) return;

        const rect = section.getBoundingClientRect();
        const sectionH = section.offsetHeight;

      
        const scrolled = -rect.top;
        const progress = Math.max(0, Math.min(1, scrolled / sectionH));

      
        if (bgRef.current) {
          const bgY = scrolled * 0.4;
          bgRef.current.style.transform = `translateY(${bgY}px)`;
        }

        
        if (headlineRef.current) {
          const y = -scrolled * 0.18;
          const opacity = Math.max(0, 1 - progress * 2.2);
          headlineRef.current.style.transform = `translateY(${y}px)`;
          headlineRef.current.style.opacity = String(opacity);
        }

  
        if (subRef.current) {
          const y = -scrolled * 0.1;
          const opacity = Math.max(0, 1 - progress * 3);
          subRef.current.style.transform = `translateY(${y}px)`;
          subRef.current.style.opacity = String(opacity);
        }

        if (cardRef.current) {
          const y = -scrolled * 0.06;
          const scale = Math.max(0.88, 1 - progress * 0.12);
          cardRef.current.style.transform = `translateY(${y}px) scale(${scale})`;
          cardRef.current.style.opacity = String(Math.max(0, 1 - progress * 1.6));
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

        /* ─── WRAPPER GLOBAL ─── */
        .hero-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        /* ─── BACKGROUND IMAGE ─── */
        .hero-bg {
          position: absolute;
          inset: -20%; /* extra room for parallax travel */
          z-index: 0;
          background-image: url('/src/assets/hero.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          will-change: transform;
          /* Smooth out the parallax on GPU */
          transform: translateZ(0);
        }

        .hero-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
        }

        /* ─── CONTENT WRAPPER ─── */
        .hero-content-wrapper {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        /* ─── HERO BODY ─── */
        .hero-body {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
          padding: 0 48px 64px;
          align-items: end;
        }

        /* ─── LEFT ─── */
        .hero-left {
          display: flex;
          flex-direction: column;
          gap: 0;
          padding-bottom: 8px;
        }

        .hero-headline {
          font-family: 'DM Serif Display', serif;
          font-size: clamp(52px, 6vw, 80px);
          line-height: 1.05;
          color: #ffffff;
          margin: 0 0 100px 0;
          letter-spacing: -2px;
          position: relative;
          top: -18px;
          will-change: transform, opacity;
          /* Initial entrance animation */
          animation: fadeUp 0.7s 0.1s ease both;
        }
        .hero-headline em {
          font-style: italic;
          color: #ffffff;
        }

        .hero-sub {
          font-size: 15px;
          color: #ffffff;
          line-height: 1.6;
          max-width: 380px;
          margin: 0 0 36px 0;
          font-weight: 300;
          will-change: transform, opacity;
          animation: fadeUp 0.7s 0.2s ease both;
        }

        /* ─── RIGHT ─── */
        .hero-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: flex-end;
          gap: 16px;
          position: relative;
        }

        /* ─── CARD ─── */
        .hero-card {
          border: 2px solid #e1d448;
          border-radius: 20px;
          overflow: hidden;
          width: 90%;
          max-width: 440px;
          height: 490px;
          position: relative;
          box-shadow:
            0 0 0 1px rgba(246, 227, 4, 0.12),
            0 32px 80px rgba(0,0,0,0.55);
          will-change: transform, opacity;
          /* Entrance animation */
          animation: fadeUp 0.9s 0.3s ease both;
          transform-origin: bottom center;
        }

        .hero-img-wrap {
          position: absolute;
          inset: 0;
          border-radius: 0;
          overflow: hidden;
        }

        .hero-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: opacity 0.6s ease, transform 8s ease;
        }
        .hero-img.fade-out { opacity: 0; transform: scale(1.04); }
        .hero-img.active   { opacity: 1; transform: scale(1); }

        .hero-card-overlay {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 28px 24px 24px;
          background: linear-gradient(
            to top,
            rgba(0,0,0,0.82) 0%,
            rgba(0,0,0,0.5) 60%,
            transparent 100%
          );
          z-index: 2;
        }

        .hero-dots {
          position: absolute;
          top: 16px;
          right: 16px;
          z-index: 3;
          display: flex;
          gap: 6px;
        }
        .hero-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.5);
          cursor: pointer;
          transition: background 0.3s, width 0.3s;
        }
        .hero-dot.active {
          background: #f6e304;
          width: 20px;
          border-radius: 3px;
        }

        .hero-tags {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 18px;
        }
        .hero-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13.5px;
          color: rgba(255,255,255,0.9);
          font-weight: 400;
        }
        .hero-tag::before {
          content: '*';
          color: #f6e304;
          font-size: 16px;
          font-weight: 700;
          line-height: 1;
        }

        .hero-cta-btn {
          background: #e1d448;
          color: #1a1a1a;
          border: none;
          padding: 13px 14px 13px 22px;
          border-radius: 100px;
          font-size: 15px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 50%;
        }
        .hero-cta-btn:hover { background: #ffe600; transform: translateY(-1px); }
        .hero-cta-arrow {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: #1a1a1a;
          display: flex; align-items: center; justify-content: center;
          font-size: 16px;
          color: #f6e304;
          flex-shrink: 0;
        }

        /* ─── SCROLL INDICATOR (like Neative) ─── */
        .hero-scroll-hint {
          position: absolute;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          z-index: 10;
          animation: fadeUp 1s 1s ease both;
        }
        .hero-scroll-hint span {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          font-family: 'DM Sans', sans-serif;
        }
        .hero-scroll-line {
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.5), transparent);
          animation: scrollPulse 1.8s ease-in-out infinite;
        }

        @keyframes scrollPulse {
          0%   { transform: scaleY(1);   opacity: 1; }
          50%  { transform: scaleY(0.4); opacity: 0.4; }
          100% { transform: scaleY(1);   opacity: 1; }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ─── RESPONSIVE ADJUSTMENTS (tablet / mobile) ─── */
        @media (max-width: 900px) {
          .hero-body {
            grid-template-columns: 1fr;
            padding: 0 24px 48px;
            align-items: center;
            gap: 28px;
          }

          .hero-left {
            padding-bottom: 0;
            align-items: center;
            text-align: center;
            justify-content: center;
          }

          .hero-headline {
            margin: 0 0 24px 0;
            top: 0;
            font-size: clamp(40px, 8vw, 64px);
            letter-spacing: -1px;
          }

          .hero-sub {
            margin: 0 auto 20px;
            max-width: 100%;
          }

          .hero-right {
            align-items: center;
            justify-content: center;
          }

          .hero-card {
            width: 100%;
            max-width: 520px;
            height: 360px;
            border-radius: 16px;
          }

          .hero-cta-btn { width: auto; padding: 12px 18px; }
        }

        @media (max-width: 480px) {
          .hero-body { padding: 0 16px 36px; gap: 18px; }
          .hero-headline { font-size: clamp(28px, 10vw, 44px); margin-bottom: 16px; }
          .hero-sub { font-size: 14px; line-height: 1.5; }
          .hero-card { height: 260px; max-width: 420px; }
          .hero-cta-btn { font-size: 14px; width: 100%; justify-content: center; }
          .hero-dots { top: 10px; right: 10px; }
        }
      `}</style>

      <section className="hero-root" ref={sectionRef}>
        {/* Background with parallax ref */}
        <div className="hero-bg" ref={bgRef} />

        <div className="hero-content-wrapper">
          <Header />

          <div className="hero-body">
            {/* Left */}
            <div className="hero-left">
              <h1 className="hero-headline" ref={headlineRef}>
                Local services,<br />
                <em>effortlessly booked.</em>
              </h1>

              <p className="hero-sub" ref={subRef}>
                Connect with trusted freelancers for home repairs, beauty, tutoring, cleaning, and more — in minutes.
              </p>
            </div>

        
            <div className="hero-right">
              <div className="hero-card" ref={cardRef}>
                <div className="hero-img-wrap">
                  <img
                    src={slides[current]}
                    alt="Clean space"
                    className={`hero-img ${animating ? "fade-out" : "active"}`}
                  />
                </div>

      
                <div className="hero-dots">
                  {slides.map((_, i) => (
                    <div
                      key={i}
                      className={`hero-dot ${i === current ? "active" : ""}`}
                      onClick={() => {
                        setAnimating(true);
                        setTimeout(() => {
                          setCurrent(i);
                          setAnimating(false);
                        }, 300);
                      }}
                    />
                  ))}
                </div>

         
                <div className="hero-card-overlay">
                  <div className="hero-tags">
                    <span className="hero-tag">12% discount for first time users</span>
                    <span className="hero-tag">24% discount for repeating clients</span>
                  </div>
                  <button className="hero-cta-btn">
                    Get a free quote
                    <span className="hero-cta-arrow">↗</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

         
        </div>
      </section>
    </>
  );
};

export default HeroSection;