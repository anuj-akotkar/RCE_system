import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { profileEndpoints } from "../apis";
import { logout } from "./authAPI"
// Destructure endpoints for clarity
const {
  GET_USER_PROFILE_API,
  UPDATE_USER_PROFILE_API,
  GET_USER_CONTESTS_API,
  GET_INSTRUCTOR_DATA_API,
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
    // Add user image logic here
    const userData = response.data.profile;
    const userImage = userData.profilePic
      ? userData.profilePic
      : `https://api.dicebear.com/5.x/initials/svg?seed=${userData.firstName} ${userData.lastName}`;
    result = { ...userData, profilePic: userImage };
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
    const updatedUser = response.data.updatedUserDetails;
    const userImage = updatedUser.image
      ? updatedUser.image
      : `https://api.dicebear.com/5.x/initials/svg?seed=${updatedUser.firstName} ${updatedUser.lastName}`;
    result = { ...updatedUser, image: userImage };
    toast.success("Profile Updated Successfully");
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

export async function getInstructorData(token) {
  const toastId = toast.loading("Loading...")
  let result = []
  try {
    const response = await apiConnector("GET", GET_INSTRUCTOR_DATA_API, null, {
      Authorization: `Bearer ${token}`,
    })
    console.log("GET_INSTRUCTOR_DATA_API API RESPONSE............", response)
    result = response?.data?.contests
  } catch (error) {
    console.log("GET_INSTRUCTOR_DATA_API API ERROR............", error)
    toast.error("Could Not Get Instructor Data")
  }
  toast.dismiss(toastId)
  return result
}