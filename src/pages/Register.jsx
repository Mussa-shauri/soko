import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { categories } from "../data/products.js";
import { geocode } from "../utils/geocode.js";
import { regions } from "../data/regions.js";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    role: "buyer",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
    shopName: "",
    category: categories[0],
    address: "",
        address: "",
    region: "",
  });

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const isDealer = form.role === "dealer";

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    if (form.password !== form.confirm) return setError("Passwords do not match.");

    setLoading(true);
    let data = { ...form };

    if (isDealer) {
const spot = await geocode(form.address, form.region);
      if (!spot) {
        setLoading(false);
        return setError("We could not find that location. Try a clearer name, e.g. Kariakoo, Dar es Salaam.");
      }
      data = { ...data, ...spot }; // adds lat and lng automatically
    }

    const result = await register(data);
    setLoading(false);
    if (!result.ok) return setError(result.error);
   navigate(isDealer ? "/dashboard" : "/account");
  };

  return (
    <form className="auth-box" onSubmit={submit}>
      <h1 className="page-title">Create Account</h1>

      <div className="role-switch">
        <button type="button" className={!isDealer ? "role-on" : ""} onClick={() => setForm({ ...form, role: "buyer" })}>
          🛍️ I am a Buyer
        </button>
        <button type="button" className={isDealer ? "role-on" : ""} onClick={() => setForm({ ...form, role: "dealer" })}>
          🏪 I am a Dealer
        </button>
      </div>

      <label>Full name
        <input name="fullName" value={form.fullName} onChange={set} required />
      </label>
      <label>Email
        <input type="email" name="email" value={form.email} onChange={set} required />
      </label>
      <label>Phone number
        <input name="phone" placeholder="+255 7XX XXX XXX" value={form.phone} onChange={set} required />
      </label>

      {isDealer && (
        <div className="dealer-fields">
          <h3>Shop details</h3>
          <label>Shop name
            <input name="shopName" value={form.shopName} onChange={set} required />
          </label>
          <label>What do you sell?
            <select name="category" value={form.category} onChange={set}>
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
                    <label>Region
            <select name="region" value={form.region} onChange={set} required>
              <option value="">Choose your region</option>
              {regions.map((r) => <option key={r}>{r}</option>)}
            </select>
          </label>
          <label>Shop location
            <input
              name="address"
              placeholder="e.g. Kariakoo, Dar es Salaam"
              value={form.address}
              onChange={set}
              required
            />
          </label>
          <p className="hint">📍 Your shop will be pinned on the map automatically.</p>
        </div>
      )}

      <label>Password
        <input type="password" name="password" value={form.password} onChange={set} required />
      </label>
      <label>Confirm password
        <input type="password" name="confirm" value={form.confirm} onChange={set} required />
      </label>

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Finding your location..." : `Create ${isDealer ? "Dealer" : "Buyer"} Account`}
      </button>
      <p className="auth-switch">Already have an account? <Link to="/login">Login</Link></p>
    </form>
  );
}