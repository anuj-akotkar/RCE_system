const express = require("express");
const router = express.Router();

// Import Controllers
const {
  getLeaderboard,
  updateLeaderboardEntry,
  getUserLeaderboardPosition,
} = require("../Controllers/Leaderboard");

// Import Middlewares
const { auth, isStudent } = require("../Middlewares/auth");

// --- Leaderboard Routes ---

// Get leaderboard for a specific contest (public route)
router.get("/:contestId", getLeaderboard);

// Update leaderboard entry (requires authentication)
router.post("/update", auth, isStudent, updateLeaderboardEntry);

// Get user's position in leaderboard for a contest
router.get("/:contestId/user/:userId", getUserLeaderboardPosition);

module.exports = router; 