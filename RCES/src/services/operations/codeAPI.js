import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { codeEndpoints } from "../apis";

// Map language to Judge0 language_id
const languageMap = {
  cpp: 54, // C++ (GCC 9.2.0)
  python: 71, // Python (3.8.1)
  java: 62, // Java (OpenJDK 13.0.1)
};

// Run code (sample test cases)
export const runCode = async ({ language, code, questionId ,token,input}) => {
  console.log("Running code with language form codeapi:", language);
  console.log("Running code with code form codeapi:", code);
  const toastId = toast.loading("Running code...");
  let result = null;
  try {
    console.log("Token being sent:", token);
    const response = await apiConnector(
      "POST",
      codeEndpoints.RUN_CODE_API,
      { language, code, questionId },
      { Authorization: `Bearer ${token}` }
    );
    console.log("Run code response form codeapi:", response);
    if (!response?.data?.success) {
      throw new Error("Could not run code.");
    }
    result = response.data;
    toast.success("Code executed successfully!");
  } catch (error) {
    console.log("RUN_CODE_API ERROR:", error);
    toast.error(error.message || "Failed to run code");
    result = error.response?.data;
  }
  toast.dismiss(toastId);
  return result;
};

// Submit code (full evaluation)
export const submitCode = async ({ language, code, questionId, token, input }) => {
  const toastId = toast.loading("Submitting code...");
  let result = null;
  try {
    const response = await apiConnector(
      "POST",
      codeEndpoints.SUBMIT_CODE_API,
      { language, code, questionId, input },
      { Authorization: `Bearer ${token}` }
    );
      if (!response?.data?.success) {
      throw new Error("Could not submit code.");
    }
    result = response.data;
    if (result.submission?.status === 'Accepted') {
      toast.success("Code submitted successfully! All test cases passed!");
    } else {
      toast.success("Code submitted successfully!");
    }
  } catch (error) {
    console.log("SUBMIT_CODE_API ERROR:", error);
    toast.error(error.message || "Failed to submit code");
    result = error.response?.data;
  }
  toast.dismiss(toastId);
  return result;
};

// Get submissions by question
export const getSubmissionsByQuestion = async (questionId) => {
  const toastId = toast.loading("Loading submissions...");
  let result = null;
  try {
    const response = await apiConnector(
      "GET",
      `${codeEndpoints.SUBMIT_CODE_API.replace('/submit', '')}/question/${questionId}`
    );
    if (!response?.data?.success) {
      throw new Error("Could not fetch submissions.");
    }
    result = response.data;
    toast.success("Submissions loaded!");
  } catch (error) {
    console.log("GET_SUBMISSIONS_API ERROR:", error);
    toast.error(error.message || "Failed to fetch submissions");
    result = error.response?.data;
  }
  toast.dismiss(toastId);
  return result;
};

// Get submission by ID
export const getSubmissionById = async (submissionId) => {
  const toastId = toast.loading("Loading submission details...");
  let result = null;
  try {
    const response = await apiConnector(
      "GET",
      `${codeEndpoints.SUBMIT_CODE_API.replace('/submit', '')}/${submissionId}`
    );
    if (!response?.data?.success) {
      throw new Error("Could not fetch submission details.");
    }
    result = response.data;
    toast.success("Submission details loaded!");
  } catch (error) {
    console.log("GET_SUBMISSION_API ERROR:", error);
    toast.error(error.message || "Failed to fetch submission details");
    result = error.response?.data;
  }
  toast.dismiss(toastId);
  return result;
};