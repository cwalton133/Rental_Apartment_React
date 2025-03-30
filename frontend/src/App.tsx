import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";

// ✅ Component Imports
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Listings from "./pages/Listing";
import Dashboard from "./pages/Dashboard";
import Logout from "./pages/Logout";
import Review from "./pages/Review";
import Booking from "./pages/Booking";
import BookingForm from "./pages/BookingForm";
import PropertyDetails from "./pages/PropertyDetails";
import Payments from "./pages/Payments";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import ViewWishListDetails from "./pages/ViewWishListDetails";




// ✅ Fetch CSRF Token and Store in Cookies
const fetchCsrfToken = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/csrf-token/", { withCredentials: true });
    if (response.data.csrfToken) {
      document.cookie = `csrftoken=${response.data.csrfToken}; path=/`;
    }
  } catch (error) {
    console.error("Failed to fetch CSRF token:", error);
  }
};

// ✅ Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem("authToken");
  return token ? children : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  useEffect(() => {
    fetchCsrfToken(); // Fetch CSRF Token when app loads
  }, []);

  return (
    <>
      <Header />
      <Routes>
        {/* ✅ Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/property/:id" element={<PropertyDetails />} />

        {/* ✅ Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/logout" element={<ProtectedRoute><Logout /></ProtectedRoute>} />
        <Route path="/review" element={<ProtectedRoute><Review /></ProtectedRoute>} />
        <Route path="/booking/:id" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
        <Route path="/booking-form" element={<ProtectedRoute><BookingForm /></ProtectedRoute>} />
        <Route path="/payment/:bookingId" element={<ProtectedRoute><Payments /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
         <Route path="/wishlist/:id" element={<ProtectedRoute><ViewWishListDetails /></ProtectedRoute>} />





        {/* ✅ Payment Status Pages */}
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
