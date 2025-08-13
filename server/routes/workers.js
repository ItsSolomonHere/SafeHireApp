const express = require('express');
const { query, param, body, validationResult } = require('express-validator');
const Worker = require('../models/Worker');
const User = require('../models/User');
const Category = require('../models/Category');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/workers
// @desc    Get all workers with filtering and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('category').optional().isMongoId().withMessage('Invalid category ID'),
  query('minRate').optional().isFloat({ min: 0 }).withMessage('Minimum rate must be a positive number'),
  query('maxRate').optional().isFloat({ min: 0 }).withMessage('Maximum rate must be a positive number'),
  query('rating').optional().isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5'),
  query('verified').optional().isBoolean().withMessage('Verified must be a boolean'),
  query('available').optional().isBoolean().withMessage('Available must be a boolean'),
  query('location').optional().isString().withMessage('Location must be a string'),
  query('search').optional().isString().withMessage('Search must be a string'),
  query('sortBy').optional().isIn(['rating', 'hourlyRate', 'completedJobs', 'createdAt']).withMessage('Invalid sort field'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc')
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

    const {
      page = 1,
      limit = 10,
      category,
      minRate,
      maxRate,
      rating,
      verified,
      available,
      location,
      search,
      sortBy = 'rating',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {
      status: 'active',
      'verification.isVerified': true
    };

    if (category) {
      filter.category = category;
    }

    if (minRate || maxRate) {
      filter.hourlyRate = {};
      if (minRate) filter.hourlyRate.$gte = parseFloat(minRate);
      if (maxRate) filter.hourlyRate.$lte = parseFloat(maxRate);
    }

    if (rating) {
      filter['rating.average'] = { $gte: parseFloat(rating) };
    }

    if (verified !== undefined) {
      filter['verification.isVerified'] = verified === 'true';
    }

    // Build aggregation pipeline
    const pipeline = [
      { $match: filter },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      { $unwind: '$userInfo' },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      { $unwind: '$categoryInfo' }
    ];

    // Add search functionality
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { 'userInfo.firstName': { $regex: search, $options: 'i' } },
            { 'userInfo.lastName': { $regex: search, $options: 'i' } },
            { bio: { $regex: search, $options: 'i' } },
            { 'skills.name': { $regex: search, $options: 'i' } },
            { 'categoryInfo.name': { $regex: search, $options: 'i' } }
          ]
        }
      });
    }

    // Add location filtering
    if (location) {
      pipeline.push({
        $match: {
          $or: [
            { 'userInfo.location.county': { $regex: location, $options: 'i' } },
            { 'userInfo.location.city': { $regex: location, $options: 'i' } }
          ]
        }
      });
    }

    // Add sorting
    const sortField = sortBy === 'hourlyRate' ? 'hourlyRate' : 
                     sortBy === 'completedJobs' ? 'completedJobs' :
                     sortBy === 'createdAt' ? 'createdAt' : 'rating.average';
    
    pipeline.push({
      $sort: { [sortField]: sortOrder === 'asc' ? 1 : -1 }
    });

    // Add pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    pipeline.push(
      { $skip: skip },
      { $limit: parseInt(limit) }
    );

    // Add projection
    pipeline.push({
      $project: {
        _id: 1,
        hourlyRate: 1,
        bio: 1,
        skills: 1,
        rating: 1,
        completedJobs: 1,
        totalEarnings: 1,
        status: 1,
        verification: 1,
        'userInfo.firstName': 1,
        'userInfo.lastName': 1,
        'userInfo.profileImage': 1,
        'userInfo.location': 1,
        'categoryInfo.name': 1,
        'categoryInfo.icon': 1,
        createdAt: 1
      }
    });

    // Execute aggregation
    const workers = await Worker.aggregate(pipeline);

    // Get total count for pagination
    const countPipeline = pipeline.slice(0, -3); // Remove skip, limit, and projection
    countPipeline.push({ $count: 'total' });
    const countResult = await Worker.aggregate(countPipeline);
    const total = countResult.length > 0 ? countResult[0].total : 0;

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      status: 'success',
      data: {
        workers,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          total,
          hasNextPage,
          hasPrevPage,
          limit: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get workers error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch workers'
    });
  }
});

// @route   GET /api/workers/nearby
// @desc    Get workers near a location
// @access  Public
router.get('/nearby', [
  query('latitude').isFloat().withMessage('Valid latitude is required'),
  query('longitude').isFloat().withMessage('Valid longitude is required'),
  query('radius').optional().isFloat({ min: 1, max: 100 }).withMessage('Radius must be between 1 and 100 km'),
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

    const { latitude, longitude, radius = 10, limit = 10 } = req.query;

    const workers = await Worker.aggregate([
      {
        $match: {
          status: 'active',
          'verification.isVerified': true
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userInfo'
        }
      },
      { $unwind: '$userInfo' },
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          distanceField: 'distance',
          maxDistance: parseFloat(radius) * 1000, // Convert km to meters
          spherical: true
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      { $unwind: '$categoryInfo' },
      {
        $project: {
          _id: 1,
          hourlyRate: 1,
          bio: 1,
          skills: 1,
          rating: 1,
          completedJobs: 1,
          distance: 1,
          'userInfo.firstName': 1,
          'userInfo.lastName': 1,
          'userInfo.profileImage': 1,
          'userInfo.location': 1,
          'categoryInfo.name': 1,
          'categoryInfo.icon': 1
        }
      },
      { $limit: parseInt(limit) }
    ]);

    res.json({
      status: 'success',
      data: {
        workers,
        searchLocation: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          radius: parseFloat(radius)
        }
      }
    });
  } catch (error) {
    console.error('Get nearby workers error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch nearby workers'
    });
  }
});

// @route   GET /api/workers/:id
// @desc    Get worker by ID
// @access  Public
router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid worker ID')
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

    const worker = await Worker.findById(req.params.id)
      .populate('user', 'firstName lastName profileImage location')
      .populate('category', 'name description icon')
      .populate('verification.verifiedBy', 'firstName lastName');

    if (!worker) {
      return res.status(404).json({
        status: 'error',
        message: 'Worker not found'
      });
    }

    if (worker.status !== 'active') {
      return res.status(404).json({
        status: 'error',
        message: 'Worker profile is not available'
      });
    }

    res.json({
      status: 'success',
      data: {
        worker: worker.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Get worker error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch worker'
    });
  }
});

// @route   POST /api/workers
// @desc    Create worker profile
// @access  Private (Worker only)
router.post('/', [
  authenticateToken,
  body('category').isMongoId().withMessage('Valid category ID is required'),
  body('skills').isArray({ min: 1 }).withMessage('At least one skill is required'),
  body('skills.*.name').notEmpty().withMessage('Skill name is required'),
  body('skills.*.level').isIn(['beginner', 'intermediate', 'expert']).withMessage('Invalid skill level'),
  body('skills.*.yearsOfExperience').isInt({ min: 0 }).withMessage('Years of experience must be a non-negative integer'),
  body('hourlyRate').isFloat({ min: 100, max: 10000 }).withMessage('Hourly rate must be between 100 and 10000'),
  body('bio').optional().isLength({ max: 1000 }).withMessage('Bio cannot exceed 1000 characters'),
  body('documents.idCard').notEmpty().withMessage('ID card is required'),
  body('documents.policeClearance').notEmpty().withMessage('Police clearance is required')
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

    // Check if user is a worker
    if (req.user.role !== 'worker') {
      return res.status(403).json({
        status: 'error',
        message: 'Only workers can create worker profiles'
      });
    }

    // Check if worker profile already exists
    const existingWorker = await Worker.findOne({ user: req.user._id });
    if (existingWorker) {
      return res.status(400).json({
        status: 'error',
        message: 'Worker profile already exists'
      });
    }

    // Verify category exists
    const category = await Category.findById(req.body.category);
    if (!category) {
      return res.status(400).json({
        status: 'error',
        message: 'Category not found'
      });
    }

    const worker = new Worker({
      user: req.user._id,
      ...req.body
    });

    await worker.save();

    // Update category worker count
    await category.updateWorkerCount();
    await category.updateAverageRate();

    res.status(201).json({
      status: 'success',
      message: 'Worker profile created successfully',
      data: {
        worker: worker.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Create worker error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create worker profile'
    });
  }
});

// @route   PUT /api/workers/:id
// @desc    Update worker profile
// @access  Private (Worker owner only)
router.put('/:id', [
  authenticateToken,
  param('id').isMongoId().withMessage('Invalid worker ID'),
  body('skills').optional().isArray({ min: 1 }).withMessage('At least one skill is required'),
  body('hourlyRate').optional().isFloat({ min: 100, max: 10000 }).withMessage('Hourly rate must be between 100 and 10000'),
  body('bio').optional().isLength({ max: 1000 }).withMessage('Bio cannot exceed 1000 characters')
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

    const worker = await Worker.findById(req.params.id);

    if (!worker) {
      return res.status(404).json({
        status: 'error',
        message: 'Worker profile not found'
      });
    }

    // Check if user owns this worker profile
    if (worker.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to update this profile'
      });
    }

    // Update worker profile
    Object.keys(req.body).forEach(key => {
      if (key !== 'user' && key !== 'verification' && key !== 'documents') {
        worker[key] = req.body[key];
      }
    });

    await worker.save();

    res.json({
      status: 'success',
      message: 'Worker profile updated successfully',
      data: {
        worker: worker.getPublicProfile()
      }
    });
  } catch (error) {
    console.error('Update worker error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update worker profile'
    });
  }
});

module.exports = router;
