const express = require('express');
const multer = require('multer');
const router = express.Router();
const { register, login, logout, getProfile, updateProfile, changePassword, getAllUsers, updateUserRole, deleteUser } = require('../controllers/userController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// Configure multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, upload.single('image'), updateProfile);
router.put('/change-password', authenticate, changePassword);
router.get('/all', authenticate, authorize('ADMIN'), getAllUsers);
router.put('/:id/role', authenticate, authorize('ADMIN'), updateUserRole);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteUser);

module.exports = router;