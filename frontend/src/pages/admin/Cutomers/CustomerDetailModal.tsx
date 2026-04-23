import {
  X,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
} from "lucide-react";
import {
  type Customer,
  avatarColors,
} from "../Providers/data/customersMockData";

interface CustomerDetailModalProps {
  customer: Customer;
  onClose: () => void;
}

export default function CustomerDetailModal({
  customer,
  onClose,
}: CustomerDetailModalProps) {
  const isServiceProvider = customer.role === "service_provider";

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
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-sm border-2 border-white -mt-2"
              style={{
                backgroundColor: avatarColors[customer.avatar] || "#6366f1",
              }}
            >
              {customer.avatar}
            </div>
            <div className="pb-2">
              <h3 className="text-xl font-bold text-[#081D3A] leading-tight">
                {customer.firstName} {customer.lastName}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`inline-flex shrink-0 items-center justify-center text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${customer.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                >
                  {customer.status}
                </span>
                <span className="text-gray-300">&bull;</span>
                <span
                  className={`inline-flex shrink-0 items-center justify-center text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${isServiceProvider ? "bg-purple-50 text-purple-700 border border-purple-200" : "bg-blue-50 text-blue-600 border border-blue-100"}`}
                >
                  {isServiceProvider ? "Service Provider" : "Customer"}
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

        {/* Body Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1: Info Stack */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                  <Mail className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    Email
                  </p>
                  <p className="font-semibold text-gray-900">
                    {customer.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                  <Phone className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    Phone
                  </p>
                  <p className="font-semibold text-gray-900">
                    {customer.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shrink-0">
                  <Calendar className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    Joined Date
                  </p>
                  <p className="font-semibold text-gray-900">
                    {customer.joinedDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Column 2: Stats & Notes Box */}
            <div className="flex flex-col gap-4">
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex items-center justify-center">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <ShoppingBag className="w-3 h-3" /> Total Bookings
                  </p>
                  <p className="font-bold text-xl text-[#081D3A]">
                    {customer.totalBookings}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5 text-[13px] text-blue-800 font-medium">
                Customer is currently marked as{" "}
                <strong>{customer.status}</strong> and acts as a{" "}
                <strong>
                  {isServiceProvider ? "service provider" : "standard customer"}
                </strong>{" "}
                on the platform.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
