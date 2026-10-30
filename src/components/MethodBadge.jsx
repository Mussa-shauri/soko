import { methods } from "../data/paymentMethods.js";

export default function MethodBadge({ name }) {
  const m = methods.find((x) => x.name === name);
  return (
    <span className="method-badge">
      {m && (
        <img
          src={m.logo}
          alt=""
          onError={(e) => { e.currentTarget.style.display = "none"; }}
        />
      )}
      {name}
    </span>
  );
}