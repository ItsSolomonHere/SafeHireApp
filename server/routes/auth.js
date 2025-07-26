const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { validateRegistration, validateLogin } = require('../middleware/validation');
const { uploadProfileImage } = require('../middleware/upload');

// Public routes
router.post('/register', validateRegistration, authController.register);
router.post('/login', validateLogin, authController.login);

// Protected routes
router.get('/profile', auth, authController.getProfile);
router.put('/profile', auth, uploadProfileImage, authController.updateProfile);
router.put('/change-password', auth, authController.changePassword);

module.exports = router; 