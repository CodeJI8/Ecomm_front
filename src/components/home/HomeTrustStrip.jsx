import { Link } from "react-router-dom";

const trustItems = [
  { title: "Free delivery", detail: "On qualifying orders", icon: <path d="M3 7h11v10H3zM14 10h4l3 3v4h-7zM7 20a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" /> },
  { title: "Easy returns", detail: "Shop with confidence", icon: <path d="M4 10a8 8 0 1 1-1 5M4 4v6h6" /> },
  { title: "Secure payment", detail: "Protected checkout", icon: <path d="M6 10V7a4 4 0 0 1 8 0v3m-9 0h10a2 2 0 0 1 2 2v7H3v-7a2 2 0 0 1 2-2Zm5 4v2" /> },
  { title: "24/7 support", detail: "Here whenever you need us", icon: <path d="M4 13v-2a8 8 0 0 1 16 0v2m-16 0v4h4v-6H4Zm16 0v4h-4v-6h4ZM16 20h-4" /> },
];

export default function HomeTrustStrip({ categories }) {
  return (
    <>
      <section className="home-trust" id="delivery-info" aria-label="Shopping benefits">
        {trustItems.map(({ title, detail, icon }) => (
          <div className="home-trust__item" key={title}>
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">{icon}</svg>
            <span><strong>{title}</strong><small>{detail}</small></span>
          </div>
        ))}
      </section>
      {categories.length > 0 && (
        <nav className="home-shortcuts" aria-label="Shop by category">
          <span className="home-shortcuts__label">Shop by</span>
          <Link to="/#home-catalog">All</Link>
          {categories.slice(0, 6).map((category) => (
            <Link
              key={category.id ?? category._id ?? category.name}
              to={`/?category=${encodeURIComponent(category.name)}#home-catalog`}
            >
              {category.name}
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}
