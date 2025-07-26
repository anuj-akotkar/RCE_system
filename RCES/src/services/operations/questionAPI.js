import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { profileEndpoints, questionEndpoints } from "../apis";

// Destructure endpoints for clarity
const {
  GET_USER_PROFILE_API,
  UPDATE_USER_PROFILE_API,
  GET_USER_CONTESTS_API,
} = profileEndpoints;

// Fetch user profile
export const fetchUserProfile = async (token) => {
  const toastId = toast.loading("Loading profile...");
  let result = null;
  try {
    const response = await apiConnector(
      "GET",
      GET_USER_PROFILE_API,
      null,
      { Authorization: `Bearer ${token}` }
    );
    if (!response?.data?.success) {
      throw new Error(response.data.message || "Could not fetch profile");
    }
    result = response.data.profile;
  } catch (error) {
    console.log("GET_USER_PROFILE_API ERROR:", error);
    toast.error(error.message || "Could not fetch profile");
  }
  toast.dismiss(toastId);
  return result;
};

// Update user profile
export const updateUserProfile = async (token, updateData) => {
  const toastId = toast.loading("Updating profile...");
  let result = null;
  try {
    const response = await apiConnector(
      "PUT",
      UPDATE_USER_PROFILE_API,
      updateData,
      { Authorization: `Bearer ${token}` }
    );
    if (!response?.data?.success) {
      throw new Error(response.data.message || "Could not update profile");
    }
    toast.success("Profile updated!");
    result = response.data.profile;
  } catch (error) {
    console.log("UPDATE_USER_PROFILE_API ERROR:", error);
    toast.error(error.message || "Could not update profile");
  }
  toast.dismiss(toastId);
  return result;
};

// Fetch contests the user is participating in
export const fetchUserContests = async (token) => {
  const toastId = toast.loading("Loading your contests...");
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      GET_USER_CONTESTS_API,
      null,
      { Authorization: `Bearer ${token}` }
    );
    if (!response?.data?.success) {
      throw new Error(response.data.message || "Could not fetch contests");
    }
    result = response.data.contests;
  } catch (error) {
    console.log("GET_USER_CONTESTS_API ERROR:", error);
    toast.error(error.message || "Could not fetch contests");
  }
  toast.dismiss(toastId);
  return result;
};

// Fetch boilerplate code for a question
export const fetchQuestionBoilerplate = async (questionId, language, token, contestId) => {
  const toastId = toast.loading("Loading boilerplate code...");
  let result = null;
  try {
    // Use the direct boilerplate endpoint that matches the backend route
    const response = await apiConnector(
      "GET",
      `${questionEndpoints.GET_QUESTION_BOILERPLATE_API}/sample-contest/problems/sum-of-two-numbers/boilerplate/${language}`,
      null,
      { Authorization: `Bearer ${token}` }
    );
    if (!response?.data?.success) {
      throw new Error(response.data.message || "Could not fetch boilerplate code");
    }
    result = {
      language: response.data.language,
      code: response.data.code
    };
  } catch (error) {
    console.log("GET_QUESTION_BOILERPLATE_API ERROR:", error);
    toast.error(error.message || "Could not fetch boilerplate code");
  }
  toast.dismiss(toastId);
  return result;
};