import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ProductDetails from "./pages/ProductDetails";
import Dashboard from "./pages/Dashboard";
import PaymentResult from "./pages/PaymentResult";

export default function App() {
  return <BrowserRouter><Header/><Routes>
    <Route path="/" element={<Home/>}/>
    <Route path="/login" element={<Login/>}/>
    <Route path="/register" element={<Register/>}/>
    <Route path="/cart" element={<Cart/>}/>
    <Route path="/checkout" element={<Checkout/>}/>
    <Route path="/products/:id" element={<ProductDetails/>}/>
    <Route path="/seller" element={<Dashboard type="seller"/>}/>
    <Route path="/admin" element={<Dashboard type="admin"/>}/>
    <Route path="/payment/success" element={<PaymentResult/>}/>
    <Route path="/payment/cancel" element={<PaymentResult/>}/>
  </Routes></BrowserRouter>;
}
