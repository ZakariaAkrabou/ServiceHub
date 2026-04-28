import { UnbanIcon } from "./CustomerManagment";
import { type Customer } from "../Providers/data/customersMockData";

interface CustomerUnbanConfirmationModalProps {
  customer: Customer;
  onClose: () => void;
  onConfirm: () => void;
}

export default function CustomerUnbanConfirmationModal({
  customer,
  onClose,
  onConfirm,
}: CustomerUnbanConfirmationModalProps) {
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
            <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
              <UnbanIcon />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 leading-tight">
                Unban Customer
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-white border border-gray-200 text-gray-400 hover:bg-gray-50 hover:text-gray-900 rounded-full transition-colors cursor-pointer"
          >
            <span className="w-4 h-4">✕</span>
          </button>
        </div>
        {/* Body Content */}
        <div className="p-6 flex flex-col gap-4">
          <p className="text-sm text-gray-600">
            You are about to unban{" "}
            <strong className="text-gray-900">
              {customer.firstName} {customer.lastName}
            </strong>
            .
          </p>
          <div className="flex gap-3 justify-end mt-2">
            <button
              className="px-4 py-2 rounded-xl bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200 cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 cursor-pointer"
              onClick={onConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
