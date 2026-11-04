import { useState } from "react";
import "./ImageWithPlaceholder.css";

export default function ImageWithPlaceholder({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);

  return (
    <span className={`image-placeholder ${className}`}>
      {(!src || failed) && (
        <span className="image-placeholder__art" aria-hidden="true">
          <svg viewBox="0 0 64 64" focusable="false">
            <rect x="9" y="13" width="46" height="38" rx="3" />
            <circle cx="39" cy="25" r="4" />
            <path d="m13 45 13-13 10 9 6-6 10 10" />
          </svg>
        </span>
      )}
      {src && !failed && <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />}
    </span>
  );
}
