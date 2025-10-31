import React, { useState, useEffect } from 'react';
import { adminAPI } from '../api/axios';
import AdminProducts from './AdminProducts';
import AdminTeam from './AdminTeam';
import './AdminDashboard.css';

const AdminDashboard = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getStats();
      setStats(response.data);
    } catch (err) {
      console.error('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-container">
        <aside className="admin-sidebar">
          <div className="admin-header">
            <h2>Admin Panel</h2>
            <p>Welcome, {user?.name}</p>
          </div>

          <nav className="admin-nav">
            <button 
              className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              📊 Dashboard
            </button>
            <button 
              className={`nav-item ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              📦 Products
            </button>
            <button 
              className={`nav-item ${activeTab === 'team' ? 'active' : ''}`}
              onClick={() => setActiveTab('team')}
            >
              👥 Team
            </button>
          </nav>
        </aside>

        <main className="admin-content">
          {activeTab === 'dashboard' && (
            <div className="dashboard-tab">
              <h1>Dashboard</h1>
              {loading ? (
                <div className="loading">Loading stats...</div>
              ) : stats ? (
                <div className="stats-grid">
                  <div className="stat-card">
                    <h3>Total Products</h3>
                    <p className="stat-value">{stats.totalProducts}</p>
                  </div>
                  <div className="stat-card">
                    <h3>Total Orders</h3>
                    <p className="stat-value">{stats.totalOrders}</p>
                  </div>
                  <div className="stat-card">
                    <h3>Total Users</h3>
                    <p className="stat-value">{stats.totalUsers}</p>
                  </div>
                  <div className="stat-card">
                    <h3>Total Revenue</h3>
                    <p className="stat-value">₹{stats.totalRevenue}</p>
                  </div>
                </div>
              ) : null}

              <div className="recent-orders">
                <h2>Recent Orders</h2>
                <div className="orders-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats?.recentOrders?.map(order => (
                        <tr key={order._id}>
                          <td>{order._id.substring(0, 8)}</td>
                          <td>₹{order.totalAmount}</td>
                          <td><span className="badge" style={{backgroundColor: getStatusColor(order.status)}}>{order.status}</span></td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && <AdminProducts />}
          {activeTab === 'team' && <AdminTeam />}
        </main>
      </div>
    </div>
  );
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

export default AdminDashboard;
