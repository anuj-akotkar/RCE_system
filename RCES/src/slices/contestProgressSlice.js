import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  progress: null,
  loading: false,
  error: null,
  updated: false,
};

const contestProgressSlice = createSlice({
  name: "contestProgress",
  initialState,
  reducers: {
    setProgress(state, action) {
      state.progress = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setUpdated(state, action) {
      state.updated = action.payload;
    },
    clearProgressStatus(state) {
      state.loading = false;
      state.error = null;
      state.updated = false;
    },
  },
});

export const {
  setProgress,
  setLoading,
  setError,
  setUpdated,
  clearProgressStatus,
} = contestProgressSlice.actions;

export default contestProgressSlice.reducer;