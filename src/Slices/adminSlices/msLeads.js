import { createSlice } from "@reduxjs/toolkit";

const msSlice = createSlice({
  name: "msLeads",
  initialState: {
    msLeads: [],
    loading: false,
    error: null,
    totalMsLeads: 0,
    totalPages: 0,
    currentPage: 1,
  },
  reducers: {
    setMsLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setMsSuccess: (state, action) => {
      state.loading = false;
      state.msLeads = action.payload.msLeads; // fixed from 'trails'
      state.totalMsLeads = action.payload.totalMsLeads;
      state.totalPages = action.payload.totalPages;
    },
    setMsError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

export const {
  setMsLoading,
  setMsSuccess,
  setMsError,
  setCurrentPage,
} = msSlice.actions;

export default msSlice.reducer;
