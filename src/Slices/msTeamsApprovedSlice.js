import { createSlice } from "@reduxjs/toolkit";

const msTeamsApprovedSlice = createSlice({
  name: "msTeamsApproved",
  initialState: {
    msTeamsApproved: [],
    loading: false,
    error: null,
    totalMsTeamsLeads: 0,
    totalPages: 0,
    currentPage: 1,
  },
  reducers: {
    setMsTeamsLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setMsTeamsApprovedSuccess: (state, action) => {
      state.loading = false;
      state.msTeamsApproved = action.payload.msTeamsApproved;
      state.totalMsTeamsLeads = action.payload.totalMsTeamsLeads;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },
    setMsTeamsApprovedError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload; // Update the current page
    },
  },
});

export const {
  setMsTeamsLoading,
  setMsTeamsApprovedSuccess,
  setMsTeamsApprovedError,
  setCurrentPage
  
} = msTeamsApprovedSlice.actions;

export default msTeamsApprovedSlice.reducer;
