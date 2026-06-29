import React, { useState, useMemo } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store/store";
import {
  Star,
  Check,
  Clock,
  ArrowRight,
  FileText,
  Building2,
  Heart,
  ChevronRight,
  Share2,
  Trash2,
  MoreVertical,
  Edit2
} from "lucide-react";
import Header from "../../../components/client/Header";
import Footer from "../../../components/client/Footer";
import {
  useGetCustomerServiceByIdQuery,
  useGetCustomerServiceReviewsQuery,
  useCreateCustomerServiceReviewMutation,
  useDeleteCustomerServiceReviewMutation,
  useUpdateCustomerServiceReviewMutation,
} from "../../../app/api/ServiceApi";
import { useGetCustomerBookingsQuery } from "../../../app/api/BookingApi";
import { mapCustomerServiceToItem, type ServiceItem } from "./services";
import CreateBooking from "../booking/createBooking";
import { toast } from "react-toastify";

interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  customerId: string;
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
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  const handleBookingClick = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location.pathname } });
      return;
    }
    setShowBookingModal(true);
  };

  const {
    data: serviceData,
    isLoading: isServiceLoading,
    isFetching: isServiceFetching,
    error: serviceError,
  } = useGetCustomerServiceByIdQuery(id || "", { skip: !id });

  const { data: serviceReviewsData, isLoading: isReviewsLoading, refetch: refetchReviews } =
    useGetCustomerServiceReviewsQuery(id || "", { skip: !id });

  const { data: bookingsData } = useGetCustomerBookingsQuery(undefined, { skip: !isAuthenticated });

  const [submitReview, { isLoading: isSubmittingReview }] = useCreateCustomerServiceReviewMutation();
  const [deleteReview] = useDeleteCustomerServiceReviewMutation();
  const [updateReview, { isLoading: isUpdatingReview }] = useUpdateCustomerServiceReviewMutation();

  const completedBooking = useMemo(() => {
    if (!bookingsData || !id) return null;
    // Find a booking for this service that is completed
    return bookingsData.data.find(
      (b) => b.service_id?._id === id && b.status === "completed"
    );
  }, [bookingsData, id]);

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
        customerId: String(
          typeof review.customer_id === "object" && review.customer_id !== null
            ? (review.customer_id as { _id: string })._id || review.customer_id
            : review.customer_id
        ),
      };
    });
  }, [serviceReviewsData]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingReviewId) {
        await updateReview({
          reviewId: editingReviewId,
          rating: userRating,
          review: reviewText,
        }).unwrap();
        toast.success("Review updated successfully!");
        setEditingReviewId(null);
      } else {
        if (!completedBooking) return;
        await submitReview({
          booking_id: completedBooking._id,
          rating: userRating,
          review: reviewText,
        }).unwrap();
        toast.success("Review submitted successfully!");
      }
      setReviewText("");
      setUserRating(5);
      refetchReviews();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to save review.");
    }
  };

  const executeDelete = async (reviewId: string) => {
    try {
      await deleteReview(reviewId).unwrap();
      toast.success("Review deleted successfully!");
      refetchReviews();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to delete review.");
    }
  };

  const handleDeleteClick = (reviewId: string) => {
    setActiveDropdown(null);
    toast(
      (t) => (
        <div>
          <p className="font-bold text-[#222325] mb-3">Delete this review?</p>
          <div className="flex gap-2">
            <button
              className="px-4 py-1.5 bg-red-500 text-white rounded-md text-sm font-bold"
              onClick={() => {
                executeDelete(reviewId);
                toast.dismiss(t.toastProps.toastId);
              }}
            >
              Delete
            </button>
            <button
              className="px-4 py-1.5 bg-[#e4e5e7] text-[#222325] rounded-md text-sm font-bold"
              onClick={() => toast.dismiss(t.toastProps.toastId)}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { autoClose: false, closeOnClick: false }
    );
  };

  const handleEditClick = (review: Review) => {
    setActiveDropdown(null);
    setEditingReviewId(review.id);
    setUserRating(review.rating);
    setReviewText(review.comment);
    window.scrollTo({ top: document.body.scrollHeight / 2, behavior: "smooth" });
  };

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
            </div>

            {/* Reviews Section */}
            <div className="mb-12">
              <h2 className="text-[22px] font-bold text-[#222325] mb-8">Reviews</h2>
              {/* Review Input */}
              {(completedBooking || editingReviewId) && (
                <form onSubmit={handleReviewSubmit} className="mb-10 bg-[#fbfbfb] p-6 rounded-xl border border-[#e4e5e7]">
                  <h3 className="text-[16px] font-bold mb-4">{editingReviewId ? "Edit your review" : "Leave a review"}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={24} className={`cursor-pointer ${star <= userRating ? "fill-[#c9a84c] text-[#c9a84c]" : "text-[#d1d1d1]"}`} onClick={() => setUserRating(star)} />
                    ))}
                  </div>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full p-3 border border-[#e4e5e7] rounded-lg mb-4 focus:ring-2 focus:ring-[#c9a84c] outline-none"
                    placeholder="Tell others about your experience..."
                    rows={3}
                  />
                  <div className="flex gap-3">
                    <button type="submit" disabled={isSubmittingReview || isUpdatingReview} className="px-6 py-2 bg-[#c9a84c] text-white rounded-lg font-bold hover:bg-[#b8963e] transition-colors disabled:opacity-50">
                      {isSubmittingReview || isUpdatingReview ? "Saving..." : "Save Review"}
                    </button>
                    {editingReviewId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingReviewId(null);
                          setReviewText("");
                          setUserRating(5);
                        }}
                        className="px-6 py-2 bg-[#e4e5e7] text-[#222325] rounded-lg font-bold hover:bg-[#d1d1d1] transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              )}
              {/* Reviews List */}
              <div className="space-y-8">
                {reviewsList.map((review) => (
                  <div key={review.id} className="flex gap-4 border-b border-[#e4e5e7] pb-8 last:border-0 relative">
                    <div className="w-10 h-10 rounded-full bg-[#f5f5f5] flex items-center justify-center font-bold text-[#404145] flex-shrink-0">
                      {review.avatar}
                    </div>
                    <div className="w-full">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-[15px]">{review.author}</span>
                        <span className="text-[#74767e] text-[13px]">{review.date}</span>
                      </div>
                      <div className="flex gap-0.5 mb-2 text-[#c9a84c]">
                        {[...Array(5)].map((_, i) => <Star key={i} size={14} className={i < review.rating ? "fill-[#c9a84c]" : ""} />)}
                      </div>
                      <p className="text-[#404145] text-[15px] pr-8">{review.comment}</p>
                    </div>
                    {user && review.customerId === user._id && (
                      <div className="absolute top-0 right-0">
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === review.id ? null : review.id)}
                          className="p-1.5 text-[#74767e] hover:bg-[#f5f5f5] rounded-md transition-colors"
                        >
                          <MoreVertical size={18} />
                        </button>
                        {activeDropdown === review.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
                            <div className="absolute right-0 top-8 w-32 bg-white rounded-lg shadow-lg border border-[#e4e5e7] py-1 z-20">
                              <button
                                onClick={() => handleEditClick(review)}
                                className="w-full text-left px-4 py-2 text-sm text-[#404145] hover:bg-[#f5f5f5] flex items-center gap-2"
                              >
                                <Edit2 size={14} /> Edit
                              </button>
                              <button
                                onClick={() => handleDeleteClick(review.id)}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-[#f5f5f5] flex items-center gap-2"
                              >
                                <Trash2 size={14} /> Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
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
                  onClick={handleBookingClick}
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