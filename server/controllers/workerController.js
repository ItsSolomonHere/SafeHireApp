const Worker = require('../models/Worker');
const User = require('../models/User');

// Create worker profile
const createWorkerProfile = async (req, res) => {
  try {
    const {
      category, skills, bio, hourlyRate, dailyRate,
      workingHours, preferredLocations, languages, experience
    } = req.body;

    // Check if worker profile already exists
    const existingWorker = await Worker.findOne({ userId: req.user._id });
    if (existingWorker) {
      return res.status(400).json({ message: 'Worker profile already exists' });
    }

    const worker = new Worker({
      userId: req.user._id,
      category,
      skills,
      bio,
      hourlyRate,
      dailyRate,
      workingHours,
      preferredLocations,
      languages,
      experience
    });

    await worker.save();

    // Populate user details
    await worker.populate('userId', 'name email phone location profileImage');

    res.status(201).json({
      message: 'Worker profile created successfully',
      worker
    });
  } catch (error) {
    console.error('Create worker profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get worker profile
const getWorkerProfile = async (req, res) => {
  try {
    const worker = await Worker.findOne({ userId: req.user._id })
      .populate('userId', 'name email phone location profileImage');

    if (!worker) {
      return res.status(404).json({ message: 'Worker profile not found' });
    }

    res.json(worker);
  } catch (error) {
    console.error('Get worker profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update worker profile
const updateWorkerProfile = async (req, res) => {
  try {
    const {
      category, skills, bio, hourlyRate, dailyRate,
      workingHours, preferredLocations, languages, experience
    } = req.body;

    const updateData = {};
    if (category) updateData.category = category;
    if (skills) updateData.skills = skills;
    if (bio) updateData.bio = bio;
    if (hourlyRate) updateData.hourlyRate = hourlyRate;
    if (dailyRate) updateData.dailyRate = dailyRate;
    if (workingHours) updateData.workingHours = workingHours;
    if (preferredLocations) updateData.preferredLocations = preferredLocations;
    if (languages) updateData.languages = languages;
    if (experience !== undefined) updateData.experience = experience;

    const worker = await Worker.findOneAndUpdate(
      { userId: req.user._id },
      updateData,
      { new: true, runValidators: true }
    ).populate('userId', 'name email phone location profileImage');

    if (!worker) {
      return res.status(404).json({ message: 'Worker profile not found' });
    }

    res.json({
      message: 'Worker profile updated successfully',
      worker
    });
  } catch (error) {
    console.error('Update worker profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update availability
const updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;

    const worker = await Worker.findOneAndUpdate(
      { userId: req.user._id },
      { availability },
      { new: true }
    ).populate('userId', 'name email phone location profileImage');

    if (!worker) {
      return res.status(404).json({ message: 'Worker profile not found' });
    }

    res.json({
      message: 'Availability updated successfully',
      worker
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search workers
const searchWorkers = async (req, res) => {
  try {
    const {
      category, location, availability, minRate, maxRate,
      skills, page = 1, limit = 10, sortBy = 'rating'
    } = req.query;

    const query = {};

    // Category filter
    if (category) {
      query.category = category;
    }

    // Location filter (fuzzy search)
    if (location) {
      query['userId.location'] = { $regex: location, $options: 'i' };
    }

    // Availability filter
    if (availability) {
      query.availability = availability;
    }

    // Rate filter
    if (minRate || maxRate) {
      query.hourlyRate = {};
      if (minRate) query.hourlyRate.$gte = parseInt(minRate);
      if (maxRate) query.hourlyRate.$lte = parseInt(maxRate);
    }

    // Skills filter
    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim());
      query.skills = { $in: skillsArray };
    }

    // Only show verified workers
    query.isVerified = true;

    const sortOptions = {};
    if (sortBy === 'rating') sortOptions.rating = -1;
    if (sortBy === 'rate') sortOptions.hourlyRate = 1;
    if (sortBy === 'experience') sortOptions.experience = -1;

    const workers = await Worker.find(query)
      .populate('userId', 'name email phone location profileImage')
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Worker.countDocuments(query);

    res.json({
      workers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Search workers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get worker by ID (public)
const getWorkerById = async (req, res) => {
  try {
    const worker = await Worker.findById(req.params.id)
      .populate('userId', 'name email phone location profileImage');

    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    res.json(worker);
  } catch (error) {
    console.error('Get worker by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all workers (admin)
const getAllWorkers = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = {};

    if (status) {
      query.isVerified = status === 'verified';
    }

    const workers = await Worker.find(query)
      .populate('userId', 'name email phone location profileImage')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Worker.countDocuments(query);

    res.json({
      workers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get all workers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify worker (admin)
const verifyWorker = async (req, res) => {
  try {
    const { workerId } = req.params;
    const { isVerified, backgroundCheck } = req.body;

    const worker = await Worker.findByIdAndUpdate(
      workerId,
      { isVerified, backgroundCheck },
      { new: true }
    ).populate('userId', 'name email phone location profileImage');

    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    res.json({
      message: 'Worker verification updated successfully',
      worker
    });
  } catch (error) {
    console.error('Verify worker error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createWorkerProfile,
  getWorkerProfile,
  updateWorkerProfile,
  updateAvailability,
  searchWorkers,
  getWorkerById,
  getAllWorkers,
  verifyWorker
}; 