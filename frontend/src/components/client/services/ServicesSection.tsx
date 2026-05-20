import React, { useState, useEffect } from 'react';

const mockServices = [
    { id: 1, category: "Home Repair", title: "Plumbing & Leak Repair", rating: 4.8, reviews: 124, price: "From $50/hr", image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80", provider: "John D.", tag: "On demand" },
    { id: 2, category: "Cleaning", title: "Deep House Cleaning", rating: 4.9, reviews: 89, price: "From $120", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80", provider: "Sparkle Co.", tag: "Top rated" },
    { id: 3, category: "Tutoring", title: "Advanced Mathematics", rating: 5.0, reviews: 42, price: "From $40/hr", image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80", provider: "Sarah M.", tag: "Perfect score" },
    { id: 4, category: "Beauty", title: "Bridal Makeup & Hair", rating: 4.7, reviews: 215, price: "From $150", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80", provider: "Glamour Studio", tag: "Trending" },
    { id: 5, category: "Landscaping", title: "Garden Maintenance", rating: 4.6, reviews: 76, price: "From $60/hr", image: "https://images.unsplash.com/photo-1558904541-efa843a96f0f?auto=format&fit=crop&w=800&q=80", provider: "Green Thumbs", tag: "Seasonal" },
    { id: 6, category: "Photography", title: "Portrait & Event Photos", rating: 4.9, reviews: 156, price: "From $200", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80", provider: "Lens Art", tag: "Award winning" },
];

const categories = ["All", "Home Repair", "Cleaning", "Tutoring", "Beauty", "Landscaping", "Photography"];

const categoryIcons: Record<string, string> = {
    "All": "◈",
    "Home Repair": "⌂",
    "Cleaning": "✦",
    "Tutoring": "◉",
    "Beauty": "❋",
    "Landscaping": "✿",
    "Photography": "◎",
};

const ServicesSection: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [selectedService, setSelectedService] = useState<any>(null);
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const filteredServices = activeCategory === "All"
        ? mockServices
        : mockServices.filter(s => s.category === activeCategory);

    return (
        <section className="ss-root">
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Mono:wght@300;400&family=Outfit:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .ss-root {
          --gold: #C8A96E;
          --gold-dim: rgba(200, 169, 110, 0.15);
          --gold-border: rgba(200, 169, 110, 0.25);
          --ink: #0E0D0B;
          --parchment: #F7F3EC;
          --parchment-dim: #EDE7D8;
          --text-main: #1A1712;
          --text-muted: #7A7265;
          --text-ghost: rgba(26, 23, 18, 0.35);
          --card-bg: #FEFCF8;
          --surface: #F2EDE3;
          background: var(--parchment);
          min-height: 100vh;
          padding: 100px 32px 120px;
          font-family: 'Outfit', sans-serif;
          color: var(--text-main);
          position: relative;
          overflow: hidden;
        }

        /* Subtle grain texture overlay */
        .ss-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.4;
        }

        /* Decorative corner marks */
        .ss-root::after {
          content: '';
          position: absolute;
          top: 48px; left: 48px; right: 48px; bottom: 0;
          border-top: 0.5px solid var(--gold-border);
          border-left: 0.5px solid var(--gold-border);
          border-right: 0.5px solid var(--gold-border);
          pointer-events: none;
          z-index: 0;
        }

        .ss-container {
          max-width: 1320px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        /* ── Header ── */
        .ss-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 72px;
          opacity: ${mounted ? 1 : 0};
          transform: ${mounted ? 'translateY(0)' : 'translateY(20px)'};
          transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .ss-eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--gold);
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          font-weight: 300;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          margin-bottom: 28px;
        }

        .ss-eyebrow::before,
        .ss-eyebrow::after {
          content: '';
          display: block;
          width: 40px;
          height: 0.5px;
          background: var(--gold);
          opacity: 0.6;
        }

        .ss-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(48px, 6vw, 80px);
          font-weight: 300;
          letter-spacing: -0.02em;
          line-height: 1.05;
          text-align: center;
          color: var(--text-main);
          margin-bottom: 8px;
        }

        .ss-title em {
          font-style: italic;
          color: var(--gold);
        }

        .ss-subtitle {
          font-size: 15px;
          font-weight: 300;
          color: var(--text-muted);
          margin-bottom: 56px;
          letter-spacing: 0.01em;
        }

        /* ── Filters ── */
        .ss-filters {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
          justify-content: center;
          background: rgba(255,255,255,0.5);
          border: 0.5px solid var(--gold-border);
          border-radius: 100px;
          padding: 6px;
          backdrop-filter: blur(8px);
        }

        .ss-filter-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: none;
          color: var(--text-muted);
          padding: 9px 18px;
          border-radius: 100px;
          cursor: pointer;
          font-size: 13px;
          font-family: 'Outfit', sans-serif;
          font-weight: 400;
          transition: all 0.25s ease;
          letter-spacing: 0.01em;
        }

        .ss-filter-btn:hover {
          color: var(--text-main);
          background: rgba(200, 169, 110, 0.08);
        }

        .ss-filter-btn.active {
          background: var(--gold);
          color: var(--ink);
          font-weight: 500;
        }

        .ss-filter-icon {
          font-size: 11px;
          opacity: 0.7;
        }

        /* ── Grid ── */
        .ss-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
          gap: 2px;
          background: var(--gold-border);
          border: 0.5px solid var(--gold-border);
          border-radius: 20px;
          overflow: hidden;
        }

        /* ── Card ── */
        .ss-card {
          background: var(--card-bg);
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: background 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .ss-card:hover {
          background: #FFFDF7;
          z-index: 1;
        }

        .ss-card-img-wrap {
          height: 240px;
          overflow: hidden;
          position: relative;
        }

        .ss-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          filter: saturate(0.85);
        }

        .ss-card:hover .ss-card-img {
          transform: scale(1.06);
          filter: saturate(1);
        }

        /* Gradient overlay on image */
        .ss-card-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(14, 13, 11, 0.55) 0%, transparent 60%);
          z-index: 1;
        }

        .ss-card-tag {
          position: absolute;
          top: 16px;
          left: 16px;
          z-index: 2;
          background: rgba(254, 252, 248, 0.92);
          backdrop-filter: blur(12px);
          border: 0.5px solid var(--gold-border);
          padding: 5px 12px;
          border-radius: 100px;
          font-size: 10px;
          font-family: 'DM Mono', monospace;
          font-weight: 300;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--gold);
        }

        .ss-card-rating-badge {
          position: absolute;
          bottom: 16px;
          right: 16px;
          z-index: 2;
          background: rgba(200, 169, 110, 0.92);
          backdrop-filter: blur(12px);
          padding: 6px 10px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 500;
          color: var(--ink);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .ss-card-body {
          padding: 28px 28px 24px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .ss-card-cat {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          font-weight: 300;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 10px;
        }

        .ss-card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px;
          font-weight: 400;
          line-height: 1.2;
          color: var(--text-main);
          margin-bottom: 8px;
          letter-spacing: -0.01em;
        }

        .ss-card-provider {
          font-size: 13px;
          font-weight: 300;
          color: var(--text-muted);
          margin-bottom: 24px;
        }

        .ss-card-footer {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 20px;
          border-top: 0.5px solid rgba(200, 169, 110, 0.15);
        }

        .ss-card-price {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 400;
          color: var(--text-main);
          letter-spacing: -0.01em;
        }

        .ss-card-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          color: var(--gold);
          border: 0.5px solid var(--gold-border);
          padding: 9px 18px;
          border-radius: 100px;
          font-size: 12px;
          font-family: 'Outfit', sans-serif;
          font-weight: 400;
          letter-spacing: 0.05em;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .ss-card-btn:hover {
          background: var(--gold);
          color: var(--ink);
          border-color: var(--gold);
        }

        .ss-card-btn-arrow {
          font-size: 14px;
          transition: transform 0.25s ease;
        }

        .ss-card-btn:hover .ss-card-btn-arrow {
          transform: translateX(3px);
        }

        /* ── Modal ── */
        .ss-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(14, 13, 11, 0.75);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          animation: ss-fade-in 0.3s ease;
        }

        .ss-modal {
          background: var(--card-bg);
          border: 0.5px solid var(--gold-border);
          border-radius: 24px;
          width: 100%;
          max-width: 780px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          animation: ss-slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 48px 120px rgba(14, 13, 11, 0.35), 0 0 0 0.5px var(--gold-border);
        }

        .ss-modal::-webkit-scrollbar { width: 4px; }
        .ss-modal::-webkit-scrollbar-track { background: transparent; }
        .ss-modal::-webkit-scrollbar-thumb { background: var(--gold-border); border-radius: 4px; }

        .ss-modal-close {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(14, 13, 11, 0.06);
          border: 0.5px solid var(--gold-border);
          color: var(--text-muted);
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          transition: all 0.2s ease;
          font-family: serif;
          line-height: 1;
        }

        .ss-modal-close:hover {
          background: var(--gold);
          color: var(--ink);
          border-color: var(--gold);
        }

        .ss-modal-img-wrap {
          position: relative;
          height: 320px;
          border-radius: 24px 24px 0 0;
          overflow: hidden;
        }

        .ss-modal-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: saturate(0.9);
        }

        .ss-modal-img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(14,13,11,0.65) 0%, transparent 55%);
        }

        .ss-modal-img-label {
          position: absolute;
          bottom: 24px;
          left: 32px;
          z-index: 2;
        }

        .ss-modal-cat-label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 4px;
        }

        .ss-modal-img-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px;
          font-weight: 300;
          color: #FEFCF8;
          line-height: 1.1;
        }

        .ss-modal-content {
          padding: 36px 40px 40px;
        }

        .ss-modal-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
          padding-bottom: 28px;
          border-bottom: 0.5px solid rgba(200, 169, 110, 0.15);
        }

        .ss-modal-provider-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ss-modal-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--gold-dim);
          border: 0.5px solid var(--gold-border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          color: var(--gold);
        }

        .ss-modal-provider-name {
          font-size: 15px;
          font-weight: 500;
          color: var(--text-main);
        }

        .ss-modal-reviews {
          font-size: 12px;
          font-weight: 300;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .ss-modal-price-block {
          text-align: right;
        }

        .ss-modal-price-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 2px;
        }

        .ss-modal-price {
          font-family: 'Cormorant Garamond', serif;
          font-size: 32px;
          font-weight: 400;
          color: var(--gold);
          letter-spacing: -0.01em;
        }

        .ss-modal-rating-pills {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
        }

        .ss-rating-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(200, 169, 110, 0.08);
          border: 0.5px solid var(--gold-border);
          padding: 6px 14px;
          border-radius: 100px;
          font-size: 13px;
          color: var(--text-main);
        }

        .ss-rating-star { color: var(--gold); font-size: 12px; }

        .ss-modal-desc {
          font-size: 15px;
          font-weight: 300;
          line-height: 1.75;
          color: var(--text-muted);
          margin-bottom: 36px;
        }

        .ss-modal-features {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 36px;
        }

        .ss-feature-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          font-weight: 300;
          color: var(--text-main);
        }

        .ss-feature-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--gold);
          flex-shrink: 0;
        }

        .ss-modal-book-btn {
          width: 100%;
          background: var(--ink);
          color: var(--parchment);
          border: none;
          padding: 18px;
          border-radius: 12px;
          font-size: 14px;
          font-family: 'Outfit', sans-serif;
          font-weight: 400;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .ss-modal-book-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--gold);
          transform: translateX(-101%);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .ss-modal-book-btn:hover::after {
          transform: translateX(0);
        }

        .ss-modal-book-btn span {
          position: relative;
          z-index: 1;
        }

        .ss-modal-book-btn:hover span {
          color: var(--ink);
        }

        /* ── Stats bar ── */
        .ss-stats-bar {
          display: flex;
          justify-content: center;
          gap: 0;
          margin-bottom: 64px;
          border: 0.5px solid var(--gold-border);
          border-radius: 16px;
          background: rgba(255,255,255,0.5);
          overflow: hidden;
          backdrop-filter: blur(8px);
        }

        .ss-stat {
          flex: 1;
          padding: 24px 32px;
          text-align: center;
          border-right: 0.5px solid var(--gold-border);
        }

        .ss-stat:last-child { border-right: none; }

        .ss-stat-num {
          font-family: 'Cormorant Garamond', serif;
          font-size: 36px;
          font-weight: 300;
          color: var(--gold);
          display: block;
          line-height: 1.1;
          margin-bottom: 4px;
        }

        .ss-stat-label {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        @keyframes ss-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes ss-slide-up {
          from { opacity: 0; transform: translateY(32px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        @media (max-width: 900px) {
          .ss-root { padding: 64px 20px 80px; }
          .ss-root::after { top: 32px; left: 32px; right: 32px; }
          .ss-grid { grid-template-columns: 1fr; }
          .ss-stats-bar { flex-direction: column; }
          .ss-stat { border-right: none; border-bottom: 0.5px solid var(--gold-border); }
          .ss-stat:last-child { border-bottom: none; }
          .ss-modal-content { padding: 24px 24px 28px; }
          .ss-modal-meta-row { flex-direction: column; align-items: flex-start; gap: 16px; }
          .ss-modal-features { grid-template-columns: 1fr; }
        }
      `}</style>

            <div className="ss-container">

                {/* Header */}
                <div className="ss-header">
                    <div className="ss-eyebrow">Curated Expertise</div>
                    <h2 className="ss-title">
                        Services <em>crafted</em><br />for your life
                    </h2>
                    <p className="ss-subtitle">Vetted professionals, exceptional results</p>

                    <div className="ss-filters">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`ss-filter-btn ${activeCategory === cat ? 'active' : ''}`}
                                onClick={() => setActiveCategory(cat)}
                            >
                                <span className="ss-filter-icon">{categoryIcons[cat]}</span>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stats bar */}
                <div className="ss-stats-bar">
                    <div className="ss-stat">
                        <span className="ss-stat-num">2,400+</span>
                        <span className="ss-stat-label">Professionals</span>
                    </div>
                    <div className="ss-stat">
                        <span className="ss-stat-num">4.9</span>
                        <span className="ss-stat-label">Avg. Rating</span>
                    </div>
                    <div className="ss-stat">
                        <span className="ss-stat-num">48h</span>
                        <span className="ss-stat-label">Avg. Response</span>
                    </div>
                    <div className="ss-stat">
                        <span className="ss-stat-num">98%</span>
                        <span className="ss-stat-label">Satisfaction</span>
                    </div>
                </div>

                {/* Grid */}
                <div className="ss-grid">
                    {filteredServices.map(service => (
                        <div
                            key={service.id}
                            className="ss-card"
                            onMouseEnter={() => setHoveredCard(service.id)}
                            onMouseLeave={() => setHoveredCard(null)}
                            onClick={() => setSelectedService(service)}
                        >
                            <div className="ss-card-img-wrap">
                                <img src={service.image} alt={service.title} className="ss-card-img" />
                                <div className="ss-card-img-overlay" />
                                <div className="ss-card-tag">{service.tag}</div>
                                <div className="ss-card-rating-badge">
                                    ★ {service.rating}
                                </div>
                            </div>
                            <div className="ss-card-body">
                                <div className="ss-card-cat">{service.category}</div>
                                <h3 className="ss-card-title">{service.title}</h3>
                                <p className="ss-card-provider">by {service.provider} · {service.reviews} reviews</p>
                                <div className="ss-card-footer">
                                    <span className="ss-card-price">{service.price}</span>
                                    <button className="ss-card-btn">
                                        Explore
                                        <span className="ss-card-btn-arrow">→</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {selectedService && (
                <div className="ss-modal-overlay" onClick={() => setSelectedService(null)}>
                    <div className="ss-modal" onClick={e => e.stopPropagation()}>
                        <button className="ss-modal-close" onClick={() => setSelectedService(null)}>×</button>

                        <div className="ss-modal-img-wrap">
                            <img src={selectedService.image} alt={selectedService.title} className="ss-modal-img" />
                            <div className="ss-modal-img-overlay" />
                            <div className="ss-modal-img-label">
                                <div className="ss-modal-cat-label">{selectedService.category}</div>
                                <div className="ss-modal-img-title">{selectedService.title}</div>
                            </div>
                        </div>

                        <div className="ss-modal-content">
                            <div className="ss-modal-meta-row">
                                <div className="ss-modal-provider-row">
                                    <div className="ss-modal-avatar">
                                        {selectedService.provider[0]}
                                    </div>
                                    <div>
                                        <div className="ss-modal-provider-name">{selectedService.provider}</div>
                                        <div className="ss-modal-reviews">{selectedService.reviews} verified reviews</div>
                                    </div>
                                </div>
                                <div className="ss-modal-price-block">
                                    <div className="ss-modal-price-label">Starting from</div>
                                    <div className="ss-modal-price">{selectedService.price.replace('From ', '')}</div>
                                </div>
                            </div>

                            <div className="ss-modal-rating-pills">
                                <div className="ss-rating-pill">
                                    <span className="ss-rating-star">★</span>
                                    {selectedService.rating} rating
                                </div>
                                <div className="ss-rating-pill">✓ Vetted professional</div>
                                <div className="ss-rating-pill">⏱ Fast response</div>
                            </div>

                            <p className="ss-modal-desc">
                                Experience exceptional {selectedService.category.toLowerCase()} with {selectedService.provider},
                                one of our most sought-after specialists. Every detail is handled with precision and care,
                                delivering results that consistently exceed expectations. Book your session today and discover
                                why {selectedService.reviews}+ clients trust this service.
                            </p>

                            <div className="ss-modal-features">
                                {["Free consultation", "Satisfaction guaranteed", "Flexible scheduling", "Insured & certified"].map(f => (
                                    <div key={f} className="ss-feature-item">
                                        <div className="ss-feature-dot" />
                                        {f}
                                    </div>
                                ))}
                            </div>

                            <button
                                className="ss-modal-book-btn"
                                onClick={() => {
                                    alert(`Booking ${selectedService.title} — API integration coming soon.`);
                                    setSelectedService(null);
                                }}
                            >
                                <span>Reserve Your Slot</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ServicesSection;