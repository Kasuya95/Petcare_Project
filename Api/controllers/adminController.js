const Booking = require('../models/Booking.model');
const Payment = require('../models/Payment.model');
const User = require('../models/User.model');

exports.getStats = async (req, res) => {
  try {
    console.log("=== GET ADMIN STATS START ===");
    console.log("req.user:", req.user);

    if (!req.user || req.user.role !== 'ADMIN') {
      console.log("❌ Unauthorized: not admin");
      return res.status(403).json({ message: "Only admins can access stats" });
    }

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
      price: payment.bookingId?.serviceId?.price || 0
    })).filter(b => b.id); // Filter out null bookings

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

    // Update status to PAID
    payment.status = 'PAID';
    await payment.save();

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

    // Update status to PENDING or delete? For reject, maybe keep as PENDING or add REJECTED status
    // For simplicity, delete the payment
    await Payment.findByIdAndDelete(payment._id);

    console.log("✅ Payment rejected successfully");
    res.json({
      message: "Payment rejected successfully",
    });
  } catch (error) {
    console.error("❌ Error in rejectPayment:", error);
    res.status(500).json({ error: "Server error at reject payment", message: error.message });
  }
};

    console.log("✅ Pending bookings fetched successfully");
    res.json(formattedBookings);
  } catch (error) {
    console.error("❌ Error in getPendingBookings:", error);
    res.status(500).json({ error: "Server error at get pending bookings", message: error.message });
  }
};