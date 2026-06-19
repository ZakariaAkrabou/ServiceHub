import React, { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/client/Header";
import Footer from "../../../components/client/Footer";
import QuestionSection from "./question";
import {
  Search,
  Star,
  Heart,
  ChevronDown,
  PlayCircle
} from "lucide-react";
import { getRandomReviews } from "../../../utils/serviceUtils";
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
  { name: "Assembly", value: "Technical" },
  { name: "Mounting", value: "Repairs" },
  { name: "Moving", value: "Gardening" },
  { name: "Cleaning", value: "Cleaning" },
  { name: "Outdoor Help", value: "Gardening" },
  { name: "Home Repairs", value: "Repairs" },
  { name: "Painting", value: "Design" },
  { name: "Trending", value: "All" },
];

const subCategoryMap: Record<string, string[]> = {
  All: ["All", "Verified Providers Only", "Popular Bookings"],
  Cleaning: ["All", "Standard Home Clean", "Deep Clean", "Carpet Clean", "Window Wash"],
  Gardening: ["All", "Lawn Mowing", "Hedge Trimming", "Garden Weeding", "Tree Pruning"],
  Repairs: ["All", "Leak Repair", "Fixture Installation", "Furniture Assemble", "TV Wall Mount"],
  Technical: ["All", "Smart Assistant", "Router Setup", "Camera Install", "Device Diagnostic"],
  Design: ["All", "Wall Painting", "Furniture Paint", "Wallpaper Install", "Consultation"],
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
            ? 'border-[#222325] bg-[#f5f5f5] text-[#222325]' 
            : 'border-[#c5c6c9] hover:border-[#222325] text-[#222325]'
        }`}
      >
        {label} <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 shadow-xl rounded-lg w-64 z-30 py-2 max-h-80 overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
              className={`w-full text-left px-4 py-2 text-[15px] hover:bg-[#f5f5f5] ${value === opt.value ? 'font-bold text-[#222325]' : 'text-[#404145]'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Toggle: React.FC<{ label: string; checked: boolean; onChange: (v: boolean) => void }> = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <div className="relative flex items-center">
      <input type="checkbox" className="sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <div className={`w-9 h-5 rounded-full transition-colors ${checked ? 'bg-[#222325]' : 'bg-[#e4e5e7]'}`}></div>
      <div className={`absolute w-3.5 h-3.5 bg-white rounded-full transition-transform ${checked ? 'translate-x-4' : 'translate-x-1'}`}></div>
    </div>
    <span className="text-[15px] font-semibold text-[#404145]">{label}</span>
  </label>
);

const ServiceMemeCard: React.FC<{
  service: ServiceItem;
  onClick: () => void;
}> = ({ service, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group flex flex-col w-full h-full cursor-pointer transition-all duration-300 hover:shadow-[0_4px_16px_rgba(0,0,0,0.1)] border border-transparent rounded-lg overflow-hidden bg-white"
    >
      {/* Top Photo */}
      <div className="w-full aspect-4/3 relative rounded-lg overflow-hidden">
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button 
          className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-black/10 transition z-10"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Heart size={20} className="text-white drop-shadow-md" strokeWidth={2.5} />
        </button>
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
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-4 mt-auto">
          <Star size={15} className="fill-[#222325] text-[#222325]" />
          <span className="text-[15px] font-bold text-[#222325]">{(service.rating || 5.0).toFixed(1)}</span>
          <span className="text-[15px] text-[#74767e]">({service.reviews > 0 ? service.reviews : getRandomReviews()})</span>
        </div>
        
        {/* Price */}
        <div className="pt-3 flex items-center justify-between border-t border-[#e4e5e7]">
          <div></div>
          <div className="text-right">
             <span className="text-[13px] text-[#74767e] font-bold block uppercase tracking-wide">From US${service.price}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ClientServices: React.FC = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeSubFilter, setActiveSubFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [proServices, setProServices] = useState(false);
  const [instantResponse, setInstantResponse] = useState(false);
  
  const isSearchActive = searchQuery.trim().length > 0;
  const isFilterActive = selectedCategory !== "All" || activeSubFilter !== "All";

  const filterParams = useMemo(() => {
    const params: { category?: string; rating?: number; availability?: string; } = {};
    if (selectedCategory !== "All") params.category = selectedCategory;
    if (activeSubFilter === "Popular Bookings") params.rating = 4;
    if (activeSubFilter === "Verified Providers Only") params.availability = "available";
    return params;
  }, [selectedCategory, activeSubFilter]);

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

  // Removed redundant useEffect; page reset is handled in individual handlers

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

    return sourceServices.filter((service) => {
      const matchesSearch = q.length === 0 || service.name.toLowerCase().includes(q) || service.description.toLowerCase().includes(q);
      const matchesCategory = selectedCategory === "All" || service.category === selectedCategory;
      const matchesSubFilter = (() => {
        if (activeSubFilter === "All") return true;
        if (activeSubFilter === "Verified Providers Only") {
          const tier = service.providerTier.toLowerCase();
          return tier.includes("verified") || service.badges.some((b) => b.toLowerCase().includes("verified")) || service.badges.some((b) => b.toLowerCase().includes("licensed"));
        }
        if (activeSubFilter === "Popular Bookings") {
          return service.reviews >= 100 || service.subCategory === "Popular Bookings" || service.badges.some((b) => b.toLowerCase().includes("top rated"));
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
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedServices = filteredServices.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

  const categoryOptions = [
    { label: "All Services", value: "All" },
    ...Array.from(new Set(mainCategories.map(c => c.value))).filter(c => c !== "All").map(c => ({ label: c, value: c }))
  ];

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
          <h1 className="text-[32px] md:text-[40px] font-bold mb-3 text-[#222325]">
             {selectedCategory === "All" ? "Explore Services" : selectedCategory}
          </h1>
          <p className="text-[16px] text-[#74767e] flex flex-wrap items-center gap-2">
            Find the perfect professional for your needs with help from our skilled service providers
            <span className="hidden sm:inline mx-1">|</span>
            <button className="flex items-center gap-1.5 text-[#222325] font-bold hover:underline group">
               <PlayCircle size={18} className="fill-[#222325] text-white transition-transform group-hover:scale-110" /> How ServiceHub Works
            </button>
          </p>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4 border-b border-[#e4e5e7] pb-4">
          <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
             <FilterDropdown 
                label="Service options" 
                options={categoryOptions} 
                value={selectedCategory} 
                onChange={handleCategorySelect} 
             />
             <FilterDropdown 
                label="Seller details" 
                options={subFilters.map(s => ({label: s, value: s}))} 
                value={activeSubFilter} 
                onChange={(v) => { setActiveSubFilter(v); setCurrentPage(1); }} 
             />
             <FilterDropdown 
                label="Budget" 
                options={[{label: "Any Budget", value: ""}]} 
                value="" 
                onChange={() => {}} 
             />
             <FilterDropdown 
                label="Delivery time" 
                options={[{label: "Any Time", value: ""}]} 
                value="" 
                onChange={() => {}} 
             />
             
             {/* Search input to keep existing functionality accessible */}
             <div className="relative ml-auto xl:ml-2 w-full sm:w-auto mt-2 sm:mt-0">
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
          
          <div className="flex items-center gap-6 w-full xl:w-auto justify-start xl:justify-end">
             <Toggle label="Pro services" checked={proServices} onChange={setProServices} />
             <Toggle label="Instant response" checked={instantResponse} onChange={setInstantResponse} />
          </div>
        </div>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
           <span className="text-[15px] font-medium text-[#74767e]">
             {filteredServices.length > 0 ? `${filteredServices.length}+ results` : "0 results"}
           </span>
           <div className="flex items-center gap-2 text-[15px]">
              <span className="text-[#74767e]">Sort by:</span>
              <button className="font-bold text-[#222325] flex items-center gap-1 hover:bg-[#f5f5f5] px-2 py-1 rounded-md transition-colors">
                 Best selling <ChevronDown size={16}/>
              </button>
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
                 onClick={() => { setSearchQuery(""); setSelectedCategory("All"); setActiveSubFilter("All"); }}
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
