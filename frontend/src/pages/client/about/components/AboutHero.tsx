import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const AboutHero: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let W = (canvas.width = canvas.offsetWidth);
    let H = (canvas.height = canvas.offsetHeight);

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(246,227,4,${p.alpha})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section className="ahr">
      <style>{`
        /* ─── Root ─── */
        .ahr {
          position: relative;
          min-height: 50vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: #0a1628;
          font-family: 'Times New Roman', Times, serif;
          padding: 120px 24px 80px;
          box-sizing: border-box;
        }

        /* ─── Canvas ─── */
        .ahr__canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }

        /* ─── Grid overlay ─── */
        .ahr__grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(246,227,4,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(246,227,4,0.04) 1px, transparent 1px);
          background-size: 80px 80px;
          pointer-events: none;
        }

        /* ─── Blobs ─── */
        .ahr__blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
        }
        .ahr__blob--1 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(246,227,4,0.18) 0%, transparent 70%);
          top: -140px; right: -120px;
          animation: blobFloat1 9s ease-in-out infinite alternate;
        }
        .ahr__blob--2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(0,140,255,0.12) 0%, transparent 70%);
          bottom: -60px; left: -80px;
          animation: blobFloat2 12s ease-in-out infinite alternate;
        }
        @keyframes blobFloat1 { from { transform: translate(0,0) scale(1); } to { transform: translate(30px,-40px) scale(1.08); } }
        @keyframes blobFloat2 { from { transform: translate(0,0) scale(1); } to { transform: translate(-20px,30px) scale(1.05); } }

        /* ─── Inner ─── */
        .ahr__inner {
          position: relative;
          z-index: 2;
          max-width: 980px;
          width: 100%;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        /* ─── Tag ─── */
        .ahr__tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(246,227,4,0.35);
          background: rgba(246,227,4,0.06);
          color: #c49e53;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 7px 18px;
          border-radius: 999px;
          margin-bottom: 36px;
          animation: fadeUp 0.7s ease both;
        }
        .ahr__tag-dot {
          width: 5px; height: 5px;
          background: #c9a84c;
          border-radius: 50%;
          animation: pulse 1.8s ease-in-out infinite;
        }
        @keyframes pulse {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(0.6); }
        }

        /* ─── Headline ─── */
        .ahr__title {
          font-family: 'Times New Roman', Times, serif;
          font-size: clamp(64px, 9vw, 120px);
          line-height: 0.92;
          letter-spacing: -0.01em;
          color: #ffffff;
          margin: 0 0 8px;
          animation: fadeUp 0.7s 0.1s ease both;
        }
        .ahr__title-accent {
          -webkit-text-stroke: 2px #c49e53;
          color: transparent;
          display: block;
        }

        /* ─── Divider ─── */
        .ahr__divider {
          width: 56px;
          height: 3px;
          background: #c9a84c;
          margin: 32px auto;
          border-radius: 2px;
          animation: fadeUp 0.7s 0.2s ease both, expand 0.8s 0.4s ease both;
          transform-origin: left center;
        }
        @keyframes expand { from { width: 0; } to { width: 56px; } }

        /* ─── Copy ─── */
        .ahr__copy {
          font-size: clamp(16px, 2vw, 18px);
          line-height: 1.85;
          color: rgba(255,255,255,0.6);
          max-width: 640px;
          margin: 0 auto 48px;
          font-weight: 300;
          animation: fadeUp 0.7s 0.3s ease both;
        }
        .ahr__copy em {
          color: rgba(255,255,255,0.9);
          font-style: italic;
          font-weight: 400;
        }

        /* ─── Stats strip ─── */
        .ahr__stats {
          display: flex;
          justify-content: center;
          gap: 48px;
          margin-bottom: 52px;
          flex-wrap: wrap;
          animation: fadeUp 0.7s 0.4s ease both;
          text-align: center;
        }
        .ahr__stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          text-align: center;
        }
        .ahr__stat-num {
          font-family: 'Times New Roman', Times, serif;
          font-size: 42px;
          line-height: 1;
          color: #c9a84c;
        }
        .ahr__stat-label {
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
        }
        .ahr__stat-sep {
          width: 1px;
          height: 48px;
          background: rgba(255,255,255,0.1);
          align-self: center;
        }

        /* ─── Actions ─── */
        .ahr__actions {
          display: inline-flex;
          gap: 14px;
          flex-wrap: wrap;
          justify-content: center;
          animation: fadeUp 0.7s 0.5s ease both;
        }

        .ahr__btn {
          position: relative;
          border-radius: 999px;
          padding: 15px 32px;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
          overflow: hidden;
        }
        .ahr__btn--primary {
          background: #c9a84c;
          color: #08101d;
          box-shadow: 0 0 0 0 rgba(246,227,4,0.4);
        }
        .ahr__btn--primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(246,227,4,0.35);
        }
        .ahr__btn--primary::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.2), transparent 60%);
          border-radius: inherit;
        }
        .ahr__btn--ghost {
          background: transparent;
          color: #ffffff;
          border: 1px solid rgba(255,255,255,0.18);
          backdrop-filter: blur(8px);
        }
        .ahr__btn--ghost:hover {
          transform: translateY(-2px);
          border-color: rgba(255,255,255,0.4);
          background: rgba(255,255,255,0.05);
        }
        .ahr__btn-arrow {
          display: inline-block;
          transition: transform 0.2s ease;
        }
        .ahr__btn:hover .ahr__btn-arrow { transform: translateX(3px); }

        /* ─── Scroll hint ─── */
        .ahr__scroll {
          position: absolute;
          bottom: 36px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: #c49e53;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          animation: fadeUp 1s 1s ease both;
          z-index: 2;
        }
        .ahr__scroll-bar {
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, #c49e53, transparent);
          animation: scrollBar 2s ease-in-out infinite;
        }
        @keyframes scrollBar {
          0%   { transform: scaleY(0); transform-origin: top; }
          50%  { transform: scaleY(1); transform-origin: top; }
          51%  { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }

        /* ─── Shared fade-up ─── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ─── Mobile ─── */
        @media (max-width: 600px) {
          .ahr { padding: 100px 20px 80px; }
          .ahr__stats { gap: 28px; }
          .ahr__stat-sep { display: none; }
          .ahr__btn { padding: 13px 24px; font-size: 13px; }
        }
      `}</style>

      <canvas ref={canvasRef} className="ahr__canvas" />
      <div className="ahr__grid" />
      <div className="ahr__blob ahr__blob--1" />
      <div className="ahr__blob ahr__blob--2" />

      <div className="ahr__inner">
       

        {/* Headline */}
        <h1 className="ahr__title">
          Who Are We?

        </h1>

        {/* Divider */}
        <div className="ahr__divider" />

        {/* Copy */}
        <p className="ahr__copy">
          ServiceHub connects people with the <em>best local service providers</em> —
          making every service simple, fast, and safe. We are building the
          go-to platform for a seamless, friction-free customer experience.
        </p>

        

     
      </div>

      {/* Scroll hint */}
      <div className="ahr__scroll">
        <div className="ahr__scroll-bar" />
        Scroll
      </div>
    </section>
  );
};

export default AboutHero;