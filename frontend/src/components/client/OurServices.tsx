import React, { useState, useRef, useEffect } from "react";
import serviceImg1 from "../../assets/homeclean.jpg";
import serviceImg2 from "../../assets/jrdinage.jpg";
import serviceImg3 from "../../assets/service.jpg";


const fontFamily =
  "'DM Sans', 'Times New Roman', sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial";

const services = [
  {
    num: "01",
    title: "Home Cleaning",
    desc: "Professional Interior Care.",
    hrs: "2 HRS",
    hrsLabel: "average time for standard clean",
    body: "From deep cleaning to regular maintenance, we keep your home spotless and healthy.",
    cta: "Explore home plan",
    img: serviceImg1,
  },
  {
    num: "02",
    title: "GARDENING & OUTDOOR",
    desc: "Complete Greenery Management.",
    hrs: "3 HRS",
    hrsLabel: "average time for office clean",
    body: "Expert lawn mowing, hedge trimming, and seasonal maintenance for a perfect garden.",
    cta: "Explore workspace plan",
    img: serviceImg2,
  },
  {
    num: "03",
    title: "TECHNICAL REPAIRS",
    desc: "Expert Solutions.",
    hrs: "4 HRS",
    hrsLabel: "average time for store clean",
    body: "Fast and reliable interventions for plumbing leaks, electrical faults, and IT troubleshooting.",
    cta: "Explore store plan",
    img: serviceImg3,
  },
];

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" style={{ marginLeft: 6, flexShrink: 0 }}>
    <circle cx="12" cy="12" r="10" fill="#1a1a2e" />
    <polyline points="12 6 12 12 16 14" stroke="white" strokeWidth="1.8" strokeLinecap="round" fill="none" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a1a2e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

const ArrowIconLight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

const OurServices: React.FC = () => {
  const [hovered, setHovered] = useState<number | null>(null);
  const [btnHovered, setBtnHovered] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headlineBlockRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const btnRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const els: { el: HTMLElement | null; dy: number; delay: number }[] = [
      { el: labelRef.current,        dy: 20, delay: 0 },
      { el: headlineBlockRef.current, dy: 36, delay: 0.1 },
      ...rowRefs.current.map((el, i) => ({ el, dy: 32, delay: i * 0.12 })),
      { el: btnRef.current,           dy: 24, delay: 0.1 },
    ];

    els.forEach(({ el, dy, delay }) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = `translateY(${dy}px)`;
      el.style.transition = `opacity 0.75s ${delay}s cubic-bezier(0.22,1,0.36,1), transform 0.75s ${delay}s cubic-bezier(0.22,1,0.36,1)`;
    });

    let headerRevealed = false;
    let rowsRevealed = false;
    let btnRevealed = false;

    const reveal = (el: HTMLElement | null) => {
      if (!el) return;
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    };

    const onScroll = () => {
      rafRef.current = requestAnimationFrame(() => {
        const section = sectionRef.current;
        if (!section) return;
        const rect = section.getBoundingClientRect();
        const vh = window.innerHeight;

        if (!headerRevealed && rect.top < vh * 0.85) {
          headerRevealed = true;
          reveal(labelRef.current);
          reveal(headlineBlockRef.current);
        }

        if (!rowsRevealed && rect.top < vh * 0.55) {
          rowsRevealed = true;
          rowRefs.current.forEach((el) => reveal(el));
        }

        if (!btnRevealed && rect.top + section.offsetHeight * 0.85 < vh) {
          btnRevealed = true;
          reveal(btnRef.current);
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        .os-section {
          background: #f5f5f0;
          padding: 64px 60px 80px;
          font-family: ${fontFamily};
          box-sizing: border-box;
        }

        .os-label {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 40px;
        }

        .os-headline {
          font-size: clamp(28px, 5vw, 68px);
          font-weight: 300;
          color: #1a1a2e;
          line-height: 1.05;
          letter-spacing: -0.02em;
          margin-bottom: 20px;
          font-family: 'DM Serif Display', serif;
        }

        /* Service rows */
        .os-row {
          border-top: 1px solid #d8d8d0;
          cursor: pointer;
          transition: background 0.4s ease, border-radius 0.35s ease;
          will-change: transform, opacity;
        }
        .os-row:last-of-type { border-bottom: 1px solid #d8d8d0; }
        .os-row.active {
          background: #eaeae4;
          border-radius: 16px;
          overflow: hidden;
        }

        .os-row-header {
          display: grid;
          grid-template-columns: 80px 1fr 40px;
          align-items: center;
          padding: 36px 16px 36px;
          transition: padding-bottom 0.4s ease;
        }
        .os-row.active .os-row-header {
          padding-bottom: 12px;
        }

        .os-row-num {
          font-size: 14px;
          color: #9a9aaa;
          letter-spacing: 0.04em;
          transition: color 0.3s;
        }
        .os-row:hover .os-row-num { color: #6a6a7a; }

        .os-row-title {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #1a1a2e;
          margin-bottom: 4px;
          transition: letter-spacing 0.3s ease;
        }
        .os-row:hover .os-row-title { letter-spacing: 0.13em; }

        .os-row-arrow {
          display: flex;
          justify-content: flex-end;
          transition: transform 0.35s ease, opacity 0.25s ease;
        }
        .os-row.active .os-row-arrow {
          transform: translate(3px, -3px);
          opacity: 0;
        }

        /* Expanded body — desktop */
        .os-row-body {
          display: grid;
          grid-template-columns: 80px auto 1fr auto;
          gap: 0 40px;
          align-items: center;
          overflow: hidden;
          max-height: 0;
          opacity: 0;
          padding: 0 16px 0;
          transition:
            max-height 0.55s cubic-bezier(0.4,0,0.2,1),
            opacity 0.4s ease,
            padding 0.4s ease;
        }
        .os-row.active .os-row-body {
          max-height: 320px;
          opacity: 1;
          padding: 0 16px 40px;
        }

        .os-img {
          width: 260px;
          height: 150px;
          object-fit: cover;
          border-radius: 12px;
          display: block;
          margin-left: -40px;
          transition: transform 0.6s cubic-bezier(0.22,1,0.36,1);
          flex-shrink: 0;
        }
        .os-row.active .os-img {
          transform: scale(1.02);
        }

        .os-stat-num {
          font-size: 44px;
          font-weight: 300;
          color: #1a1a2e;
          line-height: 1;
          letter-spacing: -0.02em;
        }

        .os-cta-pill {
          padding: 16px 28px;
          background: #1a1a2e;
          color: #c9a84c;
          border: none;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 500;
          font-family: ${fontFamily};
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.2s, transform 0.2s;
        }
        .os-cta-pill:hover {
          background: #2e2e50;
          transform: scale(1.03);
        }

        /* Bottom CTA */
        .os-bottom-btn {
          display: inline-flex;
          align-items: center;
          gap: 0;
          padding: 10px 10px 10px 28px;
          background: #c9a84c;
          border: none;
          border-radius: 100px;
          cursor: pointer;
          font-family: ${fontFamily};
          font-size: 15px;
          font-weight: 500;
          color: #1a1a2e;
          letter-spacing: -0.01em;
          transition: box-shadow 0.3s ease, background 0.2s ease;
        }
        .os-bottom-btn:hover {
          background: #e0bc66;
          box-shadow: 0 0 0 6px rgba(201,168,0,0.18), 0 8px 32px rgba(201,168,0,0.22);
        }
        .os-bottom-arrow {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #1a1a2e;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.3s ease;
        }
        .os-bottom-btn:hover .os-bottom-arrow {
          transform: rotate(45deg);
        }

        /* ── Responsive: tablet (≤ 900px) ── */
        @media (max-width: 900px) {
          .os-section {
            padding: 48px 32px 64px;
          }
          .os-headline-grid {
            grid-template-columns: 1fr !important;
            gap: 0 !important;
            margin-bottom: 48px !important;
          }
          .os-headline-left-spacer {
            display: none !important;
          }
          .os-row-body {
            grid-template-columns: 56px auto 1fr;
            gap: 0 24px;
          }
          .os-row.active .os-row-body {
            max-height: 400px;
          }
          .os-cta-col {
            display: none;
          }
          .os-img {
            width: 180px;
            height: 120px;
            margin-left: -24px;
          }
        }

        /* ── Responsive: mobile (≤ 600px) ── */
        @media (max-width: 600px) {
          .os-section {
            padding: 36px 20px 52px;
          }
          .os-row-header {
            grid-template-columns: 48px 1fr 32px;
            padding: 24px 8px;
          }
          .os-row.active .os-row-header {
            padding-bottom: 8px;
          }

          /* Stack body vertically on mobile */
          .os-row-body {
            display: flex;
            flex-direction: column;
            gap: 16px;
            max-height: 0;
          }
          .os-row.active .os-row-body {
            max-height: 520px;
            padding: 0 8px 28px;
          }
          .os-num-spacer { display: none; }
          .os-img {
            width: 100%;
            height: 180px;
            margin-left: 0;
            border-radius: 10px;
          }
          .os-stat-num {
            font-size: 32px;
          }
          .os-cta-col {
            display: block;
          }
          .os-cta-pill {
            padding: 12px 22px;
            font-size: 13px;
          }
        }
      `}</style>

      <section className="os-section" ref={sectionRef}>
        {/* Label */}
        <div className="os-label" ref={labelRef}>
          <div style={{ width: 32, height: 2, background: "#c9a84c" }} />
          <span style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.12em", color: "#1a1a2e", textTransform: "uppercase" as const }}>
            Our Services
          </span>
        </div>

        <div
          ref={headlineBlockRef}
          className="os-headline-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 40, marginBottom: 72 }}
        >
          <div className="os-headline-left-spacer" />
          <div>
            <h2 className="os-headline">
              Discover our services<br />and how we do it better.
            </h2>
            <p style={{ fontSize: 15, color: "#4a4a5a", lineHeight: 1.65, maxWidth: 760, margin: 0 }}>
              We focus on essential home needs with a commitment to quality, reliability, and professional execution.
            </p>
          </div>
        </div>

  
        {services.map((s, i) => (
          <div
            key={s.num}
            className={`os-row${hovered === i ? " active" : ""}`}
            ref={(el) => { rowRefs.current[i] = el; }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
    
            <div className="os-row-header">
              <span className="os-row-num">{s.num}</span>
              <div>
                <div className="os-row-title">{s.title}</div>
                <div style={{ fontSize: 13, color: "#6a6a7a" }}>{s.desc}</div>
              </div>
              <div className="os-row-arrow">
                <ArrowIcon />
              </div>
            </div>

            {/* Expanded body */}
            <div className="os-row-body">
              <div className="os-num-spacer" />
              <img src={s.img} alt={s.title} className="os-img" />
              <div style={{ paddingLeft: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <span className="os-stat-num">{s.hrs}</span>
                  <ClockIcon />
                  <span style={{ fontSize: 12, color: "#7a7a8a", maxWidth: 90, lineHeight: 1.4 }}>
                    {s.hrsLabel}
                  </span>
                </div>
                <p style={{ fontSize: 14, color: "#5a5a6a", lineHeight: 1.65, maxWidth: 320, margin: 0 }}>
                  {s.body}
                </p>
              </div>
              <div className="os-cta-col" style={{ flexShrink: 0 }}>
                <button className="os-cta-pill">{s.cta}</button>
              </div>
            </div>
          </div>
        ))}


        <div ref={btnRef} style={{ marginTop: 56, display: "flex", alignItems: "center" }}>
          <button
            className="os-bottom-btn"
            onMouseEnter={() => setBtnHovered(true)}
            onMouseLeave={() => setBtnHovered(false)}
          >
            <span style={{ marginRight: 20 }}>See all services</span>
            <span className="os-bottom-arrow">
              <ArrowIconLight />
            </span>
          </button>
        </div>
      </section>
    </>
  );
};

export default OurServices;