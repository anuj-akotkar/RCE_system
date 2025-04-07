const Feedback = require("../Models/Feedback");
const User = require("../Models/User");

exports.createFeedback = async (req, res) => {
  try {
    const { contestId, rating, comment } = req.body;
    const userId = req.user.id;

    const feedback = await Feedback.create({
      user: userId,
      contest: contestId,
      rating,
      comment,
    });

    res.status(201).json({ success: true, message: "Feedback submitted", data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getAllFeedback = async (req, res) => {
    try {
      const { contestId } = req.params;
  
      const feedbacks = await Feedback.find({ contest: contestId })
        .populate("user", "name email");
  
      res.status(200).json({ success: true, data: feedbacks });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  