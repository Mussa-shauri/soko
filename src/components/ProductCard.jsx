import { Link } from "react-router-dom";
import { formatTZS } from "../data/products.js";
import { useCart } from "../context/CartContext.jsx";
import { useReviews } from "../context/ReviewsContext.jsx";
import Stars from "./Stars.jsx";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { getStats } = useReviews();
  const { avg, count } = getStats(product.id);

  return (
    <div className="card">
      <Link to={`/product/${product.id}`}>
        <img src={product.image} alt={product.name} />
      </Link>
      <div className="card-body">
        <span className="tag">{product.category}</span>
        <h3>{product.name}</h3>
        <p className="seller">by {product.seller}</p>
        <div className="rating-line">
          <Stars value={avg} size="1rem" />
          <span>{count ? `${avg.toFixed(1)} (${count})` : "No reviews yet"}</span>
        </div>
        <p className="price">{formatTZS(product.price)}</p>
        <button onClick={() => addToCart(product)}>Add to cart</button>
      </div>
    </div>
  );
}