const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT;
const BASE_URL = process.env.BASE_URL;
const DB_URL = process.env.DB_URL;

const userRouter = require("./routers/userRouter");
const serviceRouter = require("./routers/serviceRouter");
const bookingRouter = require("./routers/bookingRouter");
const paymentRouter = require("./routers/paymentRouter");
const { cleanupExpiredCancellations } = require("./controllers/bookingController");

app.use(
  cors({
    origin: BASE_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Don't use global multer middleware - let routers handle it with their own multer config

if (!DB_URL) {
  console.error("DB_URL is missing. Please set it in your .env file");
} else {
  mongoose
    .connect(DB_URL)
    .then(() => {
      console.log("MongoDB connected successfully");
      
      // Start cleanup job: Run every minute to delete expired cancelled bookings
      setInterval(cleanupExpiredCancellations, 60 * 1000);
      console.log("✅ Cleanup job started (runs every minute)");
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error.message);
    });
}

app.use("/api/v1/user", userRouter);
app.use("/api/v1/service", serviceRouter);
app.use("/api/v1/booking", bookingRouter);
app.use("/api/v1/payment", paymentRouter);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
