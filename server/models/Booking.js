const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in hours
    required: true
  },
  rate: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['mpesa', 'card', 'cash'],
    default: 'mpesa'
  },
  specialRequirements: {
    type: String,
    default: ''
  },
  cancellationReason: {
    type: String,
    default: ''
  },
  completedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
bookingSchema.index({ employer: 1, status: 1 });
bookingSchema.index({ worker: 1, status: 1 });
bookingSchema.index({ scheduledDate: 1 });

module.exports = mongoose.model('Booking', bookingSchema); 