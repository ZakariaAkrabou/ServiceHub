import React, { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Star,
  Check,
  Clock,
  ArrowRight,
  FileText,
  Building2,
  Heart,
  ChevronRight,
  Share2
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

interface ServiceReview {
  _id: string;
  customer_id?: unknown;
  rating: number;
  createdAt?: string;
  review?: string;
}

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [showBookingModal, setShowBookingModal] = useState(false);

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

  const service = useMemo<ServiceItem | null>(() => {
    if (serviceData) {
      return mapCustomerServiceToItem(serviceData);
    }
    return null;
  }, [serviceData]);

  const reviewsList = useMemo<Review[]>(() => {
    if (!serviceReviewsData) return [];
    return serviceReviewsData.data.map((review: ServiceReview) => {
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
  }, [serviceReviewsData]);

  if (isServiceLoading || isServiceFetching || isReviewsLoading) {
    return (
      <div className="min-h-screen bg-white font-sans text-[#222325]">
        <Header />
        <div className="flex flex-col items-center justify-center py-48">
          <div className="w-10 h-10 border-4 border-[#e4e5e7] border-t-[#c9a84c] rounded-full animate-spin mb-4" />
          <h2 className="text-[18px] font-bold text-[#222325]">Loading service details...</h2>
        </div>
        <Footer />
      </div>
    );
  }

  if (serviceError || !service) {
    return (
      <div className="min-h-screen bg-white font-sans text-[#222325]">
        <Header />
        <div className="flex flex-col items-center justify-center py-48">
          <h2 className="text-[24px] font-bold text-[#222325] mb-6">Service not found</h2>
          <button onClick={() => navigate("/services")} className="px-6 py-3 bg-[#c9a84c] text-white font-bold rounded-lg hover:bg-[#b8963e] transition-colors">
            Back to Services
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const siblingServices = [
    "Roof Repair Pros",
    service.name,
    "Premier Roof Maintenance",
    "Sky Shield Roofing",
    "Elevate Roof Solutions",
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-[#222325]">
      <Header />
      
      {/* Main Container */}
      <main className="max-w-[1440px] mx-auto px-6 pt-32 pb-16">
        
        {/* Breadcrumbs */}
        <div className="text-[14px] text-[#74767e] mb-8 flex items-center gap-2">
          <Link to="/" className="hover:underline">Home</Link>
          <span>/</span>
          <Link to="/services" className="hover:underline">Services</Link>
          <span>/</span>
          <Link to="/services" className="hover:underline">{service.category}</Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
          
          {/* ── LEFT COLUMN ── */}
          <div className="w-full lg:w-[60%] flex flex-col">
            
            {/* Title */}
            <h1 className="text-[28px] md:text-[36px] font-black leading-[1.3] text-[#222325] mb-6">
              {service.name}
            </h1>

            {/* Provider Info Row */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#f5f5f5] flex items-center justify-center text-[13px] font-bold text-[#404145] shadow-sm">
                  {service.providerAvatar}
                </div>
                <span className="text-[16px] font-bold text-[#222325] hover:underline cursor-pointer">{service.provider}</span>
                <span className="text-[14px] text-[#c9a84c] font-bold ml-1">{service.providerTier}</span>
              </div>
              <div className="w-px h-5 bg-[#e4e5e7] hidden sm:block"></div>
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-1 text-[#c9a84c]">
                   <Star size={18} className="fill-[#c9a84c]" />
                   <Star size={18} className="fill-[#c9a84c]" />
                   <Star size={18} className="fill-[#c9a84c]" />
                   <Star size={18} className="fill-[#c9a84c]" />
                   <Star size={18} className="fill-[#c9a84c]" />
                </div>
                <span className="text-[15px] font-bold text-[#c9a84c] ml-1">{service.rating.toFixed(1)}</span>
                <span className="text-[15px] text-[#74767e] hover:underline cursor-pointer">
                  ({service.reviews > 0 ? service.reviews : '1k+'} reviews)
                </span>
              </div>
            </div>

            {/* Main Image */}
            <div className="w-full aspect-video rounded-xl overflow-hidden mb-12 border border-[#e4e5e7]">
              <img src={service.image} alt={service.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>

            {/* About Section */}
            <div className="mb-12 border-b border-[#e4e5e7] pb-12">
              <h2 className="text-[22px] font-bold text-[#222325] mb-6">About this service</h2>
              <div className="text-[16px] leading-relaxed text-[#404145] space-y-4">
                <p>{service.longDescription || service.description || "No detailed description provided for this service yet."}</p>
                <p>We pride ourselves on providing top-tier service tailored perfectly to your requirements. Our certified professionals ensure that everything is executed seamlessly from start to finish.</p>
              </div>
              
              <ul className="mt-8 space-y-4">
                <li className="flex items-start gap-3 text-[16px] text-[#404145]">
                  <Check size={20} className="text-[#c9a84c] flex-shrink-0 mt-0.5" />
                  <span>Comprehensive consultation and assessment</span>
                </li>
                <li className="flex items-start gap-3 text-[16px] text-[#404145]">
                  <Check size={20} className="text-[#c9a84c] flex-shrink-0 mt-0.5" />
                  <span>High quality materials and professional equipment</span>
                </li>
                <li className="flex items-start gap-3 text-[16px] text-[#404145]">
                  <Check size={20} className="text-[#c9a84c] flex-shrink-0 mt-0.5" />
                  <span>Post-service cleanup and quality assurance</span>
                </li>
              </ul>
            </div>

            {/* Reviews Section Placeholder */}
            <div>
              <h2 className="text-[22px] font-bold text-[#222325] mb-6">What people loved about this seller</h2>
              {reviewsList.length > 0 ? (
                <div className="space-y-6">
                  {reviewsList.map((rev) => (
                    <div key={rev.id} className="border-b border-[#e4e5e7] pb-6">
                      <div className="flex items-center gap-3 mb-3">
                         <div className="w-10 h-10 rounded-full bg-[#f5f5f5] flex items-center justify-center font-bold text-[#404145]">
                           {rev.avatar}
                         </div>
                         <div>
                           <div className="font-bold text-[#222325]">{rev.author}</div>
                           <div className="flex items-center gap-2">
                              <Star size={12} className="fill-[#c9a84c] text-[#c9a84c]" />
                              <span className="text-[13px] font-bold text-[#c9a84c]">{rev.rating.toFixed(1)}</span>
                              <span className="text-[12px] text-[#74767e]">{rev.date}</span>
                           </div>
                         </div>
                      </div>
                      <p className="text-[#404145] leading-relaxed text-[15px]">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[#74767e] italic">No reviews yet for this service.</p>
              )}
            </div>

          </div>

          {/* ── RIGHT COLUMN (Sticky Sidebar) ── */}
          <div className="w-full lg:w-[40%] flex flex-col gap-6 sticky top-[100px]">
            
            {/* Actions */}
            <div className="flex items-center justify-end gap-5 mb-2">
              <button className="flex items-center gap-2 text-[15px] font-bold text-[#74767e] hover:text-[#c9a84c] transition-colors">
                <Heart size={18} /> Save
              </button>
              <button className="flex items-center gap-2 text-[15px] font-bold text-[#74767e] hover:text-[#c9a84c] transition-colors">
                <Share2 size={18} /> Share
              </button>
            </div>

            {/* Pricing Card */}
            <div className="border border-[#e4e5e7] rounded-[12px] bg-white overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
              {/* Header */}
              <div className="bg-[#fafafa] border-b border-[#e4e5e7] px-6 py-4 flex justify-between items-center">
                 <h3 className="text-[16px] font-bold text-[#222325] uppercase tracking-wider">Service Booking</h3>
                 <span className="text-[26px] font-normal text-[#222325]">US${service.price}</span>
              </div>
              
              <div className="p-6">
                <h4 className="font-bold text-[16px] text-[#222325] mb-2">Standard Package</h4>
                <p className="text-[15px] text-[#74767e] mb-6 leading-relaxed">
                  {service.description || "Complete execution of the requested service by our verified professional."}
                </p>

                <div className="flex items-center gap-4 text-[14px] font-bold text-[#404145] mb-6">
                  <div className="flex items-center gap-2">
                    <Clock size={18} className="text-[#c9a84c]" />
                    <span>Flexible Schedule</span>
                  </div>
                </div>

                <ul className="space-y-3.5 mb-8">
                  <li className="flex items-center gap-3 text-[14px] text-[#404145]">
                    <Check size={18} className="text-[#c9a84c]" /> Service Guarantee
                  </li>
                  <li className="flex items-center gap-3 text-[14px] text-[#404145]">
                    <Check size={18} className="text-[#c9a84c]" /> Background Checked Pro
                  </li>
                  <li className="flex items-center gap-3 text-[14px] text-[#404145]">
                    <Check size={18} className="text-[#c9a84c]" /> Secure Online Payment
                  </li>
                </ul>

                <button 
                  onClick={() => setShowBookingModal(true)}
                  className="w-full py-3.5 bg-[#c9a84c] text-white text-[16px] font-bold rounded-lg hover:bg-[#b8963e] transition-colors flex items-center justify-center gap-2"
                >
                  Continue <ArrowRight size={18} />
                </button>
                
                <p className="text-center text-[13px] text-[#74767e] mt-4 font-medium">You won't be charged yet</p>
              </div>
            </div>

            {/* Related Services */}
            <div className="border border-[#e4e5e7] rounded-[12px] bg-white overflow-hidden">
              <h4 className="text-[16px] font-bold text-[#222325] px-6 py-4 border-b border-[#e4e5e7] bg-[#fafafa]">
                Related Services
              </h4>
              <ul className="flex flex-col">
                {siblingServices.map((svc, idx) => {
                  const isActive = svc === service.name;
                  return (
                    <li key={idx} className={`px-6 py-3.5 border-b border-[#e4e5e7] last:border-0 cursor-pointer transition-colors flex items-center justify-between ${isActive ? "bg-[#c9a84c] text-white font-bold" : "text-[#404145] hover:bg-[#f5f5f5]"}`}>
                      <span className="text-[14px] truncate">{svc}</span>
                      <ChevronRight size={16} className={isActive ? "text-white" : "text-[#c5c6c9]"} />
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Support / Company Details */}
            <div className="border border-[#e4e5e7] rounded-[12px] bg-white overflow-hidden mt-2">
              <div className="flex flex-col">
                <div className="p-5 border-b border-[#e4e5e7] hover:bg-[#f5f5f5] cursor-pointer transition-colors flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-full bg-[#fffcf5] border border-[#f0e6ce] flex items-center justify-center text-[#c9a84c] flex-shrink-0">
                    <FileText size={18} />
                  </div>
                  <div>
                    <span className="block text-[14px] font-bold text-[#222325] mb-0.5">Download Brochure</span>
                    <span className="block text-[13px] text-[#74767e]">Get all details in a PDF</span>
                  </div>
                </div>
                <div className="p-5 hover:bg-[#f5f5f5] cursor-pointer transition-colors flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-full bg-[#fffcf5] border border-[#f0e6ce] flex items-center justify-center text-[#c9a84c] flex-shrink-0">
                    <Building2 size={18} />
                  </div>
                  <div>
                    <span className="block text-[14px] font-bold text-[#222325] mb-0.5">View Provider Profile</span>
                    <span className="block text-[13px] text-[#74767e]">See everything they offer</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
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

export default ServiceDetail;