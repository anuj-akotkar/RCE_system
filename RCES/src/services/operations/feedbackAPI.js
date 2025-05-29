import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { feedbackEndpoints } from "../apis";

// Destructure endpoints for clarity
const {
  SUBMIT_FEEDBACK_API,
  GET_FEEDBACK_API,
} = feedbackEndpoints;

// Submit feedback (rating/review)
export const submitFeedback = async (feedbackData) => {
  const toastId = toast.loading("Submitting feedback...");
  let result = null;
  try {
    const response = await apiConnector(
      "POST",
      SUBMIT_FEEDBACK_API,
      feedbackData
    );
    if (!response?.data?.success) {
      throw new Error("Could not submit feedback");
    }
    toast.success("Feedback submitted!");
    result = response.data;
  } catch (error) {
    console.log("SUBMIT_FEEDBACK_API ERROR:", error);
    toast.error(error.message || "Failed to submit feedback");
    result = error.response?.data;
  }
  toast.dismiss(toastId);
  return result;
};

// Fetch feedback for a contest or user
export const fetchFeedback = async (query) => {
  // query can be { contestId } or { userId }
  const toastId = toast.loading("Loading feedback...");
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      GET_FEEDBACK_API,
      null,
      null,
      query // Pass query as params
    );
    if (!response?.data?.success) {
      throw new Error("Could not fetch feedback");
    }
    result = response.data.feedback;
  } catch (error) {
    console.log("GET_FEEDBACK_API ERROR:", error);
    toast.error(error.message || "Failed to fetch feedback");
  }
  toast.dismiss(toastId);
  return result;
};