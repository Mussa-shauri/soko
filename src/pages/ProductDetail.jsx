import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { formatTZS } from "../data/products.js";
import { useProducts } from "../context/ProductsContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useReviews } from "../context/ReviewsContext.jsx";
import Stars from "../components/Stars.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const { getReviews, getStats, addReview, deleteReview } = useReviews();

  const product = products.find((p) => p.id === Number(id));
  const reviews = product ? getReviews(product.id) : [];
  const mine = currentUser ? reviews.find((r) => r.userId === currentUser.id) : null;

  const [rating, setRating] = useState(mine?.rating || 0);
  const [comment, setComment] = useState(mine?.comment || "");
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  if (!product) return <p>Product not found. <Link to="/">Back to shop</Link></p>;

  const { avg, count } = getStats(product.id);
  const isOwner = currentUser && product.sellerId === currentUser.id;
  const isBuyerMode = currentUser && currentUser.role === "buyer";

  const submit = (e) => {
    e.preventDefault();
    setError("");
    setDone("");
    if (rating === 0) return setError("Please choose a star rating.");
    if (comment.trim().length < 3) return setError("Please write a short comment.");
    addReview({
      productId: product.id,
      userId: currentUser.id,
      userName: currentUser.fullName,
      rating,
      comment: comment.trim(),
    });
    setDone(mine ? "✅ Your review was updated." : "✅ Thank you for your review!");
  };

  const removeMine = () => {
    deleteReview(mine.id);
    setRating(0);
    setComment("");
    setDone("");
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

  return (
    <>
      <div className="detail">
        <img src={product.image} alt={product.name} />
        <div>
          <Link to="/">← Back</Link>
          <h1>{product.name}</h1>
          <p className="seller">Sold by {product.seller}</p>
          <div className="rating-line">
            <Stars value={avg} />
            <span>{count ? `${avg.toFixed(1)} out of 5 (${count} reviews)` : "No reviews yet"}</span>
          </div>
          <p className="price">{formatTZS(product.price)}</p>
          <p>{product.description}</p>
          <button onClick={() => addToCart(product)}>Add to cart</button>
        </div>
      </div>

      <section className="reviews">
        <h2>Customer reviews</h2>

        {/* Who can write a review */}
        {!currentUser && (
          <p className="review-note">
            <Link to="/login">Login</Link> as a buyer to write a review.
          </p>
        )}
        {currentUser && isOwner && (
          <p className="review-note">You cannot review your own product.</p>
        )}
        {currentUser && !isOwner && !isBuyerMode && (
          <p className="review-note">Switch to Buyer mode (top menu) to write a review.</p>
        )}

        {currentUser && !isOwner && isBuyerMode && (
          <form className="review-form" onSubmit={submit}>
            <h3>{mine ? "Update your review" : "Write a review"}</h3>
            <Stars value={rating} onChange={setRating} size="2rem" />
            <textarea
              rows="3"
              placeholder="Tell others what you think about this product..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            {error && <p className="error">{error}</p>}
            {done && <p className="success">{done}</p>}
            <div>
              <button type="submit">{mine ? "Update review" : "Submit review"}</button>{" "}
              {mine && (
                <button type="button" className="danger" onClick={removeMine}>
                  Delete my review
                </button>
              )}
            </div>
          </form>
        )}

        {reviews.length === 0 ? (
          <p>Be the first to review this product.</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="review-card">
              <div className="review-head">
                <strong>👤 {r.userName}</strong>
                <span>{formatDate(r.date)}</span>
              </div>
              <Stars value={r.rating} size="1rem" />
              <p>{r.comment}</p>
            </div>
          ))
        )}
      </section>
    </>
  );
}