import { createSlice } from "@reduxjs/toolkit";

const underUsApprovedSlice = createSlice({
  name: "underUsApproved",
  initialState: {
    underUsApproved: [],
    loading: false,
    error: null,
    totalApprovedLeads: 0,
    totalPages: 0,
    currentPage: 1,
  },
  reducers: {
    setUnderUsLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setUnderUsApprovedSuccess: (state, action) => {
      state.loading = false;
      state.underUsApproved = action.payload.underUsApproved;
      state.totalApprovedLeads = action.payload.totalApprovedLeads;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },
    setUnderUsApprovedError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setUnderUsLoading,
  setUnderUsApprovedSuccess,
  setUnderUsApprovedError,
} = underUsApprovedSlice.actions;

export default underUsApprovedSlice.reducer;