import { Link } from "react-router-dom";
import PageTitle from "../components/common/PageTitle";
import "../styles/Order.css";

export default function PaymentSuccess() {
  return (
    <main className="order-page">
      <PageTitle
        eyebrow="PAYMENT"
        title="Payment successful"
        description="Thank you. Your payment was completed and your order is being processed."
      />
      <Link className="order-page__link" to="/orders">View your orders</Link>
      <Link className="order-page__link" to="/">Continue shopping</Link>
    </main>
  );
}
