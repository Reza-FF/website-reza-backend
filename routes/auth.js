// routes/auth.js
const express = require('express');
const { register, login, getProfile } = require('../controllers/authController');
const auth = require('../middleware/auth');

const router = express.Router();

// Public routes (tidak perlu login)
router.post('/register', register);
router.post('/login', login);

// Protected routes (perlu login)
router.get('/profile', auth, getProfile);

module.exports = router;