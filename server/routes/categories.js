const express = require('express');
const { query, param, body, validationResult } = require('express-validator');
const Category = require('../models/Category');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', [
  query('featured').optional().isBoolean().withMessage('Featured must be a boolean'),
  query('active').optional().isBoolean().withMessage('Active must be a boolean')
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

    const { featured, active } = req.query;
    const filter = {};

    if (featured !== undefined) {
      filter.featured = featured === 'true';
    }

    if (active !== undefined) {
      filter.isActive = active === 'true';
    } else {
      filter.isActive = true; // Default to active categories
    }

    const categories = await Category.find(filter)
      .sort({ sortOrder: 1, name: 1 })
      .populate('parentCategory', 'name');

    res.json({
      status: 'success',
      data: {
        categories
      }
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch categories'
    });
  }
});

// @route   GET /api/categories/:id
// @desc    Get category by ID
// @access  Public
router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid category ID')
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

    const category = await Category.findById(req.params.id)
      .populate('parentCategory', 'name')
      .populate('subcategories', 'name description icon workerCount averageHourlyRate');

    if (!category) {
      return res.status(404).json({
        status: 'error',
        message: 'Category not found'
      });
    }

    res.json({
      status: 'success',
      data: {
        category
      }
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch category'
    });
  }
});

// @route   POST /api/categories
// @desc    Create new category (Admin only)
// @access  Private
router.post('/', [
  authenticateToken,
  requireAdmin,
  body('name').notEmpty().withMessage('Category name is required'),
  body('description').notEmpty().withMessage('Category description is required'),
  body('icon').notEmpty().withMessage('Category icon is required')
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

    const category = new Category(req.body);
    await category.save();

    res.status(201).json({
      status: 'success',
      message: 'Category created successfully',
      data: {
        category
      }
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create category'
    });
  }
});

// @route   PUT /api/categories/:id
// @desc    Update category (Admin only)
// @access  Private
router.put('/:id', [
  authenticateToken,
  requireAdmin,
  param('id').isMongoId().withMessage('Invalid category ID')
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

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        status: 'error',
        message: 'Category not found'
      });
    }

    res.json({
      status: 'success',
      message: 'Category updated successfully',
      data: {
        category
      }
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update category'
    });
  }
});

module.exports = router;

