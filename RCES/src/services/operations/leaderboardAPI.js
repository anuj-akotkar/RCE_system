import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { leaderboardEndpoints } from "../apis";

// Destructure endpoints for clarity
const {
  GET_LEADERBOARD_API,
} = leaderboardEndpoints;

// Fetch leaderboard for a contest
export const fetchLeaderboard = async (contestId, token) => {
  const toastId = toast.loading("Loading leaderboard...");
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      `${GET_LEADERBOARD_API}/${contestId}`,
      null,
      { Authorization: `Bearer ${token}` }
    );
    if (!response?.data?.success) {
      throw new Error("Could not fetch leaderboard");
    }
    result = response.data.leaderboard;
  } catch (error) {
    console.log("GET_LEADERBOARD_API ERROR:", error);
    toast.error(error.message || "Failed to fetch leaderboard");
  }
  toast.dismiss(toastId);
  return result;
};