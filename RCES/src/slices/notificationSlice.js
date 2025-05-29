import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotifications(state, action) {
      state.notifications = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    markNotificationRead(state, action) {
      // action.payload should be the updated notification object
      state.notifications = state.notifications.map((n) =>
        n._id === action.payload._id ? action.payload : n
      );
    },
    clearNotificationStatus(state) {
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setNotifications,
  setLoading,
  setError,
  markNotificationRead,
  clearNotificationStatus,
} = notificationSlice.actions;

export default notificationSlice.reducer;