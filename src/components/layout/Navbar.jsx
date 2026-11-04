import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useCart from "../../hooks/useCart";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const navigate = useNavigate();
  const closeMenu = () => setMenuOpen(false);

  function submitSearch(event) {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/?q=${encodeURIComponent(query)}#home-catalog` : "/#home-catalog");
    closeMenu();
  }

  return (
    <header className="site-nav">
      <Link className="site-nav__brand" to="/" onClick={closeMenu}>
        <svg className="site-nav__brand-mark" viewBox="0 0 32 32" aria-hidden="true">
          <path d="M4 8h3l3.2 14h14.1L28 12H9" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" />
          <circle cx="12.5" cy="26" r="1.8" fill="#f2a900" />
          <circle cx="23.5" cy="26" r="1.8" fill="#f2a900" />
          <path d="M14 7c.2-3.5 2.2-5.4 5.5-5.5-.1 3.2-1.8 5.1-5.5 5.5Z" fill="#16823a" />
          <path d="M14.5 8c-.2-2.7-1.7-4.1-4.2-4.3.1 2.4 1.4 4 4.2 4.3Z" fill="#16823a" />
        </svg>
        <span>Shopcart</span>
      </Link>
      <button className="site-nav__toggle" type="button" aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={menuOpen} aria-controls="site-nav-links" onClick={() => setMenuOpen((open) => !open)}>
        <span className="site-nav__hamburger" aria-hidden="true"><span /><span /><span /></span>
      </button>
      <nav id="site-nav-links" className={`site-nav__links${menuOpen ? " is-open" : ""}`} aria-label="Main navigation">
        <div className="site-nav__main-links">
          <Link to="/categories" onClick={closeMenu}>Categories <span aria-hidden="true">⌄</span></Link>
          <Link to="/?sale=1#home-catalog" onClick={closeMenu}>Deals</Link>
          <Link to="/#home-catalog" onClick={closeMenu}>What's New</Link>
          <Link to="/#delivery-info" onClick={closeMenu}>Delivery</Link>
        </div>
        <form className="site-nav__search" role="search" onSubmit={submitSearch}>
          <label className="visually-hidden" htmlFor="site-product-search">Search products</label>
          <input id="site-product-search" type="search" placeholder="Search Product" value={search} onChange={(event) => setSearch(event.target.value)} />
          <button type="submit" aria-label="Submit search">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.3" /><path d="m16 16 4.2 4.2" /></svg>
          </button>
        </form>
        <div className="site-nav__utility-links">
          <Link to={user ? "/profile" : "/login"} onClick={closeMenu}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.5-3.4 3.2-5.3 7-5.3s6.5 1.9 7 5.3" /></svg>
            Account
          </Link>
          {user && <Link to="/orders" onClick={closeMenu}>Order history</Link>}
          {user && <button className="site-nav__logout" type="button" onClick={() => { logout(); closeMenu(); }}>Log out</button>}
          <Link className="site-nav__cart" to="/cart" onClick={closeMenu}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 1.9-1.4L22 8H6" /><circle cx="10" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></svg>
            Cart{count > 0 && <span aria-label={`${count} items`}>{count}</span>}
          </Link>
        </div>
      </nav>
    </header>
  );
}
