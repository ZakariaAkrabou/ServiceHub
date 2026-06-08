import React, { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/client/Header";
import Footer from "../../../components/client/Footer";
import QuestionSection from "./question";
import {
  Search,
  Star,
  Wrench,
  Hammer,
  Truck,
  Sparkle,
  TreePine,
  Construction,
  Paintbrush,
  Flame,
} from "lucide-react";
import {
  useFilterCustomerServicesQuery,
  useGetCustomerAllServicesQuery,
  useSearchCustomerServicesQuery,
  type CustomerService,
} from "../../../app/api/ServiceApi";

export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: string;
  rating: number;
  reviews: number;
  description: string;
  longDescription: string;
  image: string;
  provider: string;
  providerAvatar: string;
  providerTier: string;
  subCategory?: string;
  badges: string[];
}

const mainCategories = [
  { name: "Assembly", icon: <Wrench size={24} />, value: "Technical" },
  { name: "Mounting", icon: <Hammer size={24} />, value: "Repairs" },
  { name: "Moving", icon: <Truck size={24} />, value: "Gardening" },
  { name: "Cleaning", icon: <Sparkle size={24} />, value: "Cleaning" },
  { name: "Outdoor Help", icon: <TreePine size={24} />, value: "Gardening" },
  { name: "Home Repairs", icon: <Construction size={24} />, value: "Repairs" },
  { name: "Painting", icon: <Paintbrush size={24} />, value: "Design" },
  { name: "Trending", icon: <Flame size={24} />, value: "All" },
];

const subCategoryMap: Record<string, string[]> = {
  All: ["All", "Verified Providers Only", "Popular Bookings"],
  Cleaning: [
    "All",
    "Standard Home Clean",
    "Deep Clean",
    "Carpet Clean",
    "Window Wash",
  ],
  Gardening: [
    "All",
    "Lawn Mowing",
    "Hedge Trimming",
    "Garden Weeding",
    "Tree Pruning",
  ],
  Repairs: [
    "All",
    "Leak Repair",
    "Fixture Installation",
    "Furniture Assemble",
    "TV Wall Mount",
  ],
  Technical: [
    "All",
    "Smart Assistant",
    "Router Setup",
    "Camera Install",
    "Device Diagnostic",
  ],
  Design: [
    "All",
    "Wall Painting",
    "Furniture Paint",
    "Wallpaper Install",
    "Consultation",
  ],
};

const getProviderName = (providerId: CustomerService["provider_id"]) => {
  if (!providerId || typeof providerId === "string") return "Service Provider";
  const firstName = providerId.firstName || "";
  const lastName = providerId.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();
  return fullName || providerId.name || "Service Provider";
};

const getInitials = (name: string) => {
  const parts = name.split(" ").filter(Boolean);
  if (parts.length === 0) return "SP";
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
};

export const mapCustomerServiceToItem = (
  service: CustomerService,
): ServiceItem => {
  const provider = getProviderName(service.provider_id);
  const rating = Number(service.rating || 0);

  return {
    id: service._id,
    name: service.name,
    category: service.category,
    price: service.price,
    duration: "Flexible",
    rating,
    reviews: 0,
    description: service.description,
    longDescription: service.description,
    image:
      service.image ||
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80",
    provider,
    providerAvatar: getInitials(provider),
    providerTier: rating >= 4.5 ? "Top Rated" : "Verified Expert",
    badges: ["Verified Provider"],
  };
};

const ServiceMemeCard: React.FC<{
  service: ServiceItem;
  onClick: () => void;
  style?: React.CSSProperties;
}> = ({ service, onClick, style }) => {
  return (
    <div
      onClick={onClick}
      style={{ ...style, background: "var(--surface)", border: "1px solid var(--border)" }}
      className="group flex flex-col w-full h-full cursor-pointer anim-fade-up transition-shadow duration-300 hover:shadow-lg"
    >
      {/* Top Photo */}
      <div className="w-full h-56 overflow-hidden relative">
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-[20px] font-bold mb-3" style={{ color: "var(--red)" }}>
          {service.subCategory && service.subCategory !== "Popular Bookings"
            ? service.subCategory
            : service.category}
        </h3>
        
        <p className="text-[13.5px] leading-relaxed mb-5 line-clamp-3" style={{ color: "var(--text-muted)" }}>
          {service.description}
        </p>
        
        <div className="mt-auto pt-2">
          <button 
            className="text-white text-[13.5px] font-bold py-2.5 px-6 transition-transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            style={{ background: "var(--red)" }}
          >
            Read More
          </button>
        </div>
      </div>
    </div>
  );
};

const ClientServices: React.FC = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeSubFilter, setActiveSubFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const isSearchActive = searchQuery.trim().length > 0;
  const isFilterActive =
    selectedCategory !== "All" || activeSubFilter !== "All";

  const filterParams = useMemo(() => {
    const params: {
      category?: string;
      rating?: number;
      availability?: string;
    } = {};

    if (selectedCategory !== "All") {
      params.category = selectedCategory;
    }

    if (activeSubFilter === "Popular Bookings") {
      params.rating = 4;
    }

    if (activeSubFilter === "Verified Providers Only") {
      params.availability = "available";
    }

    return params;
  }, [selectedCategory, activeSubFilter]);

  const {
    data: allServicesData,
    isLoading: isAllServicesLoading,
    isFetching: isAllServicesFetching,
    error: allServicesError,
  } = useGetCustomerAllServicesQuery(
    { page: 1, limit: 100 },
    { skip: isSearchActive || isFilterActive },
  );

  const {
    data: searchedServicesData,
    isLoading: isSearchLoading,
    isFetching: isSearchFetching,
    error: searchError,
  } = useSearchCustomerServicesQuery(
    { keyword: searchQuery.trim() },
    { skip: !isSearchActive },
  );

  const {
    data: filteredServicesData,
    isLoading: isFilterLoading,
    isFetching: isFilterFetching,
    error: filterError,
  } = useFilterCustomerServicesQuery(filterParams, {
    skip: !isFilterActive || isSearchActive,
  });

  const itemsPerPage = 6;

  // Canvas animation removed for new hero layout

  // reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, activeSubFilter]);

  const activeApiServices = useMemo(() => {
    if (isSearchActive) return searchedServicesData?.data || [];
    if (isFilterActive) return filteredServicesData?.data || [];
    return allServicesData?.data || [];
  }, [
    isSearchActive,
    isFilterActive,
    searchedServicesData?.data,
    filteredServicesData?.data,
    allServicesData?.data,
  ]);

  const isSearchNotFound =
    isSearchActive &&
    !!searchError &&
    typeof searchError === "object" &&
    "status" in searchError &&
    Number(searchError.status) === 404;

  const hasBlockingError =
    (!isSearchActive && !!allServicesError) ||
    (!isSearchActive && isFilterActive && !!filterError) ||
    (isSearchActive && !!searchError && !isSearchNotFound);

  const isLoadingServices =
    (isSearchActive && (isSearchLoading || isSearchFetching)) ||
    (!isSearchActive &&
      isFilterActive &&
      (isFilterLoading || isFilterFetching)) ||
    (!isSearchActive &&
      !isFilterActive &&
      (isAllServicesLoading || isAllServicesFetching));

  const filteredServices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const sourceServices = activeApiServices.map(mapCustomerServiceToItem);

    return sourceServices.filter((service) => {
      const matchesSearch =
        q.length === 0 ||
        service.name.toLowerCase().includes(q) ||
        service.description.toLowerCase().includes(q);

      const matchesCategory =
        selectedCategory === "All" || service.category === selectedCategory;

      const matchesSubFilter = (() => {
        if (activeSubFilter === "All") return true;

        if (activeSubFilter === "Verified Providers Only") {
          const tier = service.providerTier.toLowerCase();
          const hasVerifiedTier = tier.includes("verified");
          const hasVerifiedBadge = service.badges.some((b) =>
            b.toLowerCase().includes("verified"),
          );
          const hasLicensedBadge = service.badges.some((b) =>
            b.toLowerCase().includes("licensed"),
          );
          return hasVerifiedTier || hasVerifiedBadge || hasLicensedBadge;
        }

        if (activeSubFilter === "Popular Bookings") {
          return (
            service.reviews >= 100 ||
            service.subCategory === "Popular Bookings" ||
            service.badges.some((b) => b.toLowerCase().includes("top rated"))
          );
        }

        return service.subCategory === activeSubFilter;
      })();

      return matchesSearch && matchesCategory && matchesSubFilter;
    });
  }, [searchQuery, selectedCategory, activeSubFilter, activeApiServices]);

  const handleCategorySelect = (value: string) => {
    setSelectedCategory(value);
    setActiveSubFilter("All");
    setCurrentPage(1);
  };

  const subFilters = subCategoryMap[selectedCategory] || subCategoryMap["All"];

  // Pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedServices = filteredServices.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

  return (
    <div className="services-page-nav min-h-screen bg-[#F5F0E8]/20 font-sans antialiased text-[#1A1A2E]" style={{ background: "var(--bg)" }}>
      <Header />

      <style>{`
        :root {
          --font-main: "DM Sans", "Inter", sans-serif;
          --bg:       #fcfcfc;
          --surface:  #ffffff;
          --text:     #1a1a2e;
          --text-muted: #6b7280;
          --border:   #eaedf1;
          --red:      #c9a84c;
          --red-dark: #b8963e;
        }

        @keyframes pageFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-fade-up { animation: pageFadeUp 0.65s cubic-bezier(0.16, 1, 0.3, 1) both; }

        .services-page-nav, 
        .services-page-nav *, 
        .services-page-nav button, 
        .services-page-nav input, 
        .services-page-nav span, 
        .services-page-nav h1, 
        .services-page-nav h2, 
        .services-page-nav h3,
        .services-page-nav p {
          font-family: var(--font-main) !important;
        }
      `}</style>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-24 overflow-hidden flex flex-col justify-center items-center text-center min-h-[340px]">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80" 
          alt="Banner" 
          className="absolute inset-0 w-full h-full object-cover z-0" 
        />
        <div className="relative z-20 flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-wider mb-5">
            OUR SERVICES
          </h1>
          <div className="text-[14px] font-bold flex gap-2 justify-center tracking-widest">
            <span className="text-white">Home</span>
            <span style={{ color: "var(--red)" }}>/</span>
            <span style={{ color: "var(--red)" }}>Our Services</span>
          </div>
        </div>
      </section>

      {/* MAIN LAYOUT */}
      <section className="max-w-7xl mx-auto px-6 py-16 flex flex-col lg:flex-row gap-12">
        
        {/* LEFT SIDEBAR (Categories) */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-3">
          {/* Top Arrow Button */}
          <button 
            className="flex items-center justify-center w-full py-3 transition-all bg-white border cursor-pointer hover:bg-gray-50" 
            style={{ borderColor: "var(--red)" }}
          >
             <span style={{ color: "var(--text-muted)", fontSize: "16px" }}>&larr;</span>
          </button>
          
          {mainCategories.map((cat) => {
            const isActive = selectedCategory === cat.value;
            return (
              <button
                key={cat.name}
                onClick={() => handleCategorySelect(cat.value)}
                className="w-full text-center px-5 py-3.5 border transition-all cursor-pointer font-bold text-[14.5px]"
                style={{ 
                  borderColor: "var(--red)",
                  background: isActive ? "var(--red)" : "white",
                  color: isActive ? "white" : "var(--text-muted)"
                }}
              >
                {cat.name}
              </button>
            );
          })}
          
          {/* Bottom Arrow Button */}
          <button 
            className="flex items-center justify-center w-full py-3 transition-all bg-white border cursor-pointer hover:bg-gray-50" 
            style={{ borderColor: "var(--red)" }}
          >
             <span style={{ color: "var(--text-muted)", fontSize: "16px" }}>&rarr;</span>
          </button>
        </div>

        {/* RIGHT CONTENT AREA */}
        <div className="flex-1 flex flex-col">
          {/* Header Texts */}
          <div className="text-center mb-12 flex flex-col items-center">
            <h3 className="font-bold tracking-widest uppercase mb-3 text-[13px]" style={{ color: "var(--red)" }}>
              OUR SERVICES
            </h3>
            <h2 className="text-3xl md:text-4xl lg:text-[40px] leading-tight font-black mb-5" style={{ color: "var(--text)" }}>
              Reliable Solutions for All Your Transport Needs
            </h2>
            <p className="text-[14.5px] max-w-3xl leading-relaxed" style={{ color: "var(--text-muted)" }}>
              We offer a wide range of logistics and transportation services designed to streamline your supply chain. 
              From freight forwarding to last-mile delivery, our expert team ensures your goods reach their destination 
              safely, efficiently, and on time.
            </p>
          </div>

          {/* Sub Filters & Search */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
             <div className="flex flex-wrap justify-center items-center gap-2">
              {subFilters.map((sub) => {
                const isSubActive = activeSubFilter === sub;
                return (
                  <button
                    key={sub}
                    onClick={() => {
                      setActiveSubFilter(sub);
                      setCurrentPage(1);
                    }}
                    className="h-10 px-5 rounded-full text-[13px] font-bold transition-all shrink-0 cursor-pointer border"
                    style={{ 
                      borderColor: isSubActive ? "var(--red)" : "var(--border)",
                      background: isSubActive ? "var(--red)" : "var(--surface)",
                      color: isSubActive ? "white" : "var(--text-muted)"
                    }}
                  >
                    {sub}
                  </button>
                );
              })}
             </div>
             
             {/* Search Bar */}
             <div className="relative w-full md:w-72 shrink-0">
               <input
                 type="text"
                 placeholder="Search services..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full h-11 pl-5 pr-10 text-[14px] border outline-none rounded-full transition-colors focus:border-gray-400"
                 style={{ borderColor: "var(--border)", color: "var(--text)", background: "var(--surface)" }}
               />
               <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
             </div>
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest border-b pb-4 mb-8 anim-fade-up" style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}>
            <span>
              {filteredServices.length} Services Available
              {totalPages > 1 && (
                <span className="ml-2 normal-case tracking-normal font-semibold opacity-60">
                  • Page {currentPage} / {totalPages}
                </span>
              )}
            </span>

            {(selectedCategory !== "All" || activeSubFilter !== "All" || searchQuery.trim() !== "") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                  setActiveSubFilter("All");
                  setCurrentPage(1);
                }}
                className="hover:underline cursor-pointer"
                style={{ color: "var(--red)" }}
              >
                Reset Filters
              </button>
            )}
          </div>

          {isLoadingServices ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white border rounded-2xl text-center px-4 anim-fade-up" style={{ borderColor: "var(--border)" }}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A2E]">Loading services...</h3>
            </div>
          ) : hasBlockingError ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white border rounded-2xl text-center px-4 anim-fade-up" style={{ borderColor: "var(--border)" }}>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A2E]">Unable to load services</h3>
              <p className="text-sm text-black/45 mt-1 max-w-xs">Please refresh and try again.</p>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-white border rounded-2xl text-center px-4 anim-fade-up" style={{ borderColor: "var(--border)" }}>
              <Search className="mb-4" size={28} style={{ color: "var(--red)" }} />
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A2E]">No matches found</h3>
              <p className="text-sm mt-2 max-w-xs" style={{ color: "var(--text-muted)" }}>
                No services match your active selections. Try choosing other categories or search terms.
              </p>
            </div>
          ) : (
            <>
              {/* SERVICE CARDS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
                {paginatedServices.map((service, index) => (
                  <ServiceMemeCard
                    key={service.id}
                    service={service}
                    onClick={() => navigate(`/services/${service.id}`)}
                    style={{ animationDelay: `${50 + index * 40}ms` }}
                  />
                ))}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 pb-8 anim-fade-up">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-5 py-2.5 rounded border text-[13px] font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-gray-50"
                    style={{ borderColor: "var(--border)", color: "var(--text)" }}
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-2">
                    {[...Array(totalPages)].map((_, idx) => {
                      const page = idx + 1;
                      const isActive = page === currentPage;
                      const isVisible =
                        Math.abs(page - currentPage) <= 1 ||
                        page === 1 ||
                        page === totalPages;

                      if (!isVisible) {
                        if (page === 2 && currentPage > 3) return <span key={page} style={{ color: "var(--text-muted)" }}>...</span>;
                        if (page === totalPages - 1 && currentPage < totalPages - 2) return <span key={page} style={{ color: "var(--text-muted)" }}>...</span>;
                        return null;
                      }

                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className="w-10 h-10 rounded text-[14px] font-bold transition-all flex items-center justify-center border"
                          style={{
                            borderColor: isActive ? "var(--text)" : "var(--border)",
                            background: isActive ? "var(--text)" : "transparent",
                            color: isActive ? "white" : "var(--text)"
                          }}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-5 py-2.5 rounded border text-[13px] font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-gray-50"
                    style={{ borderColor: "var(--border)", color: "var(--text)" }}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <QuestionSection />
      <div className="services-page-nav-footer">
        <Footer />
      </div>
    </div>
  );
};

export default ClientServices;
