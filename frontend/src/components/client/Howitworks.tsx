import { useState } from "react";

const fontFamily =
  "'Times New Roman', sans-serif, Geist, 'Geist Placeholder', Inter, 'Inter Placeholder', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'";

const steps = [
  {
    number: "01",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="28" width="32" height="4" rx="2" stroke="#f0d000" strokeWidth="2" fill="none"/>
        <rect x="20" y="10" width="8" height="18" rx="1" stroke="#f0d000" strokeWidth="2" fill="none"/>
        <line x1="24" y1="10" x2="24" y2="6" stroke="#f0d000" strokeWidth="2" strokeLinecap="round"/>
        <line x1="14" y1="16" x2="10" y2="12" stroke="#f0d000" strokeWidth="2" strokeLinecap="round"/>
        <line x1="34" y1="16" x2="38" y2="12" stroke="#f0d000" strokeWidth="2" strokeLinecap="round"/>
        <rect x="16" y="32" width="4" height="8" rx="1" stroke="#f0d000" strokeWidth="2" fill="none"/>
        <rect x="28" y="32" width="4" height="8" rx="1" stroke="#f0d000" strokeWidth="2" fill="none"/>
      </svg>
    ),
    title: "Choose Service",
    description: "Select the specific cleaning, gardening, or repair service you need from our expert list.",
  },
  {
    number: "02",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="12" width="32" height="28" rx="3" stroke="#f0d000" strokeWidth="2" fill="none"/>
        <line x1="8" y1="20" x2="40" y2="20" stroke="#f0d000" strokeWidth="2"/>
        <line x1="16" y1="8" x2="16" y2="16" stroke="#f0d000" strokeWidth="2" strokeLinecap="round"/>
        <line x1="32" y1="8" x2="32" y2="16" stroke="#f0d000" strokeWidth="2" strokeLinecap="round"/>
        <rect x="14" y="26" width="5" height="5" rx="1" stroke="#f0d000" strokeWidth="1.5" fill="none"/>
        <rect x="22" y="26" width="5" height="5" rx="1" stroke="#f0d000" strokeWidth="1.5" fill="none"/>
        <rect x="30" y="26" width="5" height="5" rx="1" stroke="#f0d000" strokeWidth="1.5" fill="none"/>
      </svg>
    ),
    title: "Book Instantly",
    description: "Pick a time that works for you. Our verified pro arrives fully equipped to handle the task.",
  },
  {
    number: "03",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="14" stroke="#f0d000" strokeWidth="2" fill="none"/>
        <path d="M18 24l4 4 8-8" stroke="#f0d000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M24 10 L26 6 L24 4 L22 6 Z" stroke="#f0d000" strokeWidth="1.5" fill="none"/>
        <path d="M38 24 L42 22 L44 24 L42 26 Z" stroke="#f0d000" strokeWidth="1.5" fill="none"/>
        <path d="M24 38 L26 42 L24 44 L22 42 Z" stroke="#f0d000" strokeWidth="1.5" fill="none"/>
        <path d="M10 24 L6 22 L4 24 L6 26 Z" stroke="#f0d000" strokeWidth="1.5" fill="none"/>
      </svg>
    ),
    title: "Get It Done",
    description: "Pick a time that works for you. Our verified pro arrives fully equipped to handle the task.",
  },
  {
    number: "04",
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <polygon points="24,8 28,18 40,18 30,26 34,38 24,30 14,38 18,26 8,18 20,18" stroke="#f0d000" strokeWidth="2" fill="none" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Rate & Review",
    description: "Share your experience. Your feedback helps maintain our high standards of local service.",
  },
];

const ArrowIconLight = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#c9a84c"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);
export default function HowItWorks() {
  const [hovered, setHovered] = useState<number | null>(null);
  const [btnHovered, setBtnHovered] = useState(false);

  return (
    <section
      style={{
        backgroundColor: "#ffffff",
        padding: "80px 24px",
        fontFamily,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "left",
          marginBottom: "56px",
          maxWidth: "620px",
          alignSelf: "flex-start",
          marginLeft: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <div style={{ width: 32, height: 2, background: "#c9a84c" }} />
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.12em",
              color: "#1a1a2e",
              textTransform: "uppercase",
              fontFamily,
            }}
          >
            How it works
          </span>
        </div>
        <h2
          style={{
            fontSize: "clamp(28px, 4vw, 40px)",
            fontWeight: 800,
            color: "#0F1B35",
            margin: "0 0 16px",
            lineHeight: 1.2,
            fontFamily,
          }}
        >
          Simple Steps to Get Your Job Done
        </h2>
        <p
          style={{
            fontSize: "16px",
            color: "#6B7A99",
            lineHeight: 1.7,
            margin: 0,
            fontFamily,
          }}
        >
          Getting professional home services with Henbo is quick and easy. Just follow
          a few simple steps and let our experts handle the rest.
        </p>
      </div>


      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
          width: "100%",
          maxWidth: "1400px",
          alignItems: "stretch",
        }}
      >
        {steps.map((step, index) => {
          const isCenter = index === 1;
          const isHovered = hovered === index;

          return (
            <div
              key={step.number}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              style={{
                position: "relative",
                borderRadius: "16px",
                overflow: "hidden",
                cursor: "default",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                transform: isHovered ? "translateY(-6px)" : "translateY(0)",
                boxShadow: isHovered
                  ? "0 20px 48px rgba(42,122,228,0.15)"
                  : "0 2px 16px rgba(0,0,0,0.06)",
                ...(isCenter
                  ? {
                      background: "none",
                      border: "none",
                      minHeight: "380px",
                    }
                  : {
                      backgroundColor: "#FFFFFF",
                      border: "1px solid #E8ECF4",
                      padding: "36px 32px 40px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      minHeight: "320px",
                    }),
              }}
            >
              {isCenter ? (
                <div style={{ width: "100%", height: "100%", minHeight: "380px" }}>
                  <img
                    src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&q=80"
                    alt="Professional technician"
                    style={{
                      width: "100%",
                      height: "100%",
                      minHeight: "380px",
                      objectFit: "cover",
                      borderRadius: "16px",
                      display: "block",
                    }}
                  />
                </div>
              ) : (
                <>
                  <div
                    style={{
                      position: "absolute",
                      top: "16px",
                      right: "20px",
                      fontSize: "36px",
                      fontWeight: 800,
                      color: "rgba(42,122,228,0.08)",
                      lineHeight: 1,
                      userSelect: "none",
                      fontFamily,
                    }}
                  >
                    {step.number}
                  </div>
                  <div style={{ marginBottom: "auto" }}>{step.icon}</div>
                  <div style={{ marginTop: "32px" }}>
                    <h3
                      style={{
                        fontSize: "22px",
                        fontWeight: 700,
                        color: "#0F1B35",
                        margin: "0 0 12px",
                        fontFamily,
                      }}
                    >
                      {step.title}
                    </h3>
                    <p
                      style={{
                        fontSize: "15px",
                        color: "#6B7A99",
                        lineHeight: 1.65,
                        margin: 0,
                        fontFamily,
                      }}
                    >
                      {step.description}
                    </p>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div style={{ textAlign: "center", marginTop: "64px" }}>
        <p
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#0F1B35",
            margin: "0 0 24px",
            fontFamily,
          }}
        >
          Ready to get started? Book your service now.
        </p>

        <button
          onMouseEnter={() => setBtnHovered(true)}
          onMouseLeave={() => setBtnHovered(false)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0,
            padding: "10px 10px 10px 28px",
            background: "#c9a84c",
            border: "none",
            borderRadius: 100,
            cursor: "pointer",
            fontFamily,
            fontSize: 15,
            fontWeight: 500,
            color: "#1a1a2e",
            letterSpacing: "-0.01em",
            boxShadow: btnHovered
              ? "0 0 0 6px rgba(201,168,0,0.18), 0 8px 32px rgba(201,168,0,0.22)"
              : "0 0 0 0px rgba(201,168,0,0), 0 4px 16px rgba(201,168,0,0.12)",
            transition: "box-shadow 0.3s ease, background 0.2s ease, transform 0.2s ease",
          }}
        >
          <span style={{ marginRight: 20 }}>Get a Free Quote</span>
          <span
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "#1a1a2e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "transform 0.3s ease",
              transform: btnHovered ? "rotate(45deg)" : "rotate(0deg)",
            }}
          >
            <ArrowIconLight />
          </span>
        </button>
      </div>
    </section>
  );
}