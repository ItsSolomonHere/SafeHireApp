const Booking = require('../models/Booking');
const Worker = require('../models/Worker');
const User = require('../models/User');

// Create booking
const createBooking = async (req, res) => {
  try {
    const {
      workerId, jobTitle, description, location, scheduledDate,
      startTime, endTime, duration, specialRequirements
    } = req.body;

    // Get worker details
    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    // Calculate total amount
    const rate = worker.hourlyRate;
    const totalAmount = rate * duration;

    const booking = new Booking({
      employer: req.user._id,
      worker: workerId,
      jobTitle,
      description,
      location,
      scheduledDate,
      startTime,
      endTime,
      duration,
      rate,
      totalAmount,
      specialRequirements
    });

    await booking.save();

    // Populate details
    await booking.populate([
      { path: 'employer', select: 'name email phone' },
      { path: 'worker', populate: { path: 'userId', select: 'name email phone' } }
    ]);

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's bookings
const getUserBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (req.user.role === 'employer') {
      query.employer = req.user._id;
    } else if (req.user.role === 'worker') {
      const worker = await Worker.findOne({ userId: req.user._id });
      if (worker) {
        query.worker = worker._id;
      }
    }

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate([
        { path: 'employer', select: 'name email phone' },
        { path: 'worker', populate: { path: 'userId', select: 'name email phone' } }
      ])
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.json({
      bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate([
        { path: 'employer', select: 'name email phone' },
        { path: 'worker', populate: { path: 'userId', select: 'name email phone' } }
      ]);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user has access to this booking
    const worker = await Worker.findOne({ userId: req.user._id });
    if (booking.employer.toString() !== req.user._id.toString() && 
        (!worker || booking.worker.toString() !== worker._id.toString())) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(booking);
  } catch (error) {
    console.error('Get booking by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update booking status (worker only)
const updateBookingStatus = async (req, res) => {
  try {
    const { status, cancellationReason } = req.body;
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is the worker for this booking
    const worker = await Worker.findOne({ userId: req.user._id });
    if (!worker || booking.worker.toString() !== worker._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updateData = { status };
    if (cancellationReason) {
      updateData.cancellationReason = cancellationReason;
    }

    if (status === 'completed') {
      updateData.completedAt = new Date();
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate([
      { path: 'employer', select: 'name email phone' },
      { path: 'worker', populate: { path: 'userId', select: 'name email phone' } }
    ]);

    res.json({
      message: 'Booking status updated successfully',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Cancel booking (employer only)
const cancelBooking = async (req, res) => {
  try {
    const { cancellationReason } = req.body;
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user is the employer for this booking
    if (booking.employer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      { 
        status: 'cancelled',
        cancellationReason
      },
      { new: true }
    ).populate([
      { path: 'employer', select: 'name email phone' },
      { path: 'worker', populate: { path: 'userId', select: 'name email phone' } }
    ]);

    res.json({
      message: 'Booking cancelled successfully',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all bookings (admin)
const getAllBookings = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate([
        { path: 'employer', select: 'name email phone' },
        { path: 'worker', populate: { path: 'userId', select: 'name email phone' } }
      ])
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.json({
      bookings,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getAllBookings
}; 