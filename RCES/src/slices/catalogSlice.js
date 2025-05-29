import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  contests: [],
  loading: false,
  error: null,
};

const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {
    setContests(state, action) {
      state.contests = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setContests, setLoading, setError } = catalogSlice.actions;

export default catalogSlice.reducer;