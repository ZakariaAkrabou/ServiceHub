import { useState } from "react";
import { ShieldAlert, X } from "lucide-react";
import { type Customer } from "../Providers/data/customersMockData";

interface CustomerBanConfirmationModalProps {
  customer: Customer;
  onClose: () => void;
  onConfirm: (reason: string, duration: string) => void;
}

export default function CustomerBanConfirmationModal({ customer, onClose, onConfirm }: CustomerBanConfirmationModalProps) {
  const [reason, setReason] = useState("");
  const [duration, setDuration] = useState("7_days");

  const handleConfirm = () => {
    if (!reason.trim()) return; // Can enforce validation if needed
    onConfirm(reason, duration);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#081D3A]/30 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-100">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                  <ShieldAlert className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 leading-tight">Ban Customer</h3>
              </div>
           </div>
           <button 
             onClick={onClose}
             className="p-1.5 bg-white border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-900 rounded-full transition-colors"
           >
             <X className="w-4 h-4" />
           </button>
        </div>

        {/* Body Content */}
        <div className="p-6 flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            You are about to ban <strong className="text-gray-900">{customer.firstName} {customer.lastName}</strong>. Please provide a reason and select the duration of this ban.
          </p>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Reason for Ban <span className="text-red-500">*</span></label>
            <textarea
              className="w-full border border-gray-200 rounded-xl p-3 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition resize-none h-24"
              placeholder="e.g. Violation of terms of service..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Ban Duration <span className="text-red-500">*</span></label>
            <div className="relative">
              <select
                className="w-full appearance-none border border-gray-200 rounded-xl p-3 pr-10 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition bg-white"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              >
                <option value="1_day">1 Day</option>
                <option value="5_days">5 Days</option>
                <option value="7_days">7 Days</option>
                <option value="30_days">30 Days</option>
                <option value="3_months">3 Months</option>
                <option value="6_months">6 Months</option>
                <option value="permanent">Permanent</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 border-t border-gray-100 p-4 px-6 flex items-center justify-end gap-3">
            <button 
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-xl transition-all"
            >
                Cancel
            </button>
            <button 
                onClick={handleConfirm}
                disabled={!reason.trim()}
                className={`px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all shadow-sm ${
                    reason.trim() 
                        ? "bg-red-600 hover:bg-red-700" 
                        : "bg-red-300 cursor-not-allowed"
                }`}
            >
                Confirm Ban
            </button>
        </div>
        
      </div>
    </div>
  );
}
