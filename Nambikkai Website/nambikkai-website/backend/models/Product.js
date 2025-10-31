const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['millets', 'pulses', 'rice', 'spices', 'oils', 'dry-fruits', 'other'],
    default: 'other'
  },
  price: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviews: [{
    userId: mongoose.Schema.Types.ObjectId,
    userName: String,
    text: String,
    rating: Number,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  image: {
    type: String,
    required: false
  },
  stock: {
    type: Number,
    default: 0
  },
  sku: {
    type: String,
    unique: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
