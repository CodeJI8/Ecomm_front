import { Link, useLocation } from "react-router-dom";
import EmptyState from "../components/common/EmptyState";
import PageTitle from "../components/common/PageTitle";
import { formatPrice } from "../utils/formatPrice";
import "../styles/Order.css";

function firstAvailable(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

export default function OrderConfirmation() {
  const { state } = useLocation();

  if (!state?.order) {
    return (
      <main className="order-page">
        <EmptyState title="Order details are unavailable">
          <Link to="/cart">Return to your cart</Link>
        </EmptyState>
      </main>
    );
  }

  const { order, shippingDetails } = state;
  const items = order.orderItems ?? order.items ?? order.products;
  const shipping = order.shipping ?? order.shippingDetails ?? order;
  const orderId = firstAvailable(order.id, order._id, order.orderId);
  const total = firstAvailable(order.total, order.totalAmount, order.totalPrice, order.grandTotal);
  const shipName = firstAvailable(shipping.shipName, shipping.shippingName, shipping.name, shippingDetails?.shipName);
  const shipPhone = firstAvailable(shipping.shipPhone, shipping.shippingPhone, shipping.phone, shippingDetails?.shipPhone);
  const shipAddress = firstAvailable(shipping.shipAddress, shipping.shippingAddress, shipping.address, shippingDetails?.shipAddress);

  return (
    <main className="order-page">
      <PageTitle
        eyebrow="ORDER CONFIRMED"
        title="Thank you for your order"
        description={state.message || "Your order has been placed successfully."}
      />
      <section className="order-confirmation" aria-label="Order details">
        {orderId !== undefined && <p><strong>Order ID:</strong> {String(orderId)}</p>}

        {(shipName || shipPhone || shipAddress) && (
          <section className="order-confirmation__section">
            <h2>Shipping details</h2>
            {shipName && <p><strong>Name:</strong> {shipName}</p>}
            {shipPhone && <p><strong>Phone:</strong> {shipPhone}</p>}
            {shipAddress && <p><strong>Address:</strong> {shipAddress}</p>}
          </section>
        )}

        {Array.isArray(items) && items.length > 0 && (
          <section className="order-confirmation__section">
            <h2>Ordered products</h2>
            <ul className="order-confirmation__items">
              {items.map((item, index) => {
                const product = item.product ?? item.productDetails ?? {};
                const name = firstAvailable(item.productName, item.name, product.name, `Product ${index + 1}`);
                const quantity = firstAvailable(item.quantity, item.qty);
                const unitPrice = firstAvailable(item.unitPrice, item.price, product.price);
                return (
                  <li key={item.id ?? item._id ?? index}>
                    <span>{name}</span>
                    {quantity !== undefined && <span>Qty {quantity}</span>}
                    {unitPrice !== undefined && <span>{formatPrice(unitPrice)} each</span>}
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {total !== undefined && (
          <p className="order-confirmation__total">
            <strong>Order total:</strong> {formatPrice(total)}
          </p>
        )}

        {orderId === undefined && (!Array.isArray(items) || items.length === 0) && total === undefined && (
          <p>Additional order details were not included in the confirmation response.</p>
        )}
      </section>
      <Link className="order-page__link" to="/">Continue shopping</Link>
    </main>
  );
}
