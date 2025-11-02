import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartAPI, orderAPI } from '../api/axios';
import { FaTrash, FaArrowLeft } from 'react-icons/fa';
import './Cart.css';

const Cart = ({ user }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shippingData, setShippingData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadCart();
  }, [user, navigate]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.get();
      setCart(response.data);
    } catch (err) {
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await cartAPI.remove({ productId });
      loadCart();
    } catch (err) {
      setError('Failed to remove item');
    }
  };

  const handleQuantityChange = async (productId, quantity) => {
    if (quantity < 1) return;
    try {
      await cartAPI.updateQuantity({ productId, quantity });
      loadCart();
    } catch (err) {
      setError('Failed to update quantity');
    }
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!cart.items.length) {
      setError('Cart is empty');
      return;
    }

    try {
      await orderAPI.checkout({
        shippingAddress: shippingData,
        paymentMethod: 'cod'
      });
      alert('Order placed successfully!');
      await cartAPI.clear();
      navigate('/orders');
    } catch (err) {
      setError('Failed to place order');
    }
  };

  if (loading) return <div className="loading-container">Loading cart...</div>;
  if (!cart) return <div className="loading-container">No cart found</div>;

  return (
    <div className="cart-page">
      <div className="container">
        <button onClick={() => navigate('/products')} className="back-btn">
          <FaArrowLeft /> Continue Shopping
        </button>

        {error && <div className="error-banner">{error}</div>}

        <h1>Shopping Cart</h1>

        {!cart.items.length ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <button onClick={() => navigate('/products')} className="btn btn-primary">
              Shop Now
            </button>
          </div>
        ) : (
          <div className="cart-content">
            {/* Cart Items */}
            <div className="cart-items">
              <table className="cart-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Subtotal</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.items.filter(item => item.productId).map(item => (
                    <tr key={item.productId._id}>
                      <td>
                        <div className="product-cell">
                          <img src={`http://localhost:5005/${item.productId.image}`} alt={item.productId.name} />
                          <div>
                            <h4>{item.productId.name}</h4>
                            <p>{item.productId.category}</p>
                          </div>
                        </div>
                      </td>
                      <td>₹{item.price}</td>
                      <td>
                        <div className="quantity-control">
                          <button onClick={() => handleQuantityChange(item.productId._id, item.quantity - 1)}>−</button>
                          <input type="number" value={item.quantity} readOnly />
                          <button onClick={() => handleQuantityChange(item.productId._id, item.quantity + 1)}>+</button>
                        </div>
                      </td>
                      <td>₹{item.price * item.quantity}</td>
                      <td>
                        <button
                          className="btn-remove"
                          onClick={() => handleRemoveItem(item.productId._id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Checkout Form */}
            <div className="checkout-section">
              <div className="order-summary">
                <h3>Order Summary</h3>
                <div className="summary-item">
                  <span>Subtotal:</span>
                  <span>₹{cart.totalPrice}</span>
                </div>
                <div className="summary-item">
                  <span>Shipping:</span>
                  <span>FREE</span>
                </div>
                <div className="summary-total">
                  <span>Total:</span>
                  <span>₹{cart.totalPrice}</span>
                </div>
              </div>

              <form onSubmit={handleCheckout} className="checkout-form">
                <h3>Shipping Address</h3>

                <div className="form-group">
                  <label>Street</label>
                  <input
                    type="text"
                    value={shippingData.street}
                    onChange={(e) => setShippingData({...shippingData, street: e.target.value})}
                    required
                    className="input-field"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      value={shippingData.city}
                      onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                      required
                      className="input-field"
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      value={shippingData.state}
                      onChange={(e) => setShippingData({...shippingData, state: e.target.value})}
                      required
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Zip Code</label>
                    <input
                      type="text"
                      value={shippingData.zipCode}
                      onChange={(e) => setShippingData({...shippingData, zipCode: e.target.value})}
                      required
                      className="input-field"
                    />
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <input
                      type="text"
                      value={shippingData.country}
                      className="input-field"
                      disabled
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary btn-checkout">
                  Place Order
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
