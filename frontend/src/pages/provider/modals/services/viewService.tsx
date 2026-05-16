import React from "react";
import {
  X,
  Briefcase,
  DollarSign,
  Tag,
  FileText,
  Hash,
  Eye,
  EyeOff,
  Image as ImageIcon,
  Star,
  CalendarDays,
  RefreshCw,
} from "lucide-react";

interface ViewServiceModalProps {
  open: boolean;
  onClose: () => void;
  service: any | null;
}

const DetailRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}> = ({ icon, label, value }) => (
  <div className="flex flex-col rounded-2xl border border-[#e9e3d3] p-4 bg-white shadow-sm">
    <div className="flex items-center gap-2 text-[#5f5f5f] mb-1">
      <span className="text-[#c9a84c]">{icon}</span>
      <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
    </div>
    <div className="text-[15px] font-medium text-[#1a1a1a]">{value}</div>
  </div>
);

const ViewServiceModal: React.FC<ViewServiceModalProps> = ({
  open,
  onClose,
  service,
}) => {
  if (!open || !service) return null;

  const isActive = !service.hidden;
  const rating = service.rating ?? 0;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#1a1a1a]/70" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-[#c9a84c] via-[#e4c97c] to-[#c9a84c]" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-5">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#1a1a1a]">
              Service Details
            </h2>
            <p className="mt-1.5 text-sm font-medium text-[#5f5f5f]">
              Full overview of this service listing.
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#faf9f7] text-[#5f5f5f] transition-colors hover:bg-[#f0ebe0] hover:text-[#1a1a1a]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex flex-col max-h-[75vh]">
          <div className="flex-1 overflow-y-auto px-5 sm:px-8 pb-6 sm:pb-8 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8">

              {/* Left Column — Details */}
              <div className="md:col-span-3 flex flex-col gap-4">

                {/* Status Banner */}
                <div className="flex items-center justify-between rounded-2xl bg-[#faf9f7] p-5 border border-[#e9e3d3]">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#9a9a9a]">
                      Current Status
                    </p>
                    <p className="text-sm font-medium text-[#1a1a1a] mt-0.5">
                      Service is currently{" "}
                      <span
                        className="font-semibold"
                        style={{ color: isActive ? "#059669" : "#9a9a9a" }}
                      >
                        {isActive ? "available" : "unavailable"}
                      </span>
                    </p>
                  </div>
                  {isActive ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Available
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-50 px-2.5 py-1 text-xs font-semibold text-neutral-600 ring-1 ring-inset ring-neutral-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-400" />
                      Unavailable
                    </span>
                  )}
                </div>

                {/* ID */}
                <DetailRow
                  icon={<Hash className="h-4 w-4" />}
                  label="Service ID"
                  value={
                    <span className="font-mono text-sm text-[#5f5f5f] break-all">
                      {service._id}
                    </span>
                  }
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <DetailRow
                    icon={<Briefcase className="h-4 w-4" />}
                    label="Service Name"
                    value={service.name}
                  />
                  {/* Category */}
                  <DetailRow
                    icon={<Tag className="h-4 w-4" />}
                    label="Category"
                    value={service.category}
                  />
                  {/* Price */}
                  <DetailRow
                    icon={<DollarSign className="h-4 w-4" />}
                    label="Price"
                    value={
                      <span className="text-[#c9a84c] font-bold text-lg">
                        ${Number(service.price).toFixed(2)}
                      </span>
                    }
                  />
                  {/* Rating */}
                  <DetailRow
                    icon={<Star className="h-4 w-4" />}
                    label="Rating"
                    value={
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold">{rating.toFixed(1)}</span>
                        <span className="text-[#9a9a9a] text-sm">/ 5</span>
                        <div className="flex ml-1 gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={12}
                              className={
                                star <= Math.round(rating)
                                  ? "text-[#c9a84c] fill-[#c9a84c]"
                                  : "text-[#d4d0c8]"
                              }
                            />
                          ))}
                        </div>
                      </div>
                    }
                  />
                </div>

                {/* Visibility */}
                <DetailRow
                  icon={
                    isActive ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )
                  }
                  label="Visibility"
                  value={
                    isActive
                      ? "Visible to clients on the platform"
                      : "Hidden from clients (archived)"
                  }
                />

                {/* Description */}
                {service.description && (
                  <div className="flex flex-col rounded-2xl border border-[#e9e3d3] p-4 bg-white shadow-sm">
                    <div className="flex items-center gap-2 text-[#5f5f5f] mb-2">
                      <FileText className="h-4 w-4 text-[#c9a84c]" />
                      <span className="text-xs font-semibold uppercase tracking-wider">
                        Description
                      </span>
                    </div>
                    <p className="text-[15px] text-[#1a1a1a] leading-relaxed whitespace-pre-wrap">
                      {service.description}
                    </p>
                  </div>
                )}

                {/* Timestamps */}
                {(service.createdAt || service.updatedAt) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {service.createdAt && (
                      <DetailRow
                        icon={<CalendarDays className="h-4 w-4" />}
                        label="Created At"
                        value={new Date(service.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      />
                    )}
                    {service.updatedAt && (
                      <DetailRow
                        icon={<RefreshCw className="h-4 w-4" />}
                        label="Last Updated"
                        value={new Date(service.updatedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Right Column — Image */}
              <div className="md:col-span-2 flex flex-col gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#1a1a1a]">
                    Service Image
                  </label>
                  <p className="mb-3 text-xs text-[#5f5f5f]">
                    The visual preview shown to clients.
                  </p>
                  <div
                    className={`relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border-2 h-60 ${
                      service.image
                        ? "border-[#c9a84c] bg-[#fffcf5]"
                        : "border-dashed border-[#e9e3d3] bg-white"
                    }`}
                  >
                    {service.image ? (
                      <img
                        src={service.image}
                        alt={service.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center px-6 text-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#faf9f7] shadow-sm ring-1 ring-[#e9e3d3]">
                          <ImageIcon className="h-6 w-6 text-[#c9a84c]" />
                        </div>
                        <span className="text-sm font-semibold text-[#9a9a9a]">
                          No image uploaded
                        </span>
                        <span className="mt-1 text-xs text-[#b1b1b1]">
                          Edit this service to add an image
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-[#eceae5] bg-[#faf9f7] px-5 sm:px-8 py-4 sm:py-5">
            <div className="flex items-center justify-end">
              <button
                onClick={onClose}
                className="h-11 rounded-xl border border-[#e9e3d3] bg-white px-6 text-[15px] font-semibold text-[#1a1a1a] transition-colors hover:bg-[#faf9f7] hover:text-[#5f5f5f]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewServiceModal;
