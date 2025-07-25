const BASE_URL = "http://localhost:4000/api/v1";

// AUTH ENDPOINTS
export const authEndpoints = {
  SENDOTP_API: BASE_URL + "/users/sendotp",
  SIGNUP_API: BASE_URL + "/users/signup",
  LOGIN_API: BASE_URL + "/users/login",
  RESET_PASSWORD_TOKEN_API: BASE_URL + "/users/reset-password-token",
  RESET_PASSWORD_API: BASE_URL + "/users/reset-password",
};

// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_USER_PROFILE_API: BASE_URL + "/profile/getUserDetails",
  UPDATE_USER_PROFILE_API: BASE_URL + "/profile/updateProfile",
  GET_USER_CONTESTS_API: BASE_URL + "/profile/getEnrolledContests",
  GET_INSTRUCTOR_DATA_API: BASE_URL + "/profile/instructorDashboard",
};

// CONTEST ENDPOINTS
export const contestEndpoints = {
  GET_ALL_CONTESTS_API: BASE_URL + "/contests/getAllContests",
  GET_CONTEST_DETAILS_API: BASE_URL + "/contests/getFullContestDetails", // Usage: /contests/:id
  CREATE_CONTEST_API: BASE_URL + "/contests/createContest",
  EDIT_CONTEST_API: BASE_URL + "/contests/edit",
  DELETE_CONTEST_API: BASE_URL + "/contests/delete",
  CREATE_SECTION_API: BASE_URL + "/contests/section/create",
  EDIT_SECTION_API: BASE_URL + "/contests/section/edit",
  DELETE_SECTION_API: BASE_URL + "/contests/section/delete",
  GET_FULL_CONTEST_DETAILS_API: BASE_URL + "/contests/getFullContestDetails",
  GET_ALL_INSTRUCTOR_CONTESTS_API: BASE_URL + "/contests/getInstructorContests", // Usage: /full/:id
};

// QUESTION ENDPOINTS
export const questionEndpoints = {
  GET_ALL_QUESTIONS_API: BASE_URL + "/questions/all",
  GET_QUESTION_BY_ID_API: BASE_URL + "/questions",
  CREATE_QUESTION_API: BASE_URL + "/questions/create",
  UPDATE_QUESTION_API: BASE_URL + "/questions/update",
  DELETE_QUESTION_API: BASE_URL + "/questions/delete",
};

// CODE EXECUTION ENDPOINTS
export const codeEndpoints = {
  RUN_CODE_API: BASE_URL + "/code/run",
  SUBMIT_CODE_API: BASE_URL + "/code/submit",
};

// SUBMISSION ENDPOINTS
export const submissionEndpoints = {
  // Create and fetch submissions using new /code routes
  SUBMIT_CODE_API: BASE_URL + "/code/submit", // Replaces previous /submissions
  GET_SUBMISSIONS_API: BASE_URL + "/code/question", // Append /:questionId when calling
  GET_SUBMISSION_BY_ID_API: BASE_URL + "/code", // Append /:submissionId when calling
};

// FEEDBACK ENDPOINTS
export const feedbackEndpoints = {
  SUBMIT_FEEDBACK_API: BASE_URL + "/feedback",
  GET_FEEDBACK_API: BASE_URL + "/feedback",
};

// CONTACT US ENDPOINTS
export const contactEndpoints = {
  CONTACT_US_API: BASE_URL + "/contactus",
};

// CONTEST PROGRESS ENDPOINTS
export const contestProgressEndpoints = {
  GET_CONTEST_PROGRESS_API: BASE_URL + "/contestprogress",
  UPDATE_CONTEST_PROGRESS_API: BASE_URL + "/contestprogress",
};

// LEADERBOARD ENDPOINTS
export const leaderboardEndpoints = {
  GET_LEADERBOARD_API: BASE_URL + "/contests/leaderboard",
};

// NOTIFICATION ENDPOINTS
export const notificationEndpoints = {
  GET_NOTIFICATIONS_API: BASE_URL + "/users",
  MARK_NOTIFICATION_READ_API: BASE_URL + "/users",
};

// ADMIN ENDPOINTS
export const adminEndpoints = {
  GET_ALL_USERS_API: BASE_URL + "/users/all",
  DELETE_USER_API: BASE_URL + "/users/delete",
};

// SETTINGS PAGE API
export const settingsEndpoints = {
  UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateDisplayPicture",
  CHANGE_PASSWORD_API: BASE_URL + "/auth/changepassword",
  DELETE_PROFILE_API: BASE_URL + "/profile/deleteProfile",
};

