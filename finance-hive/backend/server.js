const express = require("express");
const fs = require("fs");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
require("dotenv").config();

const contactRoutes = require("./routes/contactRoutes");
const authRoutes = require("./routes/authRoutes");
const { seedAdminUser } = require("./controllers/authController");
const paymentRoutes = require("./routes/paymentRoutes");
const autoUpdateOverdueStatus = require("./utils/cronJobs");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notifications");
const trackingRoutes = require("./routes/tracking");
const userPaymentsRoute = require("./routes/userPayments");
const organizerRoutes = require("./routes/organizerRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const FILE_PATH = "visitorCount.json";

// Middleware
app.use(cors({
  origin: "http://localhost:3000", // Replace with your frontend URL
  credentials: true
}));
app.use(bodyParser.json());
app.use(express.json());

// Request logging for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log("MongoDB connected");
  await seedAdminUser(); // Seed admin user
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

// Read visitor count
const readVisitorCount = () => {
  try {
    const data = fs.readFileSync(FILE_PATH, "utf8");
    return JSON.parse(data).count || 0;
  } catch (error) {
    return 0;
  }
};

// Write visitor count
const writeVisitorCount = (count) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify({ count }), "utf8");
};

// API to get visitor count
app.get("/api/visitor-count", (req, res) => {
  const count = readVisitorCount();
  res.json({ count });
});

// API to increment visitor count
app.post("/api/increment-visitor", (req, res) => {
  let count = readVisitorCount();
  count += 1;
  writeVisitorCount(count);
  res.json({ count });
});

// Use routes
app.use("/api", contactRoutes);
app.use("/api", authRoutes);
app.use("/api", paymentRoutes);
app.use("/api", userRoutes);
app.use("/api/tracking", trackingRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api", userPaymentsRoute);
app.use("/api/organizer", organizerRoutes);
// Start cron job
autoUpdateOverdueStatus();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// 404 handler
app.use((req, res) => {
  console.log(`404: ${req.method} ${req.path}`);
  res.status(404).send("Route not found");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
