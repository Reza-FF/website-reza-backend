// config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Connect ke MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`📊 MongoDB Connected: ${conn.connection.host}`);
    console.log(`🗄️  Database: ${conn.connection.name}`);
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1); // Exit jika gagal connect
  }
};

module.exports = connectDB;