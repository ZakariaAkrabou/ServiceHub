import React, { useState, useEffect, useRef } from "react";
import Header from "./Header";

const slides = [
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1650&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1650&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1650&q=80",
  "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1650&q=80",
];

const services = ["Home Repairs", "Tutoring", "Beauty Services", "Carpentry"];

const HeroSection: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [serviceIdx, setServiceIdx] = useState(0);
  const [serviceVisible, setServiceVisible] = useState(true);

  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  // Auto-slide images
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % slides.length);
        setAnimating(false);
      }, 700);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Rotating service word
  useEffect(() => {
    const timer = setInterval(() => {
      setServiceVisible(false);
      setTimeout(() => {
        setServiceIdx((prev) => (prev + 1) % services.length);
        setServiceVisible(true);
      }, 350);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  // Parallax scroll
  useEffect(() => {
    const onScroll = () => {
      rafRef.current = requestAnimationFrame(() => {
        const section = sectionRef.current;
        if (!section) return;
        const rect = section.getBoundingClientRect();
        const scrolled = -rect.top;
        if (bgRef.current) {
          bgRef.current.style.transform = `translateY(${scrolled * 0.35}px)`;
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
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .h-root {
          font-family: 'Geist', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          background: #0c0c0c;
        }

        /* ── BG SLIDESHOW ── */
        .h-bg {
          position: absolute;
          inset: -25%;
          z-index: 0;
          will-change: transform;
        }
        .h-bg-img {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          transition: opacity 0.9s ease;
        }
        .h-bg-img.active  { opacity: 1; }
        .h-bg-img.hidden  { opacity: 0; }
        .h-bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background:
            linear-gradient(105deg, rgba(8,8,8,0.92) 30%, rgba(8,8,8,0.4) 65%, rgba(8,8,8,0.15) 100%),
            linear-gradient(to top, rgba(8,8,8,0.85) 0%, transparent 50%);
          z-index: 1;
        }

        /* ── LAYOUT ── */
        .h-wrap {
          position: relative;
          z-index: 2;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }

        /* Spacer visible uniquement quand le Header est en position absolute/fixed
           (sort du flux normal) — pousse le contenu vers le bas sur mobile */
        .h-header-spacer {
          display: none;
        }

        .h-body {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 480px;
          gap: 0;
          align-items: end;
          padding: 0 60px 56px 64px;
        }

        /* ── LEFT ── */
        .h-left {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding-bottom: 4px;
          max-width: 620px;
        }

        .h-eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 28px;
          animation: fadeUp 0.6s 0.1s ease both;
        }
        .h-eyebrow-line {
          width: 36px;
          height: 1px;
          background: #c9a84c;
        }
        .h-eyebrow-text {
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #c9a84c;
          font-weight: 400;
        }

        .h-headline {
          font-family: 'Times New Roman', serif;
          font-weight: 300;
          font-size: clamp(50px, 6.5vw, 94px);
          line-height: 1.0;
          letter-spacing: -1px;
          color: #f5f0e8;
          margin-bottom: 32px;
          animation: fadeUp 0.8s 0.2s ease both;
          white-space: nowrap;
        }
        .h-headline em {
          font-style: italic;
          color: #c9a84c;
          font-weight: 300;
        }

        .h-service-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 36px;
          animation: fadeUp 0.8s 0.35s ease both;
        }
        .h-service-label {
          font-size: 13px;
          color: rgba(245,240,232,0.45);
          letter-spacing: 0.08em;
          font-weight: 300;
          text-transform: uppercase;
        }
        .h-service-word {
          font-family: 'Times New Roman', serif;
          font-size: 22px;
          font-weight: 400;
          font-style: italic;
          color: #f5f0e8;
          transition: opacity 0.3s ease, transform 0.3s ease;
          display: inline-block;
          min-width: 160px;
        }
        .h-service-word.out {
          opacity: 0;
          transform: translateY(-8px);
        }
        .h-service-word.in {
          opacity: 1;
          transform: translateY(0);
        }

        .h-sub {
          font-size: 15px;
          line-height: 1.75;
          color: rgba(245,240,232,0.55);
          font-weight: 300;
          max-width: 420px;
          margin-bottom: 48px;
          animation: fadeUp 0.8s 0.45s ease both;
        }

        .h-actions {
          display: flex;
          align-items: center;
          gap: 24px;
          animation: fadeUp 0.8s 0.55s ease both;
        }

        .h-btn-primary {
          display: flex;
          align-items: center;
          gap: 16px;
          background: #c9a84c;
          color: #0c0c0c;
          border: none;
          padding: 0 8px 0 28px;
          height: 56px;
          border-radius: 100px;
          font-family: 'Geist', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: background 0.25s, transform 0.15s;
        }
        .h-btn-primary:hover { background: #e0bc66; transform: translateY(-2px); }
        .h-btn-icon {
          width: 40px; height: 40px;
          border-radius: 50%;
          background: #0c0c0c;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          color: #c9a84c;
          flex-shrink: 0;
        }

        .h-btn-ghost {
          font-size: 13px;
          color: rgba(245,240,232,0.55);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Geist', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          font-weight: 400;
          text-decoration: underline;
          text-underline-offset: 4px;
          text-decoration-color: rgba(245,240,232,0.2);
          transition: color 0.2s;
        }
        .h-btn-ghost:hover { color: rgba(245,240,232,0.85); }

        /* ── RIGHT CARD ── */
        .h-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: flex-end;
          gap: 16px;
        }

        .h-card {
          width: 100%;
          height: 500px;
          border-radius: 24px;
          overflow: hidden;
          position: relative;
          border: 1px solid rgba(201,168,76,0.25);
          animation: fadeUp 1s 0.4s ease both;
          box-shadow: 0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.08);
        }

        .h-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: opacity 0.9s ease, transform 8s ease;
        }
        .h-card-img.fade-out { opacity: 0; transform: scale(1.05); }
        .h-card-img.active   { opacity: 1; transform: scale(1); }

        .h-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(10,8,5,0.9) 0%,
            rgba(10,8,5,0.3) 50%,
            transparent 100%
          );
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 20px 22px 26px;
        }

        .h-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .h-badge {
          background: rgba(201,168,76,0.18);
          border: 1px solid rgba(201,168,76,0.3);
          backdrop-filter: blur(8px);
          border-radius: 100px;
          padding: 6px 14px;
          font-size: 12px;
          color: #c9a84c;
          letter-spacing: 0.08em;
          font-weight: 400;
        }

        .h-dots {
          display: flex;
          gap: 6px;
          align-items: center;
        }
        .h-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: rgba(255,255,255,0.3);
          cursor: pointer;
          transition: all 0.3s;
        }
        .h-dot.active {
          background: #c9a84c;
          width: 18px;
          border-radius: 3px;
        }

        .h-card-bottom {}

        .h-stat-row {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
        }
        .h-stat {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .h-stat-num {
          font-family: 'Times New Roman', serif;
          font-size: 28px;
          font-weight: 300;
          color: #f5f0e8;
          line-height: 1;
        }
        .h-stat-label {
          font-size: 11px;
          color: rgba(245,240,232,0.4);
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .h-stat-divider {
          width: 1px;
          background: rgba(245,240,232,0.12);
          align-self: stretch;
        }

        .h-card-cta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(245,240,232,0.07);
          border: 1px solid rgba(245,240,232,0.12);
          backdrop-filter: blur(12px);
          border-radius: 14px;
          padding: 14px 16px;
          cursor: pointer;
          transition: background 0.2s;
        }
        .h-card-cta:hover { background: rgba(245,240,232,0.12); }
        .h-card-cta-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .h-card-cta-title {
          font-size: 14px;
          color: #f5f0e8;
          font-weight: 400;
        }
        .h-card-cta-sub {
          font-size: 12px;
          color: rgba(245,240,232,0.4);
        }
        .h-card-cta-arrow {
          width: 34px; height: 34px;
          border-radius: 50%;
          border: 1px solid rgba(201,168,76,0.35);
          display: flex; align-items: center; justify-content: center;
          color: #c9a84c;
          font-size: 16px;
          flex-shrink: 0;
        }

        /* ── SIDE TICKER ── */
        .h-ticker {
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%) rotate(-90deg);
          transform-origin: center center;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 12px;
          animation: fadeIn 1s 0.8s ease both;
        }
        .h-ticker-line {
          width: 32px; height: 1px;
          background: rgba(245,240,232,0.2);
        }
        .h-ticker-text {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(245,240,232,0.3);
          white-space: nowrap;
        }

        /* ── SCROLL HINT ── */
        .h-scroll {
          position: absolute;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          animation: fadeIn 1s 1.2s ease both;
        }
        .h-scroll span {
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(245,240,232,0.3);
        }
        .h-scroll-track {
          width: 1px;
          height: 44px;
          background: rgba(245,240,232,0.12);
          position: relative;
          overflow: hidden;
        }
        .h-scroll-thumb {
          position: absolute;
          top: 0; left: 0;
          width: 100%;
          height: 50%;
          background: #c9a84c;
          animation: scrollDown 1.8s ease-in-out infinite;
        }

        @keyframes scrollDown {
          0%   { transform: translateY(-100%); opacity: 1; }
          50%  { transform: translateY(100%); opacity: 1; }
          51%  { opacity: 0; }
          100% { transform: translateY(100%); opacity: 0; }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* ── RESPONSIVE ── */

        /* Tablet landscape — réduire la colonne droite */
        @media (max-width: 1100px) {
          .h-body {
            grid-template-columns: 1fr 380px;
            padding: 0 40px 48px 48px;
          }
          .h-headline {
            white-space: normal;
          }
        }

        /* Tablet portrait — passer en colonne */
        @media (max-width: 960px) {
          .h-root {
            min-height: 100svh;
          }
          .h-wrap {
            min-height: 100svh;
          }
          /* Affiche le spacer pour compenser le Header sorti du flux */
          .h-header-spacer {
            display: block;
            height: 72px; /* hauteur typique d'un header mobile */
            flex-shrink: 0;
          }
          .h-body {
            grid-template-columns: 1fr;
            grid-template-rows: auto auto;
            padding: 40px 32px 56px;
            gap: 40px;
            align-items: start;
            justify-items: center;
          }
          .h-left {
            max-width: 100%;
            align-items: center;
            justify-content: flex-start;
            text-align: center;
            order: 1;
          }
          .h-right {
            align-items: center;
            justify-content: flex-start;
            width: 100%;
            max-width: 520px;
            order: 2;
          }
          .h-card { height: 380px; width: 100%; }
          .h-ticker { display: none; }
          .h-headline {
            font-size: clamp(40px, 8vw, 66px);
            white-space: normal;
            text-align: center;
          }
          .h-sub { text-align: center; margin-left: auto; margin-right: auto; }
          .h-service-row { justify-content: center; }
          .h-actions { justify-content: center; }
        }

        /* Mobile — affichage vertical */
        @media (max-width: 600px) {
          .h-body {
            /* padding-top genereux pour que le Header ne chevauche pas le contenu */
            padding: 28px 20px 48px;
            gap: 28px;
          }
          .h-headline {
            font-size: clamp(32px, 9.5vw, 48px);
            margin-bottom: 20px;
          }
          .h-service-row { margin-bottom: 20px; }
          .h-sub {
            font-size: 14px;
            line-height: 1.65;
            margin-bottom: 28px;
          }
          /* Carte : hauteur suffisante pour afficher stats + CTA */
          .h-card {
            height: 340px;
            border-radius: 18px;
          }
          /* Stats : eviter la troncature */
          .h-stat-row {
            flex-wrap: nowrap;
            justify-content: space-between;
            gap: 8px;
            margin-bottom: 14px;
          }
          .h-stat { flex: 1; align-items: center; }
          .h-stat-num { font-size: 20px; }
          .h-stat-label {
            font-size: 9px;
            letter-spacing: 0.06em;
            text-align: center;
            white-space: nowrap;
          }
          .h-stat-divider { display: none; }
          .h-card-cta {
            padding: 12px 14px;
          }
          .h-card-cta-title { font-size: 13px; }
          .h-card-cta-sub { font-size: 11px; }
        }

        /* Mobile étroit */
        @media (max-width: 420px) {
          .h-body { padding: 24px 16px 40px; }
          .h-headline { font-size: clamp(28px, 10.5vw, 40px); }
          .h-actions {
            flex-direction: column;
            align-items: stretch;
            gap: 14px;
            width: 100%;
          }
          .h-btn-primary {
            width: 100%;
            justify-content: space-between;
            padding: 0 8px 0 24px;
          }
          .h-btn-ghost { text-align: center; }
          .h-service-word { min-width: 120px; font-size: 19px; }
          .h-badge { font-size: 10px; padding: 5px 10px; }
          .h-stat-label { font-size: 8px; }
        }
      `}</style>

      <section className="h-root" ref={sectionRef}>
        {/* Parallax BG */}
        <div className="h-bg" ref={bgRef}>
          {slides.map((src, i) => (
            <div
              key={i}
              className={`h-bg-img ${i === current ? "active" : "hidden"}`}
              style={{ backgroundImage: `url(${src})` }}
            />
          ))}
        </div>

        {/* Side ticker */}
        <div className="h-ticker">
          
        </div>

        <div className="h-wrap">
          <Header />
          <div className="h-header-spacer" />

          <div className="h-body">
            {/* LEFT */}
            <div className="h-left">
              <h1 className="h-headline">
                Local experts,<br />
                <em>booked</em> in seconds.
              </h1>

              <div className="h-service-row">
                <span className="h-service-label">Looking for</span>
                <span className={`h-service-word ${serviceVisible ? "in" : "out"}`}>
                  {services[serviceIdx]}
                </span>
              </div>

              <p className="h-sub">
                ServiceHub connects you with trusted local freelancers and small businesses. Transparent pricing, verified profiles, and guaranteed quality — all in one place.
              </p>

              <div className="h-actions">
                <button className="h-btn-primary">
                  Book a Professional
                  <span className="h-btn-icon">↗</span>
                </button>
                <button className="h-btn-ghost">Explore Services</button>
              </div>
            </div>

            {/* RIGHT */}
            <div className="h-right">
              <div className="h-card">
                <img
                  src={slides[current]}
                  alt="Professional service"
                  className={`h-card-img ${animating ? "fade-out" : "active"}`}
                />
                <div className="h-card-overlay">
                  <div className="h-card-top">
                    <span className="h-badge">−15% on your first booking</span>
                    <div className="h-dots">
                      {slides.map((_, i) => (
                        <div
                          key={i}
                          className={`h-dot ${i === current ? "active" : ""}`}
                          onClick={() => {
                            setAnimating(true);
                            setTimeout(() => { setCurrent(i); setAnimating(false); }, 350);
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="h-card-bottom">
                    <div className="h-stat-row">
                      <div className="h-stat">
                        <span className="h-stat-num">4.9★</span>
                        <span className="h-stat-label">Avg. Rating</span>
                      </div>
                      <div className="h-stat-divider" />
                      <div className="h-stat">
                        <span className="h-stat-num">2,400+</span>
                        <span className="h-stat-label">Active Pros</span>
                      </div>
                      <div className="h-stat-divider" />
                      <div className="h-stat">
                        <span className="h-stat-num">48h</span>
                        <span className="h-stat-label">Avg. Response</span>
                      </div>
                    </div>

                    <div className="h-card-cta">
                      <div className="h-card-cta-text">
                        <span className="h-card-cta-title">Same-day availability open</span>
                        <span className="h-card-cta-sub">Professionals ready near you today</span>
                      </div>
                      <div className="h-card-cta-arrow">↗</div>
                    </div>
                  </div>
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