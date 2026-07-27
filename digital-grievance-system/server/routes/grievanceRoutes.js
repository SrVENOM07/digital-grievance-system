const express = require('express');
const router = express.Router();
const {
  createGrievance,
  getMyGrievances,
  getAllGrievances,
  updateGrievanceStatus
} = require('../controllers/grievanceController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// User routes
router.post('/', protect, upload.single('image'), createGrievance);
router.get('/my', protect, getMyGrievances);

// Admin routes
router.get('/admin/all', protect, adminOnly, getAllGrievances);
router.put('/:id/status', protect, adminOnly, updateGrievanceStatus);

module.exports = router;
