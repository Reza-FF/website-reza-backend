// routes/courses.js
const express = require('express');
const User = require('../models/User');
const Course = require('../models/Course');
const { 
  getAllCourses, 
  getCourseById, 
  enrollCourse, 
  getEnrolledCourses 
} = require('../controllers/courseController');
const auth = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getAllCourses);           // GET /api/courses
router.get('/:id', getCourseById);        // GET /api/courses/:id

// Protected routes (perlu login)
router.post('/:id/enroll', auth, enrollCourse);      // POST /api/courses/:id/enroll

// GET enrolled courses for user - FIXED VERSION
router.get('/user/enrolled', auth, async (req, res) => {
  try {
    console.log('Getting enrolled courses for user:', req.user.userId)
    
    // Find user and populate enrolled courses
    const user = await User.findById(req.user.userId)
      .populate({
        path: 'enrolledCourses',
        populate: {
          path: 'instructor',
          select: 'name email'
        }
      })
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    console.log('User enrolled courses:', user.enrolledCourses)

    res.json({
      success: true,
      message: 'Enrolled courses retrieved successfully',
      data: {
        courses: user.enrolledCourses || [],
        totalCourses: user.enrolledCourses ? user.enrolledCourses.length : 0
      }
    })

  } catch (error) {
    console.error('Get enrolled courses error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
})

// POST enroll in course - FIXED VERSION
router.post('/enroll/:courseId', auth, async (req, res) => {
  try {
    const { courseId } = req.params
    const userId = req.user.userId

    console.log('Enrolling user:', userId, 'in course:', courseId)

    // Check if course exists
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      })
    }

    // Check if user exists
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    // Check if already enrolled
    if (user.enrolledCourses && user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      })
    }

    // Add course to user's enrolled courses
    if (!user.enrolledCourses) {
      user.enrolledCourses = []
    }
    user.enrolledCourses.push(courseId)
    await user.save()

    // Add user to course's enrolled users
    if (!course.enrolledUsers) {
      course.enrolledUsers = []
    }
    course.enrolledUsers.push(userId)
    await course.save()

    console.log('Enrollment successful')

    res.json({
      success: true,
      message: 'Successfully enrolled in course',
      data: {
        courseId,
        courseName: course.title
      }
    })

  } catch (error) {
    console.error('Enroll course error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    })
  }
})

module.exports = router;