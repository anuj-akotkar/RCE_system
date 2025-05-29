import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { submissionEndpoints } from "../apis";

// Destructure endpoints for clarity
const {
  SUBMIT_CODE_API,
  GET_SUBMISSIONS_API,
} = submissionEndpoints;

// Submit code for a question/contest
export const submitCode = async ({ contestId, questionId, language, code }) => {
  const toastId = toast.loading("Submitting code...");
  let result = null;
  try {
    const response = await apiConnector(
      "POST",
      SUBMIT_CODE_API,
      { contestId, questionId, language, code }
    );
    if (!response?.data?.success) {
      throw new Error("Could not submit code");
    }
    toast.success("Code submitted!");
    result = response.data.submission;
  } catch (error) {
    console.log("SUBMIT_CODE_API ERROR:", error);
    toast.error(error.message || "Failed to submit code");
    result = error.response?.data;
  }
  toast.dismiss(toastId);
  return result;
};

// Fetch all submissions for a user (optionally by contest)
export const fetchSubmissions = async (params) => {
  // params can be { userId, contestId }
  const toastId = toast.loading("Loading submissions...");
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      GET_SUBMISSIONS_API,
      null,
      null,
      params // Pass as query params
    );
    if (!response?.data?.success) {
      throw new Error("Could not fetch submissions");
    }
    result = response.data.submissions;
  } catch (error) {
    console.log("GET_SUBMISSIONS_API ERROR:", error);
    toast.error(error.message || "Failed to fetch submissions");
  }
  toast.dismiss(toastId);
  return result;
};