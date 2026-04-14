import { useState } from "react";
import { 
  Search, 
  Star,
  CheckCircle2,
  XCircle,
  Briefcase,
  Eye,
} from "lucide-react";

import { type Provider, initialProvidersList, statusStyle } from "./data/providersMockData";
import ProviderDetailModal from "./ProviderDetailModal";

export default function ProvidersManagement() {
  const [providers, setProviders] = useState<Provider[]>(initialProvidersList);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;


  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);


  const handleStatusChange = (id: string, newStatus: "Active" | "Rejected" | "Pending") => {
    setProviders((prev) => 
      prev.map((provider) => {
        if (provider.id === id) {
          const updated = { ...provider, status: newStatus };
          if (selectedProvider?.id === id) setSelectedProvider(updated);
          return updated;
        }
        return provider;
      })
    );
  };

  const filteredProviders = providers.filter((provider) => {
    const matchesSearch = 
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      provider.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || provider.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  
  const totalItems = filteredProviders.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProviders = filteredProviders.slice(startIndex, startIndex + itemsPerPage);

 
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };
  
  const handleFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-6 pb-6 min-h-full">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Providers</h1>
          <p className="text-sm text-gray-400 mt-0.5">View and manage service provider applications</p>
        </div>
      </div>

      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by name, ID, or specialty..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F6E304] focus:border-transparent transition-all"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="text-sm font-medium text-gray-500 whitespace-nowrap hidden sm:block">Filter by Status:</span>
          <select 
            value={statusFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:ring-2 focus:ring-[#081D3A] transition-all cursor-pointer hover:bg-gray-50"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

    
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col shrink-0 mb-6">
        <div className="overflow-x-visible">
          
          
          <div className="md:hidden flex flex-col divide-y divide-gray-100">
            {currentProviders.map((provider) => (
              <div key={provider.id} className="p-4 flex flex-col gap-4 group hover:bg-gray-50/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-700 font-bold shrink-0" style={{ backgroundColor: "#F3F3F3" }}>
                      {provider.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 group-hover:text-[#081D3A] transition-colors">{provider.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{provider.email}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedProvider(provider)}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 hover:bg-[#F6E304] text-[#081D3A] transition-all border border-gray-200/60 shadow-sm"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-xs bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-gray-400 font-medium">Status</span>
                    <span
                      className={`w-max text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusStyle[provider.status]}`}
                    >
                      {provider.status}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-gray-400 font-medium">Specialty</span>
                    <span className="font-medium text-gray-700 flex items-center gap-1.5">
                      <Briefcase className="w-3 h-3 text-gray-400" /> {provider.specialty}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1.5 mt-1">
                    <span className="text-gray-400 font-medium">Performance</span>
                    <div className="flex items-center gap-1">
                      <Star className={`w-3.5 h-3.5 ${provider.rating > 0 ? "fill-[#F6E304] text-[#F6E304]" : "fill-gray-200 text-gray-200"}`} />
                      <span className="font-semibold text-gray-700">{provider.rating > 0 ? provider.rating : "N/A"}</span>
                      <span className="text-gray-400 ml-1">({provider.jobsCompleted})</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 mt-1">
                    <span className="text-gray-400 font-medium">Joined</span>
                    <span className="text-gray-600 font-medium">{provider.joinedDate}</span>
                  </div>
                </div>
                
                
                <div className="flex items-center gap-2 pt-1">
                  {provider.status === "Pending" ? (
                    <>
                      <button 
                        onClick={() => handleStatusChange(provider.id, "Active")}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors border border-emerald-200"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Accept
                      </button>
                      <button 
                        onClick={() => handleStatusChange(provider.id, "Rejected")}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors border border-red-200"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </>
                  ) : (
                    <select 
                      className="w-full text-xs font-semibold bg-gray-50 border border-gray-200 text-[#081D3A] rounded-xl outline-none py-2 px-3 hover:border-gray-300 transition-all focus:ring-1 focus:ring-[#081D3A] appearance-none focus:bg-white"
                      value={provider.status}
                      onChange={(e) => handleStatusChange(provider.id, e.target.value as any)}
                    >
                      <option value="Active">Set Active</option>
                      <option value="Pending">Set Pending</option>
                      <option value="Rejected">Set Rejected</option>
                    </select>
                  )}
                </div>
              </div>
            ))}
            
            {currentProviders.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                  <p className="font-medium text-gray-900">No providers found</p>
                  <p className="text-sm mt-1">Try adjusting your search query or filters.</p>
                </div>
              </div>
            )}
          </div>

          
          <table className="w-full text-sm hidden md:table">
            <thead>
              <tr className="text-left text-xs text-gray-400 border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-4 font-medium">Provider Details</th>
                <th className="px-6 py-4 font-medium">Specialty</th>
                <th className="px-6 py-4 font-medium hidden lg:table-cell">Joined Date</th>
                <th className="px-6 py-4 font-medium">Performance</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentProviders.map((provider) => (
                <tr
                  key={provider.id}
                  className="hover:bg-gray-50/60 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-700 font-bold shrink-0" style={{ backgroundColor: "#F3F3F3" }}>
                        {provider.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 group-hover:text-[#081D3A] transition-colors">{provider.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{provider.email}</p>
                        <p className="text-[10px] font-mono text-gray-400 mt-0.5">{provider.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-gray-400" />
                      <span className="font-medium text-gray-700">{provider.specialty}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 text-xs hidden lg:table-cell">
                    {provider.joinedDate}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <Star className={`w-3.5 h-3.5 ${provider.rating > 0 ? "fill-[#F6E304] text-[#F6E304]" : "fill-gray-200 text-gray-200"}`} />
                        <span className="font-semibold text-gray-700">{provider.rating > 0 ? provider.rating : "N/A"}</span>
                      </div>
                      <span className="text-xs text-gray-400">{provider.jobsCompleted} jobs</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[provider.status]}`}
                    >
                      {provider.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2.5">
                      {provider.status === "Pending" ? (
                        <>
                          <button 
                            onClick={() => handleStatusChange(provider.id, "Active")}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
                            title="Accept"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> <span className="hidden xl:inline">Accept</span>
                          </button>
                          <button 
                            onClick={() => handleStatusChange(provider.id, "Rejected")}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
                            title="Reject"
                          >
                            <XCircle className="w-3.5 h-3.5" /> <span className="hidden xl:inline">Reject</span>
                          </button>
                        </>
                      ) : (
                        <select 
                          className="text-xs font-semibold bg-gray-50 border border-gray-200 text-[#081D3A] rounded-lg outline-none py-1.5 px-3 hover:border-gray-300 transition-all cursor-pointer focus:ring-1 focus:ring-[#081D3A] appearance-none focus:bg-white"
                          value={provider.status}
                          onChange={(e) => handleStatusChange(provider.id, e.target.value as any)}
                        >
                          <option value="Active">Set Active</option>
                          <option value="Pending">Set Pending</option>
                          <option value="Rejected">Set Rejected</option>
                        </select>
                      )}
                      
                      <button 
                        onClick={() => setSelectedProvider(provider)}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 hover:bg-[#F6E304] text-[#081D3A] transition-all border border-gray-200/60 shadow-sm"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {currentProviders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3">
                        <Search className="w-5 h-5 text-gray-400" />
                      </div>
                      <p className="font-medium text-gray-900">No providers found</p>
                      <p className="text-sm mt-1">Try adjusting your search query or filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination footer */}
        {totalPages > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Showing <span className="font-medium text-gray-900">{startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalItems)}</span> of <span className="font-medium text-gray-900">{totalItems}</span> results
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              <span className="text-xs font-medium text-gray-500 px-2 hidden sm:block">
                Page {currentPage} of {totalPages}
              </span>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
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
