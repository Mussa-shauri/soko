import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// In Dealer mode the buyer pages are closed: the dealer goes to their own workspace
export default function BuyerOnly({ children }) {
  const { currentUser } = useAuth();
  if (currentUser?.role === "dealer") return <Navigate to="/dashboard" replace />;
  return children;
}