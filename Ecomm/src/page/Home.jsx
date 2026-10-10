
import { useState } from "react";
import "../styles/Home.css";

const categories = [
  { name: "Women", image: "photo-1483985988355-763728e1935b" },
  { name: "Men", image: "photo-1516257984-b1b4d707412e" },
  { name: "Accessories", image: "photo-1523275335684-37898b6baf30" },
  { name: "Footwear", image: "photo-1542291026-7eec264c27ff" },
];

const products = [
  { id: 1, name: "Relaxed Cotton Shirt", category: "Clothing", price: 48, oldPrice: 65, image: "photo-1596755094514-f87e34085b2c", tag: "BESTSELLER" },
  { id: 2, name: "Minimal Everyday Tote", category: "Accessories", price: 32, oldPrice: null, image: "photo-1548036328-c9fa89d128fa", tag: "NEW" },
  { id: 3, name: "Classic Low Sneakers", category: "Footwear", price: 69, oldPrice: 89, image: "photo-1542291026-7eec264c27ff", tag: "SALE" },
  { id: 4, name: "Essential Knit Sweater", category: "Clothing", price: 54, oldPrice: null, image: "photo-1576566588028-4147f3842f27", tag: "" },
];

const imageUrl = (id, width = 700) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

const banners = [
  {
    eyebrow: "THE NEW SEASON",
    title: "Everyday style.\nElevated.",
    description: "Discover the pieces you'll reach for again and again.",
    button: "Shop the collection",
    image: "photo-1483985988355-763728e1935b",
  },
  {
    eyebrow: "LESS, BUT BETTER",
    title: "Find your\nnew essentials.",
    description: "Thoughtfully selected styles made for everyday living.",
    button: "Explore essentials",
    image: "photo-1483985988355-763728e1935b",
  },
  {
    eyebrow: "LIMITED-TIME OFFER",
    title: "Good style.\nBetter prices.",
    description: "Discover your favorites with up to 30% off selected styles.",
    button: "Shop the sale",
    image: "photo-1483985988355-763728e1935b",
  },
];

export default function Home() {
  const [activeBanner, setActiveBanner] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState("");

  const banner = banners[activeBanner];

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  return (
    <main className="home-page">
      <div className="announcement-bar">
        Free shipping on orders over $50
        <span> · </span>
        Discover our new collection
      </div>

      <header className="site-header">
        <a className="brand-logo" href="#">
          nova<span>.</span>
        </a>

        <nav className="main-navigation">
          <a href="#new-arrivals">New Arrivals</a>
          <a href="#categories">Women</a>
          <a href="#categories">Men</a>
          <a href="#categories">Accessories</a>
          <a href="#trending" className="sale-link">Sale</a>
        </nav>

        <div className="header-actions">
          <label className="search-box">
            <span>⌕</span>
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <button
            className="icon-button"
            aria-label="Favorites"
            onClick={() => setSearch("")}
          >
            ♡
            <span className="action-count">{favorites.length}</span>
          </button>

          <button className="icon-button cart-button" aria-label="Shopping bag">
            ♧
            <span className="action-count">{cartCount}</span>
          </button>
        </div>
      </header>

      <section className="hero-section" id="new-arrivals">
        <img
          className="hero-image"
          src={imageUrl(banner.image, 1800)}
          alt="New season fashion collection"
        />

        <div className="hero-overlay" />

        <div className="hero-content" key={activeBanner}>
          <span className="eyebrow">{banner.eyebrow}</span>
          <h1>{banner.title}</h1>
          <p>{banner.description}</p>
          <a href="#trending" className="primary-button">
            {banner.button} <span>↗</span>
          </a>
        </div>

        <button
          className="carousel-arrow previous"
          aria-label="Previous banner"
          onClick={() =>
            setActiveBanner((activeBanner - 1 + banners.length) % banners.length)
          }
        >
          ←
        </button>

        <button
          className="carousel-arrow next"
          aria-label="Next banner"
          onClick={() => setActiveBanner((activeBanner + 1) % banners.length)}
        >
          →
        </button>

        <div className="carousel-pagination">
          {banners.map((item, index) => (
            <button
              key={item.eyebrow}
              aria-label={`Show banner ${index + 1}`}
              className={activeBanner === index ? "active" : ""}
              onClick={() => setActiveBanner(index)}
            />
          ))}
        </div>

        <span className="hero-counter">
          0{activeBanner + 1} <span>/</span> 0{banners.length}
        </span>
      </section>

      <section className="categories-section" id="categories">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">FIND YOUR STYLE</span>
            <h2>Shop by category</h2>
          </div>
          <a href="#trending" className="text-link">
            Explore everything ↗
          </a>
        </div>

        <div className="category-grid">
          {categories.map((category, index) => (
            <a
              className="category-card"
              href="#trending"
              key={category.name}
            >
              <img
                src={imageUrl(category.image, 600)}
                alt={category.name}
                loading="lazy"
              />
              <div className="category-overlay" />
              <div className="category-info">
                <span>0{index + 1}</span>
                <h3>{category.name}</h3>
                <span className="category-arrow">↗</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="products-section" id="trending">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">CURATED FOR YOU</span>
            <h2>Trending now<span>.</span></h2>
            <p className="section-description">
              The pieces everyone's talking about.
            </p>
          </div>
          <a href="#new-arrivals" className="text-link">
            View all products ↗
          </a>
        </div>

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-image-wrap">
                <img
                  src={imageUrl(product.image, 700)}
                  alt={product.name}
                  loading="lazy"
                />

                {product.tag && (
                  <span className={`product-tag ${product.tag === "SALE" ? "sale-tag" : ""}`}>
                    {product.tag}
                  </span>
                )}

                <button
                  className={`favorite-button ${
                    favorites.includes(product.id) ? "is-favorite" : ""
                  }`}
                  aria-label="Toggle favorite"
                  onClick={() => toggleFavorite(product.id)}
                >
                  {favorites.includes(product.id) ? "♥" : "♡"}
                </button>

                <button
                  className="quick-add-button"
                  onClick={() => setCartCount((count) => count + 1)}
                >
                  + Add to bag
                </button>
              </div>

              <div className="product-info">
                <div>
                  <span className="product-category">{product.category}</span>
                  <h3>{product.name}</h3>
                </div>

                <div className="product-price">
                  <span>${product.price}</span>
                  {product.oldPrice && (
                    <del>${product.oldPrice}</del>
                  )}
                </div>
              </div>

              <div className="product-colors">
                <span />
                <span />
                <span />
              </div>
            </article>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <p className="empty-results">
            No products found. Try another search.
          </p>
        )}
      </section>

      <section className="newsletter-section">
        <div>
          <span className="section-eyebrow">A LITTLE SOMETHING EXTRA</span>
          <h2>Good things, delivered.</h2>
          <p>Get updates on new arrivals, exclusive offers, and more.</p>
        </div>
        <form
          className="newsletter-form"
          onSubmit={(event) => {
            event.preventDefault();
            event.currentTarget.reset();
          }}
        >
          <input type="email" placeholder="Your email address" required />
          <button type="submit">Subscribe ↗</button>
        </form>
      </section>

      <footer className="site-footer">
        <a className="brand-logo footer-logo" href="#">
          nova<span>.</span>
        </a>
        <p>Thoughtful essentials. Everyday confidence.</p>
        <div className="footer-links">
          <a href="#categories">Shop</a>
          <a href="#new-arrivals">About</a>
          <a href="#trending">Contact</a>
        </div>
        <span className="copyright">© 2026 NOVA. All rights reserved.</span>
      </footer>
    </main>
  );
}
