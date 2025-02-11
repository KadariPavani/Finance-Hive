const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();
const mongoose = require("mongoose");
const contactRoutes = require("./routes/contactRoutes");
const authRoutes = require("./routes/authRoutes");
const { seedAdminUser } = require("./controllers/authController");
const paymentRoutes = require("./routes/paymentRoutes");
const app = express();
const PORT = process.env.PORT || 5000;
const autoUpdateOverdueStatus = require('./utils/cronJobs');
const userRoutes = require('./routes/userRoutes');
const notificationRoutes = require('./routes/notifications');
const trackingRoutes = require('./routes/tracking');
const userPaymentsRoute = require('./routes/userPayments');

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your frontend URL
  credentials: true
}));
app.use(bodyParser.json());
// Add request logging for debugging
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
  // Seed admin user
  await seedAdminUser();
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

// Use routes
app.use("/api", contactRoutes);
app.use("/api", authRoutes);
app.use('/api', paymentRoutes);
app.use('/api', userRoutes);
app.use('/api/tracking', require('./routes/tracking'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api', userPaymentsRoute);

autoUpdateOverdueStatus();
app.use(express.json()); // Make sure this middleware is included

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Add 404 handler
app.use((req, res) => {
  console.log(`404: ${req.method} ${req.path}`);
  res.status(404).send('Route not found');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
