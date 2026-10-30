import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useOrders } from "../context/OrdersContext.jsx";
import { formatTZS } from "../data/products.js";
import MethodBadge from "../components/MethodBadge.jsx";

const formatDate = (iso) =>
  new Date(iso).toLocaleString("en-GB", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

export default function Sales() {
  const { currentUser } = useAuth();
  const { orders } = useOrders();

  if (!currentUser || currentUser.role !== "dealer") return <Navigate to="/login" />;

  const sales = orders.filter((o) => o.dealerId === currentUser.id);
  const earnings = sales.reduce((sum, o) => sum + o.total, 0);
  const itemsSold = sales.reduce((sum, o) => sum + o.items.reduce((s, i) => s + i.qty, 0), 0);

  return (
    <>
      <h1 className="page-title">💰 Sales & Earnings</h1>

      <div className="stats">
        <div className="stat"><span>Total earnings</span><strong>{formatTZS(earnings)}</strong></div>
        <div className="stat"><span>Payments received</span><strong>{sales.length}</strong></div>
        <div className="stat"><span>Items sold</span><strong>{itemsSold}</strong></div>
      </div>

      <h2 className="my-title">Payments received</h2>
      {sales.length === 0 ? (
        <p>No sales yet. When a buyer pays for your products, the payment appears here.</p>
      ) : (
        sales.map((o) => (
          <div key={o.id} className="order-card">
            <div className="order-head">
              <strong>👤 {o.buyerName}</strong>
              <span className="paid-badge">+ {formatTZS(o.total)}</span>
            </div>
            {o.items.map((i) => (
              <div key={i.id} className="summary-line">
                <span>{i.name} × {i.qty}</span>
                <span>{formatTZS(i.price * i.qty)}</span>
              </div>
            ))}
            <p className="order-meta">
            <MethodBadge name={o.method} /> from {o.buyerPhone} · {formatDate(o.date)}<br />
              Transaction ID: <strong>{o.txnId}</strong>
            </p>
          </div>
        ))
      )}
    </>
  );
}