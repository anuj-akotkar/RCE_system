import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  loading: false,
  error: null,
  success: false,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setUsers(state, action) {
      state.users = action.payload;
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
    clearAdminStatus(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    removeUser(state, action) {
      state.users = state.users.filter(u => u._id !== action.payload);
    },
  },
});

export const {
  setUsers,
  setLoading,
  setError,
  setSuccess,
  clearAdminStatus,
  removeUser,
} = adminSlice.actions;

export default adminSlice.reducer;