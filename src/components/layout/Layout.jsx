import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ShoppingAssistant from "../common/ShoppingAssistant";
import "./Layout.css";

export default function Layout() {
  return (
    <div className="app-layout">
      <Navbar />
      <Outlet />
      <Footer />
      <ShoppingAssistant />
    </div>
  );
}
