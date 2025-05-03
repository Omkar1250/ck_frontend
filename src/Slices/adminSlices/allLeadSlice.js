import { createSlice } from "@reduxjs/toolkit";

const trailSlice = createSlice({
  name: "trails",
  initialState: {
    trails: [],
    loading: false,
    error: null,
    totalTrailList: 0,
    totalPages: 0,
    currentPage: 1,
  },
  reducers: {
    setTrailLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setTrailSuccess: (state, action) => {
      state.loading = false;
      state.trails = action.payload.trails;
      state.totalTrailList = action.payload.totalTrailList;
      state.totalPages = action.payload.totalPages;
    },
    setTrailError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload; // Update the current page
    },
  },
});

export const {
  setTrailLoading,
  setTrailSuccess,
  setTrailError,
  setCurrentPage, // now we have the setCurrentPage reducer
} = trailSlice.actions;

export default trailSlice.reducer;
