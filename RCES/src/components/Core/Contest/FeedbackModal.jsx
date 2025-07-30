import React, { useState } from "react";
import { FaStar, FaHeart, FaThumbsUp, FaSmile } from "react-icons/fa";

const FeedbackModal = ({ isOpen, onClose, contestTitle, onSubmitFeedback }) => {
  const [rating, setRating] = useState(0);
  const [difficulty, setDifficulty] = useState("");
  const [enjoyment, setEnjoyment] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Please provide a rating");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitFeedback({
        rating,
        difficulty,
        enjoyment,
        feedback,
        contestTitle
      });
    } catch (error) {
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset form
    setRating(0);
    setDifficulty("");
    setEnjoyment("");
    setFeedback("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <FaHeart className="text-red-500 text-4xl mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
          <p className="text-gray-300">
            Thank you for participating in <span className="text-blue-400 font-semibold">{contestTitle}</span>
          </p>
          <p className="text-gray-400 text-sm mt-2">
            We'd love to hear your feedback to improve our contests!
          </p>
        </div>

        <div className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-white font-semibold mb-3">
              How would you rate this contest? *
            </label>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-2xl transition-colors ${
                    star <= rating ? "text-yellow-400" : "text-gray-500"
                  }`}
                >
                  <FaStar />
                </button>
              ))}
            </div>
            <p className="text-center text-gray-400 text-sm mt-1">
              {rating === 0 && "Please select a rating"}
              {rating === 1 && "Poor"}
              {rating === 2 && "Fair"}
              {rating === 3 && "Good"}
              {rating === 4 && "Very Good"}
              {rating === 5 && "Excellent"}
            </p>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-white font-semibold mb-3">
              How difficult was this contest?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["Easy", "Medium", "Hard"].map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`py-2 px-4 rounded-lg transition-colors ${
                    difficulty === level
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Enjoyment */}
          <div>
            <label className="block text-white font-semibold mb-3">
              Did you enjoy this contest?
            </label>
            <div className="flex space-x-4">
              <button
                onClick={() => setEnjoyment("Yes")}
                className={`flex items-center space-x-2 py-2 px-4 rounded-lg transition-colors ${
                  enjoyment === "Yes"
                    ? "bg-green-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                <FaThumbsUp />
                <span>Yes</span>
              </button>
              <button
                onClick={() => setEnjoyment("No")}
                className={`flex items-center space-x-2 py-2 px-4 rounded-lg transition-colors ${
                  enjoyment === "No"
                    ? "bg-red-600 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                <FaSmile />
                <span>No</span>
              </button>
            </div>
          </div>

          {/* Additional Feedback */}
          <div>
            <label className="block text-white font-semibold mb-3">
              Additional Comments (Optional)
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Share your thoughts, suggestions, or any issues you encountered..."
              className="w-full bg-gray-700 text-white rounded-lg p-3 border border-gray-600 focus:border-blue-500 focus:outline-none resize-none"
              rows="4"
            />
          </div>

          {/* Submit Button */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleClose}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              Skip Feedback
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                "Submit Feedback"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackModal; 