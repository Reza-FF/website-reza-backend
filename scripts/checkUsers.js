// scripts/checkUsers.js
const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/website-reza');
    console.log('✅ Connected to database');

    // Get all users
    const users = await User.find({});
    console.log(`👥 Total users: ${users.length}`);
    
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. 📧 Email: ${user.email}`);
      console.log(`   👤 Name: ${user.name}`);
      console.log(`   👑 Role: ${user.role}`);
      console.log(`   📅 Created: ${user.createdAt}`);
    });

    // Check specifically for admin
    const admin = await User.findOne({ email: 'admin@rumahreza.com' });
    console.log(`\n🔍 Admin user exists: ${admin ? 'YES' : 'NO'}`);
    
    // Check for any admin role
    const adminUsers = await User.find({ role: 'admin' });
    console.log(`👑 Users with admin role: ${adminUsers.length}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.disconnect();
  }
}

checkUsers();