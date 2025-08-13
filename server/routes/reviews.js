const express = require('express');
const { body, param, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Worker = require('../models/Worker');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/reviews
// @desc    Create a review for a completed booking
// @access  Private
router.post('/', [
  authenticateToken,
  body('bookingId').isMongoId().withMessage('Valid booking ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('review').optional().isLength({ max: 500 }).withMessage('Review cannot exceed 500 characters')
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

    const { bookingId, rating, review } = req.body;

    // Find the booking
    const booking = await Booking.findById(bookingId)
      .populate('worker', 'user')
      .populate('employer');

    if (!booking) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found'
      });
    }

    // Check if booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({
        status: 'error',
        message: 'Can only review completed bookings'
      });
    }

    // Check if user is authorized to review (employer or worker)
    const isEmployer = booking.employer._id.toString() === req.user._id.toString();
    const isWorker = booking.worker.user.toString() === req.user._id.toString();

    if (!isEmployer && !isWorker) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to review this booking'
      });
    }

    // Check if review already exists
    const reviewField = isEmployer ? 'employerRating' : 'workerRating';
    if (booking.rating[reviewField].rating) {
      return res.status(400).json({
        status: 'error',
        message: 'Review already exists for this booking'
      });
    }

    // Add review to booking
    booking.rating[reviewField] = {
      rating,
      review,
      ratedAt: new Date()
    };

    await booking.save();

    // Update worker rating if employer is reviewing
    if (isEmployer) {
      const worker = await Worker.findById(booking.worker._id);
      await worker.updateRating(rating);
    }

    res.status(201).json({
      status: 'success',
      message: 'Review submitted successfully',
      data: {
        review: booking.rating[reviewField]
      }
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to submit review'
    });
  }
});

// @route   GET /api/reviews/worker/:workerId
// @desc    Get reviews for a specific worker
// @access  Public
router.get('/worker/:workerId', [
  param('workerId').isMongoId().withMessage('Valid worker ID is required')
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

    const { workerId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const reviews = await Booking.find({
      worker: workerId,
      status: 'completed',
      'rating.employerRating.rating': { $exists: true, $ne: null }
    })
    .populate('employer', 'firstName lastName profileImage')
    .select('rating.employerRating scheduledDate title')
    .sort({ 'rating.employerRating.ratedAt': -1 })
    .skip((parseInt(page) - 1) * parseInt(limit))
    .limit(parseInt(limit));

    const total = await Booking.countDocuments({
      worker: workerId,
      status: 'completed',
      'rating.employerRating.rating': { $exists: true, $ne: null }
    });

    res.json({
      status: 'success',
      data: {
        reviews,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get worker reviews error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch reviews'
    });
  }
});

module.exports = router;

