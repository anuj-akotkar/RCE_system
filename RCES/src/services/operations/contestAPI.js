import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { contestEndpoints } from "../apis";

// Destructure endpoints for clarity
const {
  GET_ALL_CONTESTS_API,
  GET_CONTEST_DETAILS_API,
  CREATE_CONTEST_API,
  EDIT_CONTEST_API,
  DELETE_CONTEST_API,
  CREATE_SECTION_API,
  EDIT_SECTION_API,
  DELETE_SECTION_API,
  GET_FULL_CONTEST_DETAILS_API,
  GET_ALL_INSTRUCTOR_CONTESTS_API,
} = contestEndpoints;

// Fetch all contests
export const fetchAllContests = async () => {
  const toastId = toast.loading("Loading contests...");
  let result = [];
  try {
    const response = await apiConnector("GET", GET_ALL_CONTESTS_API);
    if (!response?.data?.success) {
      throw new Error("Could not fetch contests");
    }
    result = response.data.contests;
  } catch (error) {
    console.log("GET_ALL_CONTESTS_API ERROR:", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

// Fetch contest details by ID
export const fetchContestDetails = async (contestId,token) => {
  const toastId = toast.loading("Loading contest details...");
  let result = null;
  try {
    const response = await apiConnector(
  "GET",
  `${GET_CONTEST_DETAILS_API}/${contestId}`,
  null,
  { Authorization: `Bearer ${token}` }
  );
    if (!response?.data?.success) {
      throw new Error("Could not fetch contest details");
    }
    result = response.data.contest;
    console.log("fetchContestDetail", result);
  } catch (error) {
    console.log("GET_CONTEST_DETAILS_API ERROR:", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

// Create a new contest
export const createContest = async (data, token) => {
  const toastId = toast.loading("Creating contest...");
  let result = null;
  try {
     const payload = {
      title: data.title,
      description: data.description,
      timeLimit: data.duration, // map duration to timeLimit
      questions: data.questions,
    };
    const response = await apiConnector("POST", CREATE_CONTEST_API, payload, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Could not create contest");
    }
    toast.success("Contest created successfully");
    result = response.data.contest;
  } catch (error) {
    console.log("CREATE_CONTEST_API ERROR:", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

// Edit contest details
export const editContest = async (data, token) => {
  const toastId = toast.loading("Updating contest...");
  let result = null;
  try {
    const response = await apiConnector("PUT", EDIT_CONTEST_API, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Could not update contest");
    }
    toast.success("Contest updated successfully");
    result = response.data.contest;
  } catch (error) {
    console.log("EDIT_CONTEST_API ERROR:", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

// Delete a contest
export const deleteContest = async (contestId, token) => {
  const toastId = toast.loading("Deleting contest...");
  let result = null;
  try {
    const response = await apiConnector("DELETE", `${DELETE_CONTEST_API}/${contestId}`, null, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Could not delete contest");
    }
    toast.success("Contest deleted successfully");
    result = true;
  } catch (error) {
    console.log("DELETE_CONTEST_API ERROR:", error);
    toast.error(error.message);
    result = false;
  }
  toast.dismiss(toastId);
  return result;
};

// Create a section in a contest
export const createSection = async (data, token) => {
  const toastId = toast.loading("Creating section...");
  let result = null;
  try {
    const response = await apiConnector("POST", CREATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Could not create section");
    }
    toast.success("Section created");
    result = response.data.section;
  } catch (error) {
    console.log("CREATE_SECTION_API ERROR:", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

// Edit a section in a contest
export const editSection = async (data, token) => {
  const toastId = toast.loading("Updating section...");
  let result = null;
  try {
    const response = await apiConnector("PUT", EDIT_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Could not update section");
    }
    toast.success("Section updated");
    result = response.data.section;
  } catch (error) {
    console.log("EDIT_SECTION_API ERROR:", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

// Delete a section in a contest
export const deleteSection = async (sectionId, token) => {
  const toastId = toast.loading("Deleting section...");
  let result = null;
  try {
    const response = await apiConnector("DELETE", `${DELETE_SECTION_API}/${sectionId}`, null, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.data?.success) {
      throw new Error("Could not delete section");
    }
    toast.success("Section deleted");
    result = true;
  } catch (error) {
    console.log("DELETE_SECTION_API ERROR:", error);
    toast.error(error.message);
    result = false;
  }
  toast.dismiss(toastId);
  return result;
};

// Fetch full contest details (with authentication)
export const fetchFullContestDetails = async (contestId, token) => {
  const toastId = toast.loading("Loading full contest details...");
  let result = null;
  try {
    const response = await apiConnector(
      "GET",
      `${GET_FULL_CONTEST_DETAILS_API}/${contestId}`,
      null,
      { Authorization: `Bearer ${token}` }
    );
    if (!response?.data?.success) {
      throw new Error("Could not fetch full contest details");
    }
    result = response.data.contest;
  } catch (error) {
    console.log("GET_FULL_CONTEST_DETAILS_API ERROR:", error);
    toast.error(error.message);
  }
  toast.dismiss(toastId);
  return result;
};

// fetching all courses under a specific instructor
export const fetchInstructorContests = async (token) => {
  let result = []
  const toastId = toast.loading("Loading instructor contests...")
  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_INSTRUCTOR_CONTESTS_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )
    console.log("INSTRUCTOR CONTESTS API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Instructor Contests")
    }
    result = response?.data?.contests
  } catch (error) {
    console.log("INSTRUCTOR CONTESTS API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}