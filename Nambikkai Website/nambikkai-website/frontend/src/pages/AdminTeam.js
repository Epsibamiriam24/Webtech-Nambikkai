import React, { useState, useEffect } from 'react';
import { adminAPI } from '../api/axios';
import './AdminTeam.css';

const AdminTeam = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    role: 'editor'
  });

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getMembers();
      setMembers(response.data);
    } catch (err) {
      console.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.addMember(formData);
      setShowForm(false);
      setFormData({ email: '', name: '', password: '', role: 'editor' });
      loadMembers();
    } catch (err) {
      alert('Failed to add member');
    }
  };

  const handleRemove = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await adminAPI.removeMember(id);
        loadMembers();
      } catch (err) {
        alert('Failed to remove member');
      }
    }
  };

  return (
    <div className="admin-team">
      <div className="team-header">
        <h2>Team Members</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add Member'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="member-form">
          <h3>Add Team Member</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Name</label>
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
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="input-field"
              />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input-field"
              >
                <option value="viewer">Viewer (View only)</option>
                <option value="editor">Editor (Edit products)</option>
                <option value="manager">Manager (Full control)</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            Add Member
          </button>
        </form>
      )}

      {loading ? (
        <div className="loading">Loading members...</div>
      ) : (
        <div className="members-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Permissions</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map(member => (
                <tr key={member._id}>
                  <td>{member.memberId?.name}</td>
                  <td>{member.memberId?.email}</td>
                  <td><span className="role-badge">{member.role}</span></td>
                  <td>
                    <div className="permissions">
                      {member.permissions.canAddProduct && <span>Add</span>}
                      {member.permissions.canEditProduct && <span>Edit</span>}
                      {member.permissions.canDeleteProduct && <span>Delete</span>}
                      {member.permissions.canViewOrders && <span>Orders</span>}
                    </div>
                  </td>
                  <td>
                    <span className={`status ${member.isActive ? 'active' : 'inactive'}`}>
                      {member.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn-remove"
                      onClick={() => handleRemove(member._id)}
                    >
                      Remove
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

export default AdminTeam;
