export const products = [
  // Electronics
  { id: 1, name: "Samsung Galaxy A15", category: "Electronics", price: 450000, seller: "Kariakoo Mobiles", image: "https://placehold.co/400x300?text=Phone", description: "128GB, dual SIM, 1 year warranty." },
  { id: 4, name: "HP Laptop 15", category: "Electronics", price: 1350000, seller: "TechHub TZ", image: "https://placehold.co/400x300?text=Laptop", description: "Core i5, 8GB RAM, 512GB SSD." },
  { id: 7, name: "Bluetooth Speaker", category: "Electronics", price: 65000, seller: "TechHub TZ", image: "https://placehold.co/400x300?text=Speaker", description: "Waterproof, 12 hours battery." },
  { id: 8, name: "32 inch Smart TV", category: "Electronics", price: 520000, seller: "Kariakoo Mobiles", image: "https://placehold.co/400x300?text=TV", description: "Full HD, WiFi, YouTube ready." },

  // Clothes
  { id: 2, name: "Kitenge Dress", category: "Clothes", price: 45000, seller: "Mama Neema Fashion", image: "https://placehold.co/400x300?text=Kitenge", description: "Hand-tailored kitenge dress, available in all sizes." },
  { id: 5, name: "Leather Sandals", category: "Clothes", price: 25000, seller: "Arusha Crafts", image: "https://placehold.co/400x300?text=Sandals", description: "Handmade Maasai leather sandals." },
  { id: 9, name: "Men's Official Shirt", category: "Clothes", price: 35000, seller: "Mama Neema Fashion", image: "https://placehold.co/400x300?text=Shirt", description: "Cotton long-sleeve shirt, sizes M to XXL." },
  { id: 10, name: "Sneakers", category: "Clothes", price: 70000, seller: "Arusha Crafts", image: "https://placehold.co/400x300?text=Sneakers", description: "Comfortable everyday sneakers." },

  // Food
  { id: 3, name: "Rice 25kg", category: "Food", price: 85000, seller: "Duka la Juma", image: "https://placehold.co/400x300?text=Rice", description: "Premium Mbeya rice, 25kg bag." },
  { id: 6, name: "Cooking Oil 5L", category: "Food", price: 28000, seller: "Duka la Juma", image: "https://placehold.co/400x300?text=Oil", description: "Pure sunflower cooking oil, 5 litres." },
  { id: 11, name: "Maize Flour 10kg", category: "Food", price: 24000, seller: "Duka la Juma", image: "https://placehold.co/400x300?text=Unga", description: "Fine sembe flour, 10kg bag." },
  { id: 12, name: "Fresh Mangoes (1 crate)", category: "Food", price: 30000, seller: "Shamba Fresh", image: "https://placehold.co/400x300?text=Mangoes", description: "Sweet ripe mangoes straight from the farm." },
];

export const categories = ["Electronics", "Clothes", "Food"];

export const formatTZS = (n) => `TZS ${n.toLocaleString("en-US")}`;