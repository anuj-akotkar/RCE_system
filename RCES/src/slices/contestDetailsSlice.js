import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  contest: null,
  loading: false,
  error: null,
};

const contestDetailSlice = createSlice({
  name: "contestDetail",
  initialState,
  reducers: {
    setContest(state, action) {
      state.contest = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearContestDetails(state) {
      state.contest = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { setContest, setLoading, setError, clearContestDetails } = contestDetailSlice.actions;
export default contestDetailSlice.reducer;