const express = require('express');
const router = express.Router();
const workerController = require('../controllers/workerController');
const { auth, requireWorker, requireAdmin } = require('../middleware/auth');
const { validateWorkerProfile } = require('../middleware/validation');

// Public routes
router.get('/search', workerController.searchWorkers);
router.get('/:id', workerController.getWorkerById);

// Worker routes (requires worker role)
router.post('/profile', auth, requireWorker, validateWorkerProfile, workerController.createWorkerProfile);
router.get('/profile/me', auth, requireWorker, workerController.getWorkerProfile);
router.put('/profile', auth, requireWorker, validateWorkerProfile, workerController.updateWorkerProfile);
router.put('/availability', auth, requireWorker, workerController.updateAvailability);

// Admin routes
router.get('/admin/all', auth, requireAdmin, workerController.getAllWorkers);
router.put('/admin/verify/:workerId', auth, requireAdmin, workerController.verifyWorker);

module.exports = router; 