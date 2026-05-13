import React from "react";
import missionImage from "../../../../assets/mission.jpg";
import teamImage from "../../../../assets/stock.jpg";

const AboutMission: React.FC = () => {
  return (
    <section className="about-root">
      <style>{`
        .about-root {
          font-family: "Times New Roman", sans-serif, Geist, "Geist Placeholder", Inter, "Inter Placeholder", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
          padding: 80px 64px;
          background: #ffffff;
          color: #1a1a1a;
        }

        .about-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 56px;
          max-width: 1200px;
          margin: 0 auto;
          align-items: start;
        }

        /* ── LEFT COLUMN ── */
        .about-left {}

        .about-label {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
        }

        .about-label-line {
          width: 32px;
          height: 2px;
          background: #c9a84c;
          transition: width 0.6s 0.05s ease;
        }

        .about-label-text {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          color: #1a1a2e;
          text-transform: uppercase;
        }

        .about-main-title {
          font-size: 36px;
          font-weight: 900;
          line-height: 1.12;
          letter-spacing: -0.03em;
          color: #1a1a1a;
          margin: 0 0 10px;
        }

        .about-sub-title {
          font-size: 18px;
          font-weight: 700;
          color: #7a7a5a;
          margin: 0 0 28px;
        }

        .about-img {
          width: 100%;
          height: 280px;
          object-fit: cover;
          border-radius: 14px;
          display: block;
        }

        .about-img-placeholder {
          width: 100%;
          height: 280px;
          border-radius: 14px;
          background: #c8d4dc;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #8a9aaa;
          font-size: 14px;
        }

        /* ── RIGHT COLUMN ── */
        .about-right {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .about-desc {
          font-size: 14px;
          line-height: 1.8;
          color: #555;
          margin: 0;
        }

        .about-img-right {
          width: 100%;
          height: 240px;
          object-fit: cover;
          border-radius: 14px;
          display: block;
        }

        .about-img-right-placeholder {
          width: 100%;
          height: 240px;
          border-radius: 14px;
          background: #9aaa94;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #5a6a54;
          font-size: 14px;
        }

        .about-mv-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .about-mv-title {
          font-size: 20px;
          font-weight: 900;
          color: #1a1a1a;
          margin: 0 0 10px;
          letter-spacing: -0.02em;
        }

        .about-mv-text {
          font-size: 13px;
          line-height: 1.75;
          color: #666;
          margin: 0;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .about-root {
            padding: 48px 24px;
          }
          .about-layout {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .about-mv-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="about-layout">

        {/* LEFT COLUMN */}
        <div className="about-left">
          <div className="about-label">
            <div className="about-label-line" />
            <span className="about-label-text">Overview</span>
          </div>

          <h2 className="about-main-title">
            Simplifying local services<br />
            with reliability<br />
            and transparency.
          </h2>
          <p className="about-sub-title">A user-focused platform.</p>

          <img className="about-img" src={missionImage} alt="Local service mission" />
        </div>

        {/* RIGHT COLUMN */}
        <div className="about-right">
          <p className="about-desc">
            We combine innovation, quality and expertise to bring your local service projects to life.
            Our platform makes it easy to find, select and book trusted providers anytime, anywhere.
          </p>

          <img className="about-img-right" src={teamImage} alt="Service provider team" />

          {/* Mission & Vision */}
          <div className="about-mv-grid">
            <div>
              <h3 className="about-mv-title">Our Mission</h3>
              <p className="about-mv-text">
                Simplify booking local services by providing a reliable, transparent, and user-centered platform with trusted providers.
              </p>
            </div>
            <div>
              <h3 className="about-mv-title">Our Vision</h3>
              <p className="about-mv-text">
                Create an ecosystem where every maintenance, repair, or assistance need is met quickly by qualified experts, emphasizing proximity and trust.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutMission;