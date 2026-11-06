import { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { createCheckoutSession, getOrders } from "../api";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import ErrorMessage from "../components/common/ErrorMessage";
import Loader from "../components/common/Loader";
import PageTitle from "../components/common/PageTitle";
import useAsync from "../hooks/useAsync";
import { formatPrice } from "../utils/formatPrice";
import { getApiData } from "../utils/getApiData";
import "../styles/OrderHistory.css";

const PAYMENT_DUE_STATUSES = new Set([
  "pending",
  "unpaid",
  "failed",
  "payment_failed",
  "awaiting_payment",
  "payment_required",
]);

function getOrderItems(order) {
  return order.items ?? order.orderItems ?? order.products ?? [];
}

function getItemName(item, index) {
  const product = item.product ?? item.productDetails ?? {};
  return item.productName ?? item.name ?? product.name ?? `Product ${index + 1}`;
}

function getItemQuantity(item) {
  return item.quantity ?? item.qty ?? 1;
}

function getOrderTotal(order) {
  return order.total ?? order.totalAmount ?? order.totalPrice ?? order.grandTotal;
}

function isPaymentDue(order) {
  const paymentStatus = order.paymentStatus ?? order.payment_status;
  const status = paymentStatus ?? order.status;
  if (typeof status !== "string") return false;
  return PAYMENT_DUE_STATUSES.has(status.trim().toLowerCase().replace(/[\s-]+/g, "_"));
}

function getOrderDate(order) {
  const value = order.createdAt ?? order.created_at;
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? null
    : new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function getOrdersFromResponse(response) {
  const payload = getApiData(response);
  const orders = payload?.orders ?? payload?.data?.orders ?? payload?.data ?? payload;
  if (!Array.isArray(orders)) {
    throw new Error("The orders response has an unexpected format.");
  }
  return orders;
}

export default function OrderHistory() {
  const request = useCallback(async ({ signal }) => getOrdersFromResponse(await getOrders({ signal })), []);
  const { data: orders, loading, error, run } = useAsync(request);
  const [payingOrderId, setPayingOrderId] = useState(null);
  const [paymentErrors, setPaymentErrors] = useState({});
  const paymentLock = useRef(false);

  async function payForOrder(orderId) {
    if (paymentLock.current) return;
    paymentLock.current = true;
    setPayingOrderId(orderId);
    setPaymentErrors((current) => {
      const next = { ...current };
      delete next[orderId];
      return next;
    });

    try {
      const response = await createCheckoutSession(orderId);
      const payload = getApiData(response);
      const checkoutUrl = payload?.checkoutUrl ?? payload?.data?.checkoutUrl;
      if (typeof checkoutUrl !== "string" || !checkoutUrl.trim()) {
        throw new Error("The payment service did not return a checkout URL.");
      }

      const checkoutUrlObject = new URL(checkoutUrl);
      if (checkoutUrlObject.protocol !== "https:") {
        throw new Error("The payment service returned an invalid checkout URL.");
      }

      window.location.assign(checkoutUrlObject.href);
    } catch (paymentError) {
      setPaymentErrors((current) => ({ ...current, [orderId]: paymentError }));
    } finally {
      paymentLock.current = false;
      setPayingOrderId(null);
    }
  }

  return (
    <main className="order-history">
      <PageTitle eyebrow="YOUR ACCOUNT" title="Order history" description="Review your previous orders and their items." />
      {loading && <Loader label="Loading your orders" />}
      {error && <ErrorMessage error={error} onRetry={run} />}
      {!loading && !error && orders?.length === 0 && (
        <EmptyState title="No orders yet">
          <Link to="/#home-catalog">Explore the collection</Link>
        </EmptyState>
      )}
      {!loading && !error && orders?.length > 0 && (
        <ul className="order-history__list">
          {orders.map((order, index) => {
            const orderId = order.id ?? order._id ?? order.orderId;
            const items = getOrderItems(order);
            const total = getOrderTotal(order);
            const date = getOrderDate(order);
            const status = order.status ?? order.paymentStatus;
            const canPay = orderId != null && isPaymentDue(order);

            return (
              <li className="order-history__card" key={orderId ?? index}>
                <header className="order-history__header">
                  <div>
                    <h2>{orderId != null ? `Order #${orderId}` : `Order ${index + 1}`}</h2>
                    {date && <p>{date}</p>}
                  </div>
                  {status && <span className="order-history__status">{status}</span>}
                </header>
                {items.length > 0 ? (
                  <ul className="order-history__items">
                    {items.map((item, itemIndex) => {
                      const unitPrice = item.unitPrice ?? item.price ?? item.product?.price;
                      return (
                        <li key={item.id ?? item._id ?? itemIndex}>
                          <span>{getItemName(item, itemIndex)}</span>
                          <span>Qty {getItemQuantity(item)}</span>
                          {unitPrice != null && <span>{formatPrice(unitPrice)}</span>}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="order-history__empty-items">No item details were included.</p>
                )}
                {total != null && (
                  <p className="order-history__total">
                    <strong>Total</strong>
                    <strong>{formatPrice(total)}</strong>
                  </p>
                )}
                {canPay && (
                  <div className="order-history__payment">
                    <Button
                      variant="purchase"
                      type="button"
                      disabled={payingOrderId !== null}
                      onClick={() => payForOrder(orderId)}
                    >
                      {payingOrderId === orderId ? "Preparing payment…" : "Pay now"}
                    </Button>
                    {paymentErrors[orderId] && (
                      <p className="order-history__payment-error" role="alert">
                        {paymentErrors[orderId].message ?? "Unable to start payment. Please try again."}
                      </p>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
