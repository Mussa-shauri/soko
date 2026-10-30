import { useState } from "react";
import { useAllDealers } from "../hooks/useAllDealers.js";
import DealersMap from "../components/DealersMap.jsx";

export default function Dealers() {
  const allDealers = useAllDealers();
  const [selected, setSelected] = useState(null);

  return (
    <>
      <h1 className="page-title">📍 Our Dealers</h1>
      <div className="dealers-layout">
        <div className="dealer-list">
          {allDealers.map((d) => (
            <div
              key={d.id}
              className={`dealer-card ${selected?.id === d.id ? "dealer-active" : ""}`}
              onClick={() => setSelected(d)}
            >
              <span className="tag">{d.category}</span>
              <h3>{d.name}</h3>
              <p className="seller">{d.address}{d.region ? ` · ${d.region}` : ""}</p>
              <a
                className="call-btn"
                href={`tel:${d.phone.replace(/\s/g, "")}`}
                onClick={(e) => e.stopPropagation()}
              >
                📞 {d.phone}
              </a>
            </div>
          ))}
        </div>
        <DealersMap dealers={allDealers} selected={selected} />
      </div>
    </>
  );
}