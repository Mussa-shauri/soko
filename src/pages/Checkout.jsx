import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useOrders } from "../context/OrdersContext.jsx";
import { formatTZS } from "../data/products.js";
import { makeRef } from "../utils/ref.js";
import { methods } from "../data/paymentMethods.js";



export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { currentUser } = useAuth();
  const { placeOrders } = useOrders();
  const navigate = useNavigate();

  const [methodId, setMethodId] = useState("");
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [step, setStep] = useState("form"); // form | pin | processing
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  if (!currentUser) return <Navigate to="/login" />;

  if (currentUser.role !== "buyer") {
    return (
      <div className="auth-box">
        <h1 className="page-title">Checkout</h1>
        <p>Switch to <strong>Buyer mode</strong> (top menu) to pay for items.</p>
      </div>
    );
  }

  if (items.length === 0) {
    return <p>Your cart is empty. <Link to="/">Start shopping</Link></p>;
  }

  const method = methods.find((m) => m.id === methodId);

  // One group per shop, so each dealer gets their own payment
  const groups = Object.values(
    items.reduce((acc, item) => {
      const key = item.sellerId ? `u${item.sellerId}` : `s-${item.seller}`;
      if (!acc[key]) {
        acc[key] = { key, shopName: item.seller, dealerId: item.sellerId || null, items: [], subtotal: 0 };
      }
      acc[key].items.push(item);
      acc[key].subtotal += item.price * item.qty;
      return acc;
    }, {})
  );

  const startPayment = (e) => {
    e.preventDefault();
    setError("");
    if (!method) return setError("Please choose a payment method.");
    const clean = phone.replace(/[\s-]/g, "");
    if (!/^(?:\+?255|0)[67]\d{8}$/.test(clean)) {
      return setError("Enter a valid phone number, e.g. 0712 345 678.");
    }
    if (items.some((i) => i.sellerId === currentUser.id)) {
      return setError("Your cart has your own products. Remove them before paying.");
    }
    setPin("");
    setStep("pin");
  };

  const confirmPayment = () => {
    if (!/^\d{4}$/.test(pin)) return setError("Enter a 4-digit PIN.");
    setError("");
    setStep("processing");
    setPin("");

    setTimeout(() => {
      const date = new Date().toISOString();
      const batch = groups.map((g) => ({
        id: makeRef("ORD"),
        txnId: makeRef("TXN"),
        buyerId: currentUser.id,
        buyerName: currentUser.fullName,
        buyerPhone: phone,
        dealerId: g.dealerId,
        dealerName: g.shopName,
        items: g.items.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
        total: g.subtotal,
        method: method.name,
        status: "Paid",
        date,
      }));
      placeOrders(batch);
      clearCart();
      navigate("/orders", { state: { justPaid: batch.length } });
    }, 2200);
  };

  const cancelPin = () => {
    setStep("form");
    setError("");
    setPin("");
  };

  return (
    <>
      <h1 className="page-title">💳 Checkout</h1>
      <p className="demo-banner">🧪 Demo payment: no real money is moved. Do not enter a real PIN.</p>

      <div className="checkout-layout">
        <form className="auth-box" onSubmit={startPayment}>
          <h2>Choose how to pay</h2>

          <div className="method-grid">
            {methods.map((m) => (
              <button
                type="button"
                key={m.id}
                className={`method-card ${methodId === m.id ? "method-on" : ""}`}
                onClick={() => setMethodId(m.id)}
              >
                               <img
                  className="method-logo"
                  src={m.logo}
                  alt={m.name}
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
                <span>{m.name}</span>
              </button>
            ))}
          </div>

          <label>Mobile money phone number
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="0712 345 678"
              required
            />
          </label>

          {error && step === "form" && <p className="error">{error}</p>}

          <button type="submit">Pay {formatTZS(total)}</button>
        </form>

        <div className="summary">
          <h2>Order summary</h2>
          {groups.map((g) => (
            <div key={g.key} className="summary-group">
              <strong>🏪 {g.shopName}</strong>
              {g.items.map((i) => (
                <div key={i.id} className="summary-line">
                  <span>{i.name} × {i.qty}</span>
                  <span>{formatTZS(i.price * i.qty)}</span>
                </div>
              ))}
              <div className="summary-line subtotal">
                <span>Paid to this shop</span>
                <span>{formatTZS(g.subtotal)}</span>
              </div>
            </div>
          ))}
          <div className="summary-total">
            <span>Total</span>
            <span>{formatTZS(total)}</span>
          </div>
        </div>
      </div>

      {step !== "form" && (
        <div className="modal-bg">
          <div className="modal">
            {step === "pin" && (
              <>
                               <img
                  className="modal-logo"
                  src={method.logo}
                  alt=""
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
                <h3>{method.name} payment request</h3>
                <p>
                  Pay <strong>{formatTZS(total)}</strong> to{" "}
                  <strong>{groups.map((g) => g.shopName).join(", ")}</strong>?
                </p>
                <label>Enter PIN to confirm
                  <input
                    type="password"
                    inputMode="numeric"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                    placeholder="••••"
                    autoFocus
                  />
                </label>
                <p className="hint">Demo only: type any 4 digits.</p>
                {error && <p className="error">{error}</p>}
                <div>
                  <button onClick={confirmPayment}>Confirm</button>{" "}
                  <button className="secondary" onClick={cancelPin}>Cancel</button>
                </div>
              </>
            )}

            {step === "processing" && (
              <div className="processing">
                <div className="spinner"></div>
                <p>Processing payment...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}