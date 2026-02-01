const Booking = require('../models/Booking.model');

exports.createBooking = async (req, res) => {
  try {
    console.log("=== CREATE BOOKING START ===");
    console.log("req.body:", req.body);
    console.log("req.user:", req.user);

    const { serviceId, bookingDate, bookingTime, petName, note } = req.body;
    const userId = req.authorId;

    if (!serviceId || !bookingDate || !bookingTime || !petName) {
      console.log("❌ Missing required fields");
      return res.status(400).json({
        message: "serviceId, bookingDate, bookingTime, petName are required",
      });
    }

    console.log("✅ All validations passed, creating booking...");

    const booking = new Booking({
      userId,
      serviceId,
      bookingDate,
      bookingTime,
      petName,
      note,
    });

    await booking.save();

    console.log("✅ Booking created successfully:", booking._id);
    res.status(201).json({
      message: "Booking Created Successfully.",
      booking,
    });
  } catch (error) {
    console.error("❌ Error in createBooking:", error);
    res.status(500).json({ error: "Server error at create booking", message: error.message });
  }
};

exports.getBookingsByUser = async (req, res) => {
  try {
    console.log("=== GET BOOKINGS BY USER START ===");
    console.log("req.user:", req.user);

    const Payment = require('../models/Payment.model');
    
    const bookings = await Booking.find({ userId: req.authorId }).populate('serviceId');
    console.log(`✅ Found ${bookings.length} bookings for user`);

    // Enrich bookings with payment status
    const enrichedBookings = await Promise.all(bookings.map(async (booking) => {
      const payment = await Payment.findOne({ bookingId: booking._id });
      return {
        ...booking.toObject(),
        paymentStatus: payment?.status || null,
        paymentId: payment?._id || null,
        slipUrl: payment?.slipUrl || null
      };
    }));

    res.json(enrichedBookings);
  } catch (error) {
    console.error("❌ Error in getBookingsByUser:", error);
    res.status(500).json({ error: "Server error at get bookings by user", message: error.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    console.log("=== GET ALL BOOKINGS START ===");
    console.log("req.user:", req.user);

    if (!req.user || req.user.role !== 'ADMIN') {
      console.log("❌ Unauthorized: not admin");
      return res.status(403).json({ message: "Only admins can view all bookings" });
    }

    const bookings = await Booking.find().populate('userId serviceId');
    console.log(`✅ Found ${bookings.length} total bookings`);

    res.json(bookings);
  } catch (error) {
    console.error("❌ Error in getAllBookings:", error);
    res.status(500).json({ error: "Server error at get all bookings", message: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    console.log("=== UPDATE BOOKING STATUS START ===");
    const { id } = req.params;
    const { status } = req.body;
    console.log("Booking ID:", id);
    console.log("New status:", status);
    console.log("req.user:", req.user);

    if (!req.user || (req.user.role !== 'ADMIN' && req.user.role !== 'SERVICE')) {
      console.log("❌ Unauthorized: not admin or service");
      return res.status(403).json({ message: "Only admins or service providers can update booking status" });
    }

    if (!id) {
      console.log("❌ No ID provided");
      return res.status(400).json({ message: "Booking ID is required" });
    }

    if (!status || !['PENDING', 'PAID', 'CANCELLED'].includes(status)) {
      console.log("❌ Invalid status");
      return res.status(400).json({ message: "Valid status is required (PENDING, PAID, CANCELLED)" });
    }

    const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true }).populate('userId serviceId');

    if (!booking) {
      console.log("❌ Booking not found");
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log("✅ Booking status updated successfully");
    res.json({
      message: "Booking Status Updated Successfully!",
      booking,
    });
  } catch (error) {
    console.error("❌ Error in updateBookingStatus:", error);
    res.status(500).json({ error: "Server error at update booking status", message: error.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    console.log("=== CANCEL BOOKING START ===");
    const { id } = req.params;
    console.log("Booking ID:", id);
    console.log("req.user:", req.user);

    if (!id) {
      console.log("❌ No ID provided");
      return res.status(400).json({ message: "Booking ID is required" });
    }

    // Find the booking first to check ownership
    const booking = await Booking.findById(id);
    if (!booking) {
      console.log("❌ Booking not found");
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user owns the booking or is admin/service
    if (booking.userId.toString() !== req.authorId && req.user.role !== 'ADMIN' && req.user.role !== 'SERVICE') {
      console.log("❌ Unauthorized: not owner, admin, or service");
      return res.status(403).json({ message: "You can only cancel your own bookings" });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      id, 
      { 
        status: 'CANCELLED',
        cancelledAt: new Date()
      }, 
      { new: true }
    ).populate('userId serviceId');

    console.log("✅ Booking cancelled successfully. Will auto-delete in 15 minutes");
    res.json({
      message: "Booking Cancelled Successfully! Will be deleted in 15 minutes.",
      booking: updatedBooking,
      cancelExpiresAt: new Date(Date.now() + 15 * 60 * 1000)
    });
  } catch (error) {
    console.error("❌ Error in cancelBooking:", error);
    res.status(500).json({ error: "Server error at cancel booking", message: error.message });
  }
};

// Undo cancel booking (restore within 15-minute window)
exports.undoCancel = async (req, res) => {
  try {
    console.log("=== UNDO CANCEL BOOKING START ===");
    const { id } = req.params;
    console.log("Booking ID:", id);
    console.log("req.user:", req.user);

    const booking = await Booking.findById(id);
    if (!booking) {
      console.log("❌ Booking not found");
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user owns the booking
    if (booking.userId.toString() !== req.authorId && req.user.role !== 'ADMIN') {
      console.log("❌ Unauthorized");
      return res.status(403).json({ message: "You can only undo your own bookings" });
    }

    // Check if booking is cancelled
    if (booking.status !== 'CANCELLED') {
      console.log("❌ Booking is not cancelled");
      return res.status(400).json({ message: "Booking is not cancelled" });
    }

    // Check if within 15-minute window
    const cancelledTime = new Date(booking.cancelledAt).getTime();
    const now = Date.now();
    const diffMinutes = (now - cancelledTime) / (1000 * 60);
    
    if (diffMinutes > 15) {
      console.log("❌ Undo window expired");
      return res.status(400).json({ message: "Cannot undo after 15 minutes" });
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      {
        status: 'PENDING',
        cancelledAt: null
      },
      { new: true }
    ).populate('userId serviceId');

    console.log("✅ Booking restored successfully");
    res.json({
      message: "Booking Restored Successfully!",
      booking: updatedBooking
    });
  } catch (error) {
    console.error("❌ Error in undoCancel:", error);
    res.status(500).json({ error: "Server error at undo cancel", message: error.message });
  }
};

// Cleanup job: Delete cancelled bookings after 15 minutes
exports.cleanupExpiredCancellations = async () => {
  try {
    console.log("=== CLEANUP EXPIRED CANCELLATIONS START ===");
    
    // Find bookings cancelled more than 15 minutes ago
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    
    const result = await Booking.deleteMany({
      status: 'CANCELLED',
      cancelledAt: { $lt: fifteenMinutesAgo }
    });
    
    if (result.deletedCount > 0) {
      console.log(`✅ Deleted ${result.deletedCount} expired cancelled bookings`);
    } else {
      console.log("✅ No expired bookings to delete");
    }
  } catch (error) {
    console.error("❌ Error in cleanupExpiredCancellations:", error);
  }
};