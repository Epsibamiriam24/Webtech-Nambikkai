import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = ({ user }) => {
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>🌾 Welcome to Nambikkai</h1>
          <p>Authentic Natural Millets & Premium Products</p>
          <p className="hero-subtitle">Sourced directly from farmers, delivered to your table</p>
          <button onClick={() => navigate('/products')} className="btn btn-primary btn-large">
            Shop Now
          </button>
        </div>
        <div className="hero-image">
          <div className="hero-placeholder">🌾</div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Why Choose Nambikkai?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🌱</div>
              <h3>100% Natural</h3>
              <p>Completely organic and chemical-free products</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👨‍🌾</div>
              <h3>Direct from Farmers</h3>
              <p>Support local farmers and sustainable farming</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📦</div>
              <h3>Fast Delivery</h3>
              <p>Quick and reliable shipping across the country</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <h3>Quality Assured</h3>
              <p>Every product tested for purity and quality</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories">
        <div className="container">
          <h2>Our Product Categories</h2>
          <div className="categories-grid">
            <div className="category-card" onClick={() => navigate('/products?category=millets')}>
              <div className="category-icon">🌾</div>
              <h3>Millets</h3>
              <p>Finger millet, Foxtail millet & more</p>
            </div>
            <div className="category-card" onClick={() => navigate('/products?category=pulses')}>
              <div className="category-icon">🫘</div>
              <h3>Pulses</h3>
              <p>Dal, lentils & legumes</p>
            </div>
            <div className="category-card" onClick={() => navigate('/products?category=spices')}>
              <div className="category-icon">🧂</div>
              <h3>Spices</h3>
              <p>Organic spices & seasonings</p>
            </div>
            <div className="category-card" onClick={() => navigate('/products?category=oils')}>
              <div className="category-icon">🫧</div>
              <h3>Oils</h3>
              <p>Cold-pressed natural oils</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Eat Healthy?</h2>
          <p>Explore our collection of premium natural products</p>
          <button onClick={() => navigate('/products')} className="btn btn-primary btn-large">
            Start Shopping
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
