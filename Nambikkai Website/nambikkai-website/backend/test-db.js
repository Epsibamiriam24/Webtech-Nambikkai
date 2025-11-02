// Test MongoDB Connection
const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    console.log('Attempting to connect to MongoDB Atlas...');
    console.log('URI:', process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ MongoDB connected successfully!');
    console.log('Connection status:', mongoose.connection.readyState);
    
    // Test a simple database operation
    const adminDb = mongoose.connection.db;
    const ping = await adminDb.admin().ping();
    console.log('✅ Database ping successful:', ping);
    
    await mongoose.connection.close();
    console.log('Connection closed');
    process.exit(0);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

testConnection();
