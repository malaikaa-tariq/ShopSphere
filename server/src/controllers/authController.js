const User = require('../models/User'); // Adjust path as needed
const bcrypt = require('bcryptjs');
const jwt = require('jwt-simple'); // Or jsonwebtoken

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Email is not registered' });
    }

    // 2. Validate password against hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Wrong password' });
    }

    // 3. Issue Token on Success
    const token = jwt.encode({ id: user._id, role: user.role }, process.env.JWT_SECRET);
    
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error during login' });
  }
};