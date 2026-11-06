import { Link } from "react-router-dom";
import { useState } from "react";
import "./Footer.css";

export default function Footer() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <footer className="site-footer">
      <div className="site-footer__columns">
        <div className="site-footer__intro">
          <Link className="site-footer__brand" to="/">Shopcart<span>.</span></Link>
          <p>Good finds for the way you live.</p>
        </div>
        <nav className="site-footer__column" aria-label="Shop">
          <h2>Shop</h2>
          <Link to="/#home-catalog">All products</Link>
          <Link to="/?sale=1#home-catalog">Deals</Link>
          <Link to="/categories">Categories</Link>
        </nav>
        <nav className="site-footer__column" aria-label="Support">
          <h2>Support</h2>
          <a href="/#delivery-info">Delivery &amp; returns</a>
          <Link to="/cart">Your cart</Link>
          <Link to="/orders">Order help</Link>
        </nav>
        <nav className="site-footer__column" aria-label="Company">
          <h2>Company</h2>
          <Link to="/profile">Your account</Link>
          <Link to="/categories">Our collection</Link>
        </nav>
        <section className="site-footer__newsletter" aria-labelledby="footer-newsletter-title">
          <h2 id="footer-newsletter-title">A little something extra</h2>
          <p>Get new arrivals and offers in your inbox.</p>
          <form onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(true);
            event.currentTarget.reset();
          }}>
            <label className="visually-hidden" htmlFor="footer-newsletter-email">Your email address</label>
            <input id="footer-newsletter-email" type="email" placeholder="Email address" required onChange={() => setSubmitted(false)} />
            <button type="submit">Subscribe <span aria-hidden="true">↗</span></button>
          </form>
          {submitted && <p className="site-footer__newsletter-status" role="status">Newsletter sign-up isn't connected yet.</p>}
        </section>
      </div>
      <div className="site-footer__bottom">
        <div className="site-footer__payments" aria-label="Secure payment options">
          <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20M6 15h4" /></svg>
          <span>Secure card checkout</span>
        </div>
        <span>© {new Date().getFullYear()} Shopcart. All rights reserved.</span>
      </div>
    </footer>
  );
}
