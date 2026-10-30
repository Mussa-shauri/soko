import { useRef, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useProducts } from "../context/ProductsContext.jsx";
import { categories, formatTZS } from "../data/products.js";
import { fileToDataUrl } from "../utils/image.js";
import { useOrders } from "../context/OrdersContext.jsx";

const emptyForm = (category) => ({ name: "", category, price: "", description: "" });

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { products, addProduct, updateProduct, deleteProduct } = useProducts();
    const { orders } = useOrders();
  const defaultCategory = currentUser?.category || categories[0];

  const [form, setForm] = useState(emptyForm(defaultCategory));
  const [image, setImage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileRef = useRef(null);

  if (!currentUser || currentUser.role !== "dealer") return <Navigate to="/login" />;

  const myProducts = products.filter((p) => p.sellerId === currentUser.id);
    const mySales = orders.filter((o) => o.dealerId === currentUser.id);
  const earnings = mySales.reduce((sum, o) => sum + o.total, 0);
  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm(defaultCategory));
    setImage("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      category: p.category,
      price: String(p.price),
      description: p.description,
    });
    setImage(p.image);
    setError("");
    setSuccess("");
    if (fileRef.current) fileRef.current.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Please choose an image file.");
    if (file.size > 8 * 1024 * 1024) return setError("Image is too big. Maximum 8MB.");
    setError("");
    setImage(await fileToDataUrl(file));
  };

  const submit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!image) return setError("Please add a product photo.");
    if (Number(form.price) <= 0) return setError("Enter a valid price.");

    const data = {
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      description: form.description.trim(),
      image,
    };

    const wasEditing = editingId !== null;
    const ok = wasEditing
      ? updateProduct(editingId, data)
      : addProduct({ ...data, seller: currentUser.shopName, sellerId: currentUser.id });

    if (!ok) return setError("Storage is full. Delete some products and try again.");

    resetForm();
    setSuccess(wasEditing ? "✅ Changes saved." : "✅ Product uploaded! It is now live on the website.");
  };

  const remove = (p) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    deleteProduct(p.id);
    if (editingId === p.id) resetForm();
  };

  return (
    <>
      <h1 className="page-title">🏪 {currentUser.shopName} — My Shop</h1>
            <div className="stats">
        <div className="stat"><span>My products</span><strong>{myProducts.length}</strong></div>
        <div className="stat"><span>Payments received</span><strong>{mySales.length}</strong></div>
        <div className="stat"><span>Total earnings</span><strong>{formatTZS(earnings)}</strong></div>
      </div>
      <p style={{ marginBottom: 20 }}>
        <Link to="/sales" className="view-btn">💰 View all payments →</Link>
      </p>

      <div className="dash-layout">
        <form className="auth-box" onSubmit={submit}>
          <h2>{editingId ? "✏️ Edit product" : "Upload a new product"}</h2>

          <label>Product name
            <input name="name" value={form.name} onChange={set} required />
          </label>

          <label>Category
            <select name="category" value={form.category} onChange={set}>
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>

          <label>Price (TZS)
            <input type="number" name="price" min="1" value={form.price} onChange={set} required />
          </label>

          <label>Description
            <textarea name="description" rows="3" value={form.description} onChange={set} required />
          </label>

          <label>{editingId ? "Change photo (optional)" : "Product photo"}
            <input type="file" accept="image/*" ref={fileRef} onChange={onImage} />
          </label>
          {image && <img className="preview" src={image} alt="Preview" />}

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <div>
            <button type="submit">{editingId ? "Save changes" : "Upload product"}</button>{" "}
            {editingId && (
              <button type="button" className="secondary" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>

        <div>
          <h2 className="my-title">My products ({myProducts.length})</h2>
          {myProducts.length === 0 && <p>You have not uploaded anything yet.</p>}
          {myProducts.map((p) => (
            <div key={p.id} className={`cart-row ${editingId === p.id ? "editing-row" : ""}`}>
              <img src={p.image} alt={p.name} />
              <div className="cart-info">
                <strong>{p.name}</strong>
                <span>{formatTZS(p.price)} · {p.category}</span>
              </div>
              <button onClick={() => startEdit(p)}>Edit</button>
              <button className="danger" onClick={() => remove(p)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}