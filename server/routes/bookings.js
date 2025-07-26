const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { auth, requireEmployer, requireWorker, requireAdmin } = require('../middleware/auth');
const { validateBooking } = require('../middleware/validation');

// Employer routes
router.post('/', auth, requireEmployer, validateBooking, bookingController.createBooking);
router.get('/my-bookings', auth, bookingController.getUserBookings);
router.get('/:id', auth, bookingController.getBookingById);
router.put('/:id/cancel', auth, requireEmployer, bookingController.cancelBooking);

// Worker routes
router.put('/:id/status', auth, requireWorker, bookingController.updateBookingStatus);

// Admin routes
router.get('/admin/all', auth, requireAdmin, bookingController.getAllBookings);

module.exports = router; 