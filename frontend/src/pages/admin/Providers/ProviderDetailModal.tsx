import { X, Star, Briefcase, CheckCircle2, XCircle, MapPin, Phone, Mail, Calendar, Award } from "lucide-react";
import { type Provider, statusStyle } from "./data/providersMockData";

interface ProviderDetailModalProps {
  provider: Provider;
  onClose: () => void;
  onStatusChange: (id: string, status: "Active" | "Rejected" | "Pending") => void;
}

export default function ProviderDetailModal({ provider, onClose, onStatusChange }: ProviderDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#081D3A]/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300 border border-white/20">
        
        {/* Banner header */}
        <div className="h-32 w-full bg-gradient-to-r from-[#081D3A] to-[#17171A] relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-8 pb-8 pt-0 overflow-y-auto max-h-[70vh]">
          {/* Avatar floating over banner */}
          <div className="flex flex-col sm:flex-row gap-6 relative -mt-12 sm:-mt-16 items-start">
            <div 
              className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl flex items-center justify-center text-[#081D3A] font-bold text-4xl sm:text-5xl shadow-xl border-4 border-white shrink-0" 
              style={{ backgroundColor: "#F6E304" }}
            >
              {provider.name.charAt(0)}
            </div>
            
            <div className="pt-2 sm:pt-20 flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#081D3A] tracking-tight">{provider.name}</h3>
                  <p className="text-sm font-medium text-gray-500 mt-1">{provider.id}</p>
                </div>
                <span className={`inline-flex items-center justify-center text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider ${statusStyle[provider.status]}`}>
                  {provider.status}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Contact & Basic Info */}
            <div className="flex flex-col gap-6">
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Contact Information</h4>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">{provider.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium">New York, NY</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Professional Details</h4>
                <div className="flex flex-col gap-4">
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                      <Briefcase className="w-5 h-5 text-[#081D3A]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Specialty</p>
                      <p className="text-sm font-bold text-gray-900">{provider.specialty}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-[#081D3A]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Joined Date</p>
                      <p className="text-sm font-bold text-gray-900">{provider.joinedDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Performance & Stats */}
            <div className="flex flex-col gap-6">
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Performance Metrics</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-[#081D3A] to-[#17171A] p-5 rounded-2xl text-white relative overflow-hidden group hover:shadow-lg transition-all">
                    <div className="absolute top-0 right-0 p-3 opacity-20 group-hover:scale-110 group-hover:opacity-30 transition-all duration-500">
                      <Star className="w-16 h-16" />
                    </div>
                    <p className="text-white/60 text-xs font-medium uppercase tracking-wider mb-1">Rating</p>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold text-[#F6E304]">{provider.rating > 0 ? provider.rating : "N/A"}</span>
                      <span className="text-white/60 text-sm font-medium pb-1">/ 5.0</span>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Jobs Done</p>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold text-gray-900">{provider.jobsCompleted}</span>
                      <Award className="w-6 h-6 text-emerald-500" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-full bg-[#F3F3F3] p-5 rounded-2xl border border-gray-200/60 relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#F6E304] rounded-l-2xl"/>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Background Check</h4>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  Identity verified. Clean criminal record. All mandatory certifications for "{provider.specialty}" are uploaded and validated by the system.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-8 py-5 bg-gray-50/80 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-4 justify-between backdrop-blur-xl">
          <span className="text-xs font-medium text-gray-500 hidden sm:inline-block">Manage provider operational status</span>
          
          <div className="flex w-full sm:w-auto items-center justify-end gap-3">
            {provider.status === "Pending" ? (
              <>
                <button 
                  onClick={() => { onStatusChange(provider.id, "Rejected"); onClose(); }}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700 rounded-xl transition-all border border-red-100"
                >
                  <XCircle className="w-4 h-4" strokeWidth={2.5} /> Reject
                </button>
                <button 
                  onClick={() => { onStatusChange(provider.id, "Active"); onClose(); }}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-bold text-emerald-700 bg-emerald-400 hover:bg-emerald-500 hover:shadow-lg hover:shadow-emerald-200 rounded-xl transition-all border border-emerald-500"
                >
                  <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} /> Accept Provider
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={onClose}
                  className="px-5 py-2.5 text-sm font-bold text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <select 
                  className="px-5 py-2.5 text-sm font-bold bg-[#081D3A] text-white rounded-xl outline-none hover:bg-[#081D3A]/90 transition-all cursor-pointer focus:ring-4 focus:ring-[#081D3A]/20 shadow-lg shadow-[#081D3A]/20"
                  value={provider.status}
                  onChange={(e) => onStatusChange(provider.id, e.target.value as any)}
                >
                  <option value="Active">Change to Active</option>
                  <option value="Pending">Change to Pending</option>
                  <option value="Rejected">Change to Rejected</option>
                </select>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
