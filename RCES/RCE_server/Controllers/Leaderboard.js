const Leaderboard = require("../Models/Leaderboard");
const Contest = require("../Models/Contest");
const User = require("../Models/User");

// Get leaderboard for a specific contest
const getLeaderboard = async (req, res) => {
  try {
    const { contestId } = req.params;

    // Verify contest exists
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({
        success: false,
        message: "Contest not found",
      });
    }

    // Get leaderboard entries for this contest, sorted by score (descending) and time taken (ascending)
    const leaderboard = await Leaderboard.find({ contest: contestId })
      .populate({
        path: "user",
        select: "firstName lastName email",
      })
      .sort({ score: -1, timeTaken: 1 })
      .exec();

    return res.status(200).json({
      success: true,
      message: "Leaderboard fetched successfully",
      leaderboard: leaderboard,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update or create leaderboard entry
const updateLeaderboardEntry = async (req, res) => {
  try {
    const { contestId, userId, score, timeTaken } = req.body;

    // Verify contest and user exist
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return res.status(404).json({
        success: false,
        message: "Contest not found",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find existing entry or create new one
    let leaderboardEntry = await Leaderboard.findOne({
      contest: contestId,
      user: userId,
    });

    if (leaderboardEntry) {
      // Update existing entry if new score is higher or time is better
      if (score > leaderboardEntry.score || 
          (score === leaderboardEntry.score && timeTaken < leaderboardEntry.timeTaken)) {
        leaderboardEntry.score = score;
        leaderboardEntry.timeTaken = timeTaken;
        await leaderboardEntry.save();
      }
    } else {
      // Create new entry
      leaderboardEntry = new Leaderboard({
        contest: contestId,
        user: userId,
        score: score,
        timeTaken: timeTaken,
      });
      await leaderboardEntry.save();
    }

    return res.status(200).json({
      success: true,
      message: "Leaderboard entry updated successfully",
      entry: leaderboardEntry,
    });
  } catch (error) {
    console.error("Error updating leaderboard entry:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get user's leaderboard position for a contest
const getUserLeaderboardPosition = async (req, res) => {
  try {
    const { contestId, userId } = req.params;

    // Get all leaderboard entries for this contest, sorted
    const leaderboard = await Leaderboard.find({ contest: contestId })
      .sort({ score: -1, timeTaken: 1 })
      .exec();

    // Find user's position
    const userPosition = leaderboard.findIndex(entry => entry.user.toString() === userId);
    const userEntry = leaderboard[userPosition];

    if (userPosition === -1) {
      return res.status(200).json({
        success: true,
        message: "User not found in leaderboard",
        position: null,
        entry: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "User position fetched successfully",
      position: userPosition + 1,
      entry: userEntry,
      totalParticipants: leaderboard.length,
    });
  } catch (error) {
    console.error("Error fetching user position:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getLeaderboard,
  updateLeaderboardEntry,
  getUserLeaderboardPosition,
}; 