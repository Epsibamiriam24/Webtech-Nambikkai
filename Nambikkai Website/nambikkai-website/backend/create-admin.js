const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AdminMember = require('./models/AdminMember');
const dotenv = require('dotenv');

dotenv.config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    const existingAdmin = await AdminMember.findOne({ email: 'rajajp@gmail.com' });
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      mongoose.connection.close();
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('jesus@123', salt);

    const admin = new AdminMember({
      name: 'Admin User',
      email: 'rajajp@gmail.com',
      password: hashedPassword
    });

    await admin.save();
    console.log('Admin user created successfully');
    console.log('Email: rajajp@gmail.com');
    console.log('Password: jesus@123');
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

createAdmin();
