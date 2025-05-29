import { toast } from "react-hot-toast";
import { apiConnector } from "../apiconnector";
import { notificationEndpoints } from "../apis";

// Destructure endpoints for clarity
const {
  GET_NOTIFICATIONS_API,
  MARK_NOTIFICATION_READ_API,
} = notificationEndpoints;

// Fetch notifications for the current user
export const fetchNotifications = async (userId) => {
  const toastId = toast.loading("Loading notifications...");
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      `${GET_NOTIFICATIONS_API}/${userId}`
    );
    if (!response?.data?.success) {
      throw new Error("Could not fetch notifications");
    }
    result = response.data.notifications;
  } catch (error) {
    console.log("GET_NOTIFICATIONS_API ERROR:", error);
    toast.error(error.message || "Failed to fetch notifications");
  }
  toast.dismiss(toastId);
  return result;
};

// Mark a notification as read
export const markNotificationRead = async ({ userId, notificationId }) => {
  const toastId = toast.loading("Marking as read...");
  let result = null;
  try {
    const response = await apiConnector(
      "PUT",
      `${MARK_NOTIFICATION_READ_API}/${userId}/${notificationId}/read`
    );
    if (!response?.data?.success) {
      throw new Error("Could not mark notification as read");
    }
    toast.success("Notification marked as read");
    result = response.data.notification;
  } catch (error) {
    console.log("MARK_NOTIFICATION_READ_API ERROR:", error);
    toast.error(error.message || "Failed to mark notification as read");
  }
  toast.dismiss(toastId);
  return result;
};