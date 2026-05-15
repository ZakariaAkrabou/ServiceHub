import React, { useMemo, useState } from "react";
import AddServiceModal from "./modals/services/addService";
import EditServiceModal, { type ServiceData } from "./modals/services/editService";
import ProviderLayouts from "../../components/provider/ProviderLayouts";
import {
  servicesTable as mockServices,
  type ServiceRow,
} from "./data/providerOverviewMock";
import { Plus, Edit, Trash2, EyeOff, Eye } from "lucide-react";

const PAGE_SIZE = 5;
const gold = "#c9a84c";

const ProviderServices: React.FC = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [services, setServices] = useState<ServiceRow[]>(mockServices);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<ServiceData | null>(null);
  // Filtered and searched services
  const filtered = useMemo(() => {
    let rows = services;
    if (filter === "active") rows = rows.filter((s) => s.active);
    if (filter === "inactive") rows = rows.filter((s) => !s.active);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.price.toLowerCase().includes(q),
      );
    }
    return rows;
  }, [services, search, filter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Actions
  const handleDelete = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };
  const handleToggle = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)),
    );
  };

  const handleEditClick = (s: ServiceRow) => {
    setServiceToEdit({
      id: s.id,
      name: s.name,
      description: "", 
      price: s.price.replace(/[^0-9.]/g, ''),
      category: s.category,
      available: s.active,
      image: null,
    });
    setEditModalOpen(true);
  };

  return (
    <ProviderLayouts>
      <AddServiceModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={(service) => {
          setServices((prev) => [
            {
              id: `S-${Math.floor(Math.random() * 10000)}`,
              name: service.name,
              category: service.category,
              price: service.price,
              bookings: 0,
              active: service.available,
            },
            ...prev,
          ]);
          setPage(1);
        }}
      />
      <EditServiceModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setServiceToEdit(null);
        }}
        service={serviceToEdit}
        onEdit={(updatedService) => {
          setServices((prev) =>
            prev.map((s) =>
              s.id === updatedService.id
                ? {
                    ...s,
                    name: updatedService.name,
                    category: updatedService.category,
                    price: `$${Number(updatedService.price).toFixed(2)}`,
                    active: updatedService.available,
                  }
                : s
            )
          );
        }}
      />
      <div className="flex flex-col gap-6 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="min-w-0">
            <h1
              className="font-sans text-2xl font-bold tracking-tight text-[#1a1a1a] sm:text-3xl"
              style={{ letterSpacing: "-0.5px" }}
            >
              <span style={{ color: gold }}>Services</span> Management
            </h1>
            <p className="mt-1 text-[#5f5f5f] text-base">
              View, search, and manage your{" "}
              <span style={{ color: gold, fontWeight: 600 }}>services</span>.
            </p>
          </div>
          <button
            className="inline-flex items-center gap-2 rounded-full bg-[#c9a84c] px-5 py-2.5 text-sm font-semibold text-[#1a1a1a] shadow-sm transition hover:bg-[#e0bc66]"
            style={{ fontWeight: 600 }}
            onClick={() => setModalOpen(true)}
          >
            <Plus size={18} /> Add new service
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between w-full">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full sm:min-w-45 rounded-lg border border-[#e9e3d3] px-3 py-2 text-sm focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20 outline-none bg-white"
              style={{ color: "#1a1a1a" }}
            />
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-[#e9e3d3] px-3 py-2 text-sm bg-white text-[#1a1a1a] focus:border-[#c9a84c] focus:ring-2 focus:ring-[#c9a84c]/20"
            >
              <option value="all">All</option>
              <option value="active">Available</option>
              <option value="inactive">Unavailable</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#e9e3d3] bg-white shadow-sm w-full">
          <table className="w-full min-w-125 lg:min-w-150 text-left text-sm">
            <thead>
              <tr className="border-b border-[#eceae5] bg-[#faf9f7] text-xs uppercase tracking-wide text-[#5f5f5f]">
                <th className="px-4 py-3 font-medium sm:px-5">Service</th>
                <th className="hidden md:table-cell px-4 py-3 font-medium sm:px-5">Category</th>
                <th className="px-4 py-3 font-medium sm:px-5">Price</th>
                <th className="hidden sm:table-cell px-4 py-3 text-right font-medium sm:px-5">
                  Bookings
                </th>
                <th className="px-4 py-3 font-medium sm:px-5">Status</th>
                <th className="px-4 py-3 font-medium sm:px-5 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f1eb]">
              {paginated.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-[#9a9a9a]"
                  >
                    No services found.
                  </td>
                </tr>
              ) : (
                paginated.map((s) => (
                  <tr key={s.id} className="hover:bg-[#faf9f7]/80">
                    <td className="px-4 py-3 font-medium text-[#1a1a1a] sm:px-5">
                      <div className="max-w-37.5 truncate sm:max-w-none">{s.name}</div>
                      <div className="md:hidden text-[11px] text-[#9a9a9a] mt-0.5">{s.category}</div>
                    </td>
                    <td className="hidden md:table-cell px-4 py-3 text-[#5f5f5f] sm:px-5">
                      {s.category}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-[#5f5f5f] sm:px-5">
                      {s.price}
                    </td>
                    <td className="hidden sm:table-cell px-4 py-3 text-right tabular-nums text-[#1a1a1a] sm:px-5">
                      {s.bookings}
                    </td>
                    <td className="px-4 py-3 sm:px-5">
                      {s.active ? (
                        <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800 ring-1 ring-inset ring-emerald-100">
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600 ring-1 ring-inset ring-neutral-200">
                          Unavailable
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right sm:px-5">
                      <button
                        title="Edit"
                        onClick={() => handleEditClick(s)}
                        className="inline-flex items-center justify-center rounded-full p-2 hover:bg-[#faf9f7] text-[#c9a84c]"
                        style={{ marginRight: 4 }}
                      >
                        <Edit size={17} />
                      </button>
                      <button
                        title={
                          s.active ? "Mark as unavailable" : "Mark as available"
                        }
                        onClick={() => handleToggle(s.id)}
                        className="inline-flex items-center justify-center rounded-full p-2 hover:bg-[#faf9f7] text-[#1a1a2e]"
                        style={{ marginRight: 4 }}
                      >
                        {s.active ? <EyeOff size={17} /> : <Eye size={17} />}
                      </button>
                      <button
                        title="Delete"
                        onClick={() => handleDelete(s.id)}
                        className="inline-flex items-center justify-center rounded-full p-2 hover:bg-[#fdf5f5] text-[#a33a3a]"
                      >
                        <Trash2 size={17} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end items-center gap-2 mt-4">
          <button
            className="rounded-lg border border-[#e9e3d3] px-3 py-1.5 text-sm text-[#1a1a1a] bg-white disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Prev
          </button>
          <span className="text-[#5f5f5f] text-sm">
            Page <span style={{ color: gold, fontWeight: 600 }}>{page}</span> of{" "}
            {totalPages}
          </span>
          <button
            className="rounded-lg border border-[#e9e3d3] px-3 py-1.5 text-sm text-[#1a1a1a] bg-white disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </ProviderLayouts>
  );
};

export default ProviderServices;
