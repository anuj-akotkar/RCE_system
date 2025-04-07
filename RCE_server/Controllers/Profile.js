const User = require("../Models/User");

exports.updateProfile = async (req, res) => {
  try {
    const { userId, name, bio, phoneNumber } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(name && { name }),
        ...(bio && { bio }),
        ...(phoneNumber && { phoneNumber }),
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: err.message,
    });
  }
};
exports.deleteProfile = async (req, res) => {
    try {
      const { userId } = req.body;
  
      await User.findByIdAndDelete(userId);
  
      res.status(200).json({
        success: true,
        message: "Profile deleted successfully",
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Failed to delete profile",
        error: err.message,
      });
    }
  };
  exports.updateProfilePic = async (req, res) => {
    try {
      const { userId, profilePicUrl } = req.body;
  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: profilePicUrl },
        { new: true }
      );
  
      res.status(200).json({
        success: true,
        message: "Profile picture updated",
        user: updatedUser,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Failed to update profile picture",
        error: err.message,
      });
    }
  };
  exports.getEnrolledContests = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const user = await User.findById(userId).populate("enrolledContests");
  
      res.status(200).json({
        success: true,
        enrolledContests: user.enrolledContests,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch enrolled contests",
        error: err.message,
      });
    }
  };
  exports.getAllCreatedContests = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const user = await User.findById(userId).populate("createdContests");
  
      res.status(200).json({
        success: true,
        createdContests: user.createdContests,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Failed to fetch created contests",
        error: err.message,
      });
    }
  };
        