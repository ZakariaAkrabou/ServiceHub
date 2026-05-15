import React, { useRef, useState, useMemo, useEffect } from "react";
import {
  X,
  Upload,
  Briefcase,
  DollarSign,
  Tag,
  Image as ImageIcon,
} from "lucide-react";

interface AddServiceModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (service: {
    name: string;
    description: string;
    price: string;
    category: string;
    available: boolean;
    image?: File | null;
  }) => void;
}

const AddServiceModal: React.FC<AddServiceModalProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    available: true,
    image: null as File | null,
  });

  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Memoize image preview URL
  const imageUrl = useMemo(() => {
    if (form.image) {
      return URL.createObjectURL(form.image);
    }
    return null;
  }, [form.image]);

  // Revoke object URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    // @ts-ignore
    const checked = e.target.checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      image: e.target.files?.[0] || null,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.price || !form.category) {
      setError("Name, price, and category are required.");
      return;
    }

    setError("");
    onAdd(form);
    setForm({
      name: "",
      description: "",
      price: "",
      category: "",
      available: true,
      image: null,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop (Removed backdrop-blur to prevent rendering lag) */}
      <div
        className="absolute inset-0 bg-[#1a1a1a]/70"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-[#c9a84c] via-[#e4c97c] to-[#c9a84c]" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-5">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#1a1a1a]">
              Add New Service
            </h2>
            <p className="mt-1.5 text-sm font-medium text-[#5f5f5f]">
              Expand your offerings and attract more clients.
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

        <form onSubmit={handleSubmit} className="flex flex-col max-h-[85vh] sm:max-h-[75vh]">
          <div className="flex-1 overflow-y-auto px-5 sm:px-8 pb-6 sm:pb-8 custom-scrollbar">
            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700 flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600 font-bold text-xs">
                  !
                </span>
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8">
              {/* Left Column: Form Fields */}
              <div className="md:col-span-3 flex flex-col gap-5">
                {/* Service Name */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#1a1a1a]">
                    Service Name <span className="text-[#c9a84c]">*</span>
                  </label>
                  <div className="group relative">
                    <Briefcase className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9a9a] transition-colors group-focus-within:text-[#c9a84c]" />
                    <input
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Signature Massage"
                      className="h-12 w-full rounded-xl border border-[#e9e3d3] bg-[#faf9f7] pl-11 pr-4 text-[15px] text-[#1a1a1a] outline-none transition-colors placeholder:text-[#b1b1b1] focus:border-[#c9a84c] focus:bg-white focus:shadow-[0_0_0_4px_rgba(201,168,76,0.1)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#1a1a1a]">
                      Category <span className="text-[#c9a84c]">*</span>
                    </label>
                    <div className="group relative">
                      <Tag className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9a9a] transition-colors group-focus-within:text-[#c9a84c]" />
                      <input
                        name="category"
                        type="text"
                        value={form.category}
                        onChange={handleChange}
                        placeholder="e.g. Wellness"
                        className="h-12 w-full rounded-xl border border-[#e9e3d3] bg-[#faf9f7] pl-11 pr-4 text-[15px] text-[#1a1a1a] outline-none transition-colors placeholder:text-[#b1b1b1] focus:border-[#c9a84c] focus:bg-white focus:shadow-[0_0_0_4px_rgba(201,168,76,0.1)]"
                      />
                    </div>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#1a1a1a]">
                      Price <span className="text-[#c9a84c]">*</span>
                    </label>
                    <div className="group relative">
                      <DollarSign className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a9a9a] transition-colors group-focus-within:text-[#c9a84c]" />
                      <input
                        name="price"
                        type="number"
                        step="0.01"
                        value={form.price}
                        onChange={handleChange}
                        placeholder="0.00"
                        className="h-12 w-full rounded-xl border border-[#e9e3d3] bg-[#faf9f7] pl-11 pr-4 text-[15px] text-[#1a1a1a] outline-none transition-colors placeholder:text-[#b1b1b1] focus:border-[#c9a84c] focus:bg-white focus:shadow-[0_0_0_4px_rgba(201,168,76,0.1)]"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#1a1a1a]">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe the benefits, duration, and what clients should expect..."
                    className="w-full resize-none rounded-xl border border-[#e9e3d3] bg-[#faf9f7] p-4 text-[15px] text-[#1a1a1a] outline-none transition-colors placeholder:text-[#b1b1b1] focus:border-[#c9a84c] focus:bg-white focus:shadow-[0_0_0_4px_rgba(201,168,76,0.1)]"
                  />
                </div>

                {/* Availability Toggle */}
                <div className="flex items-center justify-between rounded-xl border border-[#e9e3d3] bg-[#faf9f7] p-4">
                  <div>
                    <h4 className="text-sm font-semibold text-[#1a1a1a]">
                      Availability
                    </h4>
                    <p className="text-xs text-[#5f5f5f] mt-0.5">
                      Make this service bookable immediately
                    </p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      name="available"
                      type="checkbox"
                      className="peer sr-only"
                      checked={form.available}
                      onChange={handleChange}
                    />
                    <div className="peer h-6 w-11 rounded-full bg-[#d4d0c8] after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-colors after:content-[''] peer-checked:bg-[#c9a84c] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#c9a84c]/30"></div>
                  </label>
                </div>
              </div>

              <div className="md:col-span-2 flex flex-col gap-5">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#1a1a1a]">
                    Service Media
                  </label>
                  <p className="mb-3 text-xs text-[#5f5f5f]">
                    A high-quality image helps clients visualize the service.
                  </p>

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative flex cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed transition-colors hover:bg-[#faf9f7] ${
                      form.image
                        ? "border-[#c9a84c] bg-[#fffcf5]"
                        : "border-[#e9e3d3] bg-white"
                    } h-60`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFile}
                      className="hidden"
                    />

                    {form.image && imageUrl ? (
                      <div className="group relative h-full w-full">
                        <img
                          src={imageUrl}
                          alt="Preview"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                          <span className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-[#1a1a1a] shadow-sm">
                            <Upload className="h-4 w-4" /> Change Photo
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center px-6 text-center">
                        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#faf9f7] shadow-sm ring-1 ring-[#e9e3d3]">
                          <ImageIcon className="h-6 w-6 text-[#c9a84c]" />
                        </div>
                        <span className="text-sm font-semibold text-[#c9a84c]">
                          Click to upload
                        </span>
                        <span className="mt-1 text-xs text-[#9a9a9a]">
                          SVG, PNG, JPG or GIF (max. 5MB)
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
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="h-11 rounded-xl border border-[#e9e3d3] bg-white px-6 text-[15px] font-semibold text-[#1a1a1a] transition-colors hover:bg-[#faf9f7] hover:text-[#5f5f5f]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#c9a84c] px-8 text-[15px] font-semibold text-[#1a1a1a] shadow-sm transition-colors hover:bg-[#d6b45d] hover:shadow-md"
              >
                Create Service
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddServiceModal;
