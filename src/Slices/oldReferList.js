import { createSlice } from "@reduxjs/toolkit";

const referOldListSlice = createSlice({
  name: "referOldLeads",
  initialState: {
    referOldLeads: [],       // ✅ changed from oldBasicLeads → referOldLeads
    loading: false,
    error: null,
    totalReferOldList: 0,    // ✅ kept as is
    totalPages: 0,
    currentPage: 1,
  },
  reducers: {
    setReferOldLeadsLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setReferOldLeadsSuccess: (state, action) => {
      state.loading = false;
      state.referOldLeads = action.payload.referOldLeads;       // ✅ updated key
      state.totalReferOldList = action.payload.totalReferOldList; // ✅ updated key
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },
    setReferOldLeadsError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setReferOldListPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

export const {
  setReferOldLeadsLoading,
  setReferOldLeadsSuccess,
  setReferOldLeadsError,
  setReferOldListPage,
} = referOldListSlice.actions;

export default referOldListSlice.reducer;
