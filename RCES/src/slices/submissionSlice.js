import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  submissions: [],
  loading: false,
  error: null,
  success: false,
};

const submissionSlice = createSlice({
  name: "submission",
  initialState,
  reducers: {
    setSubmissions(state, action) {
      state.submissions = action.payload;
    },
    addSubmission(state, action) {
      state.submissions.push(action.payload);
      state.success = true;
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
    clearSubmissionStatus(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
});

export const {
  setSubmissions,
  addSubmission,
  setLoading,
  setError,
  setSuccess,
  clearSubmissionStatus,
} = submissionSlice.actions;

export default submissionSlice.reducer;