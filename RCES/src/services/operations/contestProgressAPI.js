import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { contestProgressEndpoints } from "../apis";

// Destructure endpoints for clarity
const {
  GET_CONTEST_PROGRESS_API,
  UPDATE_CONTEST_PROGRESS_API,
} = contestProgressEndpoints;

// Fetch contest progress for a user and contest
export const fetchContestProgress = async ({ contestId, userId }) => {
  const toastId = toast.loading("Loading contest progress...");
  let result = null;
  try {
    const response = await apiConnector(
      "GET",
      `${GET_CONTEST_PROGRESS_API}/${contestId}/${userId}`
    );
    if (!response?.data?.success) {
      throw new Error("Could not fetch contest progress");
    }
    result = response.data.progress;
  } catch (error) {
    console.log("GET_CONTEST_PROGRESS_API ERROR:", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

// Update contest progress
export const updateContestProgress = async ({ contestId, userId, progressData }) => {
  const toastId = toast.loading("Updating contest progress...");
  let result = null;
  try {
    const response = await apiConnector(
      "PUT",
      `${UPDATE_CONTEST_PROGRESS_API}/${contestId}/${userId}`,
      progressData
    );
    if (!response?.data?.success) {
      throw new Error("Could not update contest progress");
    }
    toast.success("Progress updated!");
    result = response.data.progress;
  } catch (error) {
    console.log("UPDATE_CONTEST_PROGRESS_API ERROR:", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};