import { createSlice } from "@reduxjs/toolkit";

const sipApprovedSlice = createSlice({
  name: "sipApproved",
  initialState: {
    sipApproved: [],
    loading: false,
    error: null,
    totalSipLeads: 0,
    totalPages: 0,
    currentPage: 1,
  },
  reducers: {
    setSipLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setSipApprovedSuccess: (state, action) => {
      state.loading = false;
      state.sipApproved = action.payload.sipApproved;
      state.totalSipLeads = action.payload.totalSipLeads;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },
    setSipApprovedError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setSipLoading,
  setSipApprovedSuccess,
  setSipApprovedError,
} = sipApprovedSlice.actions;

export default sipApprovedSlice.reducer;
