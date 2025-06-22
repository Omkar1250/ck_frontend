import { createSlice } from "@reduxjs/toolkit";

const oldBasicIdPassSlice = createSlice({
  name: "oldBasicIdPassLeads",
  initialState: {
    oldBasicMsLeads: [],
    loading: false,
    error: null,
    totalOldBasicMsLeads: 0,
    totalPages: 0,
    currentPage: 1,
  },
  reducers: {
    setMsPassBasicLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setMsPassBasicSuccess: (state, action) => {
      state.loading = false;
      state.oldBasicMsLeads = action.payload.oldBasicMsLeads; // fixed from 'trails'
      state.totalOldBasicMsLeads = action.payload.totalOldBasicMsLeads;
      state.totalPages = action.payload.totalPages;
    },
     setMsPassBasicError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

export const {
  setMsPassBasicLoading,
  setMsPassBasicSuccess,
  setMsPassBasicError,
  setCurrentPage,
} = oldBasicIdPassSlice.actions;

export default oldBasicIdPassSlice.reducer;
