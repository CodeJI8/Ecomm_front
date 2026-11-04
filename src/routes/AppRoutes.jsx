import { Route, Routes } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Cart from "../page/Cart";
import Categories from "../page/Categories";
import Checkout from "../page/Checkout";
import ForgotPassword from "../page/ForgotPassword";
import Home from "../page/Home";
import Login from "../page/Login";
import NotFound from "../page/NotFound";
import OrderConfirmation from "../page/OrderConfirmation";
import OrderHistory from "../page/OrderHistory";
import PaymentCancel from "../page/PaymentCancel";
import PaymentSuccess from "../page/PaymentSuccess";
import ProductDetail from "../page/ProductDetail";
import Profile from "../page/Profile";
import Register from "../page/Register";
import ResetPassword from "../page/ResetPassword";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancel" element={<PaymentCancel />} />
        <Route path="/orders/confirmation" element={<ProtectedRoute><OrderConfirmation /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
