// scripts/createAdminCorrect.js
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/website-reza');
    console.log('✅ Connected to database');

    // Delete existing admin if any
    await User.deleteOne({ email: 'admin@rumahreza.com' });
    console.log('🗑️ Deleted existing admin (if any)');

    // Create admin user - PLAIN PASSWORD (User model akan hash otomatis)
    const admin = new User({
      name: 'Admin RumahReza',
      email: 'admin@rumahreza.com',
      password: 'admin123', // ← Plain text, User model yang hash
      role: 'admin'
    });

    await admin.save(); // ← Pre-save hook akan hash password
    console.log('✅ Admin user created successfully!');
    
    // Verify creation
    const createdAdmin = await User.findOne({ email: 'admin@rumahreza.com' });
    console.log('\n🔍 Verification:');
    console.log('📧 Email:', createdAdmin.email);
    console.log('👤 Name:', createdAdmin.name);
    console.log('👑 Role:', createdAdmin.role);
    console.log('🔑 Password hash:', createdAdmin.password.substring(0, 20) + '...');
    
    // Test password menggunakan comparePassword method
    const isMatch = await createdAdmin.comparePassword('admin123');
    console.log('🔐 Password test (comparePassword method):', isMatch ? 'VALID' : 'INVALID');
    
    // Test password menggunakan bcrypt langsung
    const bcrypt = require('bcryptjs');
    const isMatchDirect = await bcrypt.compare('admin123', createdAdmin.password);
    console.log('🔐 Password test (bcrypt direct):', isMatchDirect ? 'VALID' : 'INVALID');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.disconnect();
  }
}

createAdmin();