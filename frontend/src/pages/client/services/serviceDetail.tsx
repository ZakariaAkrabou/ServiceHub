import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Star,
  CheckCircle,
  ShieldCheck,
  MessageSquare,
  UserCheck,
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

interface Client {
  name: string;
  avatar: string;
  date: string;
  task: string;
  status: string;
}

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [service, setService] = useState<ServiceItem | null>(null);
  const [hasBooked] = useState(false);
  const [bookingSuccess, ] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);


  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);


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

    const mappedReviews: Review[] = serviceReviewsData.data.map((review) => {
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
      <div className="min-h-screen bg-[#F5F0E8]/20 flex flex-col justify-between">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-32 text-center">
          <h2 className="text-2xl font-bold text-[#1A1A2E]">
            Loading service details...
          </h2>
        </div>
        <Footer />
      </div>
    );
  }

  if (serviceError || !service) {
    return (
      <div className="min-h-screen bg-[#F5F0E8]/20 flex flex-col justify-between">
        <Header />
        <div className="max-w-7xl mx-auto px-6 py-32 text-center">
          <h2 className="text-2xl font-bold text-[#1A1A2E]">
            Service not found
          </h2>
          <button
            onClick={() => navigate("/services")}
            className="mt-4 px-6 py-2 bg-[#1A1A2E] text-white rounded-lg hover:bg-[#C9A84C] hover:text-[#1A1A2E] transition"
          >
            Back to Services
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const clientDirectory: Client[] = reviewsList.slice(0, 4).map((review) => ({
    name: review.author,
    avatar: review.avatar,
    date: review.date,
    task: service.subCategory || service.category,
    status: "Completed",
  }));

  const handleBookService = () => {
    setShowBookingModal(true);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const addedReview: Review = {
      id: `r-${Date.now()}`,
      author: "You (Demo User)",
      avatar: "U",
      rating: newRating,
      date: "Today",
      comment: newComment.trim(),
    };

    setReviewsList([addedReview, ...reviewsList]);
    setNewComment("");
    setNewRating(5);
  };


  const totalStars = reviewsList.reduce((acc, curr) => acc + curr.rating, 0);
  const averageRating =
    reviewsList.length > 0
      ? (totalStars / reviewsList.length).toFixed(1)
      : service.rating.toFixed(1);

  return (
    <div
      className="services-detail-page min-h-screen bg-[#F5F0E8]/20 font-sans antialiased text-[#1A1A2E]
      [&_.header-container]:bg-white/95 
      [&_.header-container]:backdrop-blur-md 
      [&_.header-container]:border-b 
      [&_.header-container]:border-black/5 
      [&_.header-container]:shadow-sm
      [&_.nav-links_a]:text-[#1A1A2E] 
      hover:[&_.nav-links_a]:text-[#C9A84C]
      [&_.nav-links_a::after]:bg-[#C9A84C]
      [&_.btn-login]:text-[#1A1A2E] 
      [&_.btn-login]:border-[#1A1A2E]/15 
      [&_.btn-login]:bg-[#1A1A2E]/5 
      hover:[&_.btn-login]:bg-[#1A1A2E]/10
      [&_.btn-cta]:bg-[#1A1A2E] 
      [&_.btn-cta]:text-white 
      hover:[&_.btn-cta]:bg-[#2e2e4e]
      [&_.profile-trigger]:border-[#1A1A2E]/10
      [&_.profile-trigger]:bg-[#1A1A2E]/5
      [&_.profile-trigger_span]:text-[#1A1A2E]
      [&_.mobile-btn_span]:bg-[#1A1A2E]
      [&_.mobile-overlay]:bg-white
      [&_.mobile-overlay_a]:text-[#1A1A2E]"
    >
      <Header />

      <style>{`
        @keyframes pageFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-fade-up { animation: pageFadeUp 0.65s cubic-bezier(0.16, 1, 0.3, 1) both; }
        
        .ccw__grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(201,168,76,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.03) 1px, transparent 1px);
          background-size: 80px 80px;
          pointer-events: none;
        }

        .services-detail-page, 
        .services-detail-page *, 
        .services-detail-page button, 
        .services-detail-page span, 
        .services-detail-page h1, 
        .services-detail-page h2, 
        .services-detail-page h3,
        .services-detail-page p {
          font-family: "Times New Roman", sans-serif, "Geist", "Inter" !important;
        }
      `}</style>


      <section className="relative pt-32 pb-20 bg-[#0a1628] border-b border-black/3 overflow-hidden min-h-100 flex flex-col justify-center text-white">
        <div className="ccw__grid" />
        <div className="absolute inset-0 bg-linear-to-r from-[#0a1628]/95 via-[#0a1628]/80 to-transparent z-5" />

        <img
          src={service.image}
          alt={service.name}
          className="absolute inset-0 w-full h-full object-cover opacity-35 object-center pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full flex flex-col items-start anim-fade-up">
          <button
            onClick={() => navigate("/services")}
            id="back-to-services-btn"
            className="flex items-center gap-2 text-white/80 hover:text-[#C9A84C] font-semibold text-xs uppercase tracking-widest mb-6 transition cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to Catalog
          </button>

          <span className="bg-[#C9A84C] text-[#1A1A2E] text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-md mb-4 inline-block">
            {service.category}
          </span>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] max-w-4xl font-sans mb-6">
            {service.name}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-white/80">
            <div className="flex items-center gap-1">
              <Star size={16} className="fill-[#C9A84C] text-[#C9A84C]" />
              <span className="font-bold text-white">{averageRating}</span>
              <span>•</span>
              <span className="font-semibold">
                {reviewsList.length} Reviews
              </span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Clock size={16} className="text-[#C9A84C]" />
              <span className="font-bold">{service.duration} Duration</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Details Grid */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Columns - Details */}
          <div className="lg:col-span-2 space-y-10">
            {/* Overview Card */}
            <div className="bg-white rounded-3xl p-8 border border-black/4 shadow-xs anim-fade-up">
              <h2 className="text-xl font-bold uppercase tracking-wider text-[#1A1A2E] mb-6 border-b border-black/5 pb-3">
                Service Description
              </h2>
              <p className="text-sm md:text-base leading-relaxed text-black/75 mb-6 whitespace-pre-line font-serif">
                {service.longDescription}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="flex items-start gap-3 p-4 bg-[#F5F0E8]/20 rounded-2xl border border-black/3">
                  <ShieldCheck
                    className="text-[#C9A84C] shrink-0 mt-0.5"
                    size={20}
                  />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A2E]">
                      Damage Liability Protection
                    </h4>
                    <p className="text-[11px] text-black/50 mt-1">
                      Every booking is automatically covered under our secure
                      warranty scheme.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-[#F5F0E8]/20 rounded-2xl border border-black/3">
                  <CheckCircle
                    className="text-[#C9A84C] shrink-0 mt-0.5"
                    size={20}
                  />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A2E]">
                      Certified Professionals
                    </h4>
                    <p className="text-[11px] text-black/50 mt-1">
                      Our providers pass standard vetting, background checks,
                      and identity screenings.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Past Customers who booked this Provider */}
            <div className="bg-white rounded-3xl p-8 border border-black/4 shadow-xs anim-fade-up">
              <h2 className="text-xl font-bold uppercase tracking-wider text-[#1A1A2E] mb-6 border-b border-black/5 pb-3">
                Client Directory
                <span className="block text-[11px] font-normal text-black/40 mt-1 normal-case tracking-normal">
                  Clients who previously worked with {service.provider}
                </span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {clientDirectory.map((client, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-2xl border border-black/3 bg-[#F5F0E8]/10 hover:bg-[#F5F0E8]/30 transition duration-300"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#1A1A2E] text-[#C9A84C] flex items-center justify-center font-bold text-xs">
                        {client.avatar}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#1A1A2E]">
                          {client.name}
                        </h4>
                        <span className="text-[10px] text-black/45 block mt-0.5">
                          {client.task}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="inline-block text-[8px] bg-green-100 text-green-800 font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full">
                        {client.status}
                      </span>
                      <span className="block text-[9px] text-black/40 mt-1 font-semibold">
                        {client.date}
                      </span>
                    </div>
                  </div>
                ))}
                {clientDirectory.length === 0 && (
                  <div className="md:col-span-2 text-center text-[12px] text-black/45 py-6 border border-dashed border-black/10 rounded-2xl">
                    No client activity available yet.
                  </div>
                )}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-3xl p-8 border border-black/4 shadow-xs anim-fade-up">
              <h2 className="text-xl font-bold uppercase tracking-wider text-[#1A1A2E] mb-6 border-b border-black/5 pb-3 flex items-center justify-between">
                <span>Reviews & Feedback</span>
                <span className="text-xs font-semibold text-[#C9A84C] flex items-center gap-1 normal-case tracking-normal">
                  <Star size={14} className="fill-[#C9A84C] text-[#C9A84C]" />{" "}
                  {averageRating} rating
                </span>
              </h2>

              {/* Conditional Review Form */}
              <div className="mb-10 p-6 rounded-2xl border border-dashed border-[#C9A84C]/30 bg-[#F5F0E8]/10">
                {hasBooked ? (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#1A1A2E] flex items-center gap-2">
                      <MessageSquare size={16} className="text-[#C9A84C]" />{" "}
                      Write Your Review
                    </h3>

                    {/* Star Interactive Selector */}
                    <div>
                      <span className="block text-[11px] font-bold text-black/50 mb-2 uppercase tracking-wide">
                        Your Rating:
                      </span>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isActive =
                            hoveredStar !== null
                              ? star <= hoveredStar
                              : star <= newRating;
                          return (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewRating(star)}
                              onMouseEnter={() => setHoveredStar(star)}
                              onMouseLeave={() => setHoveredStar(null)}
                              className="cursor-pointer transition-transform hover:scale-110"
                            >
                              <Star
                                size={22}
                                className={`transition-colors ${
                                  isActive
                                    ? "fill-[#C9A84C] text-[#C9A84C]"
                                    : "text-black/15 fill-transparent"
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Review text area */}
                    <div>
                      <label
                        htmlFor="review-comment-input"
                        className="block text-[11px] font-bold text-black/50 mb-2 uppercase tracking-wide"
                      >
                        Your Feedback:
                      </label>
                      <textarea
                        id="review-comment-input"
                        rows={4}
                        placeholder="Tell others about your experience with this service..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full p-4 rounded-xl border border-black/10 focus:border-[#C9A84C] outline-none text-xs leading-relaxed font-serif bg-white"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      id="submit-review-btn"
                      className="px-6 py-2.5 bg-[#1A1A2E] text-white hover:bg-[#C9A84C] hover:text-[#1A1A2E] text-xs font-bold uppercase tracking-widest rounded-lg transition-all cursor-pointer"
                    >
                      Post Review
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-4 space-y-2">
                    <span className="inline-block text-xl">🔒</span>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1A2E]">
                      Review Submission Locked
                    </h4>
                    <p className="text-[11px] text-black/50 max-w-sm mx-auto leading-normal">
                      Only verified clients who have booked this service can
                      leave feedback. Please complete a booking using the
                      sidebar card to unlock writing a review.
                    </p>
                  </div>
                )}
              </div>

              {/* Reviews List */}
              <div className="space-y-6">
                {reviewsList.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-black/4 pb-6 last:border-b-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#F5F0E8] border border-black/5 text-[#1A1A2E] flex items-center justify-center font-bold text-xs uppercase">
                          {review.avatar}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-[#1A1A2E]">
                            {review.author}
                          </h4>
                          <span className="text-[10px] text-black/40 font-semibold">
                            {review.date}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={`${
                              i < review.rating
                                ? "fill-[#C9A84C] text-[#C9A84C]"
                                : "text-black/10"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs font-serif leading-relaxed text-black/70 italic pl-12">
                      "{review.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card Sidebar */}
          <div className="space-y-6">
            {/* Booking Alert banner */}
            {bookingSuccess && (
              <div className="bg-[#1A1A2E] border-2 border-[#C9A84C] text-white p-5 rounded-2xl shadow-xl flex items-start gap-3 animate-[pageFadeUp_0.4s_ease-out]">
                <UserCheck
                  className="text-[#C9A84C] shrink-0 mt-0.5"
                  size={24}
                />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#C9A84C]">
                    Booking Successful!
                  </h4>
                  <p className="text-[10px] text-white/80 mt-1 leading-normal">
                    You have successfully booked this service. The provider has
                    been notified. You can now leave a review in the feedback
                    section below.
                  </p>
                </div>
              </div>
            )}

            {/* Checkout Pricing Sidebar Card */}
            <div className="bg-white rounded-3xl p-6 border border-black/4 shadow-sm sticky top-28">
              <span className="text-[9px] uppercase font-bold tracking-widest text-black/35 block mb-1">
                Pricing Package
              </span>
              <div className="flex items-baseline gap-1.5 border-b border-black/5 pb-4 mb-4">
                <span className="text-3xl font-black text-[#1A1A2E] font-serif">
                  ${service.price}
                </span>
                <span className="text-xs text-black/40 font-semibold">
                  / Flat Rate
                </span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-xs text-black/60">
                  <span>Estimated Duration</span>
                  <span className="font-bold text-[#1A1A2E] flex items-center gap-1">
                    <Clock size={12} /> {service.duration}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-black/60">
                  <span>Service Provider</span>
                  <span className="font-bold text-[#C9A84C]">
                    {service.provider}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-black/60">
                  <span>Tier Level</span>
                  <span className="text-[10px] uppercase font-extrabold text-[#1A1A2E] bg-[#F5F0E8] px-2 py-0.5 rounded">
                    {service.providerTier}
                  </span>
                </div>
              </div>

              {/* Service Badges */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {service.badges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] font-bold text-white bg-[#1A1A2E] px-2.5 py-1 rounded-md tracking-wide"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              {/* Checkout / Booking Action Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  id="book-service-btn"
                  onClick={handleBookService}
                  className="w-full py-3 bg-[#1A1A2E] text-white hover:bg-[#C9A84C] hover:text-[#1A1A2E] font-bold text-xs uppercase tracking-widest rounded-xl transition duration-300 cursor-pointer text-center shadow-xs"
                >
                  Book Service Now
                </button>

              {/* Real Booking Popup */}
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

                <p className="text-[10px] text-center text-black/35 mt-3 leading-normal">
                  Payments are secure. No charges will be placed until service
                  completion is confirmed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServiceDetail;
