import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { codeEndpoints } from "../apis";

// Run code (sample test cases)
export const runCode = async ({ language, code, input }) => {
  const toastId = toast.loading("Running code...");
  let result = null;
  try {
    const response = await apiConnector(
      "POST",
      codeEndpoints.RUN_CODE_API,
      { language, code, input }
    );
    if (!response?.data?.success) {
      throw new Error("Could not run code.");
    }
    result = response.data;
  } catch (error) {
    console.log("RUN_CODE_API ERROR:", error);
    toast.error(error.message || "Failed to run code");
    result = error.response?.data;
  }
  toast.dismiss(toastId);
  return result;
};

// Submit code (full evaluation)
export const submitCode = async ({ language, code, questionId }) => {
  const toastId = toast.loading("Submitting code...");
  let result = null;
  try {
    const response = await apiConnector(
      "POST",
      codeEndpoints.SUBMIT_CODE_API,
      { language, code, questionId }
    );
    if (!response?.data?.success) {
      throw new Error("Could not submit code.");
    }
    result = response.data;
  } catch (error) {
    console.log("SUBMIT_CODE_API ERROR:", error);
    toast.error(error.message || "Failed to submit code");
    result = error.response?.data;
  }
  toast.dismiss(toastId);
  return result;
};