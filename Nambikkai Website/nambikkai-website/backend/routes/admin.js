const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const AdminMember = require('../models/AdminMember');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');
const router = express.Router();

// Get admin dashboard stats
router.get('/dashboard/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10);

    const totalRevenue = recentOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    res.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add team member
router.post('/members/add', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { email, name, password, role } = req.body;

    let member = await User.findOne({ email });

    if (!member) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      member = new User({
        name,
        email,
        password: hashedPassword,
        role: 'user'
      });

      await member.save();
    }

    const adminMember = new AdminMember({
      adminId: req.user.id,
      memberId: member._id,
      role: role || 'editor',
      permissions: {
        canAddProduct: role === 'manager',
        canEditProduct: role === 'manager' || role === 'editor',
        canDeleteProduct: role === 'manager',
        canViewOrders: true
      }
    });

    await adminMember.save();
    await adminMember.populate('memberId', 'name email');

    res.status(201).json({
      message: 'Team member added successfully',
      adminMember
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get team members
router.get('/members', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const members = await AdminMember.find({ adminId: req.user.id })
      .populate('memberId', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(members);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update team member
router.put('/members/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { role } = req.body;

    const adminMember = await AdminMember.findById(req.params.id);

    if (!adminMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    if (adminMember.adminId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    adminMember.role = role || adminMember.role;
    adminMember.permissions = {
      canAddProduct: role === 'manager',
      canEditProduct: role === 'manager' || role === 'editor',
      canDeleteProduct: role === 'manager',
      canViewOrders: true
    };

    await adminMember.save();
    await adminMember.populate('memberId', 'name email');

    res.json({
      message: 'Team member updated',
      adminMember
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove team member
router.delete('/members/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const adminMember = await AdminMember.findById(req.params.id);

    if (!adminMember) {
      return res.status(404).json({ message: 'Team member not found' });
    }

    if (adminMember.adminId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await AdminMember.findByIdAndDelete(req.params.id);

    res.json({ message: 'Team member removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all orders (admin view)
router.get('/orders/all', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update order status
router.put('/orders/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    res.json({
      message: 'Order updated',
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;

