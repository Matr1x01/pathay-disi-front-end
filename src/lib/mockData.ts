export interface SavedAddress {
  id: string;
  label: string;
  labelBn: string;
  address: string;
  lat: number;
  lng: number;
}

export const SAVED_ADDRESSES: SavedAddress[] = [
  { id: "addr_1", label: "Home", labelBn: "বাসা", address: "House 12, Road 5, Dhanmondi, Dhaka", lat: 23.7461, lng: 90.3742 },
  { id: "addr_2", label: "Office", labelBn: "অফিস", address: "Level 7, Gulshan Tower, Gulshan-1, Dhaka", lat: 23.7808, lng: 90.4168 },
  { id: "addr_3", label: "Other", labelBn: "অন্যান্য", address: "12/A Mirpur Road, Dhaka", lat: 23.7590, lng: 90.3783 },
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
  { id: "ORD-20260310-001", status: "in_transit", date: "2026-03-10", pickup: "Dhanmondi", dropoff: "Gulshan-2", amount: 120 },
  { id: "ORD-20260308-042", status: "delivered", date: "2026-03-08", pickup: "Mirpur-10", dropoff: "Banani", amount: 95 },
  { id: "ORD-20260305-017", status: "delivered", date: "2026-03-05", pickup: "Uttara", dropoff: "Motijheel", amount: 150 },
  { id: "ORD-20260301-088", status: "cancelled", date: "2026-03-01", pickup: "Dhanmondi", dropoff: "Gulshan-1", amount: 80 },
];

export const PACKAGE_TYPES = [
  { value: "document", label: "Document", labelBn: "ডকুমেন্ট" },
  { value: "clothes", label: "Clothes", labelBn: "কাপড়" },
  { value: "electronics", label: "Electronics", labelBn: "ইলেকট্রনিক্স" },
  { value: "fragile", label: "Fragile", labelBn: "ভঙ্গুর" },
  { value: "other", label: "Other", labelBn: "অন্যান্য" },
];

export const WEIGHT_OPTIONS = [
  { value: "0-1", label: "Up to 1 kg", labelBn: "১ কেজি পর্যন্ত" },
  { value: "1-3", label: "1–3 kg", labelBn: "১–৩ কেজি" },
  { value: "3-5", label: "3–5 kg", labelBn: "৩–৫ কেজি" },
];

export const PAYMENT_METHODS = [
  { value: "bkash", label: "bKash", icon: "📱" },
  { value: "nagad", label: "Nagad", icon: "💚" },
  { value: "card", label: "Card", icon: "💳" },
  { value: "pay_on_pickup", label: "Pay on Pickup", icon: "💵" },
];

export function calculatePrice(weight: string, hasCod: boolean, codAmount: number) {
  const basePrices: Record<string, number> = { "0-1": 60, "1-3": 90, "3-5": 130 };
  const base = basePrices[weight] || 60;
  const codCharge = hasCod ? Math.max(10, codAmount * 0.01) : 0;
  return { deliveryFee: base, codCharge: Math.round(codCharge), total: base + Math.round(codCharge) };
}
