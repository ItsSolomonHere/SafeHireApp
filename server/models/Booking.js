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
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  location: {
    address: {
      type: String,
      required: [true, 'Job location is required'],
      trim: true
    },
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required']
  },
  duration: {
    hours: {
      type: Number,
      required: [true, 'Duration in hours is required'],
      min: [1, 'Duration must be at least 1 hour'],
      max: [24, 'Duration cannot exceed 24 hours']
    }
  },
  hourlyRate: {
    type: Number,
    required: [true, 'Hourly rate is required'],
    min: [100, 'Hourly rate must be at least KES 100']
  },
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['mpesa', 'card', 'bank-transfer'],
    required: true
  },
  paymentDetails: {
    transactionId: String,
    paymentDate: Date,
    amount: Number
  },
  workerResponse: {
    accepted: {
      type: Boolean,
      default: false
    },
    responseTime: {
      type: Date
    },
    message: {
      type: String,
      trim: true
    }
  },
  completion: {
    completedAt: {
      type: Date
    },
    completedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: {
      type: String,
      trim: true
    },
    images: [{
      url: String,
      caption: String
    }]
  },
  cancellation: {
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    cancelledAt: {
      type: Date
    },
    reason: {
      type: String,
      trim: true
    },
    refundAmount: {
      type: Number
    }
  },
  rating: {
    employerRating: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      review: {
        type: String,
        trim: true
      },
      ratedAt: {
        type: Date
      }
    },
    workerRating: {
      rating: {
        type: Number,
        min: 1,
        max: 5
      },
      review: {
        type: String,
        trim: true
      },
      ratedAt: {
        type: Date
      }
    }
  },
  specialRequirements: [{
    type: String,
    trim: true
  }],
  attachments: [{
    name: String,
    url: String,
    type: String
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
bookingSchema.index({ employer: 1, status: 1 });
bookingSchema.index({ worker: 1, status: 1 });
bookingSchema.index({ scheduledDate: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ 'location.coordinates': '2dsphere' });
bookingSchema.index({ paymentStatus: 1 });

// Pre-save middleware to calculate total amount
bookingSchema.pre('save', function(next) {
  if (this.isModified('hourlyRate') || this.isModified('duration')) {
    this.totalAmount = this.hourlyRate * this.duration.hours;
  }
  next();
});

// Virtual for time until scheduled date
bookingSchema.virtual('timeUntilScheduled').get(function() {
  const now = new Date();
  const scheduled = new Date(this.scheduledDate);
  return scheduled - now;
});

// Virtual for is overdue
bookingSchema.virtual('isOverdue').get(function() {
  if (this.status !== 'in-progress') return false;
  const now = new Date();
  const scheduled = new Date(this.scheduledDate);
  const endTime = new Date(scheduled.getTime() + (this.duration.hours * 60 * 60 * 1000));
  return now > endTime;
});

// Method to accept booking
bookingSchema.methods.accept = function(message = '') {
  this.status = 'accepted';
  this.workerResponse.accepted = true;
  this.workerResponse.responseTime = new Date();
  this.workerResponse.message = message;
  return this.save();
};

// Method to reject booking
bookingSchema.methods.reject = function(message = '') {
  this.status = 'rejected';
  this.workerResponse.accepted = false;
  this.workerResponse.responseTime = new Date();
  this.workerResponse.message = message;
  return this.save();
};

// Method to start work
bookingSchema.methods.startWork = function() {
  this.status = 'in-progress';
  return this.save();
};

// Method to complete work
bookingSchema.methods.complete = function(notes = '', images = []) {
  this.status = 'completed';
  this.completion.completedAt = new Date();
  this.completion.notes = notes;
  this.completion.images = images;
  return this.save();
};

// Method to cancel booking
bookingSchema.methods.cancel = function(cancelledBy, reason, refundAmount = 0) {
  this.status = 'cancelled';
  this.cancellation.cancelledBy = cancelledBy;
  this.cancellation.cancelledAt = new Date();
  this.cancellation.reason = reason;
  this.cancellation.refundAmount = refundAmount;
  
  if (refundAmount > 0) {
    this.paymentStatus = 'refunded';
  }
  
  return this.save();
};

module.exports = mongoose.model('Booking', bookingSchema);

