import { createSlice } from "@reduxjs/toolkit";

const adminApprovedSipRequestsSlice = createSlice({
  name: "adminApprovedSipRequests",
  initialState: {
    requests: [],
    loading: false,
    error: null,
    totalRequests: 0,
    totalPages: 0,
    currentPage: 1,

    // filters helpers
    rmStats: [],
    totalConverted: 0,
    batchOptions: [],
  },
  reducers: {
    setAdminApprovedSipLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setAdminApprovedSipSuccess: (state, action) => {
      state.loading = false;
      state.requests = action.payload.approvedRequests;
      state.totalRequests = action.payload.total;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },
    setAdminApprovedSipError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setAdminApprovedSipPage: (state, action) => {
      state.currentPage = action.payload;
    },

    // extra: stats + batches
    setAdminApprovedSipStats: (state, action) => {
      state.rmStats = action.payload.stats || [];
      state.totalConverted = action.payload.totalConverted || 0;
    },
    setAdminApprovedSipBatches: (state, action) => {
      state.batchOptions = action.payload.batches || [];
    },
  },
});

export const {
  setAdminApprovedSipLoading,
  setAdminApprovedSipSuccess,
  setAdminApprovedSipError,
  setAdminApprovedSipPage,
  setAdminApprovedSipStats,
  setAdminApprovedSipBatches,
} = adminApprovedSipRequestsSlice.actions;

export default adminApprovedSipRequestsSlice.reducer;
