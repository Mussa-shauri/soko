import { useState } from "react";
import { categories } from "../data/products.js";
import { useProducts } from "../context/ProductsContext.jsx";
import ProductCard from "../components/ProductCard.jsx";
const categoryIcons = {
  Electronics: "📱",
  Clothes: "👗",
  Food: "🍚",
};

export default function Home() {
  const { products } = useProducts();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("All");

  const matches = products.filter((p) =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );

  const visibleCategories = active === "All" ? categories : [active];

  const sections = visibleCategories
    .map((cat) => ({
      name: cat,
      items: matches.filter((p) => p.category === cat),
    }))
    .filter((s) => s.items.length > 0);

  return (
    <>
      <input
        className="search"
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="chips">
        {["All", ...categories].map((c) => (
          <button
            key={c}
            className={`chip ${active === c ? "chip-active" : ""}`}
            onClick={() => setActive(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {sections.length === 0 && <p>No products found.</p>}

      {sections.map((section) => (
        <section key={section.name} className="category-section">
          <div className="section-header">
  <span className="section-icon">{categoryIcons[section.name] || "🛍️"}</span>
  <h2>{section.name}</h2>
  <div className="section-line"></div>
  <span className="section-count">{section.items.length} items</span>
</div>
          <div className="grid">
            {section.items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      ))}
    </>
  );
}