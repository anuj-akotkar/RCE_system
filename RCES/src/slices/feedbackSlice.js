import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  feedbackList: [],
  loading: false,
  error: null,
  success: false,
};

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    setFeedbackList(state, action) {
      state.feedbackList = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setSuccess(state, action) {
      state.success = action.payload;
    },
    clearFeedbackStatus(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
});

export const {
  setFeedbackList,
  setLoading,
  setError,
  setSuccess,
  clearFeedbackStatus,
} = feedbackSlice.actions;

export default feedbackSlice.reducer;