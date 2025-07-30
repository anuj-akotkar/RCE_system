import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { submissionEndpoints,contestresultpoints } from "../apis";

// // Map language to Judge0 language_id
// const languageMap = {
//   cpp: 54, // C++ (GCC 9.2.0)
//   python: 71, // Python (3.8.1)
//   java: 62, // Java (OpenJDK 13.0.1)

// };

// Run code (sample test cases)
export const runCode = async ({ language, code, questionId ,token,input}) => {
  const toastId = toast.loading("Running code...");
  let result = null;
  try {
    const response = await apiConnector(
      "POST",
      contestresultpoints.CONTEST_RESULT_RUN_API,
      { language, code, questionId,input },
       { Authorization: `Bearer ${token}` }
    );
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
export const submitCode = async ({ language, code, questionId ,token ,input}) => {
  const toastId = toast.loading("Submitting code...");
  let result = null;
  try {
    const response = await apiConnector(
      "POST",
      contestresultpoints.CONTEST_RESULT_SUBMIT_API,
      { language, code, questionId,input },
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

// Get all submissions for a specific question
export const getSubmissionsByQuestion = async (questionId, token) => {
  console.log("i am insideof getSubmissionByquestion");
  console.log("questionid form codeapi",questionId)
  const toastId = toast.loading("Loading submissions...");
  let result = null;
  try {
    // ✅ CORRECTED: The API endpoint URL construction and added token
    const response = await apiConnector(
      "GET",
      `${submissionEndpoints.GET_SUBMISSIONS_API}/question/${questionId}`,
      null,
      { Authorization: `Bearer ${token}` } // Pass the token in the header
    );
    console.log("in am here for reaponse in codeapi",response);
    if (!response?.data?.success) {
      throw new Error("Could not fetch submissions.");
    }
    result = response.data;
  } catch (error) {
    console.log("GET_SUBMISSIONS_BY_QUESTION_API ERROR:", error);
    toast.error(error.message || "Failed to fetch submissions");
    result = error.response?.data;
  }
  toast.dismiss(toastId);
  return result;
};

// Get a single submission by its ID
export const getSubmissionById = async (submissionId, token) => {
  const toastId = toast.loading("Loading submission details...");
  let result = null;
  try {
    // ✅ CORRECTED: The API endpoint URL construction and added token
    const response = await apiConnector(
      "GET",
      `${submissionEndpoints.GET_SUBMISSIONS_API}/${submissionId}`,
      null,
      { Authorization: `Bearer ${token}` } // Pass the token in the header
    );
    if (!response?.data?.success) {
      throw new Error("Could not fetch submission details.");
    }
    result = response.data;
  } catch (error) {
    console.log("GET_SUBMISSION_BY_ID_API ERROR:", error);
    toast.error(error.message || "Failed to fetch submission details");
    result = error.response?.data;
  }
  toast.dismiss(toastId);
  return result;
};