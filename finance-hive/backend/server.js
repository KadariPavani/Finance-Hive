const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config();
const mongoose = require("mongoose");
const contactRoutes = require("./routes/contactRoutes");
const authRoutes = require("./routes/authRoutes");
const { seedAdminUser } = require("./controllers/authController");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

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

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});








// const express = require("express");
// const nodemailer = require("nodemailer");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// require('dotenv').config();
// const mongoose = require("mongoose");
// const contactRoutes = require("./routes/contactRoutes");



// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // MongoDB connection
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => {
//   console.log("MongoDB connected");
// }).catch((err) => {
//   console.error("MongoDB connection error:", err);
// });


// // Use contact routes
// app.use("/api", contactRoutes);

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



//=================================================================================

// const express = require("express");
// const mongoose = require("mongoose");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const bodyParser = require("body-parser");
// const nodemailer = require("nodemailer");

// // Import Routes
// const contactRoutes = require("./routes/contactRoutes");
// const authRoutes = require("./routes/auth");
// const dashboardRoutes = require("./routes/dashboard");

// dotenv.config();
// const app = express();


// // Middleware
// app.use(cors());
// app.use(bodyParser.json());
// app.use(express.json()); // For parsing JSON

// // MongoDB Connection
// mongoose
//   .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// // Routes
// app.use("/api", contactRoutes); // Existing contact routes
// app.use("/api/auth", authRoutes); // Authentication routes
// app.use("/api/dashboard", dashboardRoutes); // Dashboard routes

// // Protect Dashboard Routes with JWT Authentication
// app.use("/api/dashboard", (req, res, next) => {
//   const token = req.header("x-auth-token");

//   if (!token) {
//     return res.status(401).json({ msg: "No token, authorization denied" });
//   }

//   try {
//     // Verify the token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded.user; // Attach user data to the request
//     next(); // Proceed to the next middleware or route handler
//   } catch (err) {
//     console.error(err);
//     res.status(401).json({ msg: "Token is not valid" });
//   }
// });

// // Nodemailer Example (if needed for contact forms or email notifications)
// app.post("/send-email", async (req, res) => {
//   const { to, subject, text } = req.body;
  
//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER, // Your email
//         pass: process.env.EMAIL_PASS, // Your email password
//       },
//     });

//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to,
//       subject,
//       text,
//     };

//     await transporter.sendMail(mailOptions);
//     res.status(200).json({ message: "Email sent successfully" });
//   } catch (err) {
//     console.error("Error sending email:", err);
//     res.status(500).json({ message: "Error sending email" });
//   }
// });

// // Start the Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
