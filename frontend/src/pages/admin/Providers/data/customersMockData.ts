export type CustomerStatus = "active" | "inactive";
export type CustomerRole = "customer" | "service_provider";

export interface Customer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: CustomerRole;
    joinedDate: string;
    totalBookings: number;
    totalSpent: number;
    status: CustomerStatus;
    avatar: string;
}


export const mockCustomers: Customer[] = [
    {
        id: "CST-2041",
        firstName: "Emily",
        lastName: "Carter",
        email: "emily.c@example.com",
        phone: "+1 555-0101",
        role: "customer",
        joinedDate: "2024-01-15",
        totalBookings: 12,
        totalSpent: 840,
        status: "active",
        avatar: "E",
    },
    {
        id: "CST-2042",
        firstName: "Mohammed",
        lastName: "Al-Rashid",
        email: "m.alrashid@example.com",
        phone: "+1 555-0102",
        role: "service_provider",
        joinedDate: "2024-03-22",
        totalBookings: 5,
        totalSpent: 310,
        status: "active",
        avatar: "M",
    },
    {
        id: "CST-2043",
        firstName: "Sarah",
        lastName: "Thompson",
        email: "s.thompson@example.com",
        phone: "+1 555-0103",
        role: "customer",
        joinedDate: "2023-11-08",
        totalBookings: 28,
        totalSpent: 2150,
        status: "active",
        avatar: "S",
    },
    {
        id: "CST-2044",
        firstName: "Lucas",
        lastName: "Ferreira",
        email: "lucas.f@example.com",
        phone: "+1 555-0104",
        role: "service_provider",
        joinedDate: "2025-01-03",
        totalBookings: 2,
        totalSpent: 95,
        status: "inactive",
        avatar: "L",
    },
    {
        id: "CST-2045",
        firstName: "Aisha",
        lastName: "Ndiaye",
        email: "aisha.n@example.com",
        phone: "+1 555-0105",
        role: "customer",
        joinedDate: "2024-07-19",
        totalBookings: 9,
        totalSpent: 620,
        status: "active",
        avatar: "A",
    },
    {
        id: "CST-2046",
        firstName: "Daniel",
        lastName: "Kim",
        email: "d.kim@example.com",
        phone: "+1 555-0106",
        role: "service_provider",
        joinedDate: "2023-09-14",
        totalBookings: 41,
        totalSpent: 3890,
        status: "active",
        avatar: "D",
    },
    {
        id: "CST-2047",
        firstName: "Priya",
        lastName: "Sharma",
        email: "priya.s@example.com",
        phone: "+1 555-0107",
        role: "customer",
        joinedDate: "2024-12-01",
        totalBookings: 0,
        totalSpent: 0,
        status: "inactive",
        avatar: "P",
    },
];

export const avatarColors: Record<string, string> = {
    E: "#6366f1",
    M: "#0ea5e9",
    S: "#10b981",
    L: "#f59e0b",
    A: "#ec4899",
    D: "#8b5cf6",
    P: "#ef4444",
};
