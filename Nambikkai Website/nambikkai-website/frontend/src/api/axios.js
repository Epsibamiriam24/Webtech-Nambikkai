import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  loginOrSignup: (data) => api.post('/auth/login-or-signup', data)
};

// Product APIs
export const productAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  update: (id, data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    return api.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  delete: (id) => api.delete(`/products/${id}`),
  addReview: (id, data) => api.post(`/products/${id}/reviews`, data)
};

// Cart APIs
export const cartAPI = {
  get: () => api.get('/cart'),
  add: (data) => api.post('/cart/add', data),
  remove: (data) => api.post('/cart/remove', data),
  updateQuantity: (data) => api.post('/cart/update-quantity', data),
  clear: () => api.post('/cart/clear')
};

// Order APIs
export const orderAPI = {
  checkout: (data) => api.post('/orders/checkout', data),
  getAll: () => api.get('/orders'),
  getById: (id) => api.get(`/orders/${id}`)
};

// Admin APIs
export const adminAPI = {
  getStats: () => api.get('/admin/dashboard/stats'),
  addMember: (data) => api.post('/admin/members/add', data),
  getMembers: () => api.get('/admin/members'),
  updateMember: (id, data) => api.put(`/admin/members/${id}`, data),
  removeMember: (id) => api.delete(`/admin/members/${id}`),
  getAllOrders: () => api.get('/admin/orders/all'),
  updateOrderStatus: (id, data) => api.put(`/admin/orders/${id}/status`, data)
};

export default api;
