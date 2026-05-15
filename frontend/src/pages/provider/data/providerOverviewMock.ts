/** Frontend-only mock data for provider overview dashboard. */

export const providerSummary = {
  servicesListed: 12,
  activeServices: 9,
  bookingsThisMonth: 34,
  bookingsPending: 3,
  uniqueClientsYtd: 87,
  completedJobs: 156,
  avgRating: 4.8,
  revenueThisMonth: 4280,
};

export const bookingTrend = [
  { month: "Jan", bookings: 18 },
  { month: "Feb", bookings: 22 },
  { month: "Mar", bookings: 19 },
  { month: "Apr", bookings: 28 },
  { month: "May", bookings: 34 },
];

export type BookingRow = {
  id: string;
  client: string;
  service: string;
  date: string;
  status: "confirmed" | "pending" | "completed" | "rejected" | "cancelled";
};

export const recentBookings: BookingRow[] = [
  { id: "B-1042", client: "Jordan M.", service: "Home cleaning", date: "May 14, 10:00 AM", status: "pending" },
  { id: "B-1041", client: "Maria L.", service: "Electrical repair", date: "May 16, 2:00 PM", status: "confirmed" },
  { id: "B-1040", client: "Alex P.", service: "Garden maintenance", date: "May 12, 9:00 AM", status: "completed" },
  { id: "B-1039", client: "Sam K.", service: "Plumbing", date: "May 18, 3:00 PM", status: "confirmed" },
  { id: "B-1038", client: "Priya R.", service: "Deep clean", date: "May 11, 11:00 AM", status: "completed" },
];

export type ServiceRow = {
  id: string;
  name: string;
  category: string;
  price: string;
  bookings: number;
  active: boolean;
};

export const servicesTable: ServiceRow[] = [
  { id: "S-01", name: "Standard home clean", category: "Cleaning", price: "$85 / visit", bookings: 42, active: true },
  { id: "S-02", name: "Garden tidy-up", category: "Outdoor", price: "$120 / session", bookings: 28, active: true },
  { id: "S-03", name: "Minor electrical fixes", category: "Repairs", price: "$95 / hr", bookings: 19, active: true },
  { id: "S-04", name: "Move-out deep clean", category: "Cleaning", price: "$210 flat", bookings: 11, active: false },
];

export type ClientRow = {
  id: string;
  name: string;
  bookings: string;
  lastVisit: string;
  rating: string;
};

export const recentClients: ClientRow[] = [
  { id: "c1", name: "Jordan M.", bookings: "6 bookings", lastVisit: "May 10", rating: "4.9" },
  { id: "c2", name: "Maria L.", bookings: "3 bookings", lastVisit: "May 8", rating: "5.0" },
  { id: "c3", name: "Alex P.", bookings: "8 bookings", lastVisit: "May 6", rating: "4.7" },
  { id: "c4", name: "Sam K.", bookings: "2 bookings", lastVisit: "Apr 28", rating: "4.8" },
];
