const Payment = require("../models/Payment.model");
const supabase = require("../config/supabase.config");

/**
 * CREATE PAYMENT (JSON ONLY)
 * POST /payment
 */
exports.createPayment = async (req, res) => {
  try {
    console.log("=== CREATE PAYMENT ===");
    console.log("req.body:", req.body);
    console.log("req.user:", req.user);

    const { bookingId, amount, method } = req.body;

    if (!bookingId || !amount) {
      return res.status(400).json({
        message: "bookingId and amount are required",
        received: { bookingId, amount }
      });
    }

    // Generate unique transactionRef: bookingId_timestamp_random
    const uniqueTransactionRef = `${bookingId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const payment = await Payment.create({
      bookingId,
      amount: Number(amount),
      method: method || "PROMPTPAY",
      transactionRef: uniqueTransactionRef,
      status: "PENDING",
    });

    console.log("✅ Payment created successfully:", payment._id);
    return res.status(201).json({
      message: "Payment created successfully",
      payment,
    });
  } catch (err) {
    console.error("❌ CREATE PAYMENT ERROR:", err);
    return res.status(500).json({
      message: "Server error at create payment",
      error: err.message,
    });
  }
};


/**
 * UPLOAD PAYMENT SLIP (multipart/form-data)
 * POST /payment/:id/upload-slip
 */
exports.uploadSlip = async (req, res) => {
  try {
    console.log("=== UPLOAD SLIP ===");

    const { id } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // 🔒 file validation
    if (!["image/jpeg", "image/png"].includes(req.file.mimetype)) {
      return res.status(400).json({ message: "Invalid file type" });
    }

    if (req.file.size > 2 * 1024 * 1024) {
      return res.status(400).json({ message: "File too large (max 2MB)" });
    }

    const filePath = `payments/${payment._id}-${Date.now()}.png`;

    const { error } = await supabase.storage
      .from("payment-slips")
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true,
      });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage
      .from("payment-slips")
      .getPublicUrl(filePath);

    payment.slipUrl = data.publicUrl;
    await payment.save();

    res.json({
      message: "Slip uploaded",
      slipUrl: payment.slipUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error at upload slip",
      error: err.message,
    });
  }
};

/**
 * GET PAYMENT BY ID
 * GET /payment/:id
 */
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("bookingId");
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * UPDATE PAYMENT STATUS (ADMIN / SERVICE)
 * PUT /payment/:id/status
 */
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["PENDING", "PAID", "REJECTED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json({
      message: "Payment status updated",
      payment,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET PAYMENTS OF CURRENT USER
 * GET /payment
 */
exports.getPaymentsByUser = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate({
        path: "bookingId",
        match: { userId: req.authorId },
      })
      .sort({ createdAt: -1 });

    res.json(payments.filter((p) => p.bookingId));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET ADMIN STATS (ADMIN ONLY)
 * GET /payment/admin/stats
 */
exports.getStats = async (req, res) => {
  try {
    console.log("=== GET ADMIN STATS START ===");
    console.log("req.user:", req.user);

    if (!req.user || req.user.role !== 'ADMIN') {
      console.log("❌ Unauthorized: not admin");
      return res.status(403).json({ message: "Only admins can access stats" });
    }

    const Booking = require('../models/Booking.model');
    const User = require('../models/User.model');

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Get stats
    const [todayBookings, pendingPayments, totalUsers, totalRevenue] = await Promise.all([
      Booking.countDocuments({
        createdAt: { $gte: today, $lt: tomorrow }
      }),
      Payment.countDocuments({ status: 'PENDING' }),
      User.countDocuments(),
      Payment.aggregate([
        { $match: { status: 'PAID' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    ]);

    const stats = {
      todayBookings,
      pendingPayments,
      totalUsers,
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0
    };

    console.log("✅ Stats:", stats);
    res.json(stats);
  } catch (error) {
    console.error("❌ Error in getStats:", error);
    res.status(500).json({ error: "Server error at get stats", message: error.message });
  }
};

/**
 * GET PENDING BOOKINGS (ADMIN ONLY)
 * GET /payment/admin/bookings/pending
 */
exports.getPendingBookings = async (req, res) => {
  try {
    console.log("=== GET PENDING BOOKINGS START ===");
    console.log("req.user:", req.user);

    if (!req.user || req.user.role !== 'ADMIN') {
      console.log("❌ Unauthorized: not admin");
      return res.status(403).json({ message: "Only admins can access pending bookings" });
    }

    // Get pending payments with booking and user info
    const pendingPayments = await Payment.find({ status: 'PENDING' })
      .populate({
        path: 'bookingId',
        populate: [
          { path: 'userId', select: 'username' },
          { path: 'serviceId', select: 'name price' }
        ]
      })
      .exec();

    // Format the data for frontend
    const formattedBookings = pendingPayments.map(payment => ({
      id: payment.bookingId?._id,
      user: payment.bookingId?.userId,
      service: payment.bookingId?.serviceId,
      price: payment.bookingId?.serviceId?.price || 0,
      slipUrl: payment.slipUrl
    })).filter(b => b.id); // Filter out null bookings

    console.log(`✅ Found ${formattedBookings.length} pending bookings`);
    res.json(formattedBookings);
  } catch (error) {
    console.error("❌ Error in getPendingBookings:", error);
    res.status(500).json({ error: "Server error at get pending bookings", message: error.message });
  }
};

/**
 * APPROVE PAYMENT (ADMIN ONLY)
 * PUT /payment/admin/bookings/:id/approve
 */
exports.approvePayment = async (req, res) => {
  try {
    console.log("=== APPROVE PAYMENT START ===");
    const { id } = req.params;
    console.log("Booking ID:", id);
    console.log("req.user:", req.user);

    if (!req.user || req.user.role !== 'ADMIN') {
      console.log("❌ Unauthorized: not admin");
      return res.status(403).json({ message: "Only admins can approve payments" });
    }

    if (!id) {
      console.log("❌ No ID provided");
      return res.status(400).json({ message: "Booking ID is required" });
    }

    // Find payment by bookingId
    const payment = await Payment.findOne({ bookingId: id });
    if (!payment) {
      console.log("❌ Payment not found");
      return res.status(404).json({ message: "Payment not found" });
    }

    // Update payment status to PAID
    payment.status = 'PAID';
    await payment.save();

    // Update booking status to PAID as well
    const Booking = require('../models/Booking.model');
    await Booking.findByIdAndUpdate(id, { status: 'PAID' });

    console.log("✅ Payment approved successfully");
    res.json({
      message: "Payment approved successfully",
      payment,
    });
  } catch (error) {
    console.error("❌ Error in approvePayment:", error);
    res.status(500).json({ error: "Server error at approve payment", message: error.message });
  }
};

/**
 * REJECT PAYMENT (ADMIN ONLY)
 * PUT /payment/admin/bookings/:id/reject
 */
exports.rejectPayment = async (req, res) => {
  try {
    console.log("=== REJECT PAYMENT START ===");
    const { id } = req.params;
    console.log("Booking ID:", id);
    console.log("req.user:", req.user);

    if (!req.user || req.user.role !== 'ADMIN') {
      console.log("❌ Unauthorized: not admin");
      return res.status(403).json({ message: "Only admins can reject payments" });
    }

    if (!id) {
      console.log("❌ No ID provided");
      return res.status(400).json({ message: "Booking ID is required" });
    }

    // Find payment by bookingId
    const payment = await Payment.findOne({ bookingId: id });
    if (!payment) {
      console.log("❌ Payment not found");
      return res.status(404).json({ message: "Payment not found" });
    }

    // Update payment status to REJECTED
    payment.status = 'REJECTED';
    await payment.save();

    // Set booking status back to PENDING so user can re-submit payment
    const Booking = require('../models/Booking.model');
    await Booking.findByIdAndUpdate(id, { status: 'PENDING' });

    console.log("✅ Payment rejected successfully");
    res.json({
      message: "Payment rejected successfully",
    });
  } catch (error) {
    console.error("❌ Error in rejectPayment:", error);
    res.status(500).json({ error: "Server error at reject payment", message: error.message });
  }
};

/**
 * GET ALL PAYMENTS (ADMIN ONLY)
 * GET /payment/all
 */
exports.getAllPayments = async (req, res) => {
  try {
    console.log("=== GET ALL PAYMENTS START ===");
    console.log("req.user:", req.user);

    if (!req.user || req.user.role !== 'ADMIN') {
      console.log("❌ Unauthorized: not admin");
      return res.status(403).json({ message: "Only admins can access all payments" });
    }

    const payments = await Payment.find()
      .populate({
        path: 'bookingId',
        populate: [
          { path: 'userId', select: 'username' },
          { path: 'serviceId', select: 'name price' }
        ]
      })
      .sort({ createdAt: -1 });

    console.log(`✅ Found ${payments.length} total payments`);
    res.json(payments);
  } catch (error) {
    console.error("❌ Error in getAllPayments:", error);
    res.status(500).json({ error: "Server error at get all payments", message: error.message });
  }
};
