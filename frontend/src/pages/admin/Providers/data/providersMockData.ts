export interface Provider {
  id: string;
  name: string;
  specialty: string;
  email: string;
  status: "Active" | "Pending" | "Rejected";
  rating: number;
  jobsCompleted: number;
  joinedDate: string;
  phone: string;
}

export const initialProvidersList: Provider[] = [
  {
    id: "PRV-1029",
    name: "Alex Johnson",
    specialty: "Plumbing",
    email: "alex.j@example.com",
    status: "Active",
    rating: 4.8,
    jobsCompleted: 142,
    joinedDate: "2025-10-12",
    phone: "+212 661-445566",
  },
  {
    id: "PRV-1030",
    name: "Maria Garcia",
    specialty: "Electrical",
    email: "maria.g@example.com",
    status: "Active",
    rating: 4.9,
    jobsCompleted: 310,
    joinedDate: "2024-03-05",
    phone: "+212 610-112233",
  },
  {
    id: "PRV-1031",
    name: "James Wilson",
    specialty: "HVAC",
    email: "j.wilson@example.com",
    status: "Pending",
    rating: 0,
    jobsCompleted: 0,
    joinedDate: "2026-04-10",
    phone: "+212 654-998877",
  },
  {
    id: "PRV-1032",
    name: "Sophia Lee",
    specialty: "Cleaning",
    email: "sophia.l@example.com",
    status: "Active",
    rating: 4.7,
    jobsCompleted: 89,
    joinedDate: "2025-11-20",
    phone: "+212 708-223344",
  },
  {
    id: "PRV-1033",
    name: "Robert Taylor",
    specialty: "Carpentry",
    email: "rtaylor@example.com",
    status: "Rejected",
    rating: 3.2,
    jobsCompleted: 45,
    joinedDate: "2025-01-15",
    phone: "+212 611-334455",
  },
  {
    id: "PRV-1034",
    name: "Emma Davis",
    specialty: "Landscaping",
    email: "emma.d@example.com",
    status: "Active",
    rating: 4.6,
    jobsCompleted: 215,
    joinedDate: "2024-08-01",
    phone: "+212 622-556677",
  },
  {
    id: "PRV-1035",
    name: "William Moore",
    specialty: "Plumbing",
    email: "william.m@example.com",
    status: "Pending",
    rating: 4.9,
    jobsCompleted: 420,
    joinedDate: "2023-05-22",
    phone: "+212 633-778899",
  },
];

export const statusStyle: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  Pending: "bg-amber-50 text-amber-600 border border-amber-100",
  Rejected: "bg-red-50 text-red-500 border border-red-100",
};
