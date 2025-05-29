const mongoose = require("mongoose");
const mailSender = require("../Utils/mailSender");
const emailTemplate = require("../Mail/template/emailVerificationTemplate");

// Define the OTP Schema
const OTPSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      validate: {
        validator: function (email) {
          // Simple email validation regex
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: "Please provide a valid email address",
      },
    },
    otp: {
      type: String,
      required: [true, "OTP is required"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 5, // Automatically delete the document after 5 minutes
    },
  },
  { timestamps: true }
);

// Define a function to send verification emails
async function sendVerificationEmail(email, otp) {
  try {
    const mailResponse = await mailSender(
      email,
      "Verification Email",
      emailTemplate(otp)
    );
    console.log("Email sent successfully: ", mailResponse.response);
  } catch (error) {
    console.error("Error occurred while sending email: ", error);
    throw error;
  }
}

// Define a pre-save hook to send the email after the document is saved
OTPSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      await sendVerificationEmail(this.email, this.otp);
    } catch (error) {
      return next(error); // Pass the error to the next middleware
    }
  }
  next();
});

// Prevent OverwriteModelError in dev
module.exports = mongoose.models.OTP || mongoose.model("OTP", OTPSchema);