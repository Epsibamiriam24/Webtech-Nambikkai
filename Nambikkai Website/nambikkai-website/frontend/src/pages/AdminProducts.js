import React, { useState, useEffect } from 'react';
import { productAPI } from '../api/axios';
import './AdminProducts.css';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'millets',
    stock: '',
    sku: '',
    image: null
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll({});
      setProducts(response.data);
    } catch (err) {
      console.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await productAPI.update(editingId, formData);
      } else {
        await productAPI.create(formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'millets',
        stock: '',
        sku: '',
        image: null
      });
      loadProducts();
    } catch (err) {
      console.error('Error saving product:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error saving product';
      alert(`Error saving product: ${errorMessage}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await productAPI.delete(id);
        loadProducts();
      } catch (err) {
        alert('Failed to delete');
      }
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      sku: product.sku,
      image: null
    });
    setEditingId(product._id);
    setShowForm(true);
  };

  return (
    <div className="admin-products">
      <div className="products-header">
        <h2>Products Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({
              name: '',
              description: '',
              price: '',
              category: 'millets',
              stock: '',
              sku: '',
              image: null
            });
          }}
        >
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="product-form">
          <h3>{editingId ? 'Edit Product' : 'Add New Product'}</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Product Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="input-field"
              >
                <option value="millets">Millets</option>
                <option value="pulses">Pulses</option>
                <option value="rice">Rice</option>
                <option value="spices">Spices</option>
                <option value="oils">Oils</option>
                <option value="dry-fruits">Dry Fruits</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="input-field"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price (₹)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label>SKU</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Product Image (Optional)</label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              accept="image/*"
              className="input-field"
            />
          </div>

          <button type="submit" className="btn btn-primary">
            {editingId ? 'Update Product' : 'Add Product'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : (
        <div className="products-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>₹{product.price}</td>
                  <td>{product.stock}</td>
                  <td>⭐ {product.rating?.toFixed(1) || 'N/A'}</td>
                  <td>
                    <button 
                      className="btn-edit"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
