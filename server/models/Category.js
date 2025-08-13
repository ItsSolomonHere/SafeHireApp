const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Category name cannot exceed 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Category description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters'],
    trim: true
  },
  icon: {
    type: String,
    required: [true, 'Category icon is required'],
    trim: true
  },
  image: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  averageHourlyRate: {
    type: Number,
    default: 0
  },
  workerCount: {
    type: Number,
    default: 0
  },
  featured: {
    type: Boolean,
    default: false
  },
  sortOrder: {
    type: Number,
    default: 0
  },
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  subcategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  requirements: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    required: {
      type: Boolean,
      default: true
    }
  }],
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
categorySchema.index({ name: 1 });
categorySchema.index({ isActive: 1, featured: 1 });
categorySchema.index({ sortOrder: 1 });

// Virtual for total workers including subcategories
categorySchema.virtual('totalWorkers').get(function() {
  return this.workerCount + this.subcategories.reduce((total, sub) => total + (sub.workerCount || 0), 0);
});

// Method to update worker count
categorySchema.methods.updateWorkerCount = function() {
  return this.model('Worker').countDocuments({ 
    category: this._id, 
    status: 'active',
    'verification.isVerified': true 
  }).then(count => {
    this.workerCount = count;
    return this.save();
  });
};

// Method to update average hourly rate
categorySchema.methods.updateAverageRate = function() {
  return this.model('Worker').aggregate([
    { $match: { category: this._id, status: 'active', 'verification.isVerified': true } },
    { $group: { _id: null, avgRate: { $avg: '$hourlyRate' } } }
  ]).then(result => {
    this.averageHourlyRate = result.length > 0 ? Math.round(result[0].avgRate) : 0;
    return this.save();
  });
};

module.exports = mongoose.model('Category', categorySchema);

