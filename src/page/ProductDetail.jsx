import { useCallback, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import ErrorMessage from "../components/common/ErrorMessage";
import ImageWithPlaceholder from "../components/common/ImageWithPlaceholder";
import Loader from "../components/common/Loader";
import useAsync from "../hooks/useAsync";
import useCart from "../hooks/useCart";
import { getProductById } from "../api";
import { formatPrice } from "../utils/formatPrice";
import { getApiData } from "../utils/getApiData";
import { getImageUrl, getProductImages } from "../utils/getImageUrl";
import "../styles/ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [selection, setSelection] = useState({ id, quantity: 1, activeImage: 0 });
  const quantity = selection.id === id ? selection.quantity : 1;
  const activeImage = selection.id === id ? selection.activeImage : 0;
  const request = useCallback(({ signal }) => {
    const productId = Number(id);
    if (!Number.isSafeInteger(productId) || productId < 1) {
      throw new Error("This product link is invalid.");
    }
    return getProductById(productId, { signal, timeout: 10000 });
  }, [id]);
  const { data, loading, error, run } = useAsync(request);
  const payload = getApiData(data);
  const product = payload?.product ?? (payload?.id != null || payload?._id != null ? payload : null);
  const images = getProductImages(product ?? {});
  const image = getImageUrl(images[activeImage] ?? images[0]);
  const stock = Math.max(0, Number(product?.stock) || 0);
  const price = Number(product?.price);
  const compareAtPrice = Number(product?.compareAtPrice);
  const discount = compareAtPrice > price
    ? Math.round((1 - price / compareAtPrice) * 100)
    : 0;
  const categoryValue = product?.category?.name ?? product?.categories?.[0]?.name ?? product?.category;
  const category = typeof categoryValue === "string" ? categoryValue : "";
  const rating = Number(product?.rating ?? product?.averageRating);
  const reviewCount = Number(product?.reviewCount ?? product?.reviewsCount);

  function changeQuantity(nextQuantity) {
    setSelection({ id, quantity: Math.min(stock, Math.max(1, nextQuantity)), activeImage });
  }

  function changeImage(nextImage) {
    setSelection({ id, quantity, activeImage: nextImage });
  }

  async function buyNow() {
    if (await addItem(product, quantity)) navigate("/cart");
  }

  return (
    <main className="product-detail">
      {loading && <Loader label="Loading product details" />}
      {!loading && error && <ErrorMessage error={error} onRetry={run} />}
      {!loading && !error && !product && (
        <EmptyState title="Product not found">This product may no longer be available.</EmptyState>
      )}
      {!loading && !error && product && (
        <>
          <nav className="product-detail__breadcrumb" aria-label="Breadcrumb">
            <ol>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/#home-catalog">Shop</Link></li>
              {category && <li><Link to="/categories">{category}</Link></li>}
              <li aria-current="page">{product.name}</li>
            </ol>
          </nav>
          <div className="product-detail__content">
            <section className="product-detail__gallery" aria-label="Product images">
              <div className="product-detail__main-image">
                <ImageWithPlaceholder src={image} alt={product.name ?? "Product"} />
              </div>
              {images.length > 1 && (
                <div className="product-detail__thumbnails">
                  {images.map((item, index) => (
                    <button
                      className={activeImage === index ? "is-active" : ""}
                      type="button"
                      key={getImageUrl(item)}
                      onClick={() => changeImage(index)}
                      aria-label={`Show image ${index + 1}`}
                      aria-pressed={activeImage === index}
                    >
                      <ImageWithPlaceholder src={getImageUrl(item)} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </section>
            <section className="product-detail__info">
              {category && <p className="product-detail__eyebrow">{category}</p>}
              <h1>{product.name}</h1>
              {product.description && <p className="product-detail__description">{product.description}</p>}
              {Number.isFinite(rating) && rating > 0 && (
                <p className="product-detail__rating" aria-label={`${rating} out of 5 stars`}>
                  <span aria-hidden="true">{"★".repeat(Math.min(5, Math.round(rating)))}</span>
                  {reviewCount > 0 && <small>({reviewCount} reviews)</small>}
                </p>
              )}
              <div className="product-detail__price-block">
                <p className="product-detail__price">
                  {formatPrice(product.price)}
                  {discount > 0 && (
                    <>
                      <del>{formatPrice(product.compareAtPrice)}</del>
                      <span>{discount}% off</span>
                    </>
                  )}
                </p>
                <p className={stock > 0 ? "product-detail__stock" : "product-detail__stock is-out"}>
                  {stock > 0 ? `${stock} in stock` : "Out of stock"}
                </p>
              </div>
              {stock > 0 && (
                <div className="product-detail__actions">
                  <div className="product-detail__purchase-row">
                    <div className="product-detail__quantity">
                      <span id="product-quantity-label">Quantity</span>
                      <div role="group" aria-labelledby="product-quantity-label">
                        <button type="button" aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => changeQuantity(quantity - 1)}>−</button>
                        <output>{quantity}</output>
                        <button type="button" aria-label="Increase quantity" disabled={quantity >= stock} onClick={() => changeQuantity(quantity + 1)}>+</button>
                      </div>
                    </div>
                    <span className="product-detail__stock-note">{stock} available</span>
                  </div>
                  <div className="product-detail__buttons">
                    <Button onClick={buyNow}>Buy now</Button>
                    <Button variant="secondary" onClick={() => addItem(product, quantity)}>Add to cart</Button>
                  </div>
                </div>
              )}
              <div className="product-detail__service-note">
                <span aria-hidden="true">↗</span>
                <p><strong>Delivery &amp; returns</strong><small>Shipping and return options are available at checkout.</small></p>
              </div>
            </section>
          </div>
        </>
      )}
    </main>
  );
}
