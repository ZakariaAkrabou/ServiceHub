import { useState } from "react";
import { useDispatch} from "react-redux";
import { setServices } from "../../../app/slices/ServiceSlice";
import { Search, Eye, Star} from "lucide-react";
import { statusStyle } from "./data/servicesMockData";
import ServiceDetailModal from "./ServiceDetailModal";
import {
  useGetAllServicesQuery,
  type Service as ApiService,
} from "../../../app/api/ServiceApi";
import React from "react";

export interface ServiceUI {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  priceUnit: "fixed" | "hr";
  providerName: string;
  status: "Active" | "Inactive";
  rating: number;
  image: string;
}

export default function ServicesManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedService, setSelectedService] = useState<ServiceUI | null>(
    null,
  );
  const { data, isLoading, isError} = useGetAllServicesQuery({
    page: currentPage,
    limit: itemsPerPage,
  }, { pollingInterval: 5000 });

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (data?.data) {
      dispatch(setServices(data.data));
    }
  }, [data, dispatch]);

  const servicesList: ServiceUI[] = (data?.data || []).map(
    (service: ApiService) => {
      let priceUnit: "fixed" | "hr" = "fixed";
      if (service.priceUnit === "hr" || service.priceUnit === "fixed") {
        priceUnit = service.priceUnit;
      }
      let status: "Active" | "Inactive" = "Active";
      if (service.status === "Inactive" || service.hidden === true) {
        status = "Inactive";
      }

      return {
        id: service._id,
        name: service.name,
        description: service.description,
        category: service.category || "Other",
        price: service.price,
        priceUnit,
        providerName: service.provider_id?.firstName
          ? `${service.provider_id.firstName} ${service.provider_id.lastName || ""}`
          : "N/A",
        status,
        rating: service.rating || 0,
        image: service.image || "https://placehold.co/400x300?text=No+Image",
      };
    },
  );

  const categories = ["All", ...new Set(servicesList.map((s) => s.category))];

  const filteredServices = servicesList.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.providerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || service.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const totalItems = data?.totalServices || 0;
  const totalPages = data?.totalPages || 1;
  const currentServices = filteredServices;

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleCategoryChange = (val: string) => {
    setCategoryFilter(val);
    setCurrentPage(1);
  };

  return (
    <div
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="flex flex-col gap-5"
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>
      
      {/* Header Section */}
      <div className="mb-2">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Services Catalog
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Manage and oversee platform service offerings
        </p>
      </div>

      {/* ── Search & Filter Bar ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 sm:px-5 py-4 flex flex-col gap-3">
          <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-yellow-500 transition-colors" />
            <input
              type="text"
              placeholder="Search services or providers..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition shadow-sm"
            />
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
                Category:
              </span>
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 bg-white cursor-pointer transition shadow-sm"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <span className="text-slate-400 text-lg font-bold">
              Loading services...
            </span>
          </div>
        ) : isError ? (
          <div className="flex justify-center items-center py-20">
            <span className="text-red-500 text-lg font-bold">
              Failed to load services.
            </span>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-4">
              {currentServices.map((service) => (
                <div
                  key={service.id}
                  className="group bg-white rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md flex flex-col md:flex-row items-stretch md:items-center p-4 gap-6"
                >
                  <div className="relative w-full md:w-48 h-40 md:h-36 rounded-xl overflow-hidden shrink-0 shadow-inner">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors" />
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm backdrop-blur-md ${statusStyle[service.status]}`}
                      >
                        {service.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5 md:mb-2 text-slate-400">
                      <span className="px-2 py-0.5 md:px-3 md:py-1 bg-[#081D3A] text-white text-[8px] md:text-[9px] font-black uppercase tracking-widest rounded-lg">
                        {service.category}
                      </span>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight transition-colors truncate">
                      {service.name}
                    </h3>
                    <p className="text-xs md:text-sm font-medium text-gray-500 line-clamp-1 mt-1">
                      {service.description}
                    </p>

                    <div className="flex items-center gap-4 md:gap-6 mt-3 md:mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 md:w-7 md:h-7 rounded-lg bg-gray-50 flex items-center justify-center text-[#081D3A] font-black text-[9px] md:text-[10px] border border-gray-100">
                          {service.providerName.charAt(0)}
                        </div>
                        <p className="text-[10px] md:text-xs font-bold text-gray-900">
                          {service.providerName}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 leading-none">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 -mt-0.5" />
                        <p className="text-[10px] md:text-xs font-bold text-gray-700">
                          {service.rating}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 md:gap-4 p-3 md:py-2 md:px-4 bg-gray-50 md:bg-transparent rounded-xl md:rounded-none md:border-l md:border-gray-50 min-w-fit">
                    <div className="text-left md:text-right">
                      <p className="text-[8px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest">
                        Rate
                      </p>
                      <span className="font-bold text-gray-900">
                        {service.price}
                      </span>{" "}
                      <span className="text-[10px] md:text-xs text-gray-400 font-bold uppercase">
                        MAD
                      </span>
                      <span className="text-[10px] md:text-xs text-gray-400 font-bold">
                        /{service.priceUnit}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedService(service)}
                      className="px-3 py-1.5 rounded-lg bg-yellow-50 text-yellow-700 text-xs font-semibold border border-yellow-200 hover:bg-yellow-100 transition cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 0 && (
              <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 rounded-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Page Results
                  </span>
                  <span className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-[#081D3A]">
                    {(currentPage - 1) * itemsPerPage + 1}-
                    {Math.min(currentPage * itemsPerPage, totalItems)} of{" "}
                    {totalItems}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-6 py-2.5 text-[10px] font-black text-gray-500 uppercase tracking-widest bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
                  >
                    Prev
                  </button>
                  <div className="flex gap-1">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-9 h-9 rounded-xl text-[10px] font-black transition-all cursor-pointer ${currentPage === i + 1 ? "bg-[#081D3A] text-white shadow-lg shadow-[#081D3A]/20" : "bg-white text-gray-400 hover:bg-gray-50 border border-gray-100"}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-6 py-2.5 text-[10px] font-black text-gray-500 uppercase tracking-widest bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {filteredServices.length === 0 && (
              <div className="bg-white rounded-2xl p-20 border border-dashed border-gray-200 flex flex-col items-center justify-center text-center shadow-sm">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <Search className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No results found
                </h3>
                <p className="text-gray-500 max-w-xs mx-auto text-sm">
                  We couldn't find any services matching your criteria. Try
                  adjusting your filters.
                </p>
              </div>
            )}
          </>
        )}

        {selectedService && (
          <ServiceDetailModal
            service={selectedService}
            onClose={() => setSelectedService(null)}
          />
        )}
    </div>
  );
}
