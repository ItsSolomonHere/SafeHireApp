const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  skills: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'expert'],
      default: 'intermediate'
    },
    yearsOfExperience: {
      type: Number,
      min: 0,
      default: 0
    }
  }],
  hourlyRate: {
    type: Number,
    required: [true, 'Hourly rate is required'],
    min: [100, 'Hourly rate must be at least KES 100'],
    max: [10000, 'Hourly rate cannot exceed KES 10,000']
  },
  availability: {
    monday: {
      available: { type: Boolean, default: true },
      startTime: { type: String, default: '08:00' },
      endTime: { type: String, default: '17:00' }
    },
    tuesday: {
      available: { type: Boolean, default: true },
      startTime: { type: String, default: '08:00' },
      endTime: { type: String, default: '17:00' }
    },
    wednesday: {
      available: { type: Boolean, default: true },
      startTime: { type: String, default: '08:00' },
      endTime: { type: String, default: '17:00' }
    },
    thursday: {
      available: { type: Boolean, default: true },
      startTime: { type: String, default: '08:00' },
      endTime: { type: String, default: '17:00' }
    },
    friday: {
      available: { type: Boolean, default: true },
      startTime: { type: String, default: '08:00' },
      endTime: { type: String, default: '17:00' }
    },
    saturday: {
      available: { type: Boolean, default: false },
      startTime: { type: String, default: '08:00' },
      endTime: { type: String, default: '17:00' }
    },
    sunday: {
      available: { type: Boolean, default: false },
      startTime: { type: String, default: '08:00' },
      endTime: { type: String, default: '17:00' }
    }
  },
  bio: {
    type: String,
    maxlength: [1000, 'Bio cannot exceed 1000 characters'],
    trim: true
  },
  portfolio: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    imageUrl: {
      type: String
    },
    projectUrl: {
      type: String
    },
    completedAt: {
      type: Date
    }
  }],
  documents: {
    idCard: {
      type: String,
      required: [true, 'ID card is required for verification']
    },
    policeClearance: {
      type: String,
      required: [true, 'Police clearance is required for verification']
    },
    certificates: [{
      name: String,
      url: String,
      issuedBy: String,
      issuedDate: Date
    }]
  },
  verification: {
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedAt: {
      type: Date
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verificationNotes: {
      type: String
    }
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended', 'pending'],
    default: 'pending'
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    },
    breakdown: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 }
    }
  },
  completedJobs: {
    type: Number,
    default: 0
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  responseTime: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
workerSchema.index({ category: 1 });
workerSchema.index({ 'location.coordinates': '2dsphere' });
workerSchema.index({ status: 1, isVerified: 1 });
workerSchema.index({ hourlyRate: 1 });
workerSchema.index({ rating: 1 });

// Virtual for total experience
workerSchema.virtual('totalExperience').get(function() {
  return this.skills.reduce((total, skill) => total + skill.yearsOfExperience, 0);
});

// Virtual for availability status
workerSchema.virtual('isAvailable').get(function() {
  const now = new Date();
  const dayOfWeek = now.toLocaleLowerCase().slice(0, 3);
  const currentTime = now.toTimeString().slice(0, 5);
  
  const dayAvailability = this.availability[dayOfWeek];
  if (!dayAvailability || !dayAvailability.available) return false;
  
  return currentTime >= dayAvailability.startTime && currentTime <= dayAvailability.endTime;
});

// Method to update rating
workerSchema.methods.updateRating = function(newRating) {
  this.rating.count += 1;
  this.rating.breakdown[newRating] += 1;
  
  const totalRatings = Object.values(this.rating.breakdown).reduce((sum, count) => sum + count, 0);
  const weightedSum = Object.entries(this.rating.breakdown).reduce((sum, [rating, count]) => {
    return sum + (parseInt(rating) * count);
  }, 0);
  
  this.rating.average = weightedSum / totalRatings;
  return this.save();
};

// Method to get public profile
workerSchema.methods.getPublicProfile = function() {
  const workerObject = this.toObject();
  delete workerObject.documents;
  delete workerObject.verification;
  delete workerObject.__v;
  return workerObject;
};

module.exports = mongoose.model('Worker', workerSchema);

