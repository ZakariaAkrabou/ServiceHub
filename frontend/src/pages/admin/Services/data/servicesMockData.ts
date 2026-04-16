export interface Service {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  priceUnit: "hr" | "fixed";
  providerName: string;
  status: "Active" | "Inactive";
  rating: number;
  image: string;
}

export const servicesList: Service[] = [
  {
    id: "SRV-2001",
    name: "Luxury Living Room Deep Clean",
    description: "Multi-point sterilization and steam cleaning for high-end residential spaces.",
    category: "Cleaning",
    price: 45,
    priceUnit: "hr",
    providerName: "Sophia Lee",
    status: "Active",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6954?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "SRV-2002",
    name: "Emergency Pipe Burst Repair",
    description: "24/7 priority response for critical plumbing failures and water damage prevention.",
    category: "Plumbing",
    price: 120,
    priceUnit: "fixed",
    providerName: "Alex Johnson",
    status: "Active",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "SRV-2003",
    name: "Complete Home Rewiring",
    description: "Safety-first electrical overhaul including modern breaker panel installation.",
    category: "Electrical",
    price: 1500,
    priceUnit: "fixed",
    providerName: "Maria Garcia",
    status: "Active",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1558223190-7c5ef4036dc6?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "SRV-2004",
    name: "Precision Cabinet Carpentry",
    description: "Custom-built kitchen and office cabinetry with premium oak or walnut finishes.",
    category: "Carpentry",
    price: 85,
    priceUnit: "hr",
    providerName: "Robert Taylor",
    status: "Active",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1534067783941-51c9c23ea339?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "SRV-2005",
    name: "Zen Garden Landscaping",
    description: "Minimalist garden design featuring rock arrangements and drought-resistant flora.",
    category: "Landscaping",
    price: 2500,
    priceUnit: "fixed",
    providerName: "Emma Davis",
    status: "Active",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1558905619-17254263bec3?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "SRV-2006",
    name: "HVAC Seasonal Tune-up",
    description: "Full inspection and filter replacement for central AC and heating systems.",
    category: "HVAC",
    price: 150,
    priceUnit: "fixed",
    providerName: "James Wilson",
    status: "Inactive",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1581094288338-2314dddb7bc3?q=80&w=800&auto=format&fit=crop",
  },
];

export const statusStyle: Record<string, string> = {
  Active: "bg-emerald-50 text-emerald-600 border border-emerald-100",
  Inactive: "bg-slate-50 text-slate-400 border border-slate-100",
};
