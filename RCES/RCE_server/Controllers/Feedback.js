const Feedback = require("../Models/Feedback");
const Contest = require("../Models/Contest");
const mongoose = require("mongoose");

// ✅ Create a new rating and review
exports.createRating = async (req, res) => {
  try {
    const { contestId, rating, review } = req.body;
    const userId = req.user.id;

    // Validate contestId
    if (!mongoose.Types.ObjectId.isValid(contestId)) {
      return res.status(400).json({ success: false, message: "Invalid contest ID." });
    }

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5." });
    }

    // Create feedback
    const feedback = await Feedback.create({
      contest: contestId,
      user: userId,
      rating,
      review,
    });

    // Update contest with the new feedback
    await Contest.findByIdAndUpdate(contestId, { $push: { feedback: feedback._id } });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully.",
      feedback,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while submitting feedback.",
      error: err.message,
    });
  }
};

// ✅ Get the average rating for a contest
exports.getAverageRating = async (req, res) => {
  try {
    const { contestId } = req.params;

    // Validate contestId
    if (!mongoose.Types.ObjectId.isValid(contestId)) {
      return res.status(400).json({ success: false, message: "Invalid contest ID." });
    }

    // Calculate average rating
    const averageRating = await Feedback.aggregate([
      { $match: { contest: mongoose.Types.ObjectId(contestId) } },
      { $group: { _id: "$contest", averageRating: { $avg: "$rating" } } },
    ]);

    if (!averageRating.length) {
      return res.status(404).json({ success: false, message: "No ratings found for this contest." });
    }

    res.status(200).json({
      success: true,
      message: "Average rating retrieved successfully.",
      averageRating: averageRating[0].averageRating,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving the average rating.",
      error: err.message,
    });
  }
};

// ✅ Get all ratings and reviews for a contest
exports.getAllRatingReview = async (req, res) => {
  try {
    const { contestId } = req.params;

    // Validate contestId
    if (!mongoose.Types.ObjectId.isValid(contestId)) {
      return res.status(400).json({ success: false, message: "Invalid contest ID." });
    }

    // Fetch all feedback for the contest
    const feedback = await Feedback.find({ contest: contestId }).populate("user", "name email");

    if (!feedback.length) {
      return res.status(404).json({ success: false, message: "No feedback found for this contest." });
    }

    res.status(200).json({
      success: true,
      message: "Feedback retrieved successfully.",
      feedback,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving feedback.",
      error: err.message,
    });
  }
};