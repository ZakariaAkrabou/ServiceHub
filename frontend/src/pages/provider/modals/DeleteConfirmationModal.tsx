import React from "react";
import { X, Trash2, AlertTriangle } from "lucide-react";

interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1a1a1a]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Top Accent Line (Red for danger) */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-red-500" />

        <div className="px-6 pt-8 pb-6 text-center">
          {/* Icon */}
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 ring-8 ring-red-50/50">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>

          <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">{title}</h3>
          <p className="text-[#5f5f5f] text-sm leading-relaxed px-2">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row gap-3 px-6 pb-8">
          <button
            onClick={onClose}
            className="flex-1 h-12 rounded-xl border border-[#e9e3d3] bg-white px-6 text-[15px] font-semibold text-[#1a1a1a] transition-colors hover:bg-[#faf9f7]"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 h-12 rounded-xl bg-red-600 px-6 text-[15px] font-semibold text-white shadow-sm transition-all hover:bg-red-700 hover:shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
