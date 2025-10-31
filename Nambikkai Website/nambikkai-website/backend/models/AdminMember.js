const mongoose = require('mongoose');

const adminMemberSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  role: {
    type: String,
    enum: ['manager', 'editor', 'viewer'],
    default: 'viewer'
  },
  permissions: {
    canAddProduct: {
      type: Boolean,
      default: false
    },
    canEditProduct: {
      type: Boolean,
      default: false
    },
    canDeleteProduct: {
      type: Boolean,
      default: false
    },
    canViewOrders: {
      type: Boolean,
      default: false
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AdminMember', adminMemberSchema);
