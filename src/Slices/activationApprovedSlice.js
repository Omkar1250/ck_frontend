import { createSlice } from "@reduxjs/toolkit";

const activationApprovedSlice = createSlice({
  name: "activationApproved",
  initialState: {
    activationApproved: [],
    loading: false,
    error: null,
    totalActivationLeads: 0,
    totalPages: 0,
    currentPage: 1,
  },
  reducers: {
    setActivationLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setActivationApprovedSuccess: (state, action) => {
      state.loading = false;
      state.activationApproved = action.payload.activationApproved;
      state.totalActivationLeads = action.payload.totalActivationLeads;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },
    setActivationApprovedError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload; // Update the current page
    },
  },
});

export const {
  setActivationLoading,
  setActivationApprovedSuccess,
  setActivationApprovedError,
  setCurrentPage
} = activationApprovedSlice.actions;

export default activationApprovedSlice.reducer;
