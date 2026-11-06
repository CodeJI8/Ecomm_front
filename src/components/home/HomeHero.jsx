import { Link } from "react-router-dom";
import { getImageUrl, getProductImages } from "../../utils/getImageUrl";

const fallbackImage = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1400&q=85";

export default function HomeHero({ promoProduct }) {
  const compareAtPrice = Number(promoProduct?.compareAtPrice);
  const price = Number(promoProduct?.price);
  const discount = compareAtPrice > price
    ? Math.round((1 - price / compareAtPrice) * 100)
    : 0;
  const title = discount > 0
    ? `Save up to ${discount}%.`
    : "Find your next favorite.";
  const image = getImageUrl(getProductImages(promoProduct ?? {})[0]) || fallbackImage;

  return (
    <section className="home-page__hero">
      <img className="home-page__hero-image" src={image} alt="" />
      <div className="home-page__hero-overlay" />
      <div className="home-page__hero-content">
        <span className="home-page__offer-pill">{discount > 0 ? "LIMITED-TIME OFFER" : "FRESH FINDS, JUST FOR YOU"}</span>
        <h1>{title}</h1>
        <p>Everyday essentials for less.</p>
        <div className="home-page__hero-actions">
          <Link to="/#home-catalog" className="home-page__primary-button">Shop now <span aria-hidden="true">↗</span></Link>
          <Link to="/?sale=1#home-catalog" className="home-page__deals-link">View deals</Link>
        </div>
      </div>
    </section>
  );
}
