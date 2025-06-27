// routes/admin.js
const express = require('express');
const User = require('../models/User');
const Course = require('../models/Course');
const auth = require('../middleware/auth');

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin only.'
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// GET all users (Admin only)
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .populate('enrolledCourses', 'title')
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: 'Users retrieved successfully',
      data: {
        users,
        totalUsers: users.length
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// PUT update user role (Admin only)
router.put('/users/:userId/role', auth, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    // Validate role
    if (!['student', 'instructor', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be student, instructor, or admin.'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User role updated successfully',
      data: { user }
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// DELETE course (Admin only)
router.delete('/courses/:courseId', auth, isAdmin, async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findByIdAndDelete(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Remove course from users' enrolled courses
    await User.updateMany(
      { enrolledCourses: courseId },
      { $pull: { enrolledCourses: courseId } }
    );

    res.json({
      success: true,
      message: 'Course deleted successfully',
      data: { courseId }
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// GET admin statistics (Admin only)
router.get('/stats', auth, isAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    
    // Get total enrollments
    const users = await User.find().populate('enrolledCourses');
    const totalEnrollments = users.reduce((sum, user) => sum + (user.enrolledCourses?.length || 0), 0);
    
    // Get total revenue (simplified calculation)
    const courses = await Course.find().populate('enrolledUsers');
    const totalRevenue = courses.reduce((sum, course) => {
      return sum + (course.price * (course.enrolledUsers?.length || 0));
    }, 0);

    res.json({
      success: true,
      message: 'Admin statistics retrieved successfully',
      data: {
        totalUsers,
        totalCourses,
        totalEnrollments,
        totalRevenue
      }
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;