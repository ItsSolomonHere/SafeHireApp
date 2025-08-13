const express = require('express');
const { query, param, body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Worker = require('../models/Worker');
const { authenticateToken, requireEmployer } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/bookings
// @desc    Get user's bookings
// @access  Private
router.get('/', [
  authenticateToken,
  query('status').optional().isIn(['pending', 'accepted', 'rejected', 'in-progress', 'completed', 'cancelled']).withMessage('Invalid status'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
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

    const { status, page = 1, limit = 10 } = req.query;
    const filter = {};

    // Filter by user role
    if (req.user.role === 'employer') {
      filter.employer = req.user._id;
    } else if (req.user.role === 'worker') {
      filter.worker = req.user._id;
    }

    if (status) {
      filter.status = status;
    }

    const bookings = await Booking.find(filter)
      .populate('worker', 'hourlyRate')
      .populate('employer', 'firstName lastName')
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(filter);

    res.json({
      status: 'success',
      data: {
        bookings,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch bookings'
    });
  }
});

// @route   POST /api/bookings
// @desc    Create new booking
// @access  Private (Employer only)
router.post('/', [
  authenticateToken,
  requireEmployer,
  body('worker').isMongoId().withMessage('Valid worker ID is required'),
  body('title').notEmpty().withMessage('Job title is required'),
  body('description').notEmpty().withMessage('Job description is required'),
  body('scheduledDate').isISO8601().withMessage('Valid scheduled date is required'),
  body('duration.hours').isInt({ min: 1, max: 24 }).withMessage('Duration must be between 1 and 24 hours'),
  body('location.address').notEmpty().withMessage('Job location is required'),
  body('paymentMethod').isIn(['mpesa', 'card', 'bank-transfer']).withMessage('Invalid payment method')
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

    const { worker: workerId, ...bookingData } = req.body;

    // Verify worker exists and is available
    const worker = await Worker.findById(workerId)
      .populate('user', 'firstName lastName')
      .populate('category', 'name');

    if (!worker) {
      return res.status(404).json({
        status: 'error',
        message: 'Worker not found'
      });
    }

    if (worker.status !== 'active' || !worker.verification.isVerified) {
      return res.status(400).json({
        status: 'error',
        message: 'Worker is not available'
      });
    }

    // Check if scheduled date is in the future
    const scheduledDate = new Date(bookingData.scheduledDate);
    if (scheduledDate <= new Date()) {
      return res.status(400).json({
        status: 'error',
        message: 'Scheduled date must be in the future'
      });
    }

    // Calculate total amount
    const totalAmount = worker.hourlyRate * bookingData.duration.hours;

    const booking = new Booking({
      employer: req.user._id,
      worker: workerId,
      category: worker.category,
      hourlyRate: worker.hourlyRate,
      totalAmount,
      ...bookingData
    });

    await booking.save();

    res.status(201).json({
      status: 'success',
      message: 'Booking created successfully',
      data: {
        booking: await booking.populate([
          { path: 'worker', populate: { path: 'user', select: 'firstName lastName' } },
          { path: 'category', select: 'name' }
        ])
      }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create booking'
    });
  }
});

// @route   PUT /api/bookings/:id/accept
// @desc    Accept booking (Worker only)
// @access  Private
router.put('/:id/accept', [
  authenticateToken,
  param('id').isMongoId().withMessage('Invalid booking ID'),
  body('message').optional().isString().withMessage('Message must be a string')
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

    const booking = await Booking.findById(req.params.id)
      .populate('worker', 'user')
      .populate('employer', 'firstName lastName');

    if (!booking) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found'
      });
    }

    // Check if user is the worker for this booking
    if (booking.worker.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to accept this booking'
      });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({
        status: 'error',
        message: 'Booking cannot be accepted'
      });
    }

    await booking.accept(req.body.message || '');

    res.json({
      status: 'success',
      message: 'Booking accepted successfully',
      data: {
        booking
      }
    });
  } catch (error) {
    console.error('Accept booking error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to accept booking'
    });
  }
});

// @route   PUT /api/bookings/:id/reject
// @desc    Reject booking (Worker only)
// @access  Private
router.put('/:id/reject', [
  authenticateToken,
  param('id').isMongoId().withMessage('Invalid booking ID'),
  body('message').optional().isString().withMessage('Message must be a string')
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

    const booking = await Booking.findById(req.params.id)
      .populate('worker', 'user');

    if (!booking) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found'
      });
    }

    // Check if user is the worker for this booking
    if (booking.worker.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to reject this booking'
      });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({
        status: 'error',
        message: 'Booking cannot be rejected'
      });
    }

    await booking.reject(req.body.message || '');

    res.json({
      status: 'success',
      message: 'Booking rejected successfully',
      data: {
        booking
      }
    });
  } catch (error) {
    console.error('Reject booking error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to reject booking'
    });
  }
});

// @route   PUT /api/bookings/:id/start
// @desc    Start work (Worker only)
// @access  Private
router.put('/:id/start', [
  authenticateToken,
  param('id').isMongoId().withMessage('Invalid booking ID')
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

    const booking = await Booking.findById(req.params.id)
      .populate('worker', 'user');

    if (!booking) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found'
      });
    }

    // Check if user is the worker for this booking
    if (booking.worker.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to start this work'
      });
    }

    if (booking.status !== 'accepted') {
      return res.status(400).json({
        status: 'error',
        message: 'Booking must be accepted before starting work'
      });
    }

    await booking.startWork();

    res.json({
      status: 'success',
      message: 'Work started successfully',
      data: {
        booking
      }
    });
  } catch (error) {
    console.error('Start work error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to start work'
    });
  }
});

// @route   PUT /api/bookings/:id/complete
// @desc    Complete work (Worker only)
// @access  Private
router.put('/:id/complete', [
  authenticateToken,
  param('id').isMongoId().withMessage('Invalid booking ID'),
  body('notes').optional().isString().withMessage('Notes must be a string')
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

    const booking = await Booking.findById(req.params.id)
      .populate('worker', 'user');

    if (!booking) {
      return res.status(404).json({
        status: 'error',
        message: 'Booking not found'
      });
    }

    // Check if user is the worker for this booking
    if (booking.worker.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to complete this work'
      });
    }

    if (booking.status !== 'in-progress') {
      return res.status(400).json({
        status: 'error',
        message: 'Work must be in progress to complete'
      });
    }

    await booking.complete(req.body.notes || '');

    res.json({
      status: 'success',
      message: 'Work completed successfully',
      data: {
        booking
      }
    });
  } catch (error) {
    console.error('Complete work error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to complete work'
    });
  }
});

module.exports = router;

