import { createSlice } from "@reduxjs/toolkit";

const adminCallRequestsSlice = createSlice({
  name: "adminCallRequests",
  initialState: {
    requests: [], // All fetched requests
    loading: false,
    error: null,
    totalRequests: 0,
    totalPages: 0,
    currentPage: 1,
  },
  reducers: {
    // ✅ Start loading state
    setAdminCallRequestsLoading: (state) => {
      state.loading = true;
      state.error = null;
    },

    // ✅ On successful fetch
    setAdminCallRequestsSuccess: (state, action) => {
      state.loading = false;
      state.requests = action.payload.requests;
      state.totalRequests = action.payload.totalRequests;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },

    // ✅ On error
    setAdminCallRequestsError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ✅ For pagination
    setAdminCallRequestsPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

export const {
  setAdminCallRequestsLoading,
  setAdminCallRequestsSuccess,
  setAdminCallRequestsError,
  setAdminCallRequestsPage,
} = adminCallRequestsSlice.actions;

export default adminCallRequestsSlice.reducer;
