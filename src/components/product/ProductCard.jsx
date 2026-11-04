import { Link } from "react-router-dom";
import { formatPrice } from "../../utils/formatPrice";
import { getImageUrl, getProductImages } from "../../utils/getImageUrl";
import ImageWithPlaceholder from "../common/ImageWithPlaceholder";
import "./ProductCard.css";

export default function ProductCard({ product, onAdd, isFavorite = false, onToggleFavorite }) {
  const image = getImageUrl(getProductImages(product)[0]);
  const category = product.category?.name ?? product.categories?.[0]?.name ?? "";
  const id = product.id ?? product._id;
  const tag = product.tag ?? (product.isFeatured ? "FEATURED" : "");

  return (
    <article className="product-card">
      <div className="product-card__image-wrap">
        <Link to={`/products/${id}`} aria-label={`View ${product.name} details`}>
          <ImageWithPlaceholder src={image} alt={product.name} />
        </Link>
        {tag && <span className={`product-card__tag${tag === "SALE" ? " product-card__tag--sale" : ""}`}>{tag}</span>}
        {onToggleFavorite && (
          <button className={`product-card__favorite${isFavorite ? " is-favorite" : ""}`} type="button" aria-label={`${isFavorite ? "Remove" : "Add"} ${product.name} ${isFavorite ? "from" : "to"} favorites`} aria-pressed={isFavorite} onClick={() => onToggleFavorite(id)}>
            {isFavorite ? "♥" : "♡"}
          </button>
        )}
        {onAdd && <button className="product-card__quick-add" type="button" onClick={() => onAdd(product)}>+ Add to bag</button>}
      </div>
      <div className="product-card__info">
        <div>
          {category && <span className="product-card__category">{category}</span>}
          <h3><Link to={`/products/${id}`}>{product.name}</Link></h3>
        </div>
        <div className="product-card__price">
          <span>{formatPrice(product.price)}</span>
          {product.compareAtPrice && <del>{formatPrice(product.compareAtPrice)}</del>}
        </div>
      </div>
    </article>
  );
}
