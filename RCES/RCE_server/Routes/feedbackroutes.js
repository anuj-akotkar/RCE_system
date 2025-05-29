const express = require("express");
const router = express.Router();
const { auth, isStudent } = require("../Middlewares/auth");
const {
  createRating,
  getAverageRating,
  getAllRatingReview,
} = require("../Controllers/Feedback");

// Feedback (rating and review) routes
router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating/:contestId", getAverageRating);
router.get("/getReviews/:contestId", getAllRatingReview);

module.exports = router;