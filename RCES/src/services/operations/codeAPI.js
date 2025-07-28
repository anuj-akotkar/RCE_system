import { apiConnector } from "./apiconnector";
import { codeEndpoints } from "./apis";
import toast from "react-hot-toast";

const {
  RUN_CODE_API,
  SUBMIT_CODE_API,
  GET_SUBMISSIONS_API,
  GET_SUBMISSION_API,
  JUDGE0_HEALTH_API
} = codeEndpoints;

// Run code on sample test cases
export const runCode = async (questionId, language, code, token) => {
  const toastId = toast.loading("Running code...");
  try {
    const response = await apiConnector("POST", RUN_CODE_API, {
      questionId,
      language,
      code
    }, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to run code");
    }

    toast.dismiss(toastId);
    return response.data;
  } catch (error) {
    console.error("RUN CODE ERROR:", error);
    toast.dismiss(toastId);
    toast.error(error?.response?.data?.message || "Failed to run code");
    throw error;
  }
};

// Submit code for evaluation
export const submitCode = async (questionId, language, code, token) => {
  const toastId = toast.loading("Submitting solution...");
  try {
    const response = await apiConnector("POST", SUBMIT_CODE_API, {
      questionId,
      language,
      code
    }, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to submit code");
    }

    toast.dismiss(toastId);
    
    // Show success/failure toast based on result
    if (response.data.submission.passed) {
      toast.success("All test cases passed! 🎉");
    } else {
      toast.error(`${response.data.submission.passedTests}/${response.data.submission.totalTests} test cases passed`);
    }
    
    return response.data;
  } catch (error) {
    console.error("SUBMIT CODE ERROR:", error);
    toast.dismiss(toastId);
    toast.error(error?.response?.data?.message || "Failed to submit code");
    throw error;
  }
};

// Get submissions for a question
export const getSubmissions = async (questionId, page = 1, limit = 10, token) => {
  try {
    const response = await apiConnector(
      "GET", 
      `${GET_SUBMISSIONS_API}/${questionId}?page=${page}&limit=${limit}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to fetch submissions");
    }

    return response.data;
  } catch (error) {
    console.error("GET SUBMISSIONS ERROR:", error);
    throw error;
  }
};

// Check Judge0 health
export const checkJudge0Health = async (token) => {
  try {
    const response = await apiConnector("GET", JUDGE0_HEALTH_API, null, {
      Authorization: `Bearer ${token}`,
    });
    return response.data;
  } catch (error) {
    console.error("JUDGE0 HEALTH CHECK ERROR:", error);
    return { success: false, message: "Judge0 service unavailable" };
  }
};