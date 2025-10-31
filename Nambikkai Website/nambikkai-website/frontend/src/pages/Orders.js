import React, { useState, useEffect } from 'react';
import { orderAPI } from '../api/axios';
import './Orders.css';

const Orders = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getAll();
      setOrders(response.data);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#f59e0b';
      case 'confirmed': return '#3b82f6';
      case 'shipped': return '#8b5cf6';
      case 'delivered': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (loading) return <div className="loading">Loading orders...</div>;

  return (
    <div className="orders-page">
      <div className="container">
        <h1>My Orders</h1>

        {error && <div className="error-banner">{error}</div>}

        {orders.length === 0 ? (
          <div className="no-orders">
            <p>You haven't placed any orders yet</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div>
                    <h3>Order #{order._id.substring(0, 8)}</h3>
                    <p className="order-date">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="order-status" style={{ borderLeftColor: getStatusColor(order.status) }}>
                    <span className="status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>
                      {order.status.toUpperCase()}
                    </span>
                    <span className="total">₹{order.totalAmount}</span>
                  </div>
                </div>

                <div className="order-items">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item">
                      <span>{item.productName}</span>
                      <span>Qty: {item.quantity}</span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="shipping-info">
                    <strong>Shipping To:</strong>
                    <p>
                      {order.shippingAddress?.street}, {order.shippingAddress?.city}, 
                      {order.shippingAddress?.state} - {order.shippingAddress?.zipCode}
                    </p>
                  </div>
                  <div className="payment-info">
                    <strong>Payment Method:</strong>
                    <p>{order.paymentMethod?.replace('-', ' ').toUpperCase()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
