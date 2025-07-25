import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { submissionEndpoints, codeEndpoints } from "../apis";

// Destructure endpoints for clarity
const {
  GET_SUBMISSIONS_API,
  GET_SUBMISSION_BY_ID_API,
} = submissionEndpoints;

const { SUBMIT_CODE_API } = codeEndpoints;

// Submit code for a question/contest
export const submitCode = async ({ questionId, language, code }) => {
  const toastId = toast.loading("Submitting code...");
  let result = null;
  try {
    const response = await apiConnector(
      "POST",
      SUBMIT_CODE_API,
      { questionId, language, code }
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

// Fetch submissions for a specific question
export const fetchSubmissionsByQuestion = async ({ questionId }) => {
  const toastId = toast.loading("Loading submissions...");
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      `${GET_SUBMISSIONS_API}/${questionId}`
    );
    if (!response?.data?.success) {
      throw new Error("Could not fetch submissions");
    }
    result = response.data.submissions;
  } catch (error) {
    console.log("GET_SUBMISSIONS_BY_QUESTION_API ERROR:", error);
    toast.error(error.message || "Failed to fetch submissions");
  }
  toast.dismiss(toastId);
  return result;
};

// Fetch a single submission by ID
export const fetchSubmissionById = async ({ submissionId }) => {
  const toastId = toast.loading("Loading submission...");
  let result = null;
  try {
    const response = await apiConnector(
      "GET",
      `${GET_SUBMISSION_BY_ID_API}/${submissionId}`
    );
    if (!response?.data?.success) {
      throw new Error("Could not fetch submission");
    }
    result = response.data.submission;
  } catch (error) {
    console.log("GET_SUBMISSION_BY_ID_API ERROR:", error);
    toast.error(error.message || "Failed to fetch submission");
  }
  toast.dismiss(toastId);
  return result;
};