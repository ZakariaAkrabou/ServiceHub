import React, { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/client/Header";
import Footer from "../../../components/client/Footer";
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
      style={style}
      className="
        group relative w-full h-85 overflow-hidden rounded-2xl cursor-pointer anim-fade-up
        bg-black transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl
      "
    >
      {/* Full bleed photo */}
      <img
        src={service.image}
        alt={service.name}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Dark gradient overlay — heavy at bottom */}
      <div className="absolute inset-0 bg-linear-to-t from-[#0a0e1c]/95 via-[#0a0e1c]/45 to-[#0a0e1c]/10" />

      {/* Rating pill — top left */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-white/92 px-3 py-1 text-[11px] font-bold text-[#1A1A2E] backdrop-blur-sm">
        <Star size={12} className="fill-[#C9A84C] text-[#C9A84C]" />
        <span>{service.rating.toFixed(1)}</span>
        <span className="text-black/30">•</span>
        <span className="text-black/50 font-semibold">
          {service.reviews} Reviews
        </span>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
        {/* Category label */}
        <div className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1">
          {service.category}
        </div>

        {/* Big title */}
        <div className="text-[20px] font-black leading-tight text-white mb-2">
          {service.subCategory && service.subCategory !== "Popular Bookings"
            ? service.subCategory
            : service.category}
        </div>

        {/* Description */}
        <p className="text-[11.5px] leading-relaxed text-white/70 line-clamp-2 mb-3">
          {service.description}
        </p>

        {/* Footer row */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-white">
            Explore Now →
          </span>
          <span className="text-[13px] font-black text-white">
            ${service.price}
          </span>
        </div>

        {/* Animated gold underline */}
        <div className="mt-2 h-0.5 w-9 bg-white/40 group-hover:bg-[#C9A84C] group-hover:w-12 transition-all duration-300 rounded-full" />
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let W = (canvas.width = canvas.offsetWidth);
    let H = (canvas.height = canvas.offsetHeight);

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.5 + 0.1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${p.alpha})`;
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

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
    <div
      className="services-page-nav min-h-screen bg-[#F5F0E8]/20 font-sans antialiased text-[#1A1A2E] 
      [&_.header-container]:bg-white/95 
      [&_.header-container]:backdrop-blur-md 
      [&_.header-container]:-webkit-backdrop-filter:blur(12px) 
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

        .ccw__canvas { position: absolute; inset: 0; width: 100%; height: 100%; pointer-events: none; }

        .ccw__grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px);
          background-size: 80px 80px;
          pointer-events: none;
        }

        .ccw__blob { position: absolute; border-radius: 50%; filter: blur(100px); pointer-events: none; }
        .ccw__blob--1 {
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(201,168,76,0.18) 0%, transparent 70%);
          top: -140px; right: -120px;
          animation: blobFloat1 9s ease-in-out infinite alternate;
        }
        .ccw__blob--2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, rgba(0,140,255,0.12) 0%, transparent 70%);
          bottom: -60px; left: -80px;
          animation: blobFloat2 12s ease-in-out infinite alternate;
        }
        @keyframes blobFloat1 { from { transform: translate(0,0) scale(1); } to { transform: translate(30px,-40px) scale(1.08); } }
        @keyframes blobFloat2 { from { transform: translate(0,0) scale(1); } to { transform: translate(-20px,30px) scale(1.05); } }

        .services-page-nav, 
        .services-page-nav *, 
        .services-page-nav button, 
        .services-page-nav input, 
        .services-page-nav span, 
        .services-page-nav h1, 
        .services-page-nav h2, 
        .services-page-nav h3,
        .services-page-nav p {
          font-family: "Times New Roman", sans-serif, "Geist", "Geist Placeholder", "Inter", "Inter Placeholder", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji" !important;
        }
      `}</style>

      <section className="relative pt-36 pb-12 bg-[#0a1628] border-b border-black/3 overflow-hidden min-h-115 flex flex-col justify-center">
        <canvas ref={canvasRef} className="ccw__canvas" />
        <div className="ccw__grid" />
        <div className="ccw__blob ccw__blob--1" />
        <div className="ccw__blob ccw__blob--2" />

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full text-center flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05] max-w-2xl font-sans mb-8 anim-fade-up">
            Book trusted help <br /> for home tasks
          </h1>

          <div
            className="w-full max-w-xl relative group mb-10 anim-fade-up"
            style={{ animationDelay: "80ms" }}
          >
            <div className="relative flex items-center bg-white/95 backdrop-blur border border-white/20 hover:border-white/40 rounded-full shadow-sm overflow-hidden focus-within:border-white focus-within:ring-2 focus-within:ring-white/20 transition-all">
              <input
                type="text"
                placeholder="What do you need help with?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-6 pr-16 text-sm md:text-base font-semibold text-[#1A1A2E] placeholder-black/35 outline-none bg-transparent"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 bg-[#1A1A2E] text-[#C9A84C] hover:bg-[#C9A84C] hover:text-[#1A1A2E] rounded-full flex items-center justify-center transition cursor-pointer">
                <Search size={18} />
              </button>
            </div>
          </div>

          <div
            className="w-full max-w-5xl overflow-x-auto pb-4 scrollbar-none anim-fade-up"
            style={{ animationDelay: "150ms" }}
          >
            <div className="flex justify-start md:justify-center items-center gap-6 md:gap-10 px-2 shrink-0">
              {mainCategories.map((cat) => {
                const isActive = selectedCategory === cat.value;
                return (
                  <button
                    key={cat.name}
                    onClick={() => handleCategorySelect(cat.value)}
                    className="flex flex-col items-center gap-2 group cursor-pointer shrink-0 transition-all"
                  >
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all ${
                        isActive
                          ? "bg-[#1A1A2E] border-[#1A1A2E] text-[#C9A84C] scale-105 shadow-md shadow-[#1A1A2E]/10"
                          : "bg-white/10 border-white/15 text-white/80 group-hover:border-[#C9A84C]/60 group-hover:text-[#C9A84C] group-hover:bg-white/15"
                      }`}
                    >
                      {cat.icon}
                    </div>

                    <div className="flex flex-col items-center">
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wider transition-colors ${
                          isActive
                            ? "text-white font-extrabold"
                            : "text-white/80 group-hover:text-white"
                        }`}
                      >
                        {cat.name}
                      </span>
                      {isActive && (
                        <div className="h-0.75 w-5 bg-[#C9A84C] rounded mt-1" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div
            className="w-full max-w-3xl overflow-x-auto pt-6 scrollbar-none anim-fade-up"
            style={{ animationDelay: "200ms" }}
          >
            <div className="flex justify-start md:justify-center items-center gap-2.5 shrink-0 px-2">
              {subFilters.map((sub) => {
                const isSubActive = activeSubFilter === sub;
                return (
                  <button
                    key={sub}
                    onClick={() => {
                      setActiveSubFilter(sub);
                      setCurrentPage(1);
                    }}
                    className={`h-9 px-4 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                      isSubActive
                        ? "bg-white border-white text-[#1A1A2E] font-extrabold shadow-sm"
                        : "bg-white/8 border-white/12 text-white/80 hover:bg-white/15 hover:text-white"
                    }`}
                  >
                    {sub}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-black/35 border-b border-black/4 pb-3 mb-10 anim-fade-up">
          <span>
            {filteredServices.length} Services Available{" "}
            {totalPages > 1 && (
              <span className="ml-2 normal-case tracking-normal text-black/30 font-semibold">
                • Page {currentPage} / {totalPages}
              </span>
            )}
          </span>

          {(selectedCategory !== "All" ||
            activeSubFilter !== "All" ||
            searchQuery.trim() !== "") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setActiveSubFilter("All");
                setCurrentPage(1);
              }}
              className="text-[#C9A84C] hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {isLoadingServices ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-black/3 text-center px-4 anim-fade-up">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A2E]">
              Loading services...
            </h3>
          </div>
        ) : hasBlockingError ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-black/3 text-center px-4 anim-fade-up">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A2E]">
              Unable to load services
            </h3>
            <p className="text-sm text-black/45 mt-1 max-w-xs">
              Please refresh and try again.
            </p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-black/3 text-center px-4 anim-fade-up">
            <Search className="text-[#C9A84C] mb-3" size={24} />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A2E]">
              No matches found
            </h3>
            <p className="text-sm text-black/45 mt-1 max-w-xs">
              No services match your active selections. Try choosing other
              categories or search terms.
            </p>
          </div>
        ) : (
          <>
            {/* MEME-STYLE CARDS (like your image) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {paginatedServices.map((service, index) => (
                <ServiceMemeCard
                  key={service.id}
                  service={service}
                  onClick={() => navigate(`/services/${service.id}`)}
                  style={{ animationDelay: `${50 + index * 40}ms` }}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 pb-8 anim-fade-up">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-black/10 text-[13px] font-semibold text-[#1A1A2E] transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-[#F5F0E8] hover:enabled:border-black/20"
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
                      if (page === 2 && currentPage > 3)
                        return (
                          <span key={page} className="text-black/30">
                            ...
                          </span>
                        );
                      if (
                        page === totalPages - 1 &&
                        currentPage < totalPages - 2
                      )
                        return (
                          <span key={page} className="text-black/30">
                            ...
                          </span>
                        );
                      return null;
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-9 h-9 rounded-lg text-[13px] font-bold transition-all ${
                          isActive
                            ? "bg-[#1A1A2E] text-white"
                            : "border border-black/10 text-[#1A1A2E] hover:bg-[#F5F0E8] hover:border-black/20"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg border border-black/10 text-[13px] font-semibold text-[#1A1A2E] transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:bg-[#F5F0E8] hover:enabled:border-black/20"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
      <div className="services-page-nav-footer">
        <Footer />
      </div>
    </div>
  );
};

export default ClientServices;
