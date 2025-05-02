import { createSlice } from "@reduxjs/toolkit";

const activationRequestSlice = createSlice({
  name: "activationRequests",
  initialState: {
    activationRequests: [],
    loading: false,
    error: null,
    totalActivationRequests: 0,
    totalPages: 0,
    currentPage: 1,
  },
  reducers: {
    setActivationLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setActivationSuccess: (state, action) => {
      state.loading = false;
      state.activationRequests = action.payload.activationRequests;
      state.totalActivationRequests = action.payload.totalActivationRequests;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },
    setActivationError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setActivationLoading, setActivationSuccess, setActivationError } = activationRequestSlice.actions;

export default activationRequestSlice.reducer;
