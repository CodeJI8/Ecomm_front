import { Link, useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import ImageWithPlaceholder from "../components/common/ImageWithPlaceholder";
import PageTitle from "../components/common/PageTitle";
import useCart from "../hooks/useCart";
import { formatPrice } from "../utils/formatPrice";
import { getImageUrl, getProductImages } from "../utils/getImageUrl";
import "../styles/Cart.css";

export default function Cart() {
  const { items, total, updateQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  return (
    <main className="cart-page">
      <PageTitle eyebrow="YOUR NOVA BAG" title="Shopping cart" />
      {items.length === 0 ? (
        <EmptyState title="Your cart is empty">
          <Link to="/#home-catalog">Discover the collection</Link>
        </EmptyState>
      ) : (
        <div className="cart-page__content">
          <ul className="cart-page__items">
            {items.map((item) => {
              const image = getImageUrl(getProductImages(item)[0]);
              return (
                <li className="cart-page__item" key={item.id}>
                  <ImageWithPlaceholder className="cart-page__image" src={image} alt={item.name} />
                  <div className="cart-page__item-info">
                    <Link to={`/products/${item.id}`}><h2>{item.name}</h2></Link>
                    <span>{formatPrice(item.price)}</span>
                    <label htmlFor={`quantity-${item.id}`}>Quantity</label>
                    <input id={`quantity-${item.id}`} type="number" min="1" value={item.quantity} onChange={(event) => updateQuantity(item.id, Math.max(1, Number(event.target.value) || 1))} />
                  </div>
                  <div className="cart-page__item-total">
                    <strong>{formatPrice(Number(item.price) * item.quantity)}</strong>
                    <button type="button" onClick={() => removeItem(item.id)}>Remove</button>
                  </div>
                </li>
              );
            })}
          </ul>
          <aside className="cart-page__summary">
            <h2>Order summary</h2>
            <p><span>Subtotal</span><strong>{formatPrice(total)}</strong></p>
            <p><span>Total</span><strong>{formatPrice(total)}</strong></p>
            <Button type="button" onClick={() => navigate("/checkout")}>Proceed to checkout</Button>
          </aside>
        </div>
      )}
    </main>
  );
}
