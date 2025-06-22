import { createSlice } from "@reduxjs/toolkit";

const oldAdvanceIdPassSlice = createSlice({
  name: "oldAdvanceIdPassLeads",
  initialState: {
    oldAdvanceMsLeads: [],
    loading: false,
    error: null,
    totalOldAdvanceMsLeads: 0,
    totalPages: 0,
    currentPage: 1,
  },
  reducers: {
    setMsPassAdvanceLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setMsPassAdvanceSuccess: (state, action) => {
      state.loading = false;
      state.oldAdvanceMsLeads = action.payload.oldAdvanceMsLeads;
      state.totalOldAdvanceMsLeads = action.payload.totalOldAdvanceMsLeads;
      state.totalPages = action.payload.totalPages;
    },
    setMsPassAdvanceError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

export const {
  setMsPassAdvanceLoading,
  setMsPassAdvanceSuccess,
  setMsPassAdvanceError,
  setCurrentPage,
} = oldAdvanceIdPassSlice.actions;

export default oldAdvanceIdPassSlice.reducer;
