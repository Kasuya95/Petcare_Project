const express = require('express');
const router = express.Router();
const { createBooking, getBookingsByUser, getAllBookings, updateBookingStatus, cancelBooking, undoCancel } = require('../controllers/bookingController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

router.post('/', authenticate, createBooking);
router.get('/my', authenticate, getBookingsByUser);
router.get('/', authenticate, authorize('ADMIN'), getAllBookings);
router.put('/:id/status', authenticate, authorize('ADMIN', 'SERVICE'), updateBookingStatus);
router.put('/:id/cancel', authenticate, cancelBooking);
router.put('/:id/undo-cancel', authenticate, undoCancel);

module.exports = router;