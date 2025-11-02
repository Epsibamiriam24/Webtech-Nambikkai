const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 60000, // 1 minute
      socketTimeoutMS: 45000, // 45 seconds
      connectTimeoutMS: 30000, // 30 seconds
      retryWrites: true,
      w: 'majority',
      maxPoolSize: 10,
      minPoolSize: 5,
      maxIdleTimeMS: 10000
    };

    await mongoose.connect(process.env.MONGODB_URI, opts);
    console.log('MongoDB connected successfully');

    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected successfully');
    });

  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Log more details about the error
    if (error.name === 'MongooseServerSelectionError') {
      console.error('Connection details:', {
        uri: process.env.MONGODB_URI?.replace(/:([^:@]{8})[^:@]*@/, ':****@'),
        errorCode: error.code,
        reason: error.reason
      });
    }
    throw error;
  }
};

module.exports = connectDB;