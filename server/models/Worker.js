const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    enum: [
      'fundi', 'domestic', 'boda', 'gardener', 'painter', 
      'event-crew', 'security', 'tutor', 'delivery', 'driver'
    ],
    required: true
  },
  skills: [{
    type: String,
    required: true
  }],
  bio: {
    type: String,
    required: true,
    maxlength: 500
  },
  hourlyRate: {
    type: Number,
    required: true,
    min: 100
  },
  dailyRate: {
    type: Number,
    required: true,
    min: 500
  },
  availability: {
    type: String,
    enum: ['available', 'busy', 'unavailable'],
    default: 'available'
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  totalJobs: {
    type: Number,
    default: 0
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  backgroundCheck: {
    type: Boolean,
    default: false
  },
  documents: [{
    name: String,
    url: String,
    verified: {
      type: Boolean,
      default: false
    }
  }],
  workingHours: {
    start: {
      type: String,
      default: '08:00'
    },
    end: {
      type: String,
      default: '18:00'
    }
  },
  preferredLocations: [{
    type: String
  }],
  languages: [{
    type: String,
    enum: ['English', 'Swahili', 'Kikuyu', 'Luo', 'Kamba', 'Other']
  }],
  experience: {
    type: Number,
    default: 0,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Virtual for average rating
workerSchema.virtual('averageRating').get(function() {
  return this.totalReviews > 0 ? (this.rating / this.totalReviews).toFixed(1) : 0;
});

module.exports = mongoose.model('Worker', workerSchema); 