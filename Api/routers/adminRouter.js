const express = require('express');
const router = express.Router();
const { getStats, getPendingBookings, approvePayment, rejectPayment } = require('../controllers/adminController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

router.get('/stats', authenticate, authorize('ADMIN'), getStats);
router.get('/bookings/pending', authenticate, authorize('ADMIN'), getPendingBookings);
router.put('/bookings/:id/approve', authenticate, authorize('ADMIN'), approvePayment);
router.put('/bookings/:id/reject', authenticate, authorize('ADMIN'), rejectPayment);

module.exports = router;