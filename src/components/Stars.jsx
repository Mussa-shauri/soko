export default function Stars({ value = 0, onChange, size = "1.1rem" }) {
  return (
    <span className="stars" style={{ fontSize: size }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`star ${n <= Math.round(value) ? "star-on" : ""} ${onChange ? "star-click" : ""}`}
          onClick={onChange ? () => onChange(n) : undefined}
        >
          ★
        </span>
      ))}
    </span>
  );
}