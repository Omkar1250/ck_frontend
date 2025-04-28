import { createSlice } from "@reduxjs/toolkit";

const referLeadSlice = createSlice({
  name: "referLeads",
  initialState: {
    referLeads: [],
    loading: false,
    error: null,
    totalReferLeads: 0,
    totalPages: 0,
    currentPage: 1,
  },
  reducers: {
    setReferLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setReferLeadsSuccess: (state, action) => {
      state.loading = false;
      state.referLeads = action.payload.referLeads;
      state.totalReferLeads = action.payload.totalReferLeads;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },
    setReferLeadsError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setReferLoading, setReferLeadsSuccess, setReferLeadsError } = referLeadSlice.actions;

export default referLeadSlice.reducer;
