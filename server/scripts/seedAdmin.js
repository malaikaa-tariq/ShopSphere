const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User'); // Adjust path to match your User model

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected for admin seeding...');

    const adminEmail = 'admin@shopsphere.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin account already exists.');
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('AdminPassword123!', 10);

    const adminUser = new User({
      name: 'System Administrator',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      isVerified: true
    });

    await adminUser.save();
    console.log('Admin account created successfully!');
    console.log('Credentials: admin@shopsphere.com / AdminPassword123!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();