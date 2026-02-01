const express = require('express');
const multer = require('multer');
const router = express.Router();
const { getAllServices, getServiceById, createService, updateService, deleteService } = require('../controllers/serviceController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

// ใช้ memory storage เพื่อให้ไฟล์อยู่ใน buffer
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.post('/', authenticate, authorize('ADMIN'), upload.single('image'), createService);
router.put('/:id', authenticate, authorize('ADMIN'), upload.single('image'), updateService);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteService);

module.exports = router;