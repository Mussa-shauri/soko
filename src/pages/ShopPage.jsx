import { Link, useParams } from "react-router-dom";
import { useAllDealers } from "../hooks/useAllDealers.js";
import { useProducts } from "../context/ProductsContext.jsx";
import ProductCard from "../components/ProductCard.jsx";

export default function ShopPage() {
  const { shopId } = useParams();
  const dealers = useAllDealers();
  const { products } = useProducts();

  const shop = dealers.find((d) => String(d.id) === shopId);
  if (!shop) return <p>Shop not found. <Link to="/regions">Back to regions</Link></p>;

  const items = products.filter(
    (p) => (shop.userId && p.sellerId === shop.userId) || p.seller === shop.name
  );

  return (
    <>
      <Link to="/regions">← Back to regions</Link>
      <div className="shop-header">
        <h1>🏪 {shop.name}</h1>
        <p>📍 {shop.address}{shop.region ? ` · ${shop.region}` : ""}</p>
        <a className="call-btn" href={`tel:${shop.phone.replace(/\s/g, "")}`}>📞 {shop.phone}</a>
      </div>

      {items.length === 0 ? (
        <p>This shop has not uploaded any products yet.</p>
      ) : (
        <div className="grid">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </>
  );
}