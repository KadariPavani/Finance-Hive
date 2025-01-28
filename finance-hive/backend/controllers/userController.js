// const UserPayment = require("../models/UserPayment");

// exports.getUserDashboard = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     // Find the user by ID and return their payment details
//     const user = await UserPayment.findById(userId).select("name email mobileNumber payments");
//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     res.status(200).json({
//       message: "User dashboard fetched successfully.",
//       user,
//     });
//   } catch (error) {
//     console.error("Error fetching user dashboard:", error);
//     res.status(500).json({ message: "Server error fetching user dashboard." });
//   }
// };
