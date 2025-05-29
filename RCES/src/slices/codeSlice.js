import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  runResult: null,
  submitResult: null,
  loading: false,
  error: null,
};

const codeSlice = createSlice({
  name: "code",
  initialState,
  reducers: {
    setRunResult(state, action) {
      state.runResult = action.payload;
    },
    setSubmitResult(state, action) {
      state.submitResult = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearCodeResults(state) {
      state.runResult = null;
      state.submitResult = null;
      state.error = null;
    },
  },
});

export const {
  setRunResult,
  setSubmitResult,
  setLoading,
  setError,
  clearCodeResults,
} = codeSlice.actions;

export default codeSlice.reducer;