// scripts/createAdminFixed.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/website-reza');
    console.log('✅ Connected to database');

    // Delete existing admin if any
    await User.deleteOne({ email: 'admin@rumahreza.com' });
    console.log('🗑️ Deleted existing admin (if any)');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    console.log('🔐 Password hashed');

    // Create admin user
    const admin = new User({
      name: 'Admin RumahReza',
      email: 'admin@rumahreza.com',
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    
    // Verify creation
    const createdAdmin = await User.findOne({ email: 'admin@rumahreza.com' });
    console.log('\n🔍 Verification:');
    console.log('📧 Email:', createdAdmin.email);
    console.log('👤 Name:', createdAdmin.name);
    console.log('👑 Role:', createdAdmin.role);
    console.log('🔑 Password hash:', createdAdmin.password.substring(0, 20) + '...');
    
    // Test password
    const isMatch = await bcrypt.compare('admin123', createdAdmin.password);
    console.log('🔐 Password test:', isMatch ? 'VALID' : 'INVALID');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.disconnect();
  }
}

createAdmin();