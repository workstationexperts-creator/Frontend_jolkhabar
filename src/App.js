// src/App.js
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProductListPage from './components/ProductListPage';
import ProductDetailPage from './components/ProductDetailPage';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import * as api from './api/apiService';
import TrackOrderPage from './pages/TrackOrderPage';
import OrdersPage from "./pages/OrdersPage";

const getRoleFromToken = (token) => {
  if (!token) return null;
  try {
    const decoded = jwtDecode(token);
    const authorities = decoded.authorities || [];
    if (authorities.includes('ROLE_ADMIN')) return 'ADMIN';
    if (authorities.includes('ROLE_USER')) return 'USER';
    return null;
  } catch {
    return null;
  }
};

function App() {
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [categories, setCategories] = useState([]);
  const [role, setRole] = useState(getRoleFromToken(token));

  // Fetch categories on app load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Watch for token changes (login/logout)
  useEffect(() => {
    setRole(getRoleFromToken(token));
  }, [token]);

  return (
    <Router>
      <Header token={token} setToken={setToken} categories={categories} isAdmin={role === 'ADMIN'} />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage api={api} categories={categories} />} />
          <Route path="/login" element={<LoginPage api={api} setToken={setToken} />} />
          <Route path="/register" element={<RegisterPage api={api} setToken={setToken} />} />
          <Route path="/category/:categoryId" element={<ProductListPage api={api} token={token} />} />
          <Route path="/product/:productId" element={<ProductDetailPage api={api} token={token} />} />

          {/* User Features */}
          <Route path="/cart" element={<CartPage api={api} token={token} />} />
          <Route path="/checkout" element={<CheckoutPage api={api} token={token} />} />
          <Route path="/track-order" element={<TrackOrderPage />} />
          <Route path="/orders" element={<OrdersPage api={api} token={token} />} />

          {/* Admin Dashboard */}
          <Route path="/admin-dashboard" element={
            <ProtectedRoute token={token} allowedRoles={["ADMIN"]}>
              <AdminDashboard api={api} token={token} />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
