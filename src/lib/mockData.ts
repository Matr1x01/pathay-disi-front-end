export interface SavedAddress {
    id: string;
    label: string;
    address: string;
    lat: number;
    lng: number;
}

export const SAVED_ADDRESSES: SavedAddress[] = [
    { id: "addr_1", label: "Home", address: "House 12, Road 5, Dhanmondi, Dhaka", lat: 23.7461, lng: 90.3742 },
    { id: "addr_2", label: "Office", address: "Level 7, Gulshan Tower, Gulshan-1, Dhaka", lat: 23.7808, lng: 90.4168 },
    { id: "addr_3", label: "Other", address: "12/A Mirpur Road, Dhaka", lat: 23.7590, lng: 90.3783 },
];

export interface RecentOrder {
    id: string;
    status: "pending" | "picked_up" | "in_transit" | "delivered" | "cancelled";
    date: string;
    pickup: string;
    dropoff: string;
    amount: number;
}

export const RECENT_ORDERS: RecentOrder[] = [
    {
        id: "ORD-20260310-001",
        status: "in_transit",
        date: "2026-03-10",
        pickup: "Dhanmondi",
        dropoff: "Gulshan-2",
        amount: 120
    },
    {
        id: "ORD-20260308-042",
        status: "delivered",
        date: "2026-03-08",
        pickup: "Mirpur-10",
        dropoff: "Banani",
        amount: 95
    },
    {
        id: "ORD-20260305-017",
        status: "delivered",
        date: "2026-03-05",
        pickup: "Uttara",
        dropoff: "Motijheel",
        amount: 150
    },
    {
        id: "ORD-20260301-088",
        status: "cancelled",
        date: "2026-03-01",
        pickup: "Dhanmondi",
        dropoff: "Gulshan-1",
        amount: 80
    },
];

export function calculatePrice(weight: string, hasCod: boolean, codAmount: number) {
    const basePrices: Record<string, number> = { "0-1": 60, "1-3": 90, "3-5": 130 };
    const base = basePrices[weight] || 60;
    const codCharge = hasCod ? Math.max(10, codAmount * 0.01) : 0;
    return { deliveryFee: base, codCharge: Math.round(codCharge), total: base + Math.round(codCharge) };
}
