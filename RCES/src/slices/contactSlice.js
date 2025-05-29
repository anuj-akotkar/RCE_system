import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  error: null,
  success: false,
};

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setSuccess(state, action) {
      state.success = action.payload;
    },
    clearContactStatus(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
});

export const { setLoading, setError, setSuccess, clearContactStatus } = contactSlice.actions;
export default contactSlice.reducer;