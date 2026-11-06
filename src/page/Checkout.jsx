import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { createCheckoutSession, createOrder } from "../api";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import ErrorMessage from "../components/common/ErrorMessage";
import Input from "../components/common/Input";
import Loader from "../components/common/Loader";
import PageTitle from "../components/common/PageTitle";
import useCart from "../hooks/useCart";
import { getApiData } from "../utils/getApiData";
import "../styles/Order.css";

export default function Checkout() {
  const { items, clearLocalCart, syncCartToServer } = useCart();
  const [shipping, setShipping] = useState({
    shipName: "",
    shipPhone: "",
    shipAddress: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [requestError, setRequestError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const submissionLock = useRef(false);

  function updateField(event) {
    const { name, value } = event.target;
    setShipping((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: "" }));
  }

  async function submit(event) {
    event.preventDefault();
    if (submissionLock.current) return;

    const shippingDetails = {
      shipName: shipping.shipName.trim(),
      shipPhone: shipping.shipPhone.trim(),
      shipAddress: shipping.shipAddress.trim(),
    };
    const nextErrors = {};
    if (!shippingDetails.shipName) nextErrors.shipName = "Enter the recipient's name.";
    if (!shippingDetails.shipPhone) nextErrors.shipPhone = "Enter a phone number.";
    if (!shippingDetails.shipAddress) nextErrors.shipAddress = "Enter a shipping address.";
    setFieldErrors(nextErrors);
    setRequestError(null);
    if (Object.keys(nextErrors).length > 0) return;

    submissionLock.current = true;
    setSubmitting(true);
    try {
      if (!(await syncCartToServer())) return;
      const response = await createOrder(shippingDetails);
      const payload = getApiData(response);
      const order = payload?.order ?? payload?.data?.order ?? payload?.data ?? payload ?? {};
      const orderId = order.id ?? order._id ?? order.orderId;
      if (orderId === undefined || orderId === null || orderId === "") {
        throw new Error("The order was created, but its ID was not returned.");
      }

      const checkoutResponse = await createCheckoutSession(orderId);
      const checkoutPayload = getApiData(checkoutResponse);
      const checkoutUrl = checkoutPayload?.checkoutUrl ?? checkoutPayload?.data?.checkoutUrl;
      if (typeof checkoutUrl !== "string" || !checkoutUrl.trim()) {
        throw new Error("The payment service did not return a checkout URL.");
      }
      const checkoutUrlObject = new URL(checkoutUrl);
      if (checkoutUrlObject.protocol !== "https:") {
        throw new Error("The payment service returned an invalid checkout URL.");
      }

      await clearLocalCart();
      window.location.assign(checkoutUrlObject.href);
    } catch (error) {
      setRequestError(error);
    } finally {
      submissionLock.current = false;
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <main className="order-page">
        <PageTitle eyebrow="CHECKOUT" title="Shipping details" />
        <EmptyState title="Your cart is empty">
          <Link to="/cart">Return to your cart</Link>
        </EmptyState>
      </main>
    );
  }

  return (
    <main className="order-page">
      <PageTitle eyebrow="CHECKOUT" title="Shipping details" description="Enter where you would like your order delivered." />
      <div className="order-page__layout">
        <form className="order-form" onSubmit={submit} noValidate>
          <Input
            id="ship-name"
            name="shipName"
            label="Shipping name"
            autoComplete="name"
            value={shipping.shipName}
            error={fieldErrors.shipName}
            onChange={updateField}
            required
          />
          <Input
            id="ship-phone"
            name="shipPhone"
            label="Phone number"
            type="tel"
            autoComplete="tel"
            value={shipping.shipPhone}
            error={fieldErrors.shipPhone}
            onChange={updateField}
            required
          />
          <div className="order-form__field">
            <label htmlFor="ship-address">Shipping address</label>
            <textarea
              id="ship-address"
              name="shipAddress"
              autoComplete="street-address"
              rows="4"
              value={shipping.shipAddress}
              aria-invalid={Boolean(fieldErrors.shipAddress)}
              aria-describedby={fieldErrors.shipAddress ? "ship-address-error" : undefined}
              onChange={updateField}
              required
            />
            {fieldErrors.shipAddress && (
              <span className="order-form__field-error" id="ship-address-error">
                {fieldErrors.shipAddress}
              </span>
            )}
          </div>
          {requestError && <ErrorMessage error={requestError} />}
          <p className="order-form__note">
            Your order total and item availability will be confirmed by the store.
          </p>
          <Button variant="purchase" type="submit" disabled={submitting}>
            {submitting ? "Placing order…" : "Place Order"}
          </Button>
          {submitting && <Loader label="Placing your order" />}
        </form>

        <aside className="order-summary">
          <h2>Items in your cart</h2>
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <span>{item.name}</span>
                <span>Qty {item.quantity}</span>
              </li>
            ))}
          </ul>
          <p>The backend calculates the final order total.</p>
        </aside>
      </div>
    </main>
  );
}
