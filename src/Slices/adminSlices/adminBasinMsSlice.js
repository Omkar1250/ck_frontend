import { createSlice } from "@reduxjs/toolkit";

const adminBasicMsRequestsSlice = createSlice({
  name: "adminBasicMsRequests",
  initialState: {
    requests: [], // Requests from server
    loading: false,
    error: null,
    totalRequests: 0,
    totalPages: 0,
    currentPage: 1,
  },
  reducers: {
    // ✅ Start Loading
    setAdminBasicMsRequestsLoading: (state) => {
      state.loading = true;
      state.error = null;
    },

    // ✅ Success
    setAdminBasicMsRequestsSuccess: (state, action) => {
      state.loading = false;
      state.requests = action.payload.data; // list of leads
      state.totalRequests = action.payload.total;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },

    // ✅ Error
    setAdminBasicMsRequestsError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ✅ Pagination
    setAdminBasicMsRequestsPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

export const {
  setAdminBasicMsRequestsLoading,
  setAdminBasicMsRequestsSuccess,
  setAdminBasicMsRequestsError,
  setAdminBasicMsRequestsPage,
} = adminBasicMsRequestsSlice.actions;

export default adminBasicMsRequestsSlice.reducer;
