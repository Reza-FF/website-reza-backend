// scripts/createAdminFinal.js
const mongoose = require('mongoose');
const User = require('../models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/course-website', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const createAdminFinal = async () => {
  try {
    console.log('🔧 Creating admin with proper User model...');
    
    // Delete existing admin
    await User.deleteMany({ 
      $or: [
        { email: 'admin@rumahreza.com' },
        { email: 'admin@rumahReza.com' }
      ]
    });
    console.log('🗑️ Deleted existing admin users');

    // Create admin using User model (will auto-hash password)
    const admin = new User({
      name: 'Admin RumahReza',
      email: 'admin@rumahreza.com',
      password: 'admin123', // Will be hashed by pre-save hook
      role: 'admin'
    });

    await admin.save();
    console.log('✅ Admin user created with proper model!');
    
    // Test the password
    const testUser = await User.findOne({ email: 'admin@rumahreza.com' });
    const isPasswordValid = await testUser.comparePassword('admin123');
    
    console.log('🧪 Password test with model method:', isPasswordValid ? '✅ VALID' : '❌ INVALID');
    
    console.log('');
    console.log('🎯 LOGIN CREDENTIALS:');
    console.log('📧 Email: admin@rumahreza.com');
    console.log('🔑 Password: admin123');
    console.log('👑 Role: admin');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdminFinal();