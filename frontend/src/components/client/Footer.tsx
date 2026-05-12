import { useState, useRef, useEffect } from "react";

const fontFamily =
  "'DM Sans', 'Times New Roman', sans-serif, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial";

const navLinks = ["About", "Services", "Pricing", "404"];

export default function Footer() {
  const [email, setEmail] = useState("");


  const footerRef = useRef<HTMLElement>(null);
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);
  const col3Ref = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {

    const cols = [col1Ref.current, col2Ref.current, col3Ref.current];
    cols.forEach((col, i) => {
      if (!col) return;
      col.style.opacity = "0";
      col.style.transform = `translateY(40px)`;
      col.style.transition = `opacity 0.7s ${i * 0.12}s ease, transform 0.7s ${i * 0.12}s ease`;
    });
    if (brandRef.current) {
      brandRef.current.style.opacity = "0";
      brandRef.current.style.transform = "translateY(60px)";
      brandRef.current.style.transition = "opacity 0.9s 0.15s ease, transform 0.9s 0.15s ease";
    }
    if (dotRef.current) {
      dotRef.current.style.opacity = "0";
      dotRef.current.style.transform = "scale(0.3)";
      dotRef.current.style.transition = "opacity 0.5s 0.4s ease, transform 0.6s 0.4s cubic-bezier(0.34,1.56,0.64,1)";
    }

    let revealed = false;

    const onScroll = () => {
      rafRef.current = requestAnimationFrame(() => {
        const footer = footerRef.current;
        if (!footer) return;

        const rect = footer.getBoundingClientRect();
        const viewportH = window.innerHeight;

      
        const triggerPoint = viewportH * 0.85;

        if (!revealed && rect.top < triggerPoint) {
          revealed = true;

        
          cols.forEach((col) => {
            if (!col) return;
            col.style.opacity = "1";
            col.style.transform = "translateY(0)";
          });

          if (brandRef.current) {
            brandRef.current.style.opacity = "1";
            brandRef.current.style.transform = "translateY(0)";
          }

        
          if (dotRef.current) {
            dotRef.current.style.opacity = "1";
            dotRef.current.style.transform = "scale(1)";
          }
        }

        if (revealed && brandRef.current) {
          const footerH = footer.offsetHeight;
          const scrolledIn = viewportH - rect.top;
          const progress = Math.max(0, Math.min(1, scrolledIn / footerH));
        
          const y = -progress * 20;
          brandRef.current.style.transform = `translateY(${y}px)`;
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
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;900&display=swap');

        .footer-root {
          background-color: #0a1628;
          font-family: ${fontFamily};
          padding: 72px 48px 0;
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
        }

        .footer-nav-link {
          color: #ffffff;
          text-decoration: none;
          font-size: 16px;
          font-weight: 500;
          opacity: 0.85;
          display: block;
          transition: opacity 0.2s, transform 0.2s;
        }
        .footer-nav-link:hover {
          opacity: 1;
          transform: translateX(4px);
        }

        .footer-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: rgba(255,255,255,0.5);
          font-size: 15px;
          font-family: ${fontFamily};
          min-width: 0;
        }
        .footer-input::placeholder { color: rgba(255,255,255,0.35); }

        .footer-submit-btn {
          background: transparent;
          border: none;
          color: #c9a84c;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          letter-spacing: -1px;
          padding: 0 4px;
          transition: transform 0.2s;
          flex-shrink: 0;
        }
        .footer-submit-btn:hover { transform: translateX(3px); }

        .footer-social-link {
          color: rgba(255,255,255,0.7);
          transition: color 0.2s, transform 0.2s;
          display: inline-flex;
        }
        .footer-social-link:hover {
          color: #c9a84c;
          transform: translateY(-2px);
        }

        /* Brand text clip reveal */
        .footer-brand-wrap {
          position: relative;
          overflow: hidden;
        }

        .footer-brand-text {
          font-size: clamp(60px, 14vw, 200px);
          font-weight: 900;
          margin: 0;
          line-height: 0.85;
          background: linear-gradient(to bottom, #c9a84c 30%, rgba(240,208,0,0.15) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -4px;
          user-select: none;
          font-family: 'DM Serif Display', serif;
          will-change: transform;
        }

        .footer-yellow-dot {
          position: absolute;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: #c9a84c;
          top: 10px;
          left: 85%;
          z-index: 2;
          will-change: transform, opacity;
        }

        /* Divider line that animates in */
        .footer-divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.08);
          margin: 0 0 64px;
        }

        /* ── Grid layout ── */
        .footer-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 32px;
          max-width: 1400px;
          margin: 0 auto;
          padding-bottom: 64px;
        }

        /* ── Tablet (≤ 860px): stack into 2 columns, col3 full width ── */
        @media (max-width: 860px) {
          .footer-root {
            padding: 56px 32px 0;
          }
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 40px 24px;
          }
          .footer-col3 {
            grid-column: 1 / -1;
            text-align: left !important;
          }
          .footer-col3 .footer-social-row {
            justify-content: flex-start !important;
          }
          .footer-yellow-dot {
            width: 48px;
            height: 48px;
          }
        }

        /* ── Mobile (≤ 560px): single column ── */
        @media (max-width: 560px) {
          .footer-root {
            padding: 44px 20px 0;
          }
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 40px;
            padding-bottom: 48px;
          }
          .footer-col2 {
            text-align: left !important;
          }
          .footer-col2 .footer-email-bar {
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
          .footer-col3 {
            grid-column: unset;
          }
          .footer-yellow-dot {
            width: 36px;
            height: 36px;
            top: 6px;
          }
        }
      `}</style>

      <footer className="footer-root" ref={footerRef}>
        <div className="footer-grid">
          
          <div
            ref={col1Ref}
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            {navLinks.map((link) => (
              <a key={link} href="#" className="footer-nav-link">
                {link}
              </a>
            ))}
          </div>

         
          <div ref={col2Ref} className="footer-col2" style={{ textAlign: "center" }}>
            <p
              style={{
                color: "#ffffff",
                fontSize: "16px",
                lineHeight: 1.6,
                margin: "0 0 32px",
                opacity: 0.85,
              }}
            >
              Subscribe to our newsletter<br />
              to get seasonal cleaning tips,<br />
              exclusive offers &amp; more
            </p>
            <div
              className="footer-email-bar"
              style={{
                position: "relative",
                borderBottom: "1px solid rgba(255,255,255,0.3)",
                display: "flex",
                alignItems: "center",
                paddingBottom: "8px",
                maxWidth: "360px",
                margin: "0 auto",
              }}
            >
              <input
                type="email"
                placeholder="your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="footer-input"
              />
              <button className="footer-submit-btn">»</button>
            </div>
            <p
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: "12px",
                marginTop: "40px",
              }}
            >
              Made by{" "}
              <span style={{ color: "#c9a84c" }}>SERVICE HUB</span>
            </p>
          </div>

      
          <div ref={col3Ref} className="footer-col3" style={{ textAlign: "right" }}>
            <p
              style={{
                color: "#ffffff",
                fontSize: "16px",
                fontWeight: 500,
                marginBottom: "16px",
                opacity: 0.85,
              }}
            >
              Follow us
            </p>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", margin: "0 0 6px" }}>
              servicehub@gmail.com
            </p>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", margin: "0 0 24px" }}>
              +91 98765 43210
            </p>
            <div className="footer-social-row" style={{ display: "flex", gap: "20px", justifyContent: "flex-end" }}>
             
              <a href="#" className="footer-social-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
       
              <a href="#" className="footer-social-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
      
              <a href="#" className="footer-social-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

       
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            position: "relative",
          }}
        >
          <div
            ref={dotRef}
            className="footer-yellow-dot"
          />
          <div ref={brandRef} className="footer-brand-wrap">
            <h2 className="footer-brand-text">SERVICE HUB</h2>
          </div>
        </div>
      </footer>
    </>
  );
}