import React, { useState } from 'react';

const mockServices = [
  { id: 1, category: "Home Repair", title: "Plumbing & Leak Repair", rating: 4.8, reviews: 124, price: "From $50/hr", image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80", provider: "John D." },
  { id: 2, category: "Cleaning", title: "Deep House Cleaning", rating: 4.9, reviews: 89, price: "From $120", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80", provider: "Sparkle Co." },
  { id: 3, category: "Tutoring", title: "Advanced Mathematics", rating: 5.0, reviews: 42, price: "From $40/hr", image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80", provider: "Sarah M." },
  { id: 4, category: "Beauty", title: "Bridal Makeup & Hair", rating: 4.7, reviews: 215, price: "From $150", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80", provider: "Glamour Studio" },
  { id: 5, category: "Landscaping", title: "Garden Maintenance", rating: 4.6, reviews: 76, price: "From $60/hr", image: "https://images.unsplash.com/photo-1558904541-efa843a96f0f?auto=format&fit=crop&w=800&q=80", provider: "Green Thumbs" },
  { id: 6, category: "Photography", title: "Portrait & Event Photos", rating: 4.9, reviews: 156, price: "From $200", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80", provider: "Lens Art" },
];

const categories = ["All", "Home Repair", "Cleaning", "Tutoring", "Beauty", "Landscaping", "Photography"];

const ServicesSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedService, setSelectedService] = useState<any>(null);

  const filteredServices = activeCategory === "All" 
    ? mockServices 
    : mockServices.filter(s => s.category === activeCategory);

  return (
    <section className="ss-root">
      <style>{`
        .ss-root {
          background: #0A0A0A;
          min-height: 100vh;
          padding: 80px 24px;
          font-family: 'Geist', 'Inter', -apple-system, sans-serif;
          color: #F5F0E8;
        }
        
        .ss-container {
          max-width: 1280px;
          margin: 0 auto;
        }

        /* ── Header & Filter ── */
        .ss-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 60px;
        }

        .ss-eyebrow {
          color: #C9A84C;
          font-size: 12px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .ss-title {
          font-family: 'Times New Roman', serif;
          font-size: clamp(36px, 5vw, 56px);
          font-weight: 300;
          margin-bottom: 40px;
          text-align: center;
        }

        .ss-filters {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .ss-filter-btn {
          background: rgba(245, 240, 232, 0.03);
          border: 1px solid rgba(245, 240, 232, 0.08);
          color: rgba(245, 240, 232, 0.6);
          padding: 10px 20px;
          border-radius: 100px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.3s ease;
        }

        .ss-filter-btn:hover {
          background: rgba(201, 168, 76, 0.1);
          border-color: rgba(201, 168, 76, 0.3);
          color: #F5F0E8;
        }

        .ss-filter-btn.active {
          background: #C9A84C;
          border-color: #C9A84C;
          color: #000000;
          font-weight: 500;
        }

        /* ── Grid ── */
        .ss-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 32px;
        }

        .ss-card {
          background: #1A1A2E;
          border: 1px solid rgba(201, 168, 76, 0.1);
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.4s ease;
          display: flex;
          flex-direction: column;
        }

        .ss-card:hover {
          transform: translateY(-6px);
          border-color: rgba(201, 168, 76, 0.4);
          box-shadow: 0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(201, 168, 76, 0.1);
        }

        .ss-card-img-wrap {
          height: 220px;
          overflow: hidden;
          position: relative;
        }

        .ss-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .ss-card:hover .ss-card-img {
          transform: scale(1.05);
        }

        .ss-card-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(245, 240, 232, 0.1);
          padding: 6px 12px;
          border-radius: 100px;
          font-size: 12px;
          color: #C9A84C;
          font-weight: 500;
        }

        .ss-card-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .ss-card-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          font-size: 13px;
        }

        .ss-card-cat {
          color: rgba(245, 240, 232, 0.5);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .ss-card-rating {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #F5F0E8;
        }

        .ss-card-star { color: #C9A84C; }

        .ss-card-title {
          font-size: 22px;
          font-family: 'Times New Roman', serif;
          margin-bottom: 8px;
          color: #F5F0E8;
        }

        .ss-card-provider {
          font-size: 14px;
          color: rgba(245, 240, 232, 0.6);
          margin-bottom: 24px;
        }

        .ss-card-footer {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 20px;
          border-top: 1px solid rgba(245, 240, 232, 0.05);
        }

        .ss-card-price {
          font-size: 18px;
          font-weight: 400;
          color: #F5F0E8;
        }

        .ss-card-btn {
          background: transparent;
          color: #C9A84C;
          border: 1px solid #C9A84C;
          padding: 8px 16px;
          border-radius: 100px;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .ss-card-btn:hover {
          background: #C9A84C;
          color: #000000;
        }

        /* ── Modal ── */
        .ss-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }

        .ss-modal {
          background: #1A1A2E;
          border: 1px solid rgba(201, 168, 76, 0.2);
          border-radius: 24px;
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          display: flex;
          flex-direction: column;
          animation: slideUp 0.4s ease;
          box-shadow: 0 40px 100px rgba(0,0,0,0.8);
        }

        .ss-modal-close {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(245, 240, 232, 0.05);
          border: none;
          color: #F5F0E8;
          font-size: 20px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          transition: background 0.2s;
        }

        .ss-modal-close:hover {
          background: rgba(245, 240, 232, 0.1);
        }

        .ss-modal-img {
          width: 100%;
          height: 300px;
          object-fit: cover;
        }

        .ss-modal-content {
          padding: 40px;
        }

        .ss-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
        }

        .ss-modal-title {
          font-family: 'Times New Roman', serif;
          font-size: 36px;
          margin-bottom: 8px;
        }

        .ss-modal-provider {
          color: rgba(245, 240, 232, 0.6);
          font-size: 16px;
        }

        .ss-modal-price {
          font-size: 28px;
          color: #C9A84C;
        }

        .ss-modal-desc {
          color: rgba(245, 240, 232, 0.7);
          line-height: 1.6;
          margin-bottom: 32px;
          font-size: 15px;
        }

        .ss-modal-book-btn {
          width: 100%;
          background: #C9A84C;
          color: #000000;
          border: none;
          padding: 18px;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
        }

        .ss-modal-book-btn:hover {
          background: #E0BC66;
          transform: translateY(-2px);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
          .ss-modal-content { padding: 24px; }
          .ss-modal-header { flex-direction: column; gap: 16px; }
          .ss-modal-img { height: 200px; }
          .ss-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="ss-container">
        <div className="ss-header">
          <span className="ss-eyebrow">Explore</span>
          <h2 className="ss-title">Available Services</h2>
          <div className="ss-filters">
            {categories.map(cat => (
              <button 
                key={cat}
                className={`ss-filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="ss-grid">
          {filteredServices.map(service => (
            <div key={service.id} className="ss-card">
              <div className="ss-card-img-wrap">
                <img src={service.image} alt={service.title} className="ss-card-img" />
                <div className="ss-card-badge">{service.category}</div>
              </div>
              <div className="ss-card-body">
                <div className="ss-card-meta">
                  <span className="ss-card-cat">{service.provider}</span>
                  <div className="ss-card-rating">
                    <span className="ss-card-star">★</span>
                    <span>{service.rating} ({service.reviews})</span>
                  </div>
                </div>
                <h3 className="ss-card-title">{service.title}</h3>
                <div className="ss-card-footer">
                  <span className="ss-card-price">{service.price}</span>
                  <button 
                    className="ss-card-btn"
                    onClick={() => setSelectedService(service)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedService && (
        <div className="ss-modal-overlay" onClick={() => setSelectedService(null)}>
          <div className="ss-modal" onClick={e => e.stopPropagation()}>
            <button className="ss-modal-close" onClick={() => setSelectedService(null)}>×</button>
            <img src={selectedService.image} alt={selectedService.title} className="ss-modal-img" />
            <div className="ss-modal-content">
              <div className="ss-modal-header">
                <div>
                  <h3 className="ss-modal-title">{selectedService.title}</h3>
                  <div className="ss-modal-provider">Provided by {selectedService.provider} • {selectedService.rating} ★ ({selectedService.reviews} reviews)</div>
                </div>
                <div className="ss-modal-price">{selectedService.price}</div>
              </div>
              <p className="ss-modal-desc">
                Experience top-notch {selectedService.category.toLowerCase()} services with our vetted professionals. 
                Whether you need immediate assistance or are planning a future project, our experts are here to deliver exceptional results.
                Book now to secure your slot with {selectedService.provider}.
              </p>
              <button 
                className="ss-modal-book-btn"
                onClick={() => {
                  alert(`Booking functionality for ${selectedService.title} will be implemented with API integration.`);
                  setSelectedService(null);
                }}
              >
                Book Service Now
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ServicesSection;
