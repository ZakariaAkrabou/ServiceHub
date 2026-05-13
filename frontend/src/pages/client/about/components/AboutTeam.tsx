import React from "react";

const AboutTeam: React.FC = () => {
  const members = [
    { name: "Sarah", role: "Responsable produit" },
    { name: "Omar", role: "Chef de projet" },
    { name: "Leila", role: "Responsable qualité" },
    { name: "Youssef", role: "Support client" },
  ];

  return (
    <section className="about-team-root">
      <style>{`
        .about-team-root {
          padding: 80px 48px 120px;
          background: #ffffff;
          color: #08101d;
        }

        .about-team-inner {
          max-width: 1120px;
          margin: 0 auto;
        }

        .about-team-title {
          text-align: center;
          margin: 0 0 16px;
          font-size: clamp(32px, 4vw, 46px);
          letter-spacing: -0.04em;
        }

        .about-team-copy {
          text-align: center;
          max-width: 720px;
          margin: 0 auto 48px;
          color: rgba(15, 23, 42, 0.7);
          line-height: 1.8;
        }

        .about-team-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 20px;
        }

        .about-team-card {
          background: #08101d;
          color: #ffffff;
          border-radius: 22px;
          padding: 28px;
          border: 1px solid rgba(8, 16, 29, 0.12);
          min-height: 180px;
        }

        .about-team-name {
          margin: 0 0 10px;
          font-size: 20px;
          color: #f6e304;
        }

        .about-team-role {
          margin: 0;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.7;
        }

        @media (max-width: 900px) {
          .about-team-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 640px) {
          .about-team-root {
            padding: 60px 20px 90px;
          }
          .about-team-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="about-team-inner">
        <h2 className="about-team-title">L'équipe derrière ServiceHub</h2>
        <p className="about-team-copy">
          Notre équipe combine expertise produit, service client et technologie pour créer une expérience de service fluide et rassurante.
        </p>

        <div className="about-team-grid">
          {members.map((member) => (
            <article key={member.name} className="about-team-card">
              <h3 className="about-team-name">{member.name}</h3>
              <p className="about-team-role">{member.role}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutTeam;
