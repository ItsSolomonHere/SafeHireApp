const express = require('express');
const { body, param, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      status: 'success',
      data: {
        user: req.user.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get profile'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update current user profile
// @access  Private
router.put('/profile', [
  authenticateToken,
  body('firstName').optional().isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  body('lastName').optional().isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
  body('phone').optional().matches(/^(\+254|0)[17]\d{8}$/).withMessage('Please provide a valid Kenyan phone number'),
  body('location.county').optional().notEmpty().withMessage('County is required'),
  body('location.city').optional().notEmpty().withMessage('City is required'),
  body('preferences.notifications.email').optional().isBoolean().withMessage('Email notifications must be a boolean'),
  body('preferences.notifications.sms').optional().isBoolean().withMessage('SMS notifications must be a boolean'),
  body('preferences.language').optional().isIn(['en', 'sw']).withMessage('Language must be en or sw')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const allowedFields = [
      'firstName', 'lastName', 'phone', 'location', 
      'preferences', 'profileImage'
    ];

    Object.keys(req.body).forEach(key => {
      if (allowedFields.includes(key)) {
        req.user[key] = req.body[key];
      }
    });

    await req.user.save();

    res.json({
      status: 'success',
      message: 'Profile updated successfully',
      data: {
        user: req.user.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update profile'
    });
  }
});

// @route   PUT /api/users/password
// @desc    Change password
// @access  Private
router.put('/password', [
  authenticateToken,
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Get user with password for comparison
    const user = await User.findById(req.user._id).select('+password');
    
    // Check current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        status: 'error',
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      status: 'success',
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to change password'
    });
  }
});

// @route   DELETE /api/users/profile
// @desc    Deactivate account
// @access  Private
router.delete('/profile', [
  authenticateToken,
  body('password').notEmpty().withMessage('Password is required for account deactivation')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { password } = req.body;

    // Get user with password for verification
    const user = await User.findById(req.user._id).select('+password');
    
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        status: 'error',
        message: 'Password is incorrect'
      });
    }

    // Deactivate account
    user.isActive = false;
    await user.save();

    res.json({
      status: 'success',
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    console.error('Deactivate account error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to deactivate account'
    });
  }
});

module.exports = router;

