const express = require('express');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { authMiddleware } = require('../middleware/auth');
const router = express.Router();

// Get cart
router.get('/', authMiddleware, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.userId })
      .populate('items.productId');

    if (!cart) {
      cart = new Cart({ userId: req.user.userId, items: [] });
      await cart.save();
    } else {
      // Filter out items with null productId (products that were deleted)
      cart.items = cart.items.filter(item => item.productId !== null);

      // Recalculate total price
      cart.totalPrice = cart.items.reduce((total, item) => {
        return total + (item.productId.price * item.quantity);
      }, 0);

      // Save the cleaned cart
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Add to cart
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ userId: req.user.userId });

    if (!cart) {
      cart = new Cart({ userId: req.user.userId, items: [] });
    }

    const existingItem = cart.items.find(item => item.productId.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        price: product.price
      });
    }

    // Update total price
    let totalPrice = 0;
    for (let item of cart.items) {
      const prod = await Product.findById(item.productId);
      totalPrice += prod.price * item.quantity;
    }
    cart.totalPrice = totalPrice;

    await cart.save();
    await cart.populate('items.productId');

    res.json({
      message: 'Item added to cart',
      cart
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove from cart
router.post('/remove', authMiddleware, async (req, res) => {
  try {
    const { productId } = req.body;

    let cart = await Cart.findOne({ userId: req.user.userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);

    // Update total price
    let totalPrice = 0;
    for (let item of cart.items) {
      const product = await Product.findById(item.productId);
      totalPrice += product.price * item.quantity;
    }
    cart.totalPrice = totalPrice;

    await cart.save();
    await cart.populate('items.productId');

    res.json({
      message: 'Item removed from cart',
      cart
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update quantity
router.post('/update-quantity', authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ userId: req.user.userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(item => item.productId.toString() === productId);

    if (!item) {
      return res.status(404).json({ message: 'Item not in cart' });
    }

    item.quantity = quantity;

    // Update total price
    let totalPrice = 0;
    for (let cartItem of cart.items) {
      const prod = await Product.findById(cartItem.productId);
      totalPrice += prod.price * cartItem.quantity;
    }
    cart.totalPrice = totalPrice;

    await cart.save();
    await cart.populate('items.productId');

    res.json({
      message: 'Quantity updated',
      cart
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Clear cart
router.post('/clear', authMiddleware, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    cart.totalPrice = 0;

    await cart.save();

    res.json({
      message: 'Cart cleared',
      cart
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
