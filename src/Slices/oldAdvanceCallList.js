import { createSlice } from "@reduxjs/toolkit";

const oldAdvanceBatchSlice = createSlice({
  name: "oldAdvanceBatch",
  initialState: {
    oldAdvanceBatch: [],
    loading: false,
    error: null,
    totalOldAdvanceBatchList: 0,
    totalPages: 0,
    currentPage: 1,
  },
  reducers: {
    setOldAdvanceBatchLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setOldAdvanceBatchSuccess: (state, action) => {
      state.loading = false;
      state.oldAdvanceBatch = action.payload.oldAdvanceBatch;
      state.totalOldAdvanceBatchList = action.payload.totalOldAdvanceBatchList;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },
    setOldAdvanceBatchError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setOldAdvanceBatchPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

export const {
  setOldAdvanceBatchLoading,
  setOldAdvanceBatchSuccess,
  setOldAdvanceBatchError,
  setOldAdvanceBatchPage,
} = oldAdvanceBatchSlice.actions;

export default oldAdvanceBatchSlice.reducer;
