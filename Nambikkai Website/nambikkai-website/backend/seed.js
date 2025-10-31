const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('MongoDB connected');

  const dummyUserId = '507f1f77bcf86cd799439011'; // dummy ObjectId

  const riceProducts = [
    {
      name: 'Karuppukavuni Rice',
      description: 'Premium traditional rice variety known for its taste and nutritional value.',
      category: 'rice',
      price: 150,
      stock: 100,
      sku: 'rice-karuppukavuni',
      image: 'uploads/karupukavuni.jpg',
      createdBy: dummyUserId,
    },
    {
      name: 'Mapillaisamba Rice',
      description: 'Authentic rice variety with unique aroma and flavor.',
      category: 'rice',
      price: 160,
      stock: 80,
      sku: 'rice-mapillaisamba',
      image: 'uploads/mapillaisamba.jpg',
      createdBy: dummyUserId,
    },
    {
      name: 'Karugguruvai Rice',
      description: 'Organic rice known for its health benefits and smooth texture.',
      category: 'rice',
      price: 180,
      stock: 60,
      sku: 'rice-karugguruvai',
      image: 'uploads/karugguruvai.jpg',
      createdBy: dummyUserId,
    },
    {
      name: 'Katuyanam Rice',
      description: 'Special variety rice highly valued for its purity and taste.',
      category: 'rice',
      price: 170,
      stock: 70,
      sku: 'rice-katuyanam',
      image: 'uploads/katuyanam rice.jpg',
      createdBy: dummyUserId,
    },
  ];

  try {
    // Drop existing products to avoid duplicates
    await Product.deleteMany({});
    console.log('Cleared existing products');

    for (const product of riceProducts) {
      const newProduct = new Product(product);
      await newProduct.save();
      console.log(`Added ${product.name}`);
    }
    console.log('Seeding completed');
  } catch (error) {
    console.error('Error seeding:', error);
  } finally {
    mongoose.disconnect();
  }
}).catch(err => {
  console.error('Connection error:', err);
});
