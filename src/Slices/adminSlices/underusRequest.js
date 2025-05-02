import { createSlice } from "@reduxjs/toolkit";

const underUsSlice = createSlice({
  name: "underUsRequests",
  initialState: {
    underUsRequests: [],
    loading: false,
    error: null,
    totalUnderUsRequests: 0,
    totalPages: 0,
    currentPage: 1,
  },
  reducers: {
    setUnderUsLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setUnderUsSuccess: (state, action) => {
      state.loading = false;
      state.underUsRequests = action.payload.underUsRequests;
      state.totalUnderUsRequests = action.payload.totalUnderUsRequests;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },
    setUnderUsError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setUnderUsLoading, setUnderUsSuccess, setUnderUsError } =
  underUsSlice.actions;

export default underUsSlice.reducer;
