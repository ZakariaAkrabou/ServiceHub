export type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

export interface Booking {
    id: string;
    customerName: string;
    avatar: string;
    serviceName: string;
    provider: string;
    bookingDate: string;
    status: BookingStatus;
    paymentStatus?: string;
}

export const mockBookings: Booking[] = [
    {
        id: "BK-1001",
        customerName: "Sarah Jenkins",
        avatar: "SJ",
        serviceName: "House Cleaning",
        provider: "CleanCo",
        bookingDate: "2026-04-15",
        status: "Pending",
    },
    {
        id: "BK-1002",
        customerName: "Michael Chen",
        avatar: "MC",
        serviceName: "Plumbing Repair",
        provider: "QuickFix Plumbing",
        bookingDate: "2026-04-14",
        status: "Confirmed",
    },
    {
        id: "BK-1003",
        customerName: "Emily Davis",
        avatar: "ED",
        serviceName: "Electrical Wiring",
        provider: "Sparky Elecs",
        bookingDate: "2026-04-12",
        status: "Completed",
    },
    {
        id: "BK-1004",
        customerName: "Robert Wilson",
        avatar: "RW",
        serviceName: "Lawn Mowing",
        provider: "Green Grass LLC",
        bookingDate: "2026-04-18",
        status: "Cancelled",
    },
    {
        id: "BK-1005",
        customerName: "Jessica Taylor",
        avatar: "JT",
        serviceName: "AC Servicing",
        provider: "CoolBreeze",
        bookingDate: "2026-04-16",
        status: "Confirmed",
        paymentStatus: "Paid"
    }
];
