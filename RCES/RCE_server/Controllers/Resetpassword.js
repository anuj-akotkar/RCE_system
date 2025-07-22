const User = require("../Models/User");
const mailSender = require("../Utils/mailSender");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// ✅ Generate Reset Password Token
exports.resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required.",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User with this email does not exist.",
      });
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Set token and expiration in the database
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: Date.now() + 3600000,
      },
      { new: true }
    );
    console.log("Reset Password Token:", updatedDetails.resetPasswordToken);
    console.log("DETAILS", updatedDetails);

    // Send reset email
    const resetLink = `${process.env.FRONTEND_URL}/update-password/${token}`;
    const mailResult = await mailSender(
      email,
      "Password Reset Request",
      `Click here to reset your password: ${resetLink}`
    );
    if (typeof mailResult === "string" && mailResult.toLowerCase().includes("error")) {
      return res.status(500).json({
        success: false,
        message: "Failed to send reset email.",
      });
    }

    res.status(200).json({
      success: true,
      message: `Password reset email sent successfully, TO: ${email}`,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while generating the reset password token.",
      error: err.message,
    });
  }
};

// ✅ Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;
    console.log("RESET PASSWORD BODY:", req.body);

    if (confirmPassword !== password) {
      return res.json({
        success: false,
        message: "Password and Confirm Password Does not Match",
      });
    }

    // Hash the token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    console.log("Hashed Token:", hashedToken);

    // Find user by token and check expiration
    const userDetails = await User.findOne({ resetPasswordToken: hashedToken });
    if (!userDetails) {
      return res.json({
        success: false,
        message: "Token is Invalid",
      });
    }
    if (!(userDetails.resetPasswordExpires > Date.now())) {
      return res.status(403).json({
        success: false,
        message: `Token is Expired, Please Regenerate Your Token`,
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update user's password and clear reset token
    await User.findOneAndUpdate(
      { resetPasswordToken: hashedToken },
      {
        password: hashedPassword,
        resetPasswordToken: undefined,
        resetPasswordExpires: undefined,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while resetting the password.",
      error: err.message,
    });
  }
};