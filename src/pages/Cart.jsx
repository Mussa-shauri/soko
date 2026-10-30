import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { formatTZS } from "../data/products.js";

export default function Cart() {
  const { items, updateQty, removeItem, clearCart, total } = useCart();

  if (items.length === 0)
    return <p>Your cart is empty. <Link to="/">Start shopping</Link></p>;

  return (
    <div>
      <h1>Your Cart</h1>
      {items.map((i) => (
        <div key={i.id} className="cart-row">
          <img src={i.image} alt={i.name} />
          <div className="cart-info">
            <strong>{i.name}</strong>
            <span>{formatTZS(i.price)}</span>
          </div>
          <div className="qty">
            <button onClick={() => updateQty(i.id, i.qty - 1)}>−</button>
            <span>{i.qty}</span>
            <button onClick={() => updateQty(i.id, i.qty + 1)}>+</button>
          </div>
          <button className="danger" onClick={() => removeItem(i.id)}>Remove</button>
        </div>
      ))}
      <h2>Total: {formatTZS(total)}</h2>
      <Link to="/checkout" className="checkout-btn">Checkout</Link>{" "}
      <button className="danger" onClick={clearCart}>Clear cart</button>
    </div>
  );
}