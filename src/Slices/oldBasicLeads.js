import { createSlice } from "@reduxjs/toolkit";

const oldBasicLeadsSlice = createSlice({
  name: "oldBasicBatch",
  initialState: {
    oldBasicBatch: [],
    loading: false,
    error: null,
    totalOldBasicBatchList: 0,
    totalPages: 0,
    currentPage: 1,
  },
  reducers: {
    setOldBasicLeadsLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setOldBasicLeadsSuccess: (state, action) => {
      state.loading = false;
      state.oldBasicBatch = action.payload.oldBasicBatch;
      state.totalOldBasicBatchList = action.payload.totalOldBasicBatchList;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },
    setOldBasicLeadsError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

export const {
  setOldBasicLeadsLoading,
  setOldBasicLeadsSuccess,
  setOldBasicLeadsError,
  setCurrentPage,
} = oldBasicLeadsSlice.actions;

export default oldBasicLeadsSlice.reducer;
