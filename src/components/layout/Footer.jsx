import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <Link className="site-footer__brand" to="/">nova<span>.</span></Link>
      <p>Thoughtful essentials. Everyday confidence.</p>
      <nav aria-label="Footer navigation">
        <Link to="/#home-catalog">Shop</Link>
        <Link to="/categories">Categories</Link>
        <Link to="/cart">Cart</Link>
        <a href="#delivery-info">Delivery</a>
      </nav>
      <span id="delivery-info">Free shipping on orders over $50 · © 2026 NOVA</span>
    </footer>
  );
}
