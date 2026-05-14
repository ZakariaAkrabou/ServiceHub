import img1 from "../../../../assets/team_1_1.png";
import img2 from "../../../../assets/team_1_4.png";

const AboutTeam = () => {
  const members = [
    { name: "Zakaria", role: "Product Manager", image: img1 },
    { name: "Fatima zahra", role: "Project Manager", image: img2 },
  ];

  return (
    <section className="about-team-root">
      <style>{`
        .about-team-root {
          --gold:     #C9A84C;
          --gold-lt:  #E2C97E;
          --navy:     #1B2F5E;
          --navy-dk:  #111E3C;
          --off-white:#F8F6F1;
          --font-body: 'Times New Roman', sans-serif, Geist, 'Geist Placeholder', Inter, 'Inter Placeholder', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';

          padding: 100px 48px 130px;
          background: var(--off-white);
          font-family: var(--font-body);
          position: relative;
          overflow: hidden;
        }

        .about-team-root::after {
          content: '';
          position: absolute;
          top: -80px;
          left: 50%;
          transform: translateX(-50%);
          width: 800px;
          height: 500px;
          background: radial-gradient(ellipse, rgba(201,168,76,0.10) 0%, transparent 70%);
          pointer-events: none;
        }

        .about-team-inner {
          position: relative;
          z-index: 1;
          max-width: 100%;
          margin: 0;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .about-team-header {
          text-align: left;
          margin-bottom: 56px;
          max-width: 620px;
          align-self: flex-start;
          margin-left: 24px;
        }

        /* ── Line & Eyebrow ── */
        .about-team-eyebrow-container {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 24px;
        }

        .about-team-eyebrow-line {
          width: 32px;
          height: 2px;
          background: var(--gold);
        }

        .about-team-eyebrow {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          color: #1a1a2e;
          text-transform: uppercase;
          margin: 0;
          font-family: inherit;
        }

        .about-team-eyebrow-dot {
          display: none;
        }

        /* ── Title ── */
        .about-team-title {
          text-align: left;
          margin: 0 0 16px;
          font-family: var(--font-body);
          font-size: clamp(28px, 4vw, 40px);
          font-weight: 800;
          font-style: normal;
          letter-spacing: -0.01em;
          line-height: 1.2;
          color: #0F1B35;
        }

        .about-team-title em {
          font-style: normal;
          color: var(--gold);
        }

        /* ── Gold rule ── */
        .about-team-rule {
          display: none;
        }

        /* ── Copy ── */
        .about-team-copy {
          text-align: left;
          max-width: 580px;
          margin: 0 0 40px;
          color: #6B7A99;
          font-size: 16px;
          line-height: 1.7;
        }

        /* ── Grid ── */
        .about-team-grid {
          display: flex;
          justify-content: center;
          gap: 32px;
          flex-wrap: wrap;
          width: 100%;
        }

        /* ── Card ── */
        .about-team-card {
          position: relative;
          width: 260px;
          height: 340px;
          border-radius: 20px;
          overflow: hidden;
          cursor: pointer;
          flex-shrink: 0;
          box-shadow: 0 8px 32px rgba(17,30,60,0.13);
        }

        /* Base image — fills entire card */
        .about-team-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }

        .about-team-card:hover .about-team-image {
          transform: scale(1.06);
        }

        /* Subtle dark vignette at top (always visible) */
        .about-team-vignette {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(17,30,60,0.08) 0%,
            transparent 40%
          );
          pointer-events: none;
        }

        /* ── Hover panel — slides up from bottom ── */
        .about-team-panel {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          background: rgba(255, 255, 255, 0.97);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-top: 2px solid rgba(201,168,76,0.35);
          border-radius: 0 0 20px 20px;
          padding: 20px 22px 22px;
          transform: translateY(100%);
          transition: transform 0.38s cubic-bezier(0.34, 1.3, 0.64, 1);
        }

        .about-team-card:hover .about-team-panel {
          transform: translateY(0);
        }

        .about-team-name {
          margin: 0 0 4px;
          font-family: var(--font-body);
          font-size: 20px;
          font-weight: 700;
          font-style: normal;
          color: var(--navy-dk);
          text-align: center;
        }

        .about-team-role {
          margin: 0 0 14px;
          font-size: 13px;
          font-weight: 500;
          color: var(--gold);
          text-align: center;
          letter-spacing: 0.04em;
        }

        /* Divider */
        .about-team-divider {
          height: 1px;
          background: rgba(27,47,94,0.10);
          margin: 0 0 14px;
        }

        /* Social icons */
        .about-team-socials {
          display: flex;
          justify-content: center;
          gap: 10px;
        }

        .about-team-social-btn {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: rgba(27,47,94,0.07);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease, transform 0.2s ease;
          color: var(--navy);
          text-decoration: none;
        }

        .about-team-social-btn:hover {
          background: var(--gold);
          color: #fff;
          transform: translateY(-2px);
        }

        .about-team-social-btn svg {
          width: 15px; height: 15px;
          fill: currentColor;
        }

        @media (max-width: 640px) {
          .about-team-root { padding: 70px 20px 90px; }
          .about-team-card { width: 100%; max-width: 320px; }
        }
      `}</style>

      <div className="about-team-inner">
        <div className="about-team-header">
          <div className="about-team-eyebrow-container">
            <div className="about-team-eyebrow-line" />
            <span className="about-team-eyebrow">Our team</span>
          </div>

          <h2 className="about-team-title">
            The faces behind <em>ServiceHub</em>
          </h2>

          <p className="about-team-copy">
            Our team combines product expertise, customer service, and technology
            to create a smooth and reassuring service experience.
          </p>
        </div>

        <div className="about-team-grid">
          {members.map((member) => (
            <article key={member.name} className="about-team-card">
              {/* Base: just the image */}
              <img
                src={member.image}
                alt={member.name}
                className="about-team-image"
              />
              <div className="about-team-vignette" />

              {/* Hover panel slides up */}
              <div className="about-team-panel">
                <h3 className="about-team-name">{member.name}</h3>
                <p className="about-team-role">{member.role}</p>
                <div className="about-team-divider" />
                <div className="about-team-socials">
                  {/* Facebook */}
                  <a href="#" className="about-team-social-btn" aria-label="Facebook">
                    <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
                  </a>
                  {/* Twitter / X */}
                  <a href="#" className="about-team-social-btn" aria-label="Twitter">
                    <svg viewBox="0 0 24 24"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                  </a>
                  {/* Instagram */}
                  <a href="#" className="about-team-social-btn" aria-label="Instagram">
                    <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="var(--off-white)"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="var(--off-white)" strokeWidth="2" strokeLinecap="round"/></svg>
                  </a>
                  {/* LinkedIn */}
                  <a href="#" className="about-team-social-btn" aria-label="LinkedIn">
                    <svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutTeam;