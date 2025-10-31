import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onAddToCart, onViewDetails }) => {
  const handleAddCart = () => {
    onAddToCart(product._id);
  };

  return (
    <div className="product-card">
      <div className="product-image">
        <img src={`http://localhost:5000/${product.image}`} alt={product.name} />
        <div className="category-badge">{product.category}</div>
      </div>

      <div className="product-info">
        <h3>{product.name}</h3>
        
        <div className="rating">
          <span className="stars">⭐ {product.rating?.toFixed(1) || 'N/A'}</span>
          <span className="reviews">({product.reviews?.length || 0} reviews)</span>
        </div>

        <p className="description">{product.description.substring(0, 60)}...</p>

        <div className="product-footer">
          <div className="price-stock">
            <span className="price">₹{product.price}</span>
            <span className={`stock ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
              {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
            </span>
          </div>

          <div className="buttons">
            <button 
              className="btn-view" 
              onClick={() => onViewDetails(product._id)}
            >
              View Details
            </button>
            <button 
              className="btn-add-cart"
              onClick={handleAddCart}
              disabled={product.stock === 0}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
