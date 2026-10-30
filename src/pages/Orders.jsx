import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useOrders } from "../context/OrdersContext.jsx";
import { formatTZS } from "../data/products.js";
import MethodBadge from "../components/MethodBadge.jsx";

const formatDate = (iso) =>
  new Date(iso).toLocaleString("en-GB", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

export default function Orders() {
  const { currentUser } = useAuth();
  const { orders } = useOrders();
  const location = useLocation();

  if (!currentUser) return <Navigate to="/login" />;

  const mine = orders.filter((o) => o.buyerId === currentUser.id);
  const justPaid = location.state?.justPaid;

  return (
    <>
      <h1 className="page-title">📦 My Orders</h1>

      {justPaid && (
        <p className="success">
          ✅ Payment successful! {justPaid} {justPaid === 1 ? "transaction was" : "transactions were"} sent to the dealer(s).
        </p>
      )}

      {mine.length === 0 ? (
        <p>You have not bought anything yet. <Link to="/">Start shopping</Link></p>
      ) : (
        mine.map((o) => (
          <div key={o.id} className="order-card">
            <div className="order-head">
              <strong>🏪 {o.dealerName}</strong>
              <span className="paid-badge">✅ {o.status}</span>
            </div>
            {o.items.map((i) => (
              <div key={i.id} className="summary-line">
                <span>{i.name} × {i.qty}</span>
                <span>{formatTZS(i.price * i.qty)}</span>
              </div>
            ))}
            <div className="summary-line subtotal">
              <span>Total paid</span>
              <span>{formatTZS(o.total)}</span>
            </div>
            <p className="order-meta">
           <MethodBadge name={o.method} /> · {formatDate(o.date)}<br />
              Transaction ID: <strong>{o.txnId}</strong> · Order: {o.id}
            </p>
          </div>
        ))
      )}
    </>
  );
}