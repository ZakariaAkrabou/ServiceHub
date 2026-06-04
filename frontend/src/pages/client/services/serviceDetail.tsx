import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ChevronRight,
  CheckCircle,
  MessageSquare,
  MapPin,
  Mail,
  Phone,
  Users,
  CalendarDays,
  BookOpen,
  Home,
  PhoneCall,
  FileText,
  Building2,
  ArrowRight,
  Wrench,
  Shield,
  Settings,
  Zap,
} from "lucide-react";
import Header from "../../../components/client/Header";
import Footer from "../../../components/client/Footer";
import {
  useGetCustomerServiceByIdQuery,
  useGetCustomerServiceReviewsQuery,
} from "../../../app/api/ServiceApi";
import { mapCustomerServiceToItem, type ServiceItem } from "./services";
import CreateBooking from "../booking/createBooking";

interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
}

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [service, setService] = useState<ServiceItem | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [reviewsList, setReviewsList] = useState<Review[]>([]);

  const {
    data: serviceData,
    isLoading: isServiceLoading,
    isFetching: isServiceFetching,
    error: serviceError,
  } = useGetCustomerServiceByIdQuery(id || "", { skip: !id });

  const { data: serviceReviewsData, isLoading: isReviewsLoading } =
    useGetCustomerServiceReviewsQuery(id || "", { skip: !id });

  const formatReviewDate = (date?: string) => {
    if (!date) return "Recently";
    return new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getReviewIdentity = (customer: unknown) => {
    if (!customer || typeof customer === "string") {
      return { author: "Verified Customer", avatar: "VC" };
    }
    const person = customer as { firstName?: string; lastName?: string };
    const firstName = person.firstName || "Verified";
    const lastName = person.lastName || "Customer";
    const author = `${firstName} ${lastName}`.trim();
    const avatar = `${firstName[0] || "V"}${lastName[0] || "C"}`.toUpperCase();
    return { author, avatar };
  };

  useEffect(() => {
    if (serviceData) {
      setService(mapCustomerServiceToItem(serviceData));
    }
  }, [serviceData]);

  useEffect(() => {
    if (!serviceReviewsData) return;
    const mappedReviews: Review[] = serviceReviewsData.data.map((review: any) => {
      const identity = getReviewIdentity(review.customer_id);
      return {
        id: review._id,
        author: identity.author,
        avatar: identity.avatar,
        rating: review.rating,
        date: formatReviewDate(review.createdAt),
        comment: review.review || "",
      };
    });
    setReviewsList(mappedReviews);
  }, [serviceReviewsData]);

  if (isServiceLoading || isServiceFetching || isReviewsLoading) {
    return (
      <div className="sd-page">
        <Header />
        <div className="sd-loading">
          <div className="sd-loading__spinner" />
          <h2>Loading service details...</h2>
        </div>
        <Footer />
        <style>{styles}</style>
      </div>
    );
  }

  if (serviceError || !service) {
    return (
      <div className="sd-page">
        <Header />
        <div className="sd-loading">
          <h2>Service not found</h2>
          <button onClick={() => navigate("/services")} className="sd-back-btn">
            Back to Services
          </button>
        </div>
        <Footer />
        <style>{styles}</style>
      </div>
    );
  }

  const providerRaw = serviceData?.provider_id as any;
  const providerEmail =
    typeof providerRaw === "object" && providerRaw?.email
      ? providerRaw.email
      : "provider@example.com";
  const providerPhone =
    typeof providerRaw === "object" && providerRaw?.phone
      ? providerRaw.phone
      : "(808) 555-0111";

  // Sibling services for sidebar list
  const siblingServices = [
    "Roof Repair Pros",
    service.name,
    "Premier Roof Maintenance",
    "Sky Shield Roofing",
    "Elevate Roof Solutions",
    "Horizon Guard Roofing",
  ];

  const processItems = [
    {
      icon: <Wrench size={22} />,
      name: "Roof Repair Pros",
      desc: "Roofing is the process installing repairing and the maintaining and maintaining roofs",
    },
    {
      icon: <Shield size={22} />,
      name: "Weatherproof Roofing Solutions",
      desc: "Roofing is the process installing repairing and the maintaining and maintaining roofs",
    },
    {
      icon: <Settings size={22} />,
      name: "Elite Roof Installations",
      desc: "Roofing is the process installing repairing and the maintaining and maintaining roofs",
    },
    {
      icon: <Zap size={22} />,
      name: "Sky Shield Roofing",
      desc: "Roofing is the process installing repairing and the maintaining and maintaining roofs",
    },
  ];

  const descriptionText = service.longDescription || service.description || "";

  return (
    <div className="sd-page">
      <Header />
      <style>{styles}</style>

      {/* Hero Banner */}
      <div className="sd-hero">
        <div className="sd-hero__inner">
          <h1 className="sd-hero__title">{service.name}</h1>
          <nav className="sd-hero__breadcrumb" aria-label="Breadcrumb">
            <Link to="/" className="sd-hero__bc-link">HOME</Link>
            <span className="sd-hero__bc-sep">/</span>
            <Link to="/services" className="sd-hero__bc-link">SERVICES</Link>
            <span className="sd-hero__bc-sep">/</span>
            <span className="sd-hero__bc-active">{service.name.toUpperCase()}</span>
          </nav>
        </div>
      </div>

      {/* Main Layout */}
      <main className="sd-main">
        <div className="sd-grid">

          {/* ── LEFT COLUMN ── */}
          <div className="sd-left">

            {/* Main service image */}
            <div className="sd-main-image">
              <img src={service.image} alt={service.name} />
            </div>

            {/* Section: Hand working / Overview */}
            <div className="sd-section">
              <h2 className="sd-section__title">Hand working</h2>
              <p className="sd-section__body">{descriptionText}</p>
              <ul className="sd-bullet-list">
                <li>Roof is a nutritious category of food that includes various</li>
                <li>My Roof is a nutritious category of food that includes various</li>
                <li>These ground nuts can be used in a variety of recipes</li>
              </ul>
            </div>

            {/* Section: Repairs & Upgrades */}
            <div className="sd-section">
              <h2 className="sd-section__title">Repairs &amp; Upgrades</h2>
              <p className="sd-section__body">
                {descriptionText ||
                  "Nutmeal is a nutritious category of food that includes various types of ground nuts, such as almonds, walnuts, and peanuts These ground nuts can be used in a variety of recipes, including smoothies, baked goods, and savory dishes Nutmeal is a versatile ingredient."}
              </p>
            </div>

            {/* Double image row */}
            <div className="sd-double-image">
              <div className="sd-double-image__item">
                <img src={service.image} alt={`${service.name} detail 1`} />
              </div>
              <div className="sd-double-image__item">
                <img src={service.image} alt={`${service.name} detail 2`} />
              </div>
            </div>

            {/* Section: Our Service Process */}
            <div className="sd-section">
              <h2 className="sd-section__title">Our Service Process</h2>
              <div className="sd-process-grid">
                {processItems.map((item, idx) => (
                  <div key={idx} className="sd-process-item">
                    <div className="sd-process-item__icon">{item.icon}</div>
                    <div>
                      <h4 className="sd-process-item__name">{item.name}</h4>
                      <p className="sd-process-item__desc">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <aside className="sd-sidebar">

            {/* All Services list */}
            <div className="sd-widget">
              <h3 className="sd-widget__title">Our All Service</h3>
              <ul className="sd-service-list">
                {siblingServices.map((svc, idx) => {
                  const isActive = svc === service.name;
                  return (
                    <li key={idx} className={`sd-service-list__item ${isActive ? "is-active" : ""}`}>
                      <span>{svc}</span>
                      <span className={`sd-service-list__arrow ${isActive ? "is-active" : ""}`}>
                        <ArrowRight size={14} />
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

           

            {/* Brochure downloads */}
            <div className="sd-widget">
              <h3 className="sd-widget__title">Brochure</h3>
              <div className="sd-brochure-list">
                <div className="sd-brochure-item">
                  <div className="sd-brochure-item__icon">
                    <FileText size={20} />
                  </div>
                  <div className="sd-brochure-item__info">
                    <span className="sd-brochure-item__name">Download Brochure</span>
                    <span className="sd-brochure-item__sub">
                      Lorem Ipsum is simply is dumiomy is tex Lorem Ipsum is simply is ou our
                    </span>
                  </div>
                </div>
                <div className="sd-brochure-item">
                  <div className="sd-brochure-item__icon">
                    <Building2 size={20} />
                  </div>
                  <div className="sd-brochure-item__info">
                    <span className="sd-brochure-item__name">Company Details</span>
                    <span className="sd-brochure-item__sub">
                      Lorem Ipsum is simply is dumiomy is tex Lorem Ipsum is simply is ou our
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Book button */}
            <button
              type="button"
              className="sd-book-btn"
              onClick={() => setShowBookingModal(true)}
            >
              <CalendarDays size={16} />
              Book This Service
            </button>

          </aside>
        </div>
      </main>

      {/* Booking Modal */}
      {showBookingModal && service && (
        <CreateBooking
          service={{
            _id: service.id,
            name: service.name,
            price: service.price,
            category: service.category,
            duration: service.duration,
            provider: service.provider,
            image: service.image,
          }}
          onClose={() => setShowBookingModal(false)}
        />
      )}

      <Footer />
    </div>
  );
};

const styles = `
  :root {
    --font-main: "DM Sans", "Inter", sans-serif;
    --bg:       #ffffff;
    --surface:  #ffffff;
    --text:     #1a1a2e;
    --text-muted: #6b7280;
    --border:   #eaedf1;
    --red:      #c9a84c;
    --red-dark: #b8963e;
    --radius:   16px;
    --shadow-sm: 0 4px 12px rgba(0,0,0,0.03);
    --shadow:    0 10px 30px rgba(0,0,0,0.05);
    --shadow-lg: 0 20px 40px rgba(0,0,0,0.08);
  }

  * { box-sizing: border-box; }

  .sd-page {
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-main);
    -webkit-font-smoothing: antialiased;
  }

  /* Loading */
  .sd-loading {
    max-width: 100%;
    margin: 0;
    padding: 120px 48px;
    text-align: center;
  }
  .sd-loading h2 { font-size: 18px; font-weight: 700; margin: 0; color: var(--text); }
  .sd-loading__spinner {
    width: 36px; height: 36px;
    border-radius: 50%;
    border: 3px solid rgba(0,0,0,.1);
    border-top-color: var(--red);
    animation: sdSpin .7s linear infinite;
    margin: 0 auto 14px;
  }
  @keyframes sdSpin { to { transform: rotate(360deg); } }
  .sd-back-btn {
    margin-top: 16px; padding: 10px 20px;
    background: var(--red); color: #fff;
    border: none; border-radius: var(--radius);
    font-size: 14px; font-weight: 700; cursor: pointer;
    font-family: var(--font-main);
  }

  /* ── HERO ── */
  .sd-hero {
    background:
      linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.6)),
      url('https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80') center/cover no-repeat;
    padding: 140px 48px 80px;
    text-align: center;
    min-height: 340px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .sd-hero__inner { max-width: 100%; margin: 0; }
  .sd-hero__title {
    font-family: var(--font-main);
    font-size: clamp(36px, 5vw, 60px);
    font-weight: 900;
    color: #fff;
    margin: 0 0 20px;
    letter-spacing: -0.5px;
    text-transform: uppercase;
  }
  .sd-hero__breadcrumb {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 14px; font-weight: 700; color: #fff;
    font-family: var(--font-main);
    letter-spacing: 1px;
  }
  .sd-hero__bc-link {
    color: #fff; text-decoration: none;
    transition: color .2s;
  }
  .sd-hero__bc-link:hover { color: var(--red); }
  .sd-hero__bc-sep { color: var(--red); font-weight: 800; }
  .sd-hero__bc-active { color: var(--red); }

  /* ── MAIN ── */
  .sd-main {
    max-width: 100%;
    margin: 0;
    padding: 64px 48px 80px;
    background: #ffffff;
  }

  @media (max-width: 1100px) {
    .sd-hero { padding: 120px 32px 64px; }
    .sd-main { padding: 48px 32px 72px; }
  }

  @media (max-width: 900px) {
    .sd-hero { padding: 140px 24px 48px; }
    .sd-main { padding: 40px 24px 64px; }
  }

  /* ── GRID ── */
  .sd-grid {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 40px;
    align-items: start;
    max-width: 1280px;
    margin: 0 auto;
  }
  @media (max-width: 900px) {
    .sd-grid { grid-template-columns: 1fr; }
    .sd-sidebar { order: -1; }
  }

  /* ── LEFT COLUMN ── */
  .sd-left { display: flex; flex-direction: column; gap: 48px; }

  .sd-main-image {
    border-radius: 4px;
    overflow: hidden;
    aspect-ratio: 16/9;
  }
  .sd-main-image img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    transition: transform .6s ease;
  }
  .sd-main-image:hover img { transform: scale(1.03); }

  .sd-section {}
  .sd-section__title {
    font-family: var(--font-main);
    font-size: 32px;
    font-weight: 900;
    color: var(--text);
    margin: 0 0 24px;
    letter-spacing: -0.5px;
    position: relative;
    padding-bottom: 12px;
  }
  .sd-section__title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 4px;
    background: var(--red);
    border-radius: 2px;
  }
  .sd-section__body {
    font-size: 15.5px;
    line-height: 1.8;
    color: var(--text-muted);
    margin: 0;
    font-family: var(--font-main);
  }

  .sd-bullet-list {
    margin: 20px 0 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .sd-bullet-list li {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 15px;
    color: var(--text-muted);
    line-height: 1.6;
    font-family: var(--font-main);
  }
  .sd-bullet-list li::before {
    content: '';
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--red);
    flex-shrink: 0;
    margin-top: 6px;
  }

  .sd-double-image {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }
  .sd-double-image__item {
    border-radius: 4px;
    overflow: hidden;
    aspect-ratio: 4/3;
  }
  .sd-double-image__item img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    transition: transform .6s ease;
  }
  .sd-double-image__item:hover img { transform: scale(1.04); }

  /* Service process grid */
  .sd-process-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    margin-top: 12px;
  }
  @media (max-width: 600px) {
    .sd-process-grid { grid-template-columns: 1fr; }
    .sd-double-image { grid-template-columns: 1fr; }
  }
  .sd-process-item {
    display: flex;
    gap: 20px;
    align-items: flex-start;
    padding: 24px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 4px;
    transition: all 0.3s ease;
  }
  .sd-process-item:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow);
    border-color: var(--red);
  }
  .sd-process-item__icon {
    width: 56px; height: 56px;
    border-radius: 50%;
    background: var(--surface);
    border: 2px solid var(--red);
    display: flex; align-items: center; justify-content: center;
    color: var(--red);
    flex-shrink: 0;
    transition: all 0.3s ease;
  }
  .sd-process-item:hover .sd-process-item__icon {
    background: var(--red);
    color: #fff;
  }
  .sd-process-item__name {
    margin: 0 0 8px;
    font-size: 17px;
    font-weight: 800;
    color: var(--text);
    font-family: var(--font-main);
  }
  .sd-process-item__desc {
    margin: 0;
    font-size: 14px;
    color: var(--text-muted);
    line-height: 1.6;
    font-family: var(--font-main);
  }

  /* ── RIGHT SIDEBAR ── */
  .sd-sidebar {
    display: flex;
    flex-direction: column;
    gap: 24px;
    position: sticky;
    top: 100px;
  }
  @media (max-width: 900px) {
    .sd-sidebar { position: static; }
  }

  /* Widget base */
  .sd-widget {
    background: var(--surface);
    border-radius: 4px;
    border: 1px solid var(--border);
  }
  .sd-widget__title {
    font-family: var(--font-main);
    font-size: 16px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0;
    padding: 20px;
    border-bottom: 1px solid var(--border);
    color: var(--text);
    background: #fdfdfd;
  }

  /* Services list */
  .sd-service-list {
    list-style: none;
    margin: 0; padding: 0;
  }
  .sd-service-list__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    font-size: 15px;
    font-weight: 600;
    color: var(--text-muted);
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    transition: all .2s ease;
    font-family: var(--font-main);
  }
  .sd-service-list__item:last-child { border-bottom: none; }
  .sd-service-list__item:hover { background: var(--red); color: #fff; }
  .sd-service-list__item.is-active {
    background: var(--red);
    color: #fff;
    font-weight: 700;
  }
  .sd-service-list__arrow {
    width: 28px; height: 28px;
    display: flex; align-items: center; justify-content: center;
    background: transparent;
    color: inherit;
    transition: transform .2s ease;
    flex-shrink: 0;
  }
  .sd-service-list__item:hover .sd-service-list__arrow,
  .sd-service-list__item.is-active .sd-service-list__arrow {
    transform: translateX(4px);
  }

  /* Brochure */
  .sd-brochure-list {
    display: flex;
    flex-direction: column;
  }
  .sd-brochure-item {
    display: flex;
    gap: 16px;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    transition: background .2s;
  }
  .sd-brochure-item:last-child { border-bottom: none; }
  .sd-brochure-item:hover { background: #fafafa; }
  .sd-brochure-item__icon {
    width: 48px; height: 48px;
    border-radius: 50%;
    background: var(--surface);
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    color: var(--red);
    flex-shrink: 0;
    transition: all .2s;
  }
  .sd-brochure-item:hover .sd-brochure-item__icon {
    background: var(--red);
    color: #fff;
    border-color: var(--red);
  }
  .sd-brochure-item__name {
    display: block;
    font-size: 15px;
    font-weight: 800;
    color: var(--text);
    margin-bottom: 4px;
    font-family: var(--font-main);
  }
  .sd-brochure-item__sub {
    display: block;
    font-size: 13px;
    color: var(--text-muted);
    line-height: 1.4;
    font-family: var(--font-main);
  }

  /* Book button */
  .sd-book-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 18px;
    border-radius: 4px;
    border: none;
    background: var(--red);
    color: #fff;
    font-family: var(--font-main);
    font-size: 15px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .sd-book-btn:hover {
    background: var(--text);
    transform: translateY(-2px);
  }
`;

export default ServiceDetail;