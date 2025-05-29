import { apiConnector } from "../apiconnector";
import { adminEndpoints } from "../apis";

// Fetch all users (admin only)
export const fetchAllUsers = async (token) => {
  return await apiConnector(
    "GET",
    adminEndpoints.GET_ALL_USERS_API,
    null,
    { Authorization: `Bearer ${token}` }
  );
};

// Delete a user (admin only)
export const deleteUser = async (userId, token) => {
  return await apiConnector(
    "DELETE",
    `${adminEndpoints.DELETE_USER_API}/${userId}`,
    null,
    { Authorization: `Bearer ${token}` }
  );
};

// You can add more admin-related API functions as needed