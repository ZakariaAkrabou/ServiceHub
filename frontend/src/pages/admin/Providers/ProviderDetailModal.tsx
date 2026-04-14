import { X, Star, Briefcase, CheckCircle2, XCircle, Mail, Calendar, Phone } from "lucide-react";
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
        className="absolute inset-0 bg-[#081D3A]/30 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Compact Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header Ribbon */}
        <div className="h-24 bg-gray-50 border-b border-gray-100 flex items-start justify-between px-6 pt-6">
           <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-[#081D3A] font-bold text-2xl shadow-sm border-2 border-white -mt-2" 
                style={{ backgroundColor: "#F6E304" }}
              >
                {provider.name.charAt(0)}
              </div>
              <div className="pb-2">
                <h3 className="text-xl font-bold text-[#081D3A] leading-tight">{provider.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-xs font-mono text-gray-500">{provider.id}</p>
                  <span className="text-gray-300">&bull;</span>
                  <span className={`inline-flex shrink-0 items-center justify-center text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${statusStyle[provider.status]}`}>
                    {provider.status}
                  </span>
                </div>
              </div>
           </div>
           
           <button 
             onClick={onClose}
             className="p-2 bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900 rounded-full transition-colors"
           >
             <X className="w-4 h-4" />
           </button>
        </div>

        {/* Body Content - No scrolling needed */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Column 1: Info Stack */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                  <Briefcase className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Specialty</p>
                  <p className="font-semibold text-gray-900">{provider.specialty}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                  <Mail className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Email</p>
                  <p className="font-semibold text-gray-900">{provider.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                  <Phone className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Phone Number</p>
                  <p className="font-semibold text-gray-900">{provider.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                  <Calendar className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Joined Date</p>
                  <p className="font-semibold text-gray-900">{provider.joinedDate}</p>
                </div>
              </div>
            </div>

            {/* Column 2: Stats & Notes Box */}
            <div className="flex flex-col gap-4">
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Global Rating</p>
                  <div className="flex items-center gap-1.5">
                    <Star className={`w-4 h-4 ${provider.rating > 0 ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                    <span className="font-bold text-xl text-gray-900">{provider.rating > 0 ? provider.rating : "N/A"}</span>
                  </div>
                </div>
                <div className="h-10 w-px bg-gray-200"></div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Jobs Done</p>
                  <p className="font-bold text-xl text-[#081D3A]">{provider.jobsCompleted}</p>
                </div>
              </div>

              {provider.status === "Pending" ? (
                 <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5 text-[13px] text-amber-800 font-medium">
                   Awaiting manual review for platform access. Check credentials before approving.
                 </div>
              ) : (
                 <div className="bg-gray-50 border border-gray-100 rounded-xl p-3.5 text-[13px] text-gray-600 font-medium">
                   Provider is currently marked as <strong>{provider.status}</strong> on the platform.
                 </div>
              )}
            </div>
            
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-white border-t border-gray-100 p-4 px-6 flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-400 hidden sm:block uppercase tracking-wider">
            Manage Provider
          </span>
          
          <div className="flex items-center justify-end gap-3 w-full sm:w-auto">
            {provider.status === "Pending" ? (
              <>
                <button 
                  onClick={() => { onStatusChange(provider.id, "Rejected"); onClose(); }}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-red-700 bg-white border border-red-200 hover:bg-red-50 rounded-xl transition-all"
                >
                  <XCircle className="w-4 h-4" /> Reject
                </button>
                <button 
                  onClick={() => { onStatusChange(provider.id, "Active"); onClose(); }}
                  className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-5 py-2.5 text-sm font-semibold text-white bg-[#081D3A] hover:bg-[#081D3A]/90 rounded-xl transition-all shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approve
                </button>
              </>
            ) : (
              <select 
                className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold bg-white border border-gray-200 text-[#081D3A] rounded-xl outline-none hover:border-gray-300 focus:border-[#081D3A] transition-all cursor-pointer shadow-sm appearance-none pr-8 bg-no-repeat bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M5%208l5%205%205-5z%22%20fill%3D%22%239CA3AF%22%2F%3E%3C%2Fsvg%3E')] bg-position-[right_8px_center]"
                value={provider.status}
                onChange={(e) => { onStatusChange(provider.id, e.target.value as any); }}
              >
                <option value="Active">Set Active</option>
                <option value="Pending">Set Pending</option>
                <option value="Rejected">Set Rejected</option>
              </select>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
