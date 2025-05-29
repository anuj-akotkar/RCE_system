import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  leaderboard: [],
  loading: false,
  error: null,
};

const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState,
  reducers: {
    setLeaderboard(state, action) {
      state.leaderboard = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    clearLeaderboardStatus(state) {
      state.loading = false;
      state.error = null;
      state.leaderboard = [];
    },
  },
});

export const {
  setLeaderboard,
  setLoading,
  setError,
  clearLeaderboardStatus,
} = leaderboardSlice.actions;

export default leaderboardSlice.reducer;