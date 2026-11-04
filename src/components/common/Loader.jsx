import "./Loader.css";

export default function Loader({ label = "Loading" }) {
  return (
    <div className="common-loader" role="status" aria-live="polite">
      <span className="common-loader__spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
