import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";
import { getImageUrl, getProductImages } from "../../utils/getImageUrl";
import ImageWithPlaceholder from "../common/ImageWithPlaceholder";
import "../common/Button.css";
import "./ProductCard.css";

export default function ProductCard({ product, onAdd, isFavorite = false, onToggleFavorite }) {
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const resetAddedTimer = useRef(null);
  const image = getImageUrl(getProductImages(product)[0]);
  const id = product.id ?? product._id;
  const price = Number(product.price);
  const compareAtPrice = Number(product.compareAtPrice);
  const discount = Number.isFinite(price) && Number.isFinite(compareAtPrice) && compareAtPrice > price
    ? Math.round((1 - price / compareAtPrice) * 100)
    : 0;
  const ratingValue = Number(product.rating ?? product.averageRating);
  const reviewCount = Number(product.reviewCount ?? product.reviewsCount);
  const hasRating = Number.isFinite(ratingValue) && ratingValue > 0;
  const stock = Number(product.stock);
  const hasStock = product.stock !== undefined && product.stock !== null && Number.isFinite(stock);
  const badge = discount > 0
    ? `Sale −${discount}%`
    : product.isBestSeller === true || product.isBestseller === true
      ? "Best seller"
      : product.isNew === true || product.isNewArrival === true
        ? "New"
        : "";

  useEffect(() => () => clearTimeout(resetAddedTimer.current), []);

  async function buyNow() {
    if (await onAdd(product)) navigate("/cart");
  }

  async function addToCart() {
    if (adding || (hasStock && stock <= 0)) return;
    setAdding(true);
    setAdded(false);
    clearTimeout(resetAddedTimer.current);
    try {
      if (await onAdd(product)) {
        setAdded(true);
        resetAddedTimer.current = setTimeout(() => setAdded(false), 1600);
      }
    } finally {
      setAdding(false);
    }
  }

  return (
    <article className="product-card">
      <div className="product-card__image-wrap">
        <Link to={`/products/${id}`} aria-label={`View ${product.name} details`}>
          <ImageWithPlaceholder src={image} alt={product.name} />
        </Link>
        {badge && <span className={`product-card__tag${discount > 0 ? " product-card__tag--sale" : ""}`}>{badge}</span>}
        {onToggleFavorite && (
          <button className={`product-card__favorite${isFavorite ? " is-favorite" : ""}`} type="button" aria-label={`${isFavorite ? "Remove" : "Add"} ${product.name} ${isFavorite ? "from" : "to"} favorites`} aria-pressed={isFavorite} onClick={() => onToggleFavorite(id)}>
            {isFavorite ? "♥" : "♡"}
          </button>
        )}
      </div>
      <div className="product-card__info">
        <h3><Link to={`/products/${id}`}>{product.name}</Link></h3>
        <div className="product-card__rating" aria-label={hasRating ? `${ratingValue.toFixed(1)} out of 5 stars${reviewCount > 0 ? `, ${reviewCount} reviews` : ""}` : "No reviews yet"}>
          <span className="product-card__stars" aria-hidden="true">{hasRating ? "★".repeat(Math.min(5, Math.round(ratingValue))) + "☆".repeat(Math.max(0, 5 - Math.min(5, Math.round(ratingValue)))) : "☆☆☆☆☆"}</span>
          {hasRating
            ? <span>{ratingValue.toFixed(1)}{reviewCount > 0 ? ` (${reviewCount})` : ""}</span>
            : <span>No reviews yet</span>}
        </div>
        <div className="product-card__price">
          <span>{formatPrice(product.price)}</span>
          {discount > 0 && (
            <>
              <del>{formatPrice(compareAtPrice)}</del>
              <span className="product-card__discount" aria-label={`${discount}% off`}>−{discount}%</span>
            </>
          )}
        </div>
        {hasStock && stock > 0 && stock <= 5 && <p className="product-card__stock">Only {stock} left</p>}
        {onAdd && (
          <div className="product-card__actions">
            <button className="common-button common-button--purchase product-card__add" type="button" onClick={addToCart} disabled={adding || (hasStock && stock <= 0)}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2l2.2 11.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 1.9-1.4L22 8H6" /><circle cx="10" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></svg>
              {adding ? "Adding…" : added ? "Added ✓" : "Add to cart"}
            </button>
            <button className="common-button common-button--secondary product-card__buy" type="button" aria-label="Buy now" title="Buy now" onClick={buyNow} disabled={hasStock && stock <= 0}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
            </button>
          </div>
        )}
        <span className="visually-hidden" aria-live="polite">{added ? `${product.name} added to cart` : ""}</span>
      </div>
    </article>
  );
}
