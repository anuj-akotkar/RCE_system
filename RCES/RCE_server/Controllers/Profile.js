const User = require("../Models/User");
const Contest = require("../Models/Contest");

// Delete user profile
exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    res.status(200).json({ success: true, message: "Profile deleted successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: "An error occurred while deleting the profile.", error: err.message });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updates = req.body;
    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: "No updates provided." });
    }
    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    res.status(200).json({ success: true, message: "Profile updated successfully.", user: updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, message: "An error occurred while updating the profile.", error: err.message });
  }
};

// Get all user details
exports.getAllUserDetails = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      console.error("getAllUserDetails: No user info in request", { user: req.user });
      return res.status(401).json({ success: false, message: "Unauthorized: No user info in request." });
    }
    
    const userId = req.user.id;
    console.log("getAllUserDetails: Fetching user with ID:", userId);
    
    const user = await User.findById(userId).populate("additionalDetails");
    if (!user) {
      console.error("getAllUserDetails: User not found for ID:", userId);
      return res.status(404).json({ success: false, message: "User not found." });
    }
    
    console.log("getAllUserDetails: Successfully fetched user:", user._id);
    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error("getAllUserDetails: Error occurred:", err);
    res.status(500).json({ success: false, message: "An error occurred while fetching user details.", error: err.message });
  }
};

// Get enrolled contests/courses
exports.getEnrolledContests = async (req, res) => {
  try {
    const userId = req.user.id;
    // Assuming User model has a field 'enrolledContests' as an array of contest IDs
    const user = await User.findById(userId).populate("enrolledContests");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    res.status(200).json({ success: true, enrolledContests: user.enrolledContests || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: "An error occurred while fetching enrolled contests.", error: err.message });
  }
};

// Update display picture
exports.updateDisplayPicture = async (req, res) => {
  try {
    const userId = req.user.id;
    const { profilePic } = req.body;
    if (!profilePic) {
      return res.status(400).json({ success: false, message: "Profile picture URL is required." });
    }
    const updatedUser = await User.findByIdAndUpdate(userId, { profilePic }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    res.status(200).json({ success: true, message: "Profile picture updated successfully.", user: updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, message: "An error occurred while updating the profile picture.", error: err.message });
  }
};

// Instructor dashboard
exports.instructorDashboard = async (req, res) => {
  try {
    const instructorId = req.user.id;
    // Assuming Contest model has an 'instructor' field
    const contests = await Contest.find({ instructor: instructorId });
    res.status(200).json({ success: true, contests });
  } catch (err) {
    res.status(500).json({ success: false, message: "An error occurred while fetching instructor dashboard.", error: err.message });
  }
};