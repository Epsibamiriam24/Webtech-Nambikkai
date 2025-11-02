import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAuthAPI } from '../api/axios';
import '../components/Auth.css';

const AdminLogin = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting admin login with:', formData);
      const response = await adminAuthAPI.login(formData);
      console.log('Login response:', response.data);
      
      // Ensure admin role is set
      const adminData = {
        ...response.data.admin,
        role: 'admin'
      };
      console.log('Admin data being set:', adminData);
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(adminData));
      onLogin(adminData);
      console.log('Login successful, navigating to /admin');
      alert('Admin login successful!');
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Admin Login</h2>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>Admin Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter admin email"
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter admin password"
            className="input-field"
          />
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? 'Logging in...' : 'Admin Login'}
        </button>

        <p><a href="/login">Back to User Login</a></p>
      </form>
    </div>
  );
};

export default AdminLogin;
