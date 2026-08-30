const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // adjust path if needed
require('dotenv').config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const existingAdmin = await User.findOne({ email: 'admin@shopsphere.com' });
    if (existingAdmin) {
      console.log('Admin account already exists.');
      process.exit();
    }

    const hashedPassword = await bcrypt.hash('AdminPassword123!', 10);
    const adminUser = new User({
      name: 'System Administrator',
      email: 'admin@shopsphere.com',
      password: hashedPassword,
      role: 'admin'
    });

    await adminUser.save();
    console.log('Admin user created successfully: admin@shopsphere.com / AdminPassword123!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedAdmin();