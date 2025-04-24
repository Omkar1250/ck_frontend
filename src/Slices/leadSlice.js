import { createSlice } from "@reduxjs/toolkit";

const leadSlice = createSlice({
  name: "leads",
  initialState: {
    leads: [],
    loading: false,
    error: null,
    totalLeads: 0,
    totalPages: 0,
    currentPage: 1,
  },
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setLeadsSuccess: (state, action) => {
      state.loading = false;
      state.leads = action.payload.leads;
      state.totalLeads = action.payload.totalLeads;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },
    setLeadsError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setLoading, setLeadsSuccess, setLeadsError } = leadSlice.actions;

export default leadSlice.reducer;
