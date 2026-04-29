// RoleBadge component
function RoleBadge({ role }: { role: CustomerRole }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold w-fit ${
        role === "service_provider"
          ? "bg-purple-50 text-purple-700 border border-purple-200"
          : "bg-blue-50 text-blue-600 border border-blue-100"
      }`}
    >
      {role === "service_provider" ? "Service Provider" : "Customer"}
    </span>
  );
}

// ActionButtons component
function ActionButtons({
  onOpenDetails,
  onDeleteClick,
  onBanClick,
  onUnbanClick,
  isBanned,
}: {
  onOpenDetails: () => void;
  onDeleteClick: () => void;
  onBanClick: () => void;
  onUnbanClick?: () => void;
  isBanned?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-1.5"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        title="View Details"
        onClick={onOpenDetails}
        className="cursor-pointer text-gray-400 hover:text-indigo-600 transition p-1.5 rounded-lg hover:bg-indigo-50"
      >
        <EyeIcon />
      </button>
      {isBanned ? (
        <button
          title="Unban Customer"
          onClick={onUnbanClick}
          className="cursor-pointer text-green-500 hover:text-green-600 transition p-1.5 rounded-lg hover:bg-green-50"
        >
          <UnbanIcon />
        </button>
      ) : (
        <button
          title="Ban Customer"
          onClick={onBanClick}
          className="cursor-pointer text-red-500 hover:text-red-600 transition p-1.5 rounded-lg hover:bg-red-50"
        >
          <BanIcon />
        </button>
      )}
      <button
        title="Delete"
        onClick={onDeleteClick}
        className="cursor-pointer text-gray-400 hover:text-red-500 transition p-1.5 rounded-lg hover:bg-red-50"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
          <path d="M10 11v6M14 11v6" />
          <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </svg>
      </button>
    </div>
  );
}
import { useState } from "react";
import { toast } from "react-toastify";
import {
  type CustomerRole,
  type Customer,
} from "../Providers/data/customersMockData";
import {
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useBanUserMutation,
  useUnbanUserMutation,
} from "../../../app/api/UserApi";
import CustomerDetailModal from "./CustomerDetailModal";
import CustomerDeleteConfirmationModal from "./CustomerDeleteConfirmationModal";
import CustomerBanConfirmationModal from "./CustomerBanConfirmationModal";
import CustomerUnbanConfirmationModal from "./CustomerUnbanConfirmationModal";

type Status = "active" | "inactive" | "all";
type RoleFilter = CustomerRole | "all";

const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);
const ChevronIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);
const EyeIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const BanIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
  </svg>
);
export const UnbanIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M9 12l2 2 4-4" stroke="#22c55e" strokeWidth="2" fill="none" />
  </svg>
);


function FilterSelect<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-500 font-medium whitespace-nowrap">
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as T)}
          className="appearance-none pl-3 pr-8 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 bg-white cursor-pointer transition"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <ChevronIcon />
        </span>
      </div>
    </div>
  );
}

export default function CustomerManagement() {
  const [banUser] = useBanUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [unbanUser] = useUnbanUserMutation();
  const [customerToUnban, setCustomerToUnban] = useState<Customer | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status>("all");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(
    null,
  );
  const [customerToBan, setCustomerToBan] = useState<Customer | null>(null);

  const { data, isLoading, isError } = useGetAllUsersQuery({}, { pollingInterval: 5000 });
  const users = data?.data || [];

  const customers: (Customer & { isBanned?: boolean })[] = users.map(
    (u: any) => ({
      id: u._id,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      phone: u.phone || "",
      role: u.role,
      joinedDate: u.createdAt || "",
      totalBookings: u.totalBookings || 0,
      totalSpent: 0,
      status: u.status || "active",
      avatar: u.firstName ? u.firstName[0].toUpperCase() : "U",
      isBanned: u.isBanned || false,
    }),
  );

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch =
      `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    const matchRole = roleFilter === "all" || c.role === roleFilter;
    return matchSearch && matchStatus && matchRole;
  });

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCustomers = filtered.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-400">Loading users...</div>
    );
  }
  if (isError) {
    return (
      <div className="p-8 text-center text-red-500">Failed to load users.</div>
    );
  }

  return (
    <div
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      className="min-h-screen bg-gray-50 p-4 sm:p-6"
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`}</style>

      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Customers
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          View and manage registered customer accounts
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 sm:px-5 py-4 mb-5 flex flex-col gap-3">
        <div className="relative w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search by name, ID, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 transition"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <FilterSelect
            label="Role:"
            value={roleFilter}
            onChange={setRoleFilter}
            options={[
              { value: "all", label: "All Roles" },
              { value: "customer", label: "Customer" },
              { value: "service_provider", label: "Service Provider" },
            ]}
          />
          <FilterSelect
            label="Status:"
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: "all", label: "All Statuses" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center text-gray-400 text-sm">
          No customers match your search.
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <div className="grid grid-cols-[minmax(130px,1fr)_minmax(110px,1fr)_minmax(160px,2fr)_minmax(130px,1.2fr)_minmax(130px,1fr)_auto] gap-4 px-6 py-3 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide min-w-170">
                <span>First Name</span>
                <span>Last Name</span>
                <span>Email</span>
                <span>Phone Number</span>
                <span>Role</span>
                <span className="text-right pr-2">Action</span>
              </div>

              {currentCustomers.map((customer, i) => (
                <div
                  key={customer.id}
                  className={`grid grid-cols-[minmax(130px,1fr)_minmax(110px,1fr)_minmax(160px,2fr)_minmax(130px,1.2fr)_minmax(130px,1fr)_auto] gap-4 px-6 py-4 items-center border-b border-gray-50 hover:bg-gray-50/60 transition-colors min-w-170 ${
                    i === currentCustomers.length - 1 ? "border-b-0" : ""
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-[#081D3A] font-bold shrink-0"
                      style={{ backgroundColor: "#F3F3F3" }}
                    >
                      {customer.avatar}
                    </div>
                    <span className="text-sm font-semibold text-gray-800 truncate">
                      {customer.firstName}
                    </span>
                  </div>

                  <span className="text-sm text-gray-700 truncate">
                    {customer.lastName}
                  </span>

                  <span className="text-sm text-gray-600 truncate">
                    {customer.email}
                  </span>

                  <span className="text-sm text-gray-600 whitespace-nowrap">
                    {customer.phone}
                  </span>

                  <RoleBadge role={customer.role} />

                  <ActionButtons
                    onOpenDetails={() => setSelectedCustomer(customer)}
                    onDeleteClick={() => setCustomerToDelete(customer)}
                    onBanClick={() => setCustomerToBan(customer)}
                    onUnbanClick={() => setCustomerToUnban(customer)}
                    isBanned={customer.isBanned}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="md:hidden flex flex-col gap-3">
            {currentCustomers.map((customer) => (
              <div
                key={customer.id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-4"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-[#081D3A] font-bold shrink-0"
                      style={{ backgroundColor: "#F3F3F3" }}
                    >
                      {customer.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {customer.firstName} {customer.lastName}
                      </p>
                      <RoleBadge role={customer.role} />
                    </div>
                  </div>
                  <ActionButtons
                    onOpenDetails={() => setSelectedCustomer(customer)}
                    onDeleteClick={() => setCustomerToDelete(customer)}
                    onBanClick={() => setCustomerToBan(customer)}
                    onUnbanClick={async () => {
                      try {
                        await fetch(`/api/admin/users/unban/${customer.id}`, {
                          method: "PUT",
                        });
                        toast.success("User unbanned successfully");
                      } catch (err) {
                        toast.error("Failed to unban user");
                      }
                    }}
                    isBanned={customer.status === "inactive"}
                  />
                </div>

                <div className="space-y-1.5 text-sm border-t border-gray-50 pt-3">
                  <div className="flex gap-2">
                    <span className="text-gray-400 w-24 shrink-0">Email</span>
                    <span className="text-gray-700 truncate">
                      {customer.email}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-gray-400 w-24 shrink-0">Phone</span>
                    <span className="text-gray-700">{customer.phone}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Footer */}
          {totalPages > 0 && (
            <div className="px-8 py-6 border-t border-gray-50 bg-gray-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Page Results
                </span>
                <span className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-[#081D3A]">
                  {startIndex + 1}-
                  {Math.min(startIndex + itemsPerPage, totalItems)} of{" "}
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
        </>
      )}

      <p className="text-xs text-gray-400 mt-3 pl-1">
        Showing {filtered.length} of {customers.length} customers
      </p>

      {selectedCustomer && (
        <CustomerDetailModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}

      {customerToDelete && (
        <CustomerDeleteConfirmationModal
          customer={customerToDelete}
          onClose={() => setCustomerToDelete(null)}
          onConfirm={async () => {
            if (customerToDelete) {
              try {
                await deleteUser(customerToDelete.id).unwrap();
                toast.success("User deleted successfully");
              } catch (err) {
                toast.error("Failed to delete user");
              }
              setCustomerToDelete(null);
            }
          }}
        />
      )}

      {customerToBan && (
        <CustomerBanConfirmationModal
          customer={customerToBan}
          onClose={() => setCustomerToBan(null)}
          onConfirm={async (reason, duration) => {
            let days: number | null = 7;
            switch (duration) {
              case "1_day":
                days = 1;
                break;
              case "5_days":
                days = 5;
                break;
              case "7_days":
                days = 7;
                break;
              case "30_days":
                days = 30;
                break;
              case "3_months":
                days = 90;
                break;
              case "6_months":
                days = 180;
                break;
              case "permanent":
                days = null;
                break;
              default:
                days = 7;
            }
            if (customerToBan) {
              try {
                await banUser({
                  userId: customerToBan.id,
                  reason,
                  duration: days,
                }).unwrap();
                toast.success("User banned successfully");
              } catch (err) {
                toast.error("Failed to ban user");
              }
              setCustomerToBan(null);
            }
          }}
        />
      )}
      {/* ...other modals... */}
      {customerToUnban && (
        <CustomerUnbanConfirmationModal
          customer={customerToUnban}
          onClose={() => setCustomerToUnban(null)}
          onConfirm={async () => {
            try {
              await unbanUser({ userId: customerToUnban.id }).unwrap();
              toast.success("User unbanned successfully");
            } catch (err) {
              toast.error("Failed to unban user");
            }
            setCustomerToUnban(null);
          }}
        />
      )}
    </div>
  );
}
