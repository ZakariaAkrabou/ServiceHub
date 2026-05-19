import React, { useState, useMemo } from "react";
import Header from "../../../components/client/Header";
import Footer from "../../../components/client/Footer";
import ServiceDetail from "./serviceDetail";
import { 
  Search, Star,  Heart,
  Wrench, Hammer, Truck, Sparkle, TreePine, Construction, Paintbrush, Flame 
} from "lucide-react";

interface ServiceItem {
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

const mockupServices: ServiceItem[] = [
  {
    id: "s1",
    name: "Standard Home Cleaning & Deep Sanitization",
    category: "Cleaning",
    subCategory: "Standard Home Clean",
    price: 80,
    duration: "2 Hours",
    rating: 4.8,
    reviews: 124,
    description: "Deep, pristine cleaning for your bedrooms, living room, kitchen, and bathrooms. Includes dusting, vacuuming, mopping, and waste disposal.",
    longDescription: "Our standard home cleaning package is designed to keep your home healthy, sparkling, and comfortable. Our certified professionals use eco-friendly products to clean all surfaces, dust hard-to-reach areas, mop floors, vacuum carpets, and sanitize toilets/showers. We pay special attention to detail, leaving your space looking and feeling refreshed.",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
    provider: "EcoClean Solutions",
    providerAvatar: "ES",
    providerTier: "Top Rated",
    badges: ["Eco-friendly", "Verified Expert"]
  },
  {
    id: "s2",
    name: "Lawn Mowing, Landscape & Complete Garden Care",
    category: "Gardening",
    subCategory: "Lawn Mowing",
    price: 120,
    duration: "3 Hours",
    rating: 4.9,
    reviews: 86,
    description: "Complete garden care including lawn mowing, hedge trimming, weed control, and garden bed cleanup.",
    longDescription: "Elevate your home's curb appeal with our professional landscaping and lawn care services. This comprehensive service includes precise lawn mowing, edge trimming, weeding, pruning shrubs, hedge sculpting, and clearing garden waste. We ensure your garden thrives in every season.",
    image: "https://images.unsplash.com/photo-1558904541-efa8c1a68f6f?auto=format&fit=crop&w=800&q=80",
    provider: "GreenThumb Pros",
    providerAvatar: "GT",
    providerTier: "Level 2 Seller",
    badges: ["Tools Included", "Top Rated"]
  },
  {
    id: "s3",
    name: "Emergency Plumbing, Pipe Repairs & Drainage Unclogging",
    category: "Repairs",
    subCategory: "Leak Repair",
    price: 150,
    duration: "1.5 Hours",
    rating: 4.7,
    reviews: 95,
    description: "Fast fix for leaky pipes, clogged drains, toilet repairs, and faucet installations by certified plumbers.",
    longDescription: "Don't let leaks or blocks ruin your day. Our expert plumbers offer reliable, high-speed diagnostic and repair services. From fixing leaking pipes and standard faucet installations to resolving complex toilet overflows and blocked drains, we resolve your technical plumbing emergencies with guaranteed durability.",
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80",
    provider: "Apex Plumbing",
    providerAvatar: "AP",
    providerTier: "Verified Expert",
    badges: ["Same-Day Fix", "Licensed Pro"]
  },
  {
    id: "s4",
    name: "Smart Home System Synchronization & Assistant Configuration",
    category: "Technical",
    subCategory: "Smart Assistant",
    price: 200,
    duration: "4 Hours",
    rating: 4.9,
    reviews: 62,
    description: "Installation and integration of smart assistants, smart thermostats, security cameras, and smart lighting.",
    longDescription: "Modernize your living space with a fully synchronized smart home ecosystem. Our certified IT and systems experts will install and seamlessly configure your smart devices, including voice assistants (Alexa/Google Home), smart thermostats (Nest), high-definition security cameras, video doorbells, and automated lighting networks.",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
    provider: "ByteSize Setup",
    providerAvatar: "BS",
    providerTier: "Top Rated",
    badges: ["Certified Tech", "Smart Certified"]
  },
  {
    id: "s5",
    name: "Premium Interior Painting, Plastering & Accent Wall Coating",
    category: "Design",
    subCategory: "Wall Painting",
    price: 350,
    duration: "8 Hours",
    rating: 4.6,
    reviews: 43,
    description: "Professional interior wall painting including surface preparation, priming, two finish coats, and clean up.",
    longDescription: "Transform the look and mood of any room with our high-quality interior painting service. We handle everything from moving light furniture and laying protective dropsheets to wall preparation, minor plastering, priming, and applying two coats of premium low-VOC paint. We leave your walls immaculate.",
    image: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80",
    provider: "GoldAccent Decor",
    providerAvatar: "GA",
    providerTier: "Verified Expert",
    badges: ["Premium Paint", "Insured"]
  },
  {
    id: "s6",
    name: "Professional Handyman Services, TV Mounting & Furniture Assembly",
    category: "Repairs",
    subCategory: "Furniture Assemble",
    price: 90,
    duration: "2 Hours",
    rating: 4.8,
    reviews: 110,
    description: "TV mounting, furniture assembly, hanging pictures, cabinet repairs, and other light home handyman tasks.",
    longDescription: "Clear your weekend to-do list with a professional handyman service. Our skilled technicians are equipped for a wide range of light installations, TV wall mounting, heavy-duty shelving installation, door handle repairs, cabinet hinge tuning, and assembling complex flat-pack furniture with utmost speed and accuracy.",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
    provider: "FixIt Handymen",
    providerAvatar: "FI",
    providerTier: "Level 1 Seller",
    badges: ["Multi-Skilled", "Quick Dispatch"]
  },
  {
    id: "s7",
    name: "Heavy Duty Television Wall Mounting & Invisible Cabling Setup",
    category: "Repairs",
    subCategory: "TV Wall Mount",
    price: 110,
    duration: "1.5 Hours",
    rating: 4.9,
    reviews: 74,
    description: "Secure wall mounting of smart TVs on drywalls or masonry surfaces, with hidden cabling channels included.",
    longDescription: "Get the perfect viewing angle with our professional television mounting service. We carefully locate structural wall studs, securely mount heavy-duty brackets, hide cables in sleek surface-mounted tracks, and connect your smart devices to ensure everything functions perfectly.",
    image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=800&q=80",
    provider: "MountTech Pro",
    providerAvatar: "MT",
    providerTier: "Top Rated",
    badges: ["Brackets Loaded", "1-Year Warranty"]
  },
  {
    id: "s8",
    name: "Residential Relocation, Packaging & Local Van Transport",
    category: "Gardening",
    subCategory: "Popular Bookings",
    price: 240,
    duration: "4 Hours",
    rating: 4.8,
    reviews: 153,
    description: "Professional packing, loading, and safe truck transport of light household furniture items locally.",
    longDescription: "Minimize moving stress with our professional helpers. This service includes two vetted moving experts, a clean container van truck, furniture blankets, loading, transporting, and unpacking your possessions safely at your new location.",
    image: "https://images.unsplash.com/photo-1603796846097-bee99e4a60c9?auto=format&fit=crop&w=800&q=80",
    provider: "QuickShift Crew",
    providerAvatar: "QS",
    providerTier: "Level 2 Seller",
    badges: ["Truck Included", "Damage Protected"]
  }
];

const mainCategories = [
  { name: "Assembly", icon: <Wrench size={24} />, value: "Technical" },
  { name: "Mounting", icon: <Hammer size={24} />, value: "Repairs" },
  { name: "Moving", icon: <Truck size={24} />, value: "Gardening" },
  { name: "Cleaning", icon: <Sparkle size={24} />, value: "Cleaning" },
  { name: "Outdoor Help", icon: <TreePine size={24} />, value: "Gardening" },
  { name: "Home Repairs", icon: <Construction size={24} />, value: "Repairs" },
  { name: "Painting", icon: <Paintbrush size={24} />, value: "Design" },
  { name: "Trending", icon: <Flame size={24} />, value: "All" }
];

const subCategoryMap: Record<string, string[]> = {
  All: ["All Services Available", "Verified Providers Only", "Popular Bookings"],
  Cleaning: ["Standard Home Clean", "Deep Clean", "Carpet Clean", "Window Wash"],
  Gardening: ["Lawn Mowing", "Hedge Trimming", "Garden Weeding", "Tree Pruning"],
  Repairs: ["Leak Repair", "Fixture Installation", "Furniture Assemble", "TV Wall Mount"],
  Technical: ["Smart Assistant", "Router Setup", "Camera Install", "Device Diagnostic"],
  Design: ["Wall Painting", "Furniture Paint", "Wallpaper Install", "Consultation"]
};

const ClientServices: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeSubFilter, setActiveSubFilter] = useState("All");
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const filteredServices = useMemo(() => {
    return mockupServices.filter((service) => {
      const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            service.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "All" || service.category === selectedCategory;
      
      const matchesSubFilter = activeSubFilter === "All" || 
                               activeSubFilter === "All Services Available" ||
                               activeSubFilter === "Verified Providers Only" ||
                               activeSubFilter === "Popular Bookings" ||
                               service.subCategory === activeSubFilter;
      
      return matchesSearch && matchesCategory && matchesSubFilter;
    });
  }, [searchQuery, selectedCategory, activeSubFilter]);

  const handleCategorySelect = (value: string) => {
    setSelectedCategory(value);
    setActiveSubFilter("All");
  };

  const subFilters = subCategoryMap[selectedCategory] || subCategoryMap["All"];

  return (
    <div className="services-page-nav min-h-screen bg-[#F5F0E8]/20 font-sans antialiased text-[#1A1A2E] 
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

      {/* Styled Entry Keyframe Animation */}
      <style>{`
        @keyframes pageFadeUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .anim-fade-up {
          animation: pageFadeUp 0.65s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        /* Global Priority Font override */
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

      {/* TaskRabbit-Inspired Premium Header Section */}
      <section className="relative pt-36 pb-12 bg-white border-b border-black/3 overflow-hidden min-h-115 flex flex-col justify-center">
        
        {/* Left Side Organic Abstract Graphics */}
        <div className="absolute left-0 top-[20%] -translate-x-[20%] w-60 h-60 rounded-full bg-[#1A1A2E]/5 z-0 pointer-events-none" />
        <div className="absolute left-[3%] top-[35%] w-48 h-48 rounded-full bg-[#C9A84C]/5 z-0 pointer-events-none" />
        <div className="absolute left-[1%] top-[55%] flex flex-col gap-2 opacity-15 pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-2">
              {Array.from({ length: 8 }).map((_, j) => (
                <div key={j} className="w-1.5 h-1.5 rounded-full bg-[#1A1A2E]" />
              ))}
            </div>
          ))}
        </div>

        {/* Right Side Organic Abstract Graphics */}
        <div className="absolute right-0 top-[15%] translate-x-[15%] w-72 h-72 rounded-full bg-[#C9A84C]/5 z-0 pointer-events-none" />
        <div className="absolute right-[4%] top-[25%] w-16 h-16 rounded-full border-[3px] border-[#C9A84C]/25 z-0 pointer-events-none" />
        <div className="absolute right-[2%] top-[45%] flex flex-col gap-2.5 opacity-20 pointer-events-none">
          <div className="w-10 h-10 rounded-full bg-[#1A1A2E]/5" />
          <div className="w-14 h-14 rounded-full bg-[#C9A84C]/5" />
        </div>

        {/* Center Content Wrapper */}
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full text-center flex flex-col items-center">
          
          {/* Main TaskRabbit-styled centered Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6.5xl font-black text-[#1A1A2E] tracking-tight leading-[1.05] max-w-2xl font-sans mb-8 anim-fade-up">
            Book trusted help <br /> for home tasks
          </h1>

          {/* Large Pill Centered Search Bar */}
          <div className="w-full max-w-xl relative group mb-10 anim-fade-up" style={{ animationDelay: "80ms" }}>
            <div className="relative flex items-center bg-white border border-black/15 hover:border-black/25 rounded-full shadow-sm overflow-hidden focus-within:border-[#1A1A2E] focus-within:ring-2 focus-within:ring-[#1A1A2E]/5 transition-all">
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

          {/* Horizontal Category Icons Selector (TaskRabbit exact reproduction using BRAND colors) */}
          <div className="w-full max-w-5xl overflow-x-auto pb-4 scrollbar-none anim-fade-up" style={{ animationDelay: "150ms" }}>
            <div className="flex justify-start md:justify-center items-center gap-6 md:gap-10 px-2 shrink-0">
              {mainCategories.map((cat) => {
                const isActive = selectedCategory === cat.value;
                return (
                  <button
                    key={cat.name}
                    onClick={() => handleCategorySelect(cat.value)}
                    className="flex flex-col items-center gap-2 group cursor-pointer shrink-0 transition-all"
                  >
                    {/* Circle icon bubbles using Deep Blue (#1A1A2E) & Gold (#C9A84C) */}
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-all ${
                      isActive 
                        ? "bg-[#1A1A2E] border-[#1A1A2E] text-[#C9A84C] scale-105 shadow-md shadow-[#1A1A2E]/10" 
                        : "bg-white border-black/10 text-black/55 group-hover:border-[#1A1A2E] group-hover:text-[#1A1A2E] group-hover:bg-[#F5F0E8]/20"
                    }`}>
                      {cat.icon}
                    </div>
                    {/* Active label underline in Gold (#C9A84C) */}
                    <div className="flex flex-col items-center">
                      <span className={`text-[11px] font-bold uppercase tracking-wider transition-colors ${
                        isActive ? "text-[#1A1A2E] font-extrabold" : "text-black/50 group-hover:text-[#1A1A2E]"
                      }`}>
                        {cat.name}
                      </span>
                      {isActive && (
                        <div className="h-0.75 w-5 bg-[#C9A84C] rounded mt-0.5" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Horizontal Sub-Category Pill Buttons (Dynamic matching) */}
          <div className="w-full max-w-3xl overflow-x-auto pt-6 scrollbar-none anim-fade-up" style={{ animationDelay: "200ms" }}>
            <div className="flex justify-start md:justify-center items-center gap-2.5 shrink-0 px-2">
              {subFilters.map((sub) => {
                const isSubActive = activeSubFilter === sub;
                return (
                  <button
                    key={sub}
                    onClick={() => setActiveSubFilter(sub)}
                    className={`h-9 px-4.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                      isSubActive
                        ? "bg-white border-[#1A1A2E] text-[#1A1A2E] font-extrabold shadow-xs"
                        : "bg-[#F5F0E8]/40 border-black/5 text-black/60 hover:bg-[#F5F0E8]/70 hover:text-black/80"
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

      {/* Main Grid Catalogue Area (Fiverr-Inspired Elegant Layout) */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        
        {/* Grid Header summary info */}
        <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-black/35 border-b border-black/4 pb-3 mb-10 anim-fade-up">
          <span>{filteredServices.length} Services Available</span>
          {(selectedCategory !== "All" || activeSubFilter !== "All") && (
            <button
              onClick={() => {
                setSelectedCategory("All");
                setActiveSubFilter("All");
              }}
              className="text-[#C9A84C] hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredServices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-black/3 text-center px-4 anim-fade-up">
            <Search className="text-[#C9A84C] mb-3" size={24} />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1A2E]">No matches found</h3>
            <p className="text-sm text-black/45 mt-1 max-w-xs">
              No services match your active selections. Try choosing other categories or search terms.
            </p>
          </div>
        ) : (
          /* Fiverr-Inspired Premium Gig Grid (3 Columns on Desktop) */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredServices.map((service, index) => (
              <div
                key={service.id}
                onClick={() => setSelectedService(service)}
                style={{ animationDelay: `${50 + index * 40}ms` }}
                className="group bg-white rounded-xl border border-black/6 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-black/12 flex flex-col cursor-pointer anim-fade-up"
              >
                {/* Fiverr-Style Gig Thumbnail (aspect-video h-48) */}
                <div className="h-48 relative overflow-hidden shrink-0">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-102"
                  />
                  {/* Floating Category tag */}
                  <span className="absolute top-3 left-3 bg-[#1A1A2E] text-white text-[8px] font-bold uppercase tracking-widest px-2.5 py-1 rounded">
                    {service.category}
                  </span>
                </div>

                {/* Fiverr-Style Body details */}
                <div className="p-5 flex-1 flex flex-col space-y-3">
                  
                  {/* Seller/Provider Profile row (Fiverr signature) */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {/* Avatar Circle */}
                      <div className="w-6.5 h-6.5 rounded-full bg-[#1A1A2E] text-[#C9A84C] text-[10px] font-extrabold flex items-center justify-center border border-[#C9A84C]/25">
                        {service.providerAvatar}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-black/85">{service.provider}</span>
                        <span className="text-[9px] text-[#C9A84C] font-extrabold tracking-wider uppercase">{service.providerTier}</span>
                      </div>
                    </div>
                  </div>

                  {/* Gig Title (Comfortable height, standard text sizes, bold on hover) */}
                  <h3 className="text-[14px] md:text-[15px] font-medium text-black/85 leading-snug group-hover:text-[#C9A84C] transition-colors line-clamp-2 pt-1 h-11">
                    I will provide {service.name.toLowerCase()}
                  </h3>

                  {/* Rating row with stars (Fiverr exact display) */}
                  <div className="flex items-center gap-1 text-[11px] font-bold text-black/90">
                    <Star size={12} className="fill-[#C9A84C] text-[#C9A84C]" />
                    <span className="text-[#C9A84C]">{service.rating}</span>
                    <span className="text-black/45 font-medium">({service.reviews})</span>
                  </div>

                  {/* Styled Option Badges (Compact) */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {service.badges.slice(0, 2).map((badge) => (
                      <span 
                        key={badge}
                        className="text-[9px] font-semibold tracking-wide px-2 py-0.5 rounded bg-[#F5F0E8]/70 text-[#1A1A2E]/80 border border-black/4"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  {/* Fiverr-Style Divider & Footer layout */}
                  <div className="border-t border-black/5 pt-3.5 mt-auto flex items-center justify-between">
                    {/* Left heart bookmark icon (Fiverr signature) */}
                    <button 
                      onClick={(e) => toggleFavorite(service.id, e)}
                      className="p-1 text-black/35 hover:text-red-500 transition-colors"
                    >
                      <Heart 
                        size={16} 
                        className={favorites[service.id] ? "fill-red-500 text-red-500" : "text-black/30"} 
                      />
                    </button>

                    {/* Right starting price block */}
                    <div className="text-right">
                      <span className="block text-[8px] tracking-wider text-black/40 font-bold uppercase">Starting At</span>
                      <span className="text-lg font-extrabold text-[#1A1A2E] leading-none">${service.price}</span>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modern Modular ServiceDetail Modal Component overlay */}
      <ServiceDetail 
        service={selectedService} 
        onClose={() => setSelectedService(null)} 
      />

      <div className="services-page-nav-footer">
        <Footer />
      </div>
    </div>
  );
};

export default ClientServices;
