import { createSlice } from "@reduxjs/toolkit";

const sipRequestSlice = createSlice({
  name: "sipRequests",
  initialState: {
    sipRequests: [],
    loading: false,
    error: null,
    totalSipRequests: 0,
    totalPages: 0,
    currentPage: 1,
  },
  reducers: {
    setSipLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setSipSuccess: (state, action) => {
      state.loading = false;
      state.sipRequests = action.payload.sipRequests;
      state.totalSipRequests = action.payload.totalSipRequests;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },
    setSipError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setSipLoading, setSipSuccess, setSipError } = sipRequestSlice.actions;

export default sipRequestSlice.reducer;
