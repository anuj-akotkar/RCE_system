import { toast } from "react-hot-toast";
import { judge0Run, judge0Submit } from "./judge0API";

// Map language to Judge0 language_id
const languageMap = {
  cpp: 54, // C++ (GCC 9.2.0)
  python: 71, // Python (3.8.1)
  java: 62, // Java (OpenJDK 13.0.1)
};

// Run code (sample test cases)
export const runCode = async ({ language, code, questionId, token, input }) => {
  const toastId = toast.loading("Running code...");
  let result = null;
  try {
    console.log("runCode called with:", { language, code, questionId, input });
    const language_id = languageMap[language] || 54;
    console.log("Using language_id:", language_id);
    result = await judge0Run({ source_code: code, language_id, stdin: input });
    console.log("judge0Run result:", result);
    toast.success("Code executed successfully!");
  } catch (error) {
    console.error("runCode error:", error);
    toast.error(error.message || "Failed to run code");
    result = { success: false, error: error.message };
  }
  toast.dismiss(toastId);
  return result;
};

// Submit code (full evaluation)
export const submitCode = async ({ language, code, questionId, input }) => {
  const toastId = toast.loading("Submitting code...");
  let result = null;
  try {
    const language_id = languageMap[language] || 54;
    result = await judge0Submit({ source_code: code, language_id, stdin: input });
    if (result.success) {
      toast.success("Code submitted successfully! All test cases passed!");
    } else {
      toast.success("Code submitted successfully!");
    }
  } catch (error) {
    toast.error(error.message || "Failed to submit code");
    result = { success: false, error: error.message };
  }
  toast.dismiss(toastId);
  return result;
};

// Get submissions by question (placeholder - implement if needed)
export const getSubmissionsByQuestion = async (questionId) => {
  const toastId = toast.loading("Loading submissions...");
  let result = null;
  try {
    // TODO: Implement if you need to fetch submissions from your backend
    result = { success: true, submissions: [] };
    toast.success("Submissions loaded!");
  } catch (error) {
    console.log("GET_SUBMISSIONS_API ERROR:", error);
    toast.error(error.message || "Failed to fetch submissions");
    result = { success: false, error: error.message };
  }
  toast.dismiss(toastId);
  return result;
};

// Get submission by ID (placeholder - implement if needed)
export const getSubmissionById = async (submissionId) => {
  const toastId = toast.loading("Loading submission details...");
  let result = null;
  try {
    // TODO: Implement if you need to fetch submission details from your backend
    result = { success: true, submission: {} };
    toast.success("Submission details loaded!");
  } catch (error) {
    console.log("GET_SUBMISSION_API ERROR:", error);
    toast.error(error.message || "Failed to fetch submission details");
    result = { success: false, error: error.message };
  }
  toast.dismiss(toastId);
  return result;
};