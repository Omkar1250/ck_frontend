import { createSlice } from "@reduxjs/toolkit";

const codedApprovedSlice = createSlice({
  name: "codedApproved",
  initialState: {
    codedApproved: [],
    loading: false,
    error: null,
    totalCodedLeads: 0,
    totalPages: 0,
    currentPage: 1,
  },
  reducers: {
    setCodedLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setCodedApprovedSuccess: (state, action) => {
      state.loading = false;
      state.codedApproved = action.payload.codedApproved;
      state.totalCodedLeads = action.payload.totalCodedLeads;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },
    setCodedApprovedError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setCodedLoading,
  setCodedApprovedSuccess,
  setCodedApprovedError,
} = codedApprovedSlice.actions;

export default codedApprovedSlice.reducer;