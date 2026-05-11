import React, { useRef, useEffect } from "react";

const fontFamily =
  "'DM Sans', 'Times New Roman', sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial";

const HomeIcon = () => (
  <svg viewBox="0 0 64 64" width="48" height="48" fill="none" stroke="#1a1a2e" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 30 L32 12 L52 30 L52 54 L12 54 Z" />
    <rect x="25" y="40" width="14" height="14" />
    <path d="M40 20 C40 20 45 18 47 22 C49 26 45 30 42 29" strokeWidth="1.3" />
    <path d="M50 10 L51 13 L54 14 L51 15 L50 18 L49 15 L46 14 L49 13 Z" fill="#1a1a2e" strokeWidth="1" />
    <path d="M44 6 L44.6 7.8 L46.4 8.4 L44.6 9 L44 10.8 L43.4 9 L41.6 8.4 L43.4 7.8 Z" fill="#1a1a2e" strokeWidth="0.8" />
  </svg>
);

const WorkspaceIcon = () => (
  <svg viewBox="0 0 64 64" width="48" height="48" fill="none" stroke="#1a1a2e" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <rect x="16" y="18" width="32" height="22" rx="2" />
    <line x1="32" y1="40" x2="32" y2="48" />
    <line x1="24" y1="48" x2="40" y2="48" />
    <path d="M20 56 L28 48" strokeWidth="1.3" />
    <path d="M20 56 C20 56 17 58 16 57 C15 56 17 53 17 53 L22 51" strokeWidth="1.2" fill="none" />
    <path d="M50 12 L51 15 L54 16 L51 17 L50 20 L49 17 L46 16 L49 15 Z" fill="#1a1a2e" strokeWidth="1" />
    <path d="M43 8 L43.5 9.8 L45.3 10.3 L43.5 10.8 L43 12.6 L42.5 10.8 L40.7 10.3 L42.5 9.8 Z" fill="#1a1a2e" strokeWidth="0.8" />
  </svg>
);

const StoreIcon = () => (
  <svg viewBox="0 0 64 64" width="48" height="48" fill="none" stroke="#1a1a2e" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="36" y1="16" x2="26" y2="52" />
    <path d="M20 48 C20 48 22 44 26 44 C30 44 32 48 36 48 L34 54 C34 54 28 56 24 54 Z" strokeWidth="1.3" />
    <line x1="22" y1="48" x2="21" y2="54" strokeWidth="1" />
    <line x1="26" y1="48" x2="26" y2="54" strokeWidth="1" />
    <line x1="30" y1="48" x2="31" y2="54" strokeWidth="1" />
    <path d="M46 12 L47 15 L50 16 L47 17 L46 20 L45 17 L42 16 L45 15 Z" fill="#1a1a2e" strokeWidth="1" />
    <path d="M40 8 L40.6 9.8 L42.4 10.3 L40.6 10.8 L40 12.6 L39.4 10.8 L37.6 10.3 L39.4 9.8 Z" fill="#1a1a2e" strokeWidth="0.8" />
  </svg>
);

const cards = [
  {
    icon: <HomeIcon />,
    title: "HOME",
    desc: "Apartment, condos, and houses – busy people who want their home to feel fresh again.",
  },
  {
    icon: <WorkspaceIcon />,
    title: "WORKSPACE",
    desc: "Maintain a clean, healthy workspace that supports productivity and professionalism.",
  },
  {
    icon: <StoreIcon />,
    title: "STORE",
    desc: "Retail shops, studios, and showrooms – spotless spaces that make a great impression.",
  },
];

const WhoWeHelp: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const card0Ref = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const cardRefs = [card0Ref, card1Ref, card2Ref];
    const allEls: { el: HTMLElement | null; delay: number; dy: number }[] = [
      { el: labelRef.current,    delay: 0,    dy: 20 },
      { el: headlineRef.current, delay: 0.1,  dy: 36 },
      { el: subRef.current,      delay: 0.2,  dy: 24 },
      { el: ctaRef.current,      delay: 0.25, dy: 20 },
      { el: card0Ref.current,    delay: 0.1,  dy: 48 },
      { el: card1Ref.current,    delay: 0.22, dy: 48 },
      { el: card2Ref.current,    delay: 0.34, dy: 48 },
    ];

    allEls.forEach(({ el, delay, dy }) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = `translateY(${dy}px)`;
      el.style.transition = `opacity 0.75s ${delay}s cubic-bezier(0.22,1,0.36,1), transform 0.75s ${delay}s cubic-bezier(0.22,1,0.36,1)`;
    });

    let headerRevealed = false;
    let cardsRevealed = false;

    const onScroll = () => {
      rafRef.current = requestAnimationFrame(() => {
        const section = sectionRef.current;
        if (!section) return;

        const rect = section.getBoundingClientRect();
        const vh = window.innerHeight;

        if (!headerRevealed && rect.top < vh * 0.85) {
          headerRevealed = true;
          [labelRef, headlineRef, subRef, ctaRef].forEach(({ current: el }) => {
            if (!el) return;
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
          });
        }

        const cardsTop = rect.top + section.offsetHeight * 0.55;
        if (!cardsRevealed && cardsTop < vh * 0.9) {
          cardsRevealed = true;
          cardRefs.forEach(({ current: el }) => {
            if (!el) return;
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
          });
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

        .wwh-section {
          background: #ffffff;
          padding: 64px 60px 80px;
          font-family: ${fontFamily};
        }

        /* Label bar */
        .wwh-label {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
        }
        .wwh-label-line {
          width: 32px;
          height: 2px;
          background: #f6e304;
          transition: width 0.6s 0.05s ease;
        }
        .wwh-label-text {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          color: #1a1a2e;
          text-transform: uppercase;
        }

        /* Header row */
        .wwh-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 56px;
          gap: 40px;
          flex-wrap: wrap;
        }

        .wwh-headline {
          font-size: clamp(42px, 5vw, 72px);
          font-weight: 300;
          color: #1a1a2e;
          line-height: 1.05;
          letter-spacing: -0.02em;
          margin-bottom: 20px;
          font-family: 'DM Serif Display', serif;
        }

        .wwh-sub {
          font-size: 15px;
          color: #3a3a4a;
          line-height: 1.6;
          max-width: 380px;
        }

        /* CTA Button */
        .wwh-cta {
          display: flex;
          align-items: center;
          gap: 0;
          background: #f6e304;
          border: none;
          border-radius: 50px;
          padding: 14px 20px 14px 30px;
          cursor: pointer;
          white-space: nowrap;
          flex-shrink: 0;
          transition: background 0.2s, transform 0.2s;
        }
        .wwh-cta:hover {
          background: #ffe600;
          transform: scale(1.02);
        }
        .wwh-cta-label {
          font-size: 14px;
          font-weight: 500;
          color: #1a1a2e;
          margin-right: 14px;
        }
        .wwh-cta-circle {
          width: 40px;
          height: 40px;
          background: #1a1a2e;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1);
        }
        .wwh-cta:hover .wwh-cta-circle {
          transform: rotate(45deg);
        }

        /* Cards grid */
        .wwh-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .wwh-card {
          background: #fff;
           box-shadow: 0 24px 48px rgba(26,26,46,0.12);
          border-radius: 16px;
          padding: 36px 32px 40px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          cursor: pointer;
          transition:
            transform 0.4s cubic-bezier(0.22,1,0.36,1),
            box-shadow 0.4s ease;
          will-change: transform;
        }
        .wwh-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 24px 48px rgba(26,26,46,0.12);
        }

        .wwh-card-icon {
          width: 52px;
          height: 52px;
          transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
        }
        .wwh-card:hover .wwh-card-icon {
          transform: scale(1.12) rotate(-4deg);
        }

        .wwh-card-title {
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #1a1a2e;
          position: relative;
          display: inline-block;
        }
        .wwh-card-title::after {
          content: '';
          position: absolute;
          bottom: -3px;
          left: 0;
          width: 0;
          height: 2px;
          background: #f6e304;
          transition: width 0.3s ease;
        }
        .wwh-card:hover .wwh-card-title::after {
          width: 100%;
        }

        .wwh-card-desc {
          font-size: 14px;
          color: #5a5a6e;
          line-height: 1.65;
          margin: 0;
        }

        /* ── Responsive ───────────────────────────────────────────── */

        /* Tablet: ~768px – 1024px */
        @media (max-width: 1024px) {
          .wwh-section {
            padding: 52px 40px 64px;
          }
          .wwh-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
          }
          .wwh-card {
            padding: 28px 24px 32px;
          }
        }

        /* Tablet portrait / large phone: ≤ 768px */
        @media (max-width: 768px) {
          .wwh-section {
            padding: 48px 28px 56px;
          }

          /* Stack header text + CTA vertically, CTA left-aligned */
          .wwh-header-row {
            flex-direction: column;
            align-items: flex-start;
            margin-bottom: 40px;
            gap: 28px;
          }

          .wwh-sub {
            max-width: 100%;
          }

          /* 2-column card grid */
          .wwh-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }

          /* Last card spans full width so it doesn't sit alone */
          .wwh-card:last-child {
            grid-column: 1 / -1;
          }
        }

        /* Mobile: ≤ 480px */
        @media (max-width: 480px) {
          .wwh-section {
            padding: 40px 20px 48px;
          }

          /* Single-column cards */
          .wwh-grid {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .wwh-card:last-child {
            grid-column: auto;
          }

          .wwh-card {
            padding: 28px 24px 32px;
            gap: 18px;
          }

          /* CTA: let it wrap text naturally and fill width on very small screens */
          .wwh-cta {
            width: 100%;
            justify-content: space-between;
          }
        }
      `}</style>

      <section className="wwh-section" ref={sectionRef}>
        {/* Label */}
        <div className="wwh-label" ref={labelRef}>
          <div className="wwh-label-line" />
          <span className="wwh-label-text">Who We Help</span>
        </div>

        {/* Header row */}
        <div className="wwh-header-row">
          <div style={{ flex: 1, maxWidth: 520 }}>
            <h2 className="wwh-headline" ref={headlineRef}>
              Spaces we<br />specialize in
            </h2>
            <p className="wwh-sub" ref={subRef}>
              We work with busy homeowners, growing businesses, and commercial
              properties who need a space that's consistently clean and well cared for.
            </p>
          </div>

          <button className="wwh-cta" ref={ctaRef}>
            <span className="wwh-cta-label">Know more about us</span>
            <div className="wwh-cta-circle">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </svg>
            </div>
          </button>
        </div>

        {/* Cards */}
        <div className="wwh-grid">
          {cards.map((card, i) => {
            const ref = [card0Ref, card1Ref, card2Ref][i];
            return (
              <div key={card.title} className="wwh-card" ref={ref}>
                <div className="wwh-card-icon">{card.icon}</div>
                <div className="wwh-card-title">{card.title}</div>
                <p className="wwh-card-desc">{card.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default WhoWeHelp;