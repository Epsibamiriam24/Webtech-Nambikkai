import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Auth';
import Signup from './pages/Signup';
import AdminLogin from './pages/AdminLogin';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';
import Footer from './components/Footer';
import './index.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontSize: '1.2rem', color: '#6b7280' }}>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} />
        <Route path="/signup" element={!user ? <Signup onLogin={handleLogin} /> : <Navigate to="/" />} />
        <Route path="/admin/login" element={!user ? <AdminLogin onLogin={handleLogin} /> : <Navigate to="/admin" />} />

        {/* Protected Routes */}
        <Route path="/" element={user ? <Home user={user} /> : <Login onLogin={handleLogin} />} />
        <Route path="/products" element={user ? <Products user={user} /> : <Navigate to="/login" />} />
        <Route path="/product/:id" element={user ? <ProductDetail user={user} /> : <Navigate to="/login" />} />
        <Route path="/cart" element={user ? <Cart user={user} /> : <Navigate to="/login" />} />
        <Route path="/orders" element={user ? <Orders user={user} /> : <Navigate to="/login" />} />
        
        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            user?.role === 'admin' ? (
              <AdminDashboard user={user} />
            ) : user ? (
              <Navigate to="/admin/login" />
            ) : (
              <Navigate to="/admin/login" />
            )
          }
        />
        
        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
