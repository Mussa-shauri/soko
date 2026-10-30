import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { regions } from "../data/regions.js";
import { useAllDealers } from "../hooks/useAllDealers.js";
import { useProducts } from "../context/ProductsContext.jsx";

export default function Regions() {
  const allDealers = useAllDealers();
  const { products } = useProducts();
  const [selected, setSelected] = useState(null);
  const [onlyActive, setOnlyActive] = useState(false);
  const shopsRef = useRef(null);

  useEffect(() => {
    if (selected && shopsRef.current) {
      shopsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selected]);

  const shopsIn = (region) => allDealers.filter((d) => d.region === region);
  const countProducts = (d) =>
    products.filter((p) => (d.userId && p.sellerId === d.userId) || p.seller === d.name).length;

  const placed = allDealers.filter((d) => regions.includes(d.region));
  const activeRegions = regions.filter((r) => shopsIn(r).length > 0);
  const visibleRegions = onlyActive ? activeRegions : regions;
  const withoutRegion = allDealers.length - placed.length;

  return (
    <>
      <h1 className="page-title">🗺️ Shops by Region</h1>
      <p className="region-summary">
        {placed.length} shops across {activeRegions.length} regions of Tanzania
        {withoutRegion > 0 && ` · ${withoutRegion} shop(s) have not chosen a region yet`}
      </p>

      <label className="toggle">
        <input type="checkbox" checked={onlyActive} onChange={(e) => setOnlyActive(e.target.checked)} />
        Show only regions with shops
      </label>

      <div className="region-grid">
        {visibleRegions.map((r) => {
          const n = shopsIn(r).length;
          return (
            <button
              key={r}
              className={`region-card ${selected === r ? "region-active" : ""} ${n === 0 ? "region-empty" : ""}`}
              onClick={() => setSelected(r)}
            >
              <span className="region-name">{r}</span>
              <span className="region-count">{n} {n === 1 ? "shop" : "shops"}</span>
            </button>
          );
        })}
      </div>

      {selected && (
        <section className="region-shops" ref={shopsRef}>
          <h2>🏪 Shops in {selected}</h2>
          {shopsIn(selected).length === 0 ? (
            <p>
              No shops in {selected} yet. <Link to="/register">Open the first one!</Link>
            </p>
          ) : (
            <div className="shop-grid">
              {shopsIn(selected).map((d) => (
                <div key={d.id} className="shop-card">
                  <span className="tag">{d.category}</span>
                  <h3>{d.name}</h3>
                  <p className="seller">📍 {d.address}</p>
                  <p className="seller">🛍️ {countProducts(d)} products</p>
                  <div className="shop-actions">
                    <a className="call-btn" href={`tel:${d.phone.replace(/\s/g, "")}`}>
                      📞 {d.phone}
                    </a>
                    <Link className="view-btn" to={`/shop/${d.id}`}>View shop</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </>
  );
}