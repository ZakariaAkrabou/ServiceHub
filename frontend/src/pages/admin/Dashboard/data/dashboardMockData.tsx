// Dashboard mock data and constants

export const bookingTrend = [
    { month: "Jan", bookings: 42 },
    { month: "Feb", bookings: 68 },
    { month: "Mar", bookings: 55 },
    { month: "Apr", bookings: 90 },
    { month: "May", bookings: 78 },
    { month: "Jun", bookings: 110 },
    { month: "Jul", bookings: 95 },
    { month: "Aug", bookings: 130 },
    { month: "Sep", bookings: 115 },
    { month: "Oct", bookings: 148 },
    { month: "Nov", bookings: 132 },
    { month: "Dec", bookings: 162 },
];

export const bookingStatus = [
    { name: "Completed", value: 48, color: "#2F6B3F" },
    { name: "Confirmed", value: 25, color: "#081D3A" },
    { name: "Pending", value: 17, color: "#F7C85C" },
    { name: "Cancelled", value: 10, color: "#000000" },
];

export const recentBookings = [
    {
        id: "#BK-1041",
        client: "Sarah Johnson",
        service: "Home Cleaning",
        date: "Apr 11, 2026",
        amount: "$120",
        status: "Confirmed",
    },
    {
        id: "#BK-1040",
        client: "Marcus Lee",
        service: "Plumbing Repair",
        date: "Apr 10, 2026",
        amount: "$85",
        status: "Pending",
    },
    {
        id: "#BK-1039",
        client: "Aisha Patel",
        service: "Electrical Check",
        date: "Apr 10, 2026",
        amount: "$200",
        status: "Completed",
    },
    {
        id: "#BK-1038",
        client: "Tom Richards",
        service: "Lawn Mowing",
        date: "Apr 09, 2026",
        amount: "$60",
        status: "Cancelled",
    },
    {
        id: "#BK-1037",
        client: "Priya Sharma",
        service: "Interior Painting",
        date: "Apr 09, 2026",
        amount: "$350",
        status: "Confirmed",
    },
];

export const topProviders = [
    {
        name: "Carlos Mendez",
        specialty: "Plumbing",
        rating: 4.9,
        jobs: 148,
        avatar: "CM",
    },
    {
        name: "Lisa Wang",
        specialty: "Cleaning",
        rating: 4.8,
        jobs: 132,
        avatar: "LW",
    },
    {
        name: "James Okafor",
        specialty: "Electrical",
        rating: 4.8,
        jobs: 121,
        avatar: "JO",
    },
    {
        name: "Nina Russo",
        specialty: "Painting",
        rating: 4.7,
        jobs: 107,
        avatar: "NR",
    },
    {
        name: "David Kim",
        specialty: "Gardening",
        rating: 4.6,
        jobs: 98,
        avatar: "DK",
    },
];

export const statusStyle: Record<string, string> = {
    Confirmed: "bg-[#F6E304]/20 text-[#000000] ring-1 ring-[#F6E304]/50",
    Pending: "bg-[#17171A]/10  text-[#17171A]  ring-1 ring-[#17171A]/20",
    Completed: "bg-[#081D3A]/10 text-[#081D3A] ring-1 ring-[#081D3A]/20",
    Cancelled: "bg-[#000000]/10    text-[#000000]    ring-1 ring-[#000000]/20",
};

export const avatarColor = [
    "bg-[#081D3A] text-[#F3F3F3]",
    "bg-[#F6E304] text-[#000000]",
    "bg-[#17171A] text-[#F3F3F3]",
    "bg-[#000000] text-[#F6E304]",
    "bg-[#F3F3F3] text-[#081D3A] ring-1 ring-[#081D3A]/10",
];
