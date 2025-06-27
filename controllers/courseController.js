// controllers/courseController.js
const Course = require('../models/Course');
const User = require('../models/User');

// Get all courses
const getAllCourses = async (req, res) => {
  try {
    const { category, level, search, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    let filter = { isActive: true };
    
    if (category) filter.category = category;
    if (level) filter.level = level;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Pagination
    const skip = (page - 1) * limit;
    
    const courses = await Course.find(filter)
      .select('-curriculum -enrolledStudents') // Exclude heavy fields
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Course.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        courses,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          count: courses.length,
          totalCourses: total
        }
      }
    });

  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      error: error.message
    });
  }
};

// Get single course by ID
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course tidak ditemukan'
      });
    }

    res.status(200).json({
      success: true,
      data: { course }
    });

  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      error: error.message
    });
  }
};

// Enroll to course
const enrollCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.userId;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course tidak ditemukan'
      });
    }

    // Check if user already enrolled
    if (course.enrolledStudents.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'Anda sudah terdaftar di course ini'
      });
    }

    // Add user to enrolled students
    course.enrolledStudents.push(userId);
    course.totalStudents += 1;
    await course.save();

    // Add course to user's enrolled courses
    await User.findByIdAndUpdate(userId, {
      $push: { enrolledCourses: courseId }
    });

    res.status(200).json({
      success: true,
      message: 'Berhasil mendaftar course!',
      data: { course }
    });

  } catch (error) {
    console.error('Enroll course error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      error: error.message
    });
  }
};

// Get user's enrolled courses
const getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const user = await User.findById(userId).populate('enrolledCourses');
    
    res.status(200).json({
      success: true,
      data: { courses: user.enrolledCourses }
    });

  } catch (error) {
    console.error('Get enrolled courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server',
      error: error.message
    });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  enrollCourse,
  getEnrolledCourses
};