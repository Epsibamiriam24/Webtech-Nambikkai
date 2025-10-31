import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { productAPI, cartAPI } from '../api/axios';
import ProductCard from '../components/ProductCard';
import './Products.css';

const Products = ({ user }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    minPrice: '',
    maxPrice: ''
  });
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll(filters);
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleAddToCart = async (productId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await cartAPI.add({ productId, quantity: 1 });
      setNotification('Product added to cart!');
      setTimeout(() => setNotification(''), 3000);
    } catch (err) {
      setError('Failed to add to cart');
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const categories = ['millets', 'pulses', 'rice', 'spices', 'oils', 'dry-fruits'];

  return (
    <div className="products-page">
      <div className="container">
        {notification && <div className="notification success">{notification}</div>}
        {error && <div className="notification error">{error}</div>}

        <div className="products-header">
          <h1>Our Products</h1>
          <p>Discover our range of natural millets and products</p>
        </div>

        <div className="products-layout">
          {/* Sidebar Filters */}
          <aside className="filters-sidebar">
            <h3>Filters</h3>

            <div className="filter-group">
              <label>Search</label>
              <input
                type="text"
                name="search"
                placeholder="Search products..."
                value={filters.search}
                onChange={handleFilterChange}
                className="input-field"
              />
            </div>

            <div className="filter-group">
              <label>Category</label>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="input-field"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Price Range</label>
              <div className="price-inputs">
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  className="input-field"
                />
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  className="input-field"
                />
              </div>
            </div>

            <button 
              onClick={() => setFilters({ category: '', search: '', minPrice: '', maxPrice: '' })}
              className="btn btn-secondary"
            >
              Clear Filters
            </button>
          </aside>

          {/* Products Grid */}
          <main className="products-main">
            {loading ? (
              <div className="loading">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="no-products">No products found. Try adjusting your filters.</div>
            ) : (
              <div className="products-grid">
                {products.map(product => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={handleAddToCart}
                    onViewDetails={(id) => navigate(`/product/${id}`)}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Products;
