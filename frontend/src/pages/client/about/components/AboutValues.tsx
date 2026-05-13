import React from "react";
import {
  ShieldCheck,
  Headphones,
  MapPinned,
  BadgeCheck,
} from "lucide-react";

const AboutValues: React.FC = () => {
  const features = [
    {
      icon: <ShieldCheck size={42} strokeWidth={1.5} />,
      title: "Trusted Professionals",
      description:
        "Every provider on ServiceHub is verified to ensure quality, professionalism, and reliability.",
    },
    {
      icon: <Headphones size={42} strokeWidth={1.5} />,
      title: "24/7 Support",
      description:
        "Our team is always available to help customers and providers at every step of the process.",
    },
    {
      icon: <MapPinned size={42} strokeWidth={1.5} />,
      title: "Local Services",
      description:
        "Connect quickly with nearby experts for fast, secure, and convenient local services.",
    },
    {
      icon: <BadgeCheck size={42} strokeWidth={1.5} />,
      title: "Transparent Experience",
      description:
        "Clear pricing, honest reviews, and trusted communication for a smooth experience.",
    },
  ];

  return (
    <section className="features-root">
      <style>{`
        .features-root {
          padding: 75px 20px;
          background: #0a1628;
          overflow: hidden;

          font-family:
            "Times New Roman",
            sans-serif,
            "Geist",
            "Geist Placeholder",
            "Inter",
            "Inter Placeholder",
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            "Helvetica Neue",
            Arial,
            "Noto Sans",
            "Apple Color Emoji",
            "Segoe UI Emoji",
            "Segoe UI Symbol",
            "Noto Color Emoji";
        }

        .features-container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .features-header {
          text-align: center;
          margin-bottom: 55px;
        }

        .features-subtitle {
          color: #c9a84c;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 14px;
          display: inline-block;
        }

        .features-title {
          font-size: clamp(30px, 4vw, 52px);
          line-height: 1.1;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
          letter-spacing: -1px;
        }

        .features-title span {
          color: #c9a84c;
        }

        .features-divider {
          width: 100%;
          height: 1px;
          background: rgba(255, 255, 255, 0.12);
          margin-bottom: 35px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
        }

        .feature-card {
          padding: 28px 24px;
          border-right: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.3s ease;
          position: relative;
        }

        .feature-card:last-child {
          border-right: none;
        }

        .feature-card:hover {
          transform: translateY(-5px);
        }

        .feature-card::before {
          content: "";
          position: absolute;
          left: 0;
          top: 16px;
          width: 2px;
          height: 0%;
          background: #c9a84c;
          transition: height 0.3s ease;
          border-radius: 20px;
        }

        .feature-card:hover::before {
          height: 65%;
        }

        .feature-icon {
          color: #c9a84c;
          margin-bottom: 18px;
        }

        .feature-title {
          font-size: 22px;
          line-height: 1.3;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 12px;
        }

        .feature-description {
          margin: 0;
          color: rgba(255, 255, 255, 0.72);
          line-height: 1.7;
          font-size: 14px;
        }

        .features-bottom-divider {
          width: 100%;
          height: 1px;
          background: rgba(255, 255, 255, 0.12);
          margin-top: 35px;
        }

        @media (max-width: 1024px) {
          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .feature-card:nth-child(2) {
            border-right: none;
          }

          .feature-card:nth-child(1),
          .feature-card:nth-child(2) {
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          }
        }

        @media (max-width: 640px) {
          .features-root {
            padding: 60px 18px;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .feature-card {
            border-right: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            padding: 24px 8px;
          }

          .feature-card:last-child {
            border-bottom: none;
          }

          .features-header {
            margin-bottom: 45px;
          }

          .features-title {
            font-size: 38px;
          }

          .feature-title {
            font-size: 20px;
          }

          .feature-description {
            font-size: 13px;
          }
        }
      `}</style>

      <div className="features-container">
        <div className="features-header">
          <span className="features-subtitle">
            WHY CHOOSE SERVICEHUB
          </span>

          <h2 className="features-title">
            What Makes Us <span>Different</span>
          </h2>
        </div>

        <div className="features-divider"></div>

        <div className="features-grid">
          {features.map((feature) => (
            <div key={feature.title} className="feature-card">
              <div className="feature-icon">
                {feature.icon}
              </div>

              <h3 className="feature-title">
                {feature.title}
              </h3>

              <p className="feature-description">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="features-bottom-divider"></div>
      </div>
    </section>
  );
};

export default AboutValues;