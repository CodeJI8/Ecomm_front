import { Link } from "react-router-dom";
import PageTitle from "../components/common/PageTitle";
import "../styles/Order.css";

export default function PaymentCancel() {
  return (
    <main className="order-page">
      <PageTitle
        eyebrow="PAYMENT"
        title="Payment was canceled"
        description="Your payment was not completed. You can try again from your order history."
      />
      <Link className="order-page__link" to="/orders">Return to your orders</Link>
      <Link className="order-page__link" to="/">Continue shopping</Link>
    </main>
  );
}
