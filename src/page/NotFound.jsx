import { Link } from "react-router-dom";
import "../styles/NotFound.css";

export default function NotFound() {
  return (
    <main className="not-found">
      <p>404</p>
      <h1>Page not found</h1>
      <Link to="/">Return home</Link>
    </main>
  );
}
