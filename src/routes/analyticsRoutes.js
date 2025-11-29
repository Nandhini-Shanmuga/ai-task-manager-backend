const express = require('express');
const AnalyticsController = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// All analytics routes are protected
router.use(protect);

router.get('/dashboard', AnalyticsController.getDashboardSummary);
router.get('/stats', AnalyticsController.getTaskStatsByDateRange);

module.exports = router;

