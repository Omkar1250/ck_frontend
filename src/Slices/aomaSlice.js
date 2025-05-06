import { createSlice } from "@reduxjs/toolkit";

const aomaApprovedSlice = createSlice({
  name: "aomaApproved",
  initialState: {
    aomaApproved: [],
    loading: false,
    error: null,
    totalAomaLeads: 0,
    totalPages: 0,
    currentPage: 1,
  },
  reducers: {
    setAomaLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setAomaApprovedSuccess: (state, action) => {
      state.loading = false;
      state.aomaApproved = action.payload.aomaApproved;
      state.totalAomaLeads = action.payload.totalAomaLeads;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },
    setAomaApprovedError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload; // Update the current page
    },
  },
});

export const {
  setAomaLoading,
  setAomaApprovedSuccess,
  setAomaApprovedError,
  setCurrentPage
} = aomaApprovedSlice.actions;

export default aomaApprovedSlice.reducer;