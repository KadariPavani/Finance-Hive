// routes/feedbackRoutes.js
const express = require("express");
const Feedback = require("../models/Feedback");

const router = express.Router();

// Submit feedback
router.post("/", async (req, res) => {
  const { firstName, lastName, email, feedback } = req.body;

  try {
    if (!firstName || !lastName || !email || !feedback) {
      return res.status(400).json({ msg: "All fields are required." });
    }

    const newFeedback = new Feedback({ firstName, lastName, email, feedback });
    await newFeedback.save();

    res.status(201).json({ msg: "Feedback submitted successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error submitting feedback", error: error.message });
  }
});

// Get all feedback (Admin only)
router.get("/", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ submittedAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error fetching feedback", error: error.message });
  }
});

module.exports = router;
