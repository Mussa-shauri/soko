import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { count } = useCart();
  const { currentUser, updateProfile } = useAuth();
  const navigate = useNavigate();

  const isDealer = currentUser?.role === "dealer";
  const hasShop = !!(currentUser?.shopName && currentUser?.lat);

  const switchMode = () => {
    if (isDealer) {
      updateProfile({ role: "buyer" });
      navigate("/");
    } else if (hasShop) {
      updateProfile({ role: "dealer" });
      navigate("/dashboard");
    } else {
      navigate("/account");
    }
  };

  return (
    <header className={`navbar ${isDealer ? "navbar-dealer" : ""}`}>
      <div className="container nav-inner">
        <Link to={isDealer ? "/dashboard" : "/"} className="logo">
          🛒 Soko{isDealer && " · Dealer"}
        </Link>

        <nav className="nav-links">
          {isDealer ? (
            <>
              <Link to="/dashboard">📦 My Products</Link>
              <Link to="/sales">💰 Payments</Link>
            </>
          ) : (
            <>
              <Link to="/">Shop</Link>
              <Link to="/dealers">Dealers Map</Link>
              <Link to="/regions">Regions</Link>
              <Link to="/cart">Cart ({count})</Link>
              {currentUser && <Link to="/orders">📦 My Orders</Link>}
            </>
          )}

          {currentUser ? (
            <>
              <button className="mode-btn" onClick={switchMode}>
                {isDealer ? "🛍️ Switch to Buyer" : hasShop ? "🏪 Switch to Dealer" : "🏪 Become a Dealer"}
              </button>
              <Link to="/account">👤 {currentUser.fullName.split(" ")[0]}</Link>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="nav-cta">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}