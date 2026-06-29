import React, { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/client/Header";
import Footer from "../../../components/client/Footer";
import QuestionSection from "./question";
import {
  Search,
  Star,
  ChevronDown,
  PlayCircle,
  X,
} from "lucide-react";
import {
  useFilterCustomerServicesQuery,
  useGetCustomerAllServicesQuery,
  useSearchCustomerServicesQuery,
  useGetCustomerServiceReviewsQuery,
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

type SortOption = "best_selling" | "highest_rated" | "price_low" | "price_high";

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

// eslint-disable-next-line react-refresh/only-export-components
export const mapCustomerServiceToItem: (service: CustomerService) => ServiceItem = (service) => {
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

/* ── Budget Dropdown (price range slider) ────────────────────── */
const PRICE_MIN = 0;
const PRICE_MAX = 1000;

const BudgetDropdown: React.FC<{
  minPrice: string;
  maxPrice: string;
  onApply: (min: string, max: string) => void;
  onClear: () => void;
}> = ({ minPrice, maxPrice, onApply, onClear }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localMin, setLocalMin] = useState(minPrice !== "" ? Number(minPrice) : PRICE_MIN);
  const [localMax, setLocalMax] = useState(maxPrice !== "" ? Number(maxPrice) : PRICE_MAX);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Sync when parent clears
  useEffect(() => { setLocalMin(minPrice !== "" ? Number(minPrice) : PRICE_MIN); }, [minPrice]);
  useEffect(() => { setLocalMax(maxPrice !== "" ? Number(maxPrice) : PRICE_MAX); }, [maxPrice]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = minPrice !== "" || maxPrice !== "";
  const label = isActive ? `${minPrice} MAD – ${maxPrice || PRICE_MAX} MAD` : "Budget";

  const minPct = ((localMin - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  const maxPct = ((localMax - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;

  const handleMinChange = (v: number) => {
    setLocalMin(Math.min(v, localMax - 1));
  };
  const handleMaxChange = (v: number) => {
    setLocalMax(Math.max(v, localMin + 1));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-4 py-2 border rounded-lg text-[15px] font-semibold flex items-center gap-2 transition-colors ${
          isOpen || isActive
            ? "border-[#222325] bg-[#f5f5f5] text-[#222325]"
            : "border-[#c5c6c9] hover:border-[#222325] text-[#222325]"
        }`}
      >
        {label}
        {isActive ? (
          <X
            size={14}
            onClick={(e) => {
              e.stopPropagation();
              onClear();
              setLocalMin(PRICE_MIN);
              setLocalMax(PRICE_MAX);
            }}
            className="text-[#74767e] hover:text-[#222325] cursor-pointer"
          />
        ) : (
          <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 shadow-xl rounded-xl w-72 z-30 p-5">
          <p className="text-[13px] font-bold text-[#74767e] uppercase tracking-wider mb-1">Price Range</p>

          {/* Price labels */}
          <div className="flex justify-between mb-4">
            <span className="text-[15px] font-bold text-[#222325]">{localMin} MAD</span>
            <span className="text-[15px] font-bold text-[#222325]">{localMax}{localMax === PRICE_MAX ? "+" : ""} MAD</span>
          </div>

          {/* Dual range slider */}
          <div className="relative h-5 mb-6" ref={trackRef}>
            {/* Track background */}
            <div className="absolute top-1/2 -translate-y-1/2 w-full h-1.5 bg-[#e4e5e7] rounded-full" />
            {/* Active fill between thumbs */}
            <div
              className="absolute top-1/2 -translate-y-1/2 h-1.5 bg-[#222325] rounded-full"
              style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }}
            />
            {/* Min thumb */}
            <input
              type="range"
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={5}
              value={localMin}
              onChange={(e) => handleMinChange(Number(e.target.value))}
              className="absolute w-full h-full opacity-0 cursor-pointer"
              style={{ zIndex: localMin > PRICE_MAX - 50 ? 5 : 3 }}
            />
            {/* Max thumb */}
            <input
              type="range"
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={5}
              value={localMax}
              onChange={(e) => handleMaxChange(Number(e.target.value))}
              className="absolute w-full h-full opacity-0 cursor-pointer"
              style={{ zIndex: 4 }}
            />
            {/* Visual min thumb */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#222325] rounded-full shadow pointer-events-none"
              style={{ left: `calc(${minPct}% - 8px)` }}
            />
            {/* Visual max thumb */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white border-2 border-[#222325] rounded-full shadow pointer-events-none"
              style={{ left: `calc(${maxPct}% - 8px)` }}
            />
          </div>



          <div className="flex gap-2">
            <button
              onClick={() => {
                onClear();
                setLocalMin(PRICE_MIN);
                setLocalMax(PRICE_MAX);
                setIsOpen(false);
              }}
              className="flex-1 py-2 text-[14px] font-semibold border border-[#e4e5e7] rounded-lg hover:bg-[#f5f5f5] transition-colors text-[#404145]"
            >
              Clear
            </button>
            <button
              onClick={() => {
                const min = localMin > PRICE_MIN ? String(localMin) : "";
                const max = localMax < PRICE_MAX ? String(localMax) : "";
                onApply(min, max);
                setIsOpen(false);
              }}
              className="flex-1 py-2 text-[14px] font-bold bg-[#222325] text-white rounded-lg hover:bg-[#404145] transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── Generic Filter Dropdown ─────────────────────────────────── */
const FilterDropdown: React.FC<{
  label: string;
  options: { label: string; value: string }[];
  value: string;
  onChange: (val: string) => void;
}> = ({ label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasSelection = value !== "All" && value !== "";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-4 py-2 border rounded-lg text-[15px] font-semibold flex items-center gap-2 transition-colors ${
          isOpen || hasSelection
            ? "border-[#222325] bg-[#f5f5f5] text-[#222325]"
            : "border-[#c5c6c9] hover:border-[#222325] text-[#222325]"
        }`}
      >
        {label} <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 shadow-xl rounded-lg w-64 z-30 py-2 max-h-80 overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
              className={`w-full text-left px-4 py-2 text-[15px] hover:bg-[#f5f5f5] ${value === opt.value ? "font-bold text-[#222325]" : "text-[#404145]"}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Sort Dropdown ───────────────────────────────────────────── */
const sortLabels: Record<SortOption, string> = {
  best_selling: "Best Selling",
  highest_rated: "Highest Rated",
  price_low: "Price: Low to High",
  price_high: "Price: High to Low",
};

const SortDropdown: React.FC<{
  value: SortOption;
  onChange: (v: SortOption) => void;
}> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="font-bold text-[#222325] flex items-center gap-1 hover:bg-[#f5f5f5] px-2 py-1 rounded-md transition-colors text-[15px]"
      >
        {sortLabels[value]} <ChevronDown size={16} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 shadow-xl rounded-lg w-52 z-30 py-2">
          {(Object.entries(sortLabels) as [SortOption, string][]).map(([k, label]) => (
            <button
              key={k}
              onClick={() => { onChange(k); setIsOpen(false); }}
              className={`w-full text-left px-4 py-2 text-[15px] hover:bg-[#f5f5f5] ${value === k ? "font-bold text-[#222325]" : "text-[#404145]"}`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Review count fetcher per card ───────────────────────────── */
const ServiceRating: React.FC<{ serviceId: string }> = ({ serviceId }) => {
  const { data, isLoading } = useGetCustomerServiceReviewsQuery(serviceId);

  // Only trust the reviews API — never fall back to service.rating
  if (isLoading) {
    return (
      <div className="flex items-center gap-1 mb-4 mt-auto">
        <span className="text-[13px] text-[#c5c6c9] italic">Loading…</span>
      </div>
    );
  }

  const count = data?.count ?? 0;
  const avg = data?.averageRating ?? 0;

  if (count === 0) {
    return (
      <div className="flex items-center gap-1 mb-4 mt-auto">
        <span className="text-[13px] text-[#74767e] italic">No reviews yet</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 mb-4 mt-auto">
      <Star size={15} className="fill-[#222325] text-[#222325]" />
      <span className="text-[15px] font-bold text-[#222325]">{avg.toFixed(1)}</span>
      <span className="text-[15px] text-[#74767e]">({count})</span>
    </div>
  );
};

/* ── Service Card ────────────────────────────────────────────── */
const ServiceMemeCard: React.FC<{
  service: ServiceItem;
  onClick: () => void;
}> = ({ service, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group flex flex-col w-full h-full cursor-pointer transition-all duration-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] border border-transparent rounded-lg overflow-hidden bg-white"
    >
      {/* Top Photo — no heart button */}
      <div className="w-full aspect-4/3 relative rounded-lg overflow-hidden">
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="pt-3 pb-4 px-2 flex flex-col flex-1">
        {/* Seller Info */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold overflow-hidden text-[#404145]">
            {service.providerAvatar}
          </div>
          <span className="text-[15px] font-semibold text-[#222325] hover:underline">{service.provider}</span>
          <span className="text-[13px] text-[#74767e] font-medium ml-1">{service.providerTier || "Verified"}</span>
        </div>

        {/* Title */}
        <h3 className="text-[16px] text-[#404145] leading-5.5 mb-2 line-clamp-2 hover:underline">
          {service.name || service.description}
        </h3>

        {/* Rating — strictly from reviews API, no service.rating fallback */}
        <ServiceRating serviceId={service.id} />

        {/* Price */}
        <div className="pt-3 flex items-center justify-between border-t border-[#e4e5e7]">
          <div></div>
          <div className="text-right">
            <span className="text-[13px] text-[#74767e] font-bold block uppercase tracking-wide">From {service.price} MAD</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Main Page ───────────────────────────────────────────────── */
const ClientServices: React.FC = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeSubFilter, setActiveSubFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("best_selling");

  const isSearchActive = searchQuery.trim().length > 0;
  const isPriceFilterActive = minPrice !== "" || maxPrice !== "";
  const isFilterActive = selectedCategory !== "All" || activeSubFilter !== "All" || isPriceFilterActive;

  const filterParams = useMemo(() => {
    const params: { category?: string; minPrice?: number; maxPrice?: number; rating?: number; availability?: string } = {};
    if (selectedCategory !== "All") params.category = selectedCategory;
    if (minPrice !== "") params.minPrice = Number(minPrice);
    if (maxPrice !== "") params.maxPrice = Number(maxPrice);
    return params;
  }, [selectedCategory, minPrice, maxPrice]);

  const {
    data: allServicesData,
    isLoading: isAllServicesLoading,
    isFetching: isAllServicesFetching,
    error: allServicesError,
  } = useGetCustomerAllServicesQuery({ page: 1, limit: 100 }, { skip: isSearchActive || isFilterActive });

  const {
    data: searchedServicesData,
    isLoading: isSearchLoading,
    isFetching: isSearchFetching,
    error: searchError,
  } = useSearchCustomerServicesQuery({ keyword: searchQuery.trim() }, { skip: !isSearchActive });

  const {
    data: filteredServicesData,
    isLoading: isFilterLoading,
    isFetching: isFilterFetching,
    error: filterError,
  } = useFilterCustomerServicesQuery(filterParams, { skip: !isFilterActive || isSearchActive });

  const itemsPerPage = 12;

  const activeApiServices = useMemo(() => {
    if (isSearchActive) return searchedServicesData?.data || [];
    if (isFilterActive) return filteredServicesData?.data || [];
    return allServicesData?.data || [];
  }, [isSearchActive, isFilterActive, searchedServicesData?.data, filteredServicesData?.data, allServicesData?.data]);

  const isSearchNotFound = isSearchActive && !!searchError && typeof searchError === "object" && "status" in searchError && Number(searchError.status) === 404;
  const hasBlockingError = (!isSearchActive && !!allServicesError) || (!isSearchActive && isFilterActive && !!filterError) || (isSearchActive && !!searchError && !isSearchNotFound);
  const isLoadingServices = (isSearchActive && (isSearchLoading || isSearchFetching)) || (!isSearchActive && isFilterActive && (isFilterLoading || isFilterFetching)) || (!isSearchActive && !isFilterActive && (isAllServicesLoading || isAllServicesFetching));

  const filteredServices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const sourceServices = activeApiServices.map(mapCustomerServiceToItem);

    const filtered = sourceServices.filter((service) => {
      const matchesSearch = q.length === 0 || service.name.toLowerCase().includes(q) || service.description.toLowerCase().includes(q);
      const matchesCategory = selectedCategory === "All" || service.category === selectedCategory;
      const matchesMin = minPrice === "" || service.price >= Number(minPrice);
      const matchesMax = maxPrice === "" || service.price <= Number(maxPrice);
      
      return matchesSearch && matchesCategory && matchesMin && matchesMax;
    });

    // Client-side sort
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "highest_rated": return b.rating - a.rating;
        case "price_low":     return a.price - b.price;
        case "price_high":    return b.price - a.price;
        case "best_selling":
        default:              return b.rating - a.rating; // fallback to rating for best selling
      }
    });
  }, [searchQuery, selectedCategory, activeApiServices, sortBy]);

  const handleCategorySelect = (value: string) => {
    setSelectedCategory(value);
    setActiveSubFilter("All");
    setCurrentPage(1);
  };

  const handleBudgetApply = (min: string, max: string) => {
    setMinPrice(min);
    setMaxPrice(max);
    setCurrentPage(1);
  };

  const handleBudgetClear = () => {
    setMinPrice("");
    setMaxPrice("");
    setCurrentPage(1);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedServices = filteredServices.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

  // Build category options dynamically from actual API data
  const categoryOptions = useMemo(() => {
    const apiCategories = (allServicesData?.data ?? []).map((s) => s.category).filter(Boolean);
    const uniqueCategories = Array.from(new Set(apiCategories)).sort();
    return [
      { label: "All Services", value: "All" },
      ...uniqueCategories.map((c) => ({ label: c, value: c })),
    ];
  }, [allServicesData?.data]);

  return (
    <div className="min-h-screen bg-white font-sans text-[#222325]">
      <Header />

      <main className="max-w-360 mx-auto px-6 pt-32 pb-8">
        {/* Breadcrumbs */}
        <div className="text-[14px] text-[#74767e] mb-6 flex items-center gap-2">
          <button className="hover:underline" onClick={() => { setSelectedCategory("All"); setActiveSubFilter("All"); }}>Home</button>
          <span>/</span>
          <button className="hover:underline">Services</button>
          <span>/</span>
          <span className="text-[#222325] font-medium">{selectedCategory === "All" ? "All Services" : selectedCategory}</span>
        </div>

        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-[32px] md:text-[40px] font-bold mb-3 text-[#1A1A2E]">
            {selectedCategory === "All" ? "Explore Services" : selectedCategory}
          </h1>
          <p className="text-[16px] flex flex-wrap items-center gap-2">
            <span className="text-[#1A1A2E]/70">Find the perfect professional for your needs with help from our skilled service providers</span>
            <span className="hidden sm:inline text-[#C9A84C] font-bold mx-1">|</span>
            <button className="flex items-center gap-1.5 text-[#C9A84C] font-bold hover:underline group">
              <PlayCircle size={18} className="fill-[#C9A84C] text-white transition-transform group-hover:scale-110" /> How ServiceHub Works
            </button>
          </p>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-3 mb-6 border-b border-[#e4e5e7] pb-4">
          <FilterDropdown
            label="Service options"
            options={categoryOptions}
            value={selectedCategory}
            onChange={handleCategorySelect}
          />

          <BudgetDropdown
            minPrice={minPrice}
            maxPrice={maxPrice}
            onApply={handleBudgetApply}
            onClear={handleBudgetClear}
          />

          {/* Search */}
          <div className="relative ml-auto w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 pl-4 pr-10 text-[15px] border border-[#c5c6c9] outline-none rounded-lg transition-colors focus:border-[#222325] w-full sm:w-56"
            />
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#74767e]" />
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-[15px] font-medium text-[#74767e]">
            {filteredServices.length > 0 ? `${filteredServices.length}+ results` : "0 results"}
          </span>
          <div className="flex items-center gap-2 text-[15px]">
            <span className="text-[#74767e]">Sort by:</span>
            <SortDropdown value={sortBy} onChange={(v) => { setSortBy(v); setCurrentPage(1); }} />
          </div>
        </div>

        {/* Content */}
        {isLoadingServices ? (
          <div className="flex justify-center py-24">
            <span className="text-[#74767e] font-medium">Loading services...</span>
          </div>
        ) : hasBlockingError ? (
          <div className="flex justify-center py-24">
            <span className="text-red-500 font-medium">Error loading services.</span>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Search size={32} className="text-[#c5c6c9] mb-4" />
            <h3 className="text-[20px] font-bold text-[#222325]">No Services Found</h3>
            <p className="text-[#74767e] mt-2">Try adjusting your filters or search query.</p>
            {(isFilterActive || isSearchActive) && (
              <button
                onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setActiveSubFilter("All"); setMinPrice(""); setMaxPrice(""); }}
                className="mt-6 px-6 py-2.5 bg-[#222325] text-white font-bold rounded-lg hover:bg-[#404145] transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 gap-y-10 mb-12">
              {paginatedServices.map((service) => (
                <ServiceMemeCard
                  key={service.id}
                  service={service}
                  onClick={() => navigate(`/services/${service.id}`)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 0 && (
              <div className="flex items-center justify-center gap-2 pb-12 mt-8">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-[#e4e5e7] hover:bg-[#f5f5f5] disabled:opacity-50 transition-colors"
                >
                  <ChevronDown size={20} className="rotate-90 text-[#404145]" />
                </button>

                {[...Array(totalPages)].map((_, idx) => {
                  const page = idx + 1;
                  const isActive = page === currentPage;
                  const isVisible = Math.abs(page - currentPage) <= 2 || page === 1 || page === totalPages;

                  if (!isVisible) {
                    if (page === 2 && currentPage > 4) return <span key={page} className="text-[#74767e] px-1">...</span>;
                    if (page === totalPages - 1 && currentPage < totalPages - 3) return <span key={page} className="text-[#74767e] px-1">...</span>;
                    return null;
                  }

                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-full text-[15px] font-bold transition-all flex items-center justify-center ${
                        isActive
                          ? "bg-[#222325] text-white"
                          : "text-[#404145] hover:bg-[#f5f5f5]"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-full flex items-center justify-center border border-[#e4e5e7] hover:bg-[#f5f5f5] disabled:opacity-50 transition-colors"
                >
                  <ChevronDown size={20} className="-rotate-90 text-[#404145]" />
                </button>
              </div>
            )}
          </>
        )}
      </main>
      <QuestionSection />
      <Footer />
    </div>
  );
};

export default ClientServices;
