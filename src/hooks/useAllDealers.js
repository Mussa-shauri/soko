import { dealers as sampleDealers } from "../data/dealers.js";
import { useAuth } from "../context/AuthContext.jsx";

export function useAllDealers() {
  const { users } = useAuth();

  const registered = users
    .filter((u) => u.shopName && u.lat && u.lng)
    .map((u) => ({
      id: `u${u.id}`,
      userId: u.id,
      name: u.shopName,
      category: u.category,
      phone: u.phone,
      address: u.address,
      region: u.region || "",
      lat: Number(u.lat),
      lng: Number(u.lng),
    }));

  return [...sampleDealers, ...registered];
}