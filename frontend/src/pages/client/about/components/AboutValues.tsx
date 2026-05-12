import React from "react";

const AboutValues: React.FC = () => {
  const cards = [
    {
      title: "Confiance",
      description: "Tous les prestataires sont sélectionnés pour leur professionnalisme et leur sérieux.",
    },
    {
      title: "Proximité",
      description: "Nous mettons en relation les clients avec des services locaux et réactifs.",
    },
    {
      title: "Transparence",
      description: "Des informations claires sur les tarifs, les avis et les disponibilités.",
    },
    {
      title: "Support",
      description: "Un accompagnement disponible pour chaque étape de votre service.",
    },
  ];

  return (
    <section className="about-values-root">
      <style>{`
        .about-values-root {
          padding: 80px 48px;
          background: #08101d;
          color: #ffffff;
        }

        .about-values-inner {
          max-width: 1120px;
          margin: 0 auto;
        }

        .about-values-top {
          text-align: center;
          margin-bottom: 48px;
        }

        .about-values-title {
          margin: 0 0 16px;
          font-size: clamp(32px, 4vw, 48px);
          letter-spacing: -0.04em;
        }

        .about-values-copy {
          margin: 0;
          color: rgba(255, 255, 255, 0.72);
          line-height: 1.8;
          max-width: 760px;
          margin-left: auto;
          margin-right: auto;
        }

        .about-values-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 24px;
        }

        .about-value-card {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 22px;
          padding: 28px;
          min-height: 180px;
        }

        .about-value-title {
          margin: 0 0 12px;
          font-size: 20px;
          color: #f6e304;
        }

        .about-value-text {
          margin: 0;
          color: rgba(255, 255, 255, 0.78);
          line-height: 1.7;
          font-size: 15px;
        }

        @media (max-width: 900px) {
          .about-values-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 640px) {
          .about-values-root {
            padding: 60px 20px;
          }
          .about-values-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="about-values-inner">
        <div className="about-values-top">
          <h2 className="about-values-title">Nos valeurs fondamentales</h2>
          <p className="about-values-copy">
            Ces principes guident chaque décision de ServiceHub et garantissent une expérience client 
            cohérente, sûre et accessible.
          </p>
        </div>

        <div className="about-values-grid">
          {cards.map((card) => (
            <article key={card.title} className="about-value-card">
              <h3 className="about-value-title">{card.title}</h3>
              <p className="about-value-text">{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutValues;
