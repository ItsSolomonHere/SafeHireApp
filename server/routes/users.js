const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, requireAdmin } = require('../middleware/auth');

// Get all users (admin only)
router.get('/', auth, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 20, role } = req.query;
    const query = {};

    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user status (admin only)
router.put('/:userId/status', auth, requireAdmin, async (req, res) => {
  try {
    const { isActive } = req.body;
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'User status updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 