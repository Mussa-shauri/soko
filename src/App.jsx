import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import BuyerOnly from "./components/BuyerOnly.jsx";
import Home from "./pages/Home.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import Orders from "./pages/Orders.jsx";
import Dealers from "./pages/Dealers.jsx";
import Regions from "./pages/Regions.jsx";
import ShopPage from "./pages/ShopPage.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Account from "./pages/Account.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Sales from "./pages/Sales.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          {/* Buyer pages: closed to dealers in Dealer mode */}
          <Route path="/" element={<BuyerOnly><Home /></BuyerOnly>} />
          <Route path="/product/:id" element={<BuyerOnly><ProductDetail /></BuyerOnly>} />
          <Route path="/cart" element={<BuyerOnly><Cart /></BuyerOnly>} />
          <Route path="/checkout" element={<BuyerOnly><Checkout /></BuyerOnly>} />
          <Route path="/orders" element={<BuyerOnly><Orders /></BuyerOnly>} />
          <Route path="/dealers" element={<BuyerOnly><Dealers /></BuyerOnly>} />
          <Route path="/regions" element={<BuyerOnly><Regions /></BuyerOnly>} />
          <Route path="/shop/:shopId" element={<BuyerOnly><ShopPage /></BuyerOnly>} />

          {/* Open to everyone */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/account" element={<Account />} />

          {/* Dealer workspace */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/sales" element={<Sales />} />
        </Routes>
      </main>
    </>
  );
}