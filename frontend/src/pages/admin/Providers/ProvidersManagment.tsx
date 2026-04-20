import { useState } from "react";
import { Search, XCircle, Briefcase, Eye, Phone } from "lucide-react";

import {
  type Provider,
  initialProvidersList,
  statusStyle,
} from "./data/providersMockData";
import ProviderDetailModal from "./ProviderDetailModal";

export default function ProvidersManagement() {
  const [providers, setProviders] = useState<Provider[]>(initialProvidersList);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
    null,
  );

  const handleStatusChange = (
    id: string,
    newStatus: "Active" | "Rejected" | "Pending",
  ) => {
    setProviders((prev) =>
      prev.map((provider) => {
        if (provider.id === id) {
          const updated = { ...provider, status: newStatus };
          if (selectedProvider?.id === id) setSelectedProvider(updated);
          return updated;
        }
        return provider;
      }),
    );
  };

  const filteredProviders = providers.filter((provider) => {
    const matchesSearch =
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || provider.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalItems = filteredProviders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProviders = filteredProviders.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-8 pb-10 min-h-screen bg-[#F8FAFC]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-[#081D3A] tracking-tight">
            Providers
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Manage and verify your professional service network
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* ── Search & Filter Bar ── */}
        <div className="bg-white rounded-4xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 flex flex-col lg:flex-row gap-6 items-center justify-between">
          <div className="relative w-full lg:max-w-xl group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#081D3A] transition-colors" />
            <input
              type="text"
              placeholder="Search by name, ID, or specialty..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#081D3A]/10 focus:bg-white focus:border-[#081D3A] transition-all"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-3 w-full sm:w-auto bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                Filter by Status
              </span>
              <select
                value={statusFilter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="bg-transparent text-sm font-bold text-[#081D3A] outline-none cursor-pointer pr-4"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Main List Container ── */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(8,29,58,0.05)] border border-slate-100 overflow-hidden">
          {/* Mobile View (Cards) */}
          <div className="md:hidden divide-y divide-slate-50">
            {currentProviders.map((provider) => (
              <div
                key={provider.id}
                className="p-6 space-y-6 hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#F6E304] flex items-center justify-center text-[#081D3A] font-black text-xl shadow-inner border border-white/50">
                      {provider.name.charAt(0)}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-slate-900">
                        {provider.name}
                      </h3>
                      <p className="text-xs font-semibold text-slate-400">
                        {provider.email}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedProvider(provider)}
                    className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#081D3A] hover:bg-[#F6E304]/20 transition-all border border-slate-100"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100/50 space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      Role
                    </p>
                    <p className="text-[10px] font-bold text-[#081D3A]">
                      Service Provider
                    </p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100/50 space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      Status
                    </p>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${statusStyle[provider.status]}`}
                    >
                      {provider.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  {provider.status === "Pending" ? (
                    <>
                      <button
                        onClick={() =>
                          handleStatusChange(provider.id, "Active")
                        }
                        className="flex-1 py-3 bg-emerald-500 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          handleStatusChange(provider.id, "Rejected")
                        }
                        className="flex-1 py-3 bg-white text-slate-400 text-xs font-black uppercase tracking-widest rounded-xl border border-slate-200 hover:bg-slate-50 transition-all"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <div className="w-full relative">
                      <select
                        className="w-full py-3 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-[#081D3A] uppercase tracking-widest appearance-none outline-none focus:border-[#081D3A] transition-all"
                        value={provider.status}
                        onChange={(e) =>
                          handleStatusChange(provider.id, e.target.value as any)
                        }
                      >
                        <option value="Active">Set Active</option>
                        <option value="Pending">Set Pending</option>
                        <option value="Rejected">Set Rejected</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View (Table) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-y border-slate-100">
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] min-w-50">
                    Provider Profile
                  </th>
                  <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">
                    Phone Number
                  </th>
                  <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">
                    Specialization
                  </th>
                  <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">
                    Role
                  </th>
                  <th className="px-6 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">
                    Current Status
                  </th>
                  <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/50">
                {currentProviders.map((provider) => (
                  <tr
                    key={provider.id}
                    className="group hover:bg-blue-50/20 transition-all duration-300"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#081D3A] font-black text-lg border border-slate-100 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                          {provider.name.charAt(0)}
                        </div>
                        <div className="space-y-1">
                          <p className="font-bold text-slate-900 group-hover:text-[#081D3A] transition-colors">
                            {provider.name}
                          </p>
                          <p className="text-xs font-semibold text-slate-400">
                            {provider.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 font-semibold text-slate-600 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-300" />
                        <span className="text-xs">{provider.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6 font-semibold text-slate-600 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-slate-300" />
                        <span>{provider.specialty}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <span className="inline-flex px-3 py-1.5 rounded-lg bg-[#081D3A]/5 text-[#081D3A] text-[10px] font-black uppercase tracking-widest border border-[#081D3A]/10">
                        Service Provider
                      </span>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <span
                        className={`inline-flex px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${statusStyle[provider.status]}`}
                      >
                        {provider.status}
                      </span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <div className="flex items-center justify-end gap-3">
                        {provider.status === "Pending" ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleStatusChange(provider.id, "Active")
                              }
                              className="px-4 py-2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all active:scale-95"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange(provider.id, "Rejected")
                              }
                              className="w-9 h-9 flex items-center justify-center bg-white text-slate-300 hover:text-red-500 hover:border-red-200 border border-slate-200 rounded-xl transition-all"
                            >
                              <XCircle className="w-5 h-5" />
                            </button>
                          </div>
                        ) : (
                          <div className="relative group/select">
                            <select
                              className="pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black text-[#081D3A] uppercase tracking-widest appearance-none outline-none focus:bg-white focus:border-[#081D3A] transition-all cursor-pointer"
                              value={provider.status}
                              onChange={(e) =>
                                handleStatusChange(
                                  provider.id,
                                  e.target.value as any,
                                )
                              }
                            >
                              <option value="Active">Set Active</option>
                              <option value="Pending">Set Pending</option>
                              <option value="Rejected">Set Rejected</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover/select:text-[#081D3A]">
                              <svg
                                className="w-3 h-3 fill-current"
                                viewBox="0 0 20 20"
                              >
                                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                              </svg>
                            </div>
                          </div>
                        )}
                        <button
                          onClick={() => setSelectedProvider(provider)}
                          className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-[#081D3A] hover:bg-[#F6E304] transition-all border border-slate-100 shadow-sm cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {totalPages > 0 && (
            <div className="px-8 py-6 border-t border-slate-50 bg-slate-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Page Results
                </span>
                <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-[#081D3A]">
                  {startIndex + 1}-
                  {Math.min(startIndex + itemsPerPage, totalItems)} of{" "}
                  {totalItems}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-6 py-2.5 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Prev
                </button>
                <div className="flex gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-9 h-9 rounded-xl text-[10px] font-black transition-all ${currentPage === i + 1 ? "bg-[#081D3A] text-white shadow-lg shadow-[#081D3A]/20" : "bg-white text-slate-400 hover:bg-slate-50 border border-slate-100"}`}
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
                  className="px-6 py-2.5 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Provider Details Modal ── */}
      {selectedProvider && (
        <ProviderDetailModal
          provider={selectedProvider}
          onClose={() => setSelectedProvider(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}
