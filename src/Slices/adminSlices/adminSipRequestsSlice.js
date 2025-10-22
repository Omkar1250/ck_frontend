import { createSlice } from "@reduxjs/toolkit";

const adminSipRequestsSlice = createSlice({
  name: "adminSipRequests",
  initialState: {
    requests: [],       // pending SIP requests list
    loading: false,
    error: null,
    totalRequests: 0,
    totalPages: 0,
    currentPage: 1,
  },
  reducers: {
    // ✅ Start loading
    setAdminSipRequestsLoading: (state) => {
      state.loading = true;
      state.error = null;
    },

    // ✅ Success
    setAdminSipRequestsSuccess: (state, action) => {
      state.loading = false;
      state.requests = action.payload.pendingRequests; // backend returns pendingRequests
      state.totalRequests = action.payload.total;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },

    // ✅ Error
    setAdminSipRequestsError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ✅ Pagination
    setAdminSipRequestsPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

export const {
  setAdminSipRequestsLoading,
  setAdminSipRequestsSuccess,
  setAdminSipRequestsError,
  setAdminSipRequestsPage,
} = adminSipRequestsSlice.actions;

export default adminSipRequestsSlice.reducer;
