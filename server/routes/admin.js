const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Worker = require('../models/Worker');
const Booking = require('../models/Booking');
const Message = require('../models/Message');
const { auth, requireAdmin } = require('../middleware/auth');

// Get dashboard statistics
router.get('/dashboard', auth, requireAdmin, async (req, res) => {
  try {
    const [
      totalUsers,
      totalWorkers,
      totalBookings,
      totalMessages,
      pendingWorkers,
      activeBookings,
      completedBookings,
      totalRevenue
    ] = await Promise.all([
      User.countDocuments(),
      Worker.countDocuments(),
      Booking.countDocuments(),
      Message.countDocuments(),
      Worker.countDocuments({ isVerified: false }),
      Booking.countDocuments({ status: { $in: ['pending', 'accepted'] } }),
      Booking.countDocuments({ status: 'completed' }),
      Booking.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ])
    ]);

    // Get recent activities
    const recentBookings = await Booking.find()
      .populate([
        { path: 'employer', select: 'name' },
        { path: 'worker', populate: { path: 'userId', select: 'name' } }
      ])
      .sort({ createdAt: -1 })
      .limit(5);

    const recentWorkers = await Worker.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalUsers,
        totalWorkers,
        totalBookings,
        totalMessages,
        pendingWorkers,
        activeBookings,
        completedBookings,
        totalRevenue: totalRevenue[0]?.total || 0
      },
      recentBookings,
      recentWorkers
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get analytics data
router.get('/analytics', auth, requireAdmin, async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // User registration trends
    const userTrends = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Booking trends
    const bookingTrends = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Worker category distribution
    const workerCategories = await Worker.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // Booking status distribution
    const bookingStatuses = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      userTrends,
      bookingTrends,
      workerCategories,
      bookingStatuses
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 