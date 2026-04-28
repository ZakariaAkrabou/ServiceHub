import { X, Star, CheckCircle2, ChevronRight } from "lucide-react";
import { type Service, statusStyle } from "./data/servicesMockData";
import { Button } from "../../../components/admin/ui/Button";

interface ServiceDetailModalProps {
  service: Service;
  onClose: () => void;
}

export default function ServiceDetailModal({ service, onClose }: ServiceDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      <div
        className="absolute inset-0 bg-[#081D3A]/40 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />


      <div className="relative w-full max-w-md bg-white rounded-3xl md:rounded-4xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100 max-h-[90vh]">


        <div className="p-4 md:p-6 border-b border-slate-50 relative bg-slate-50/50">
          <button
            onClick={onClose}
            className="absolute top-2 md:top-4 right-2 md:right-4 p-2 text-slate-400 hover:text-slate-900 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl md:rounded-2xl overflow-hidden shadow-lg shrink-0 border-2 border-white">
              <img src={service.image} className="w-full h-full object-cover" alt={service.name} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="px-2 py-0.5 bg-slate-900 text-white text-[8px] font-black uppercase tracking-wider rounded">
                  {service.category}
                </span>

              </div>
              <h2 className="text-lg md:text-xl font-black text-[#081D3A] tracking-tight leading-tight">
                {service.name}
              </h2>
            </div>
          </div>
        </div>

        {/* Content Area - Single Column Stack */}
        <div className="p-4 md:p-6 space-y-6 overflow-y-auto custom-scrollbar">

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            <div className="p-3 md:p-4 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100">
              <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Service Fee</p>
              <p className="text-lg md:text-xl font-black text-[#081D3A]">
                {service.price} <span className="text-xs text-slate-400 uppercase">MAD</span><span className="text-[10px] text-slate-400">/{service.priceUnit}</span>
              </p>
            </div>
            <div className="p-3 md:p-4 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100">
              <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Quality Avg</p>
              <div className="flex items-center gap-1.5">
                <Star className="w-3 md:w-3.5 h-3 md:h-3.5 fill-[#F6E304] text-[#F6E304]" />
                <p className="text-lg md:text-xl font-black text-[#081D3A]">{service.rating}</p>
              </div>
            </div>
          </div>

          {/* Details Stack */}
          <div className="space-y-4 md:space-y-5">
            <div className="space-y-1.5">
              <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Description</p>
              <p className="text-xs md:text-sm font-medium text-slate-600 leading-relaxed">
                {service.description}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Managed By</p>
              <div className="flex items-center justify-between p-2.5 md:p-3 bg-white border border-slate-100 rounded-xl">
                <div className="flex items-center gap-2.5 md:gap-3">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[#081D3A] font-black text-[9px] md:text-[10px] border border-slate-100">
                    {service.providerName.charAt(0)}
                  </div>
                  <p className="text-xs md:text-sm font-bold text-slate-900">{service.providerName}</p>
                </div>
                <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-300" />
              </div>
            </div>

            <div className="pt-1">
              <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl border flex items-start gap-3 ${statusStyle[service.status]}`}>
                <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest mb-0.5">Availability</p>
                  <p className="text-[10px] md:text-xs font-bold opacity-80 leading-relaxed">This service is presently {service.status.toLowerCase()} for live bookings.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Compact Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100">
          <Button
            onClick={onClose}
            variant="secondary"
            fullWidth
            className="rounded-xl! md:rounded-2xl!"
          >
            Dismiss Details
          </Button>
        </div>

      </div>
    </div>
  );
}
