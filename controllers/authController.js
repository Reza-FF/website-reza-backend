// controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Add bcrypt import for debugging

// Helper function untuk generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d' // Token berlaku 7 hari
  });
};

// Register user baru
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log('📝 Register attempt:', { name, email, password: '***' });

    // Cek apakah user sudah ada
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('❌ Email already exists:', email);
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar'
      });
    }

    // Buat user baru
    const user = await User.create({
      name,
      email: email.toLowerCase(), // Ensure lowercase
      password
    });

    console.log('✅ User created successfully:', user.email);

    // Generate token
    const token = generateToken(user._id);

    // Response (jangan kirim password)
    res.status(201).json({
      success: true,
      message: 'Pendaftaran berhasil',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      error: error.message
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('🔍 Login attempt:', { email, password: '***' });

    // Validation
    if (!email || !password) {
      console.log('❌ Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Email dan password harus diisi'
      });
    }

    // Cari user berdasarkan email (case insensitive)
    const user = await User.findOne({ email: email.toLowerCase() });
    console.log('👤 User found:', user ? 'YES' : 'NO');
    
    if (!user) {
      console.log('❌ User not found for email:', email);
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    console.log('🔑 User details:');
    console.log('  - Name:', user.name);
    console.log('  - Email:', user.email);
    console.log('  - Role:', user.role);
    console.log('  - Password hash:', user.password.substring(0, 20) + '...');

    // Cek password - Try both methods for compatibility
    let isPasswordValid = false;
    
    // Method 1: Using model method (if exists)
    if (typeof user.comparePassword === 'function') {
      console.log('🔒 Using model comparePassword method...');
      isPasswordValid = await user.comparePassword(password);
      console.log('🧪 Model method result:', isPasswordValid);
    }
    
    // Method 2: Direct bcrypt compare (fallback)
    if (!isPasswordValid) {
      console.log('🔒 Using direct bcrypt compare...');
      isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('🧪 Direct bcrypt result:', isPasswordValid);
    }
    
    if (!isPasswordValid) {
      console.log('❌ Invalid password for user:', email);
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    console.log('✅ Password validation successful');

    // Generate token
    const token = generateToken(user._id);
    console.log('🎫 Token generated successfully');

    // Response
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };

    console.log('✅ Login successful for:', email, 'Role:', user.role);

    res.status(200).json({
      success: true,
      message: 'Login berhasil',
      data: {
        user: userData,
        token
      }
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      error: error.message
    });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    console.log('👤 Getting profile for user ID:', req.user.userId);
    
    // req.user sudah diset oleh middleware auth
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      console.log('❌ User not found for profile request');
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan'
      });
    }

    console.log('✅ Profile retrieved for:', user.email);
    
    res.status(200).json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      error: error.message
    });
  }
};

module.exports = {
  register,
  login,
  getProfile
};