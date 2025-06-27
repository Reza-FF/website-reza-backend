// scripts/checkAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/course-website', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const checkAdmin = async () => {
  try {
    console.log('🔍 Checking admin user...');
    
    // Find admin user
    const admin = await User.findOne({ email: 'admin@rumahReza.com' });
    
    if (!admin) {
      console.log('❌ Admin user not found in database!');
      process.exit(1);
    }

    console.log('✅ Admin user found!');
    console.log('📧 Email:', admin.email);
    console.log('👤 Name:', admin.name);
    console.log('🔑 Role:', admin.role);
    console.log('🆔 ID:', admin._id);
    console.log('🔒 Password Hash:', admin.password.substring(0, 20) + '...');
    
    // Test password
    const testPassword = 'admin123';
    const isPasswordValid = await bcrypt.compare(testPassword, admin.password);
    
    console.log('🧪 Password Test Result:', isPasswordValid ? '✅ VALID' : '❌ INVALID');
    
    if (!isPasswordValid) {
      console.log('🔧 Fixing password...');
      
      // Hash new password
      const newHashedPassword = await bcrypt.hash('admin123', 10);
      
      // Update admin password
      await User.findByIdAndUpdate(admin._id, { password: newHashedPassword });
      
      console.log('✅ Password fixed! Try login again.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking admin:', error);
    process.exit(1);
  }
};

checkAdmin();