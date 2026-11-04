import "./Input.css";

export default function Input({ label, id, error, ...props }) {
  return (
    <div className="common-input">
      <label htmlFor={id}>{label}</label>
      <input id={id} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} {...props} />
      {error && <span className="common-input__error" id={`${id}-error`}>{error}</span>}
    </div>
  );
}
