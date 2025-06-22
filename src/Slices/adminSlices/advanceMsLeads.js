import { createSlice } from "@reduxjs/toolkit";

const advanceMsSlice = createSlice({
  name: "advanceMsLeads",
  initialState: {
    advanceMsLeads: [],
    loading: false,
    error: null,
    totalAdvanceMsLeads: 0,
    totalPages: 0,
    currentPage: 1,
  },
  reducers: {
    setAdvanceMsLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setAdvanceMsSuccess: (state, action) => {
      state.loading = false;
      state.advanceMsLeads = action.payload.advanceMsLeads; // fixed from 'trails'
      state.totalAdvanceMsLeads = action.payload.totalAdvanceMsLeads;
      state.totalPages = action.payload.totalPages;
    },
    setAdvanceMsError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

export const {
  setAdvanceMsLoading,
  setAdvanceMsSuccess,
  setAdvanceMsError,
  setCurrentPage,
} = advanceMsSlice.actions;

export default advanceMsSlice.reducer;
