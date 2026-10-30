import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { categories } from "../data/products.js";
import { regions } from "../data/regions.js";
import { geocode } from "../utils/geocode.js";

function RegionSelect({ value, onChange }) {
  return (
    <label>Region
      <select name="region" value={value || ""} onChange={onChange} required>
        <option value="">Choose your region</option>
        {regions.map((r) => <option key={r}>{r}</option>)}
      </select>
    </label>
  );
}

export default function Account() {
  const { currentUser, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [becoming, setBecoming] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(currentUser || {});
  const [shop, setShop] = useState({ shopName: "", category: categories[0], region: "", address: "" });

  if (!currentUser) return <Navigate to="/login" />;

  const isDealerMode = currentUser.role === "dealer";
  const hasShop = !!(currentUser.shopName && currentUser.lat);

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const setShopField = (e) => setShop({ ...shop, [e.target.name]: e.target.value });

  const switchMode = (mode) => {
    updateProfile({ role: mode });
    navigate(mode === "dealer" ? "/dashboard" : "/");
  };

  const becomeDealer = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    const spot = await geocode(shop.address, shop.region);
    setSaving(false);
    if (!spot) {
      return setError("We could not find that location. Try a clearer name, e.g. Kariakoo.");
    }
    updateProfile({
      role: "dealer",
      shopName: shop.shopName.trim(),
      category: shop.category,
      region: shop.region,
      address: shop.address.trim(),
      ...spot,
    });
    navigate("/dashboard");
  };

  const save = async (e) => {
    e.preventDefault();
    setError("");
    let changes = { ...form };

    const placeChanged =
      hasShop &&
      (form.address.trim() !== currentUser.address || (form.region || "") !== (currentUser.region || ""));

    if (placeChanged) {
      setSaving(true);
      const spot = await geocode(form.address, form.region);
      setSaving(false);
      if (!spot) return setError("We could not find that location. Try a clearer name.");
      changes = { ...changes, ...spot };
    }

    updateProfile(changes);
    setEditing(false);
  };

  const rows = [
    ["Full name", currentUser.fullName],
    ["Email", currentUser.email],
    ["Phone", currentUser.phone],
    ...(hasShop
      ? [
          ["Shop name", currentUser.shopName],
          ["Category", currentUser.category],
          ["Region", currentUser.region || "⚠️ Not set"],
          ["Location", currentUser.address],
          ["Map pin", "✅ Pinned automatically"],
        ]
      : []),
  ];

  return (
    <div className="auth-box">
      <h1 className="page-title">My Account</h1>
      <span className="tag">{isDealerMode ? "🏪 Dealer mode" : "🛍️ Buyer mode"}</span>

      {hasShop && !currentUser.region && !editing && (
        <p className="error">
          ⚠️ Please choose your region (Edit details), so customers can find your shop on the Regions page.
        </p>
      )}

      <div className="mode-card">
        {isDealerMode ? (
          <>
            <p>You are using the website as a <strong>Dealer</strong>.</p>
            <button className="secondary" onClick={() => switchMode("buyer")}>
              🛍️ Switch to Buyer mode
            </button>
          </>
        ) : hasShop ? (
          <>
            <p>You are using the website as a <strong>Buyer</strong>.</p>
            <button onClick={() => switchMode("dealer")}>🏪 Switch to Dealer mode</button>
          </>
        ) : !becoming ? (
          <>
            <p>Want to sell your own products? Open a shop on the marketplace.</p>
            <button onClick={() => setBecoming(true)}>🏪 Become a Dealer</button>
          </>
        ) : (
          <form onSubmit={becomeDealer}>
            <h3>Your shop details</h3>
            <label>Shop name
              <input name="shopName" value={shop.shopName} onChange={setShopField} required />
            </label>
            <label>What do you sell?
              <select name="category" value={shop.category} onChange={setShopField}>
                {categories.map((c) => <option key={c}>{c}</option>)}
              </select>
            </label>
            <RegionSelect value={shop.region} onChange={setShopField} />
            <label>Shop location
              <input
                name="address"
                placeholder="e.g. Kariakoo"
                value={shop.address}
                onChange={setShopField}
                required
              />
            </label>
            <p className="hint">📍 Your shop will be pinned on the map automatically.</p>
            {error && <p className="error">{error}</p>}
            <div>
              <button type="submit" disabled={saving}>
                {saving ? "Finding location..." : "Open my shop"}
              </button>{" "}
              <button type="button" className="secondary" onClick={() => setBecoming(false)}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {!editing ? (
        <>
          <div className="details">
            {rows.map(([label, value]) => (
              <div key={label} className="detail-row">
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          <button onClick={() => { setForm(currentUser); setError(""); setEditing(true); }}>
            Edit details
          </button>
        </>
      ) : (
        <form onSubmit={save}>
          <label>Full name <input name="fullName" value={form.fullName} onChange={set} required /></label>
          <label>Phone <input name="phone" value={form.phone} onChange={set} required /></label>
          {hasShop && (
            <>
              <label>Shop name <input name="shopName" value={form.shopName} onChange={set} required /></label>
              <RegionSelect value={form.region} onChange={set} />
              <label>Shop location <input name="address" value={form.address} onChange={set} required /></label>
            </>
          )}
          {error && <p className="error">{error}</p>}
          <div>
            <button type="submit" disabled={saving}>{saving ? "Finding location..." : "Save changes"}</button>{" "}
            <button type="button" className="secondary" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </form>
      )}

      <button className="danger" style={{ marginTop: 20 }} onClick={() => { logout(); navigate("/"); }}>
        Logout
      </button>
    </div>
  );
}