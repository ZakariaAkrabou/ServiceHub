import React from "react";
import { X, Clock, Star } from "lucide-react";

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

interface ServiceDetailProps {
  service: ServiceItem | null;
  onClose: () => void;
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({ service, onClose }) => {
  if (!service) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs font-['Times_New_Roman',sans-serif,'Geist','Inter']"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-black/10 flex flex-col max-h-[85vh] animate-[pageFadeUp_0.4s_cubic-bezier(0.16,1,0.3,1)]"
      >
        {/* Style tag for custom pageFadeUp inside modal if needed */}
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
        `}</style>

        {/* Image Box */}
        <div className="h-48 relative shrink-0">
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/30 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 h-8 w-8 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60 transition cursor-pointer"
          >
            <X size={15} />
          </button>
          
          <div className="absolute bottom-4 left-5 right-5 text-white">
            <span className="bg-[#C9A84C] text-[#1A1A2E] text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md mb-1.5 inline-block">
              {service.category}
            </span>
            <h2 className="text-lg font-bold font-serif leading-tight">
              {service.name}
            </h2>
          </div>
        </div>

        {/* Scroll details */}
        <div className="p-5 md:p-6 overflow-y-auto space-y-5 flex-1 text-xs leading-relaxed text-black/70">
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A2E] mb-1.5">Overview</h3>
            <p>{service.longDescription}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 py-3 border-y border-black/4 bg-[#F5F0E8]/30 rounded-xl px-3 shrink-0">
            <div>
              <span className="block text-[8px] uppercase font-bold tracking-widest text-black/40">Hourly Rate</span>
              <span className="text-sm font-bold text-[#1A1A2E]">${service.price}</span>
            </div>
            <div>
              <span className="block text-[8px] uppercase font-bold tracking-widest text-black/40">Duration</span>
              <span className="text-xs font-bold text-[#1A1A2E] flex items-center gap-1 mt-0.5">
                <Clock size={12} />
                {service.duration}
              </span>
            </div>
            <div>
              <span className="block text-[8px] uppercase font-bold tracking-widest text-black/40">Rating</span>
              <span className="text-xs font-bold text-[#1A1A2E] flex items-center gap-0.5 mt-0.5">
                <Star size={11} className="fill-[#C9A84C] text-[#C9A84C]" />
                {service.rating}
              </span>
            </div>
            <div>
              <span className="block text-[8px] uppercase font-bold tracking-widest text-black/40">Provider</span>
              <span className="text-xs font-bold text-[#C9A84C] truncate block">{service.provider}</span>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-[#1A1A2E] mb-1.5">Standard Inclusions</h3>
            <ul className="space-y-1 text-xs text-black/55">
              <li className="flex items-center gap-1.5">✓ Standard equipment & cleanup included</li>
              <li className="flex items-center gap-1.5">✓ Completed by background checked local expert</li>
              <li className="flex items-center gap-1.5">✓ Fully covered under booking damage liability protection</li>
            </ul>
          </div>
        </div>

        {/* Modal actions */}
        <div className="p-5 border-t border-black/4 bg-[#F5F0E8]/10 flex items-center justify-between shrink-0">
          <div>
            <span className="block text-[8px] text-black/40 font-bold uppercase tracking-widest">Base Cost</span>
            <span className="text-xl font-bold text-[#1A1A2E] font-serif">${service.price}</span>
          </div>
          <button
            onClick={() => {
              onClose();
              alert("Bookings will be connected to the booking flow API soon!");
            }}
            className="h-10 bg-[#1A1A2E] text-white hover:bg-[#C9A84C] hover:text-[#1A1A2E] font-bold text-[10px] uppercase tracking-widest px-6 rounded-lg transition cursor-pointer"
          >
            Proceed to Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
