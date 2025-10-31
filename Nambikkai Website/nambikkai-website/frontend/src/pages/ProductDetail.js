import React, { useState, useEffect, useCallback } from 'react';
import { productAPI, cartAPI } from '../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaStar } from 'react-icons/fa';
import './ProductDetail.css';

const ProductDetail = ({ user }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [review, setReview] = useState({ text: '', rating: 5 });
  const [notification, setNotification] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  const loadProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productAPI.getById(id);
      setProduct(response.data);
    } catch (err) {
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await cartAPI.add({ productId: id, quantity });
      setNotification('Product added to cart!');
      setTimeout(() => setNotification(''), 3000);
    } catch (err) {
      setError('Failed to add to cart');
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await productAPI.addReview(id, review);
      setReview({ text: '', rating: 5 });
      setNotification('Review added successfully!');
      loadProduct();
      setTimeout(() => setNotification(''), 3000);
    } catch (err) {
      setError('Failed to add review');
    }
  };

  if (loading) return <div className="loading">Loading product...</div>;
  if (!product) return <div className="error">Product not found</div>;

  return (
    <div className="product-detail-page">
      <div className="container">
        <button onClick={() => navigate('/products')} className="back-btn">
          <FaArrowLeft /> Back to Products
        </button>

        {notification && <div className="notification success">{notification}</div>}
        {error && <div className="notification error">{error}</div>}

        <div className="product-detail-content">
          {/* Product Image */}
          <div className="product-image-section">
            <img src={`http://localhost:5000/${product.image}`} alt={product.name} />
            <div className="category-badge">{product.category}</div>
          </div>

          {/* Product Info */}
          <div className="product-info-section">
            <h1>{product.name}</h1>

            <div className="rating-section">
              <div className="stars">
                <FaStar className="star-icon" />
                <span>{product.rating?.toFixed(1) || 'N/A'}</span>
              </div>
              <span className="review-count">({product.reviews?.length || 0} reviews)</span>
            </div>

            <p className="description">{product.description}</p>

            <div className="product-meta">
              <div className="meta-item">
                <span className="label">SKU:</span>
                <span className="value">{product.sku}</span>
              </div>
              <div className="meta-item">
                <span className="label">Stock:</span>
                <span className={`value ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
              </div>
            </div>

            <div className="pricing-section">
              <span className="price">₹{product.price}</span>
            </div>

            {product.stock > 0 && (
              <div className="purchase-section">
                <div className="quantity-selector">
                  <label>Quantity:</label>
                  <div className="quantity-control">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                    <input type="number" value={quantity} readOnly />
                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                  </div>
                </div>
                <button onClick={handleAddToCart} className="btn btn-primary btn-large">
                  Add to Cart
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <h2>Reviews ({product.reviews?.length || 0})</h2>

          {user && (
            <form onSubmit={handleAddReview} className="review-form">
              <h3>Add Your Review</h3>
              <div className="form-group">
                <label>Rating</label>
                <select
                  value={review.rating}
                  onChange={(e) => setReview({...review, rating: parseInt(e.target.value)})}
                  className="input-field"
                >
                  <option value={1}>1 Star</option>
                  <option value={2}>2 Stars</option>
                  <option value={3}>3 Stars</option>
                  <option value={4}>4 Stars</option>
                  <option value={5}>5 Stars</option>
                </select>
              </div>
              <div className="form-group">
                <label>Review</label>
                <textarea
                  value={review.text}
                  onChange={(e) => setReview({...review, text: e.target.value})}
                  placeholder="Share your experience with this product..."
                  required
                  className="input-field"
                  rows={4}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Submit Review
              </button>
            </form>
          )}

          <div className="reviews-list">
            {product.reviews && product.reviews.length > 0 ? (
              product.reviews.map((r, idx) => (
                <div key={idx} className="review-item">
                  <div className="review-header">
                    <span className="review-author">{r.userName}</span>
                    <span className="review-rating">{'⭐'.repeat(r.rating)}</span>
                  </div>
                  <p className="review-text">{r.text}</p>
                </div>
              ))
            ) : (
              <p className="no-reviews">No reviews yet. Be the first to review!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
