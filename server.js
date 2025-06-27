// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Debug middleware - track all requests
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.url} - ${new Date().toISOString()}`);
  console.log('📦 Body:', req.body);
  next(); // ← PERBAIKAN: Tambah semicolon
}); // ← PERBAIKAN: Tambah kurung kurawal

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/admin', require('./routes/admin')); // ← Admin routes

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'RumahReza Backend API is running!',
    status: 'success',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile'
      },
      courses: {
        getAll: 'GET /api/courses',
        getById: 'GET /api/courses/:id',
        enroll: 'POST /api/courses/:id/enroll',
        enrolled: 'GET /api/courses/user/enrolled'
      },
      admin: {                                      // ← Admin endpoints
        getUsers: 'GET /api/admin/users',
        updateUserRole: 'PUT /api/admin/users/:userId/role',
        deleteCourse: 'DELETE /api/admin/courses/:courseId',
        getStats: 'GET /api/admin/stats'
      }
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan'
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({
    success: false,
    message: 'Terjadi kesalahan server',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📱 Access at: http://localhost:${PORT}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`👑 Admin Panel: Available for admin users`);
});