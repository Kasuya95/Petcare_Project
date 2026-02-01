const express = require("express");
const router = express.Router();
const {
  createPayment,
  uploadSlip,
  getPaymentById,
  updatePaymentStatus,
  getPaymentsByUser,
  getStats,
  getPendingBookings,
  approvePayment,
  rejectPayment,
  getAllPayments,
} = require("../controllers/paymentController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");
const uploadPaymentSlip = require("../middlewares/uploadPaymentSlip");

// Admin routes (must be defined BEFORE generic :id routes)
router.get("/admin/stats", authenticate, authorize("ADMIN"), getStats);
router.get("/admin/bookings/pending", authenticate, authorize("ADMIN"), getPendingBookings);
router.get("/admin/all", authenticate, authorize("ADMIN"), getAllPayments);
router.put("/admin/bookings/:id/approve", authenticate, authorize("ADMIN"), approvePayment);
router.put("/admin/bookings/:id/reject", authenticate, authorize("ADMIN"), rejectPayment);

// General routes
router.post("/", authenticate, createPayment);

router.post(
  "/:id/upload-slip",
  authenticate,
  uploadPaymentSlip.single("image"),
  uploadSlip
);

router.get("/", authenticate, getPaymentsByUser);
router.get("/:id", authenticate, getPaymentById);
router.put(
  "/:id/status",
  authenticate,
  authorize("ADMIN", "SERVICE"),
  updatePaymentStatus
);

module.exports = router;
