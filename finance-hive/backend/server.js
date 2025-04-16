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
const Visitor = require('./models/Visitor');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "https://finance-hive.netlify.app/", // Replace with your frontend URL
  credentials: true
}));
app.use(bodyParser.json());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("FinanceHive backend is live 🚀");
});


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

// Replace with MongoDB functions
const getVisitorCount = async () => {
  try {
    let visitor = await Visitor.findOne();
    if (!visitor) {
      visitor = await Visitor.create({ count: 0 });
    }
    return visitor.count;
  } catch (error) {
    console.error('Error getting visitor count:', error);
    return 0;
  }
};

const incrementVisitorCount = async () => {
  try {
    let visitor = await Visitor.findOne();
    if (!visitor) {
      visitor = new Visitor({ count: 1 });
    } else {
      visitor.count += 1;
      visitor.lastUpdated = new Date();
    }
    await visitor.save();
    return visitor.count;
  } catch (error) {
    console.error('Error incrementing visitor count:', error);
    throw error;
  }
};

// API to get visitor count
app.get("/api/visitor-count", async (req, res) => {
  try {
    const count = await getVisitorCount();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching visitor count' });
  }
});

// API to increment visitor count
app.post("/api/increment-visitor", async (req, res) => {
  try {
    const count = await incrementVisitorCount();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error incrementing visitor count' });
  }
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
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  console.log(`404: ${req.method} ${req.path}`);
  res.status(404).json({ message: 'Route not found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
