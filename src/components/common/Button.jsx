import "./Button.css";

export default function Button({ variant = "primary", className = "", ...props }) {
  return <button className={`common-button common-button--${variant} ${className}`} {...props} />;
}
