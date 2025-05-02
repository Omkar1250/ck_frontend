import { createSlice } from "@reduxjs/toolkit";

const aomaRequestSlice = createSlice({
  name: "aomaRequests",
  initialState: {
    aomaRequests: [],
    loading: false,
    error: null,
    totalAomaRequests: 0,
    totalPages: 0,
    currentPage: 1,
  },
  reducers: {
    setAomaLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setAomaSuccess: (state, action) => {
      state.loading = false;
      state.aomaRequests = action.payload.aomaRequests;
      state.totalAomaRequests = action.payload.totalAomaRequests;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },
    setAomaError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setAomaLoading, setAomaSuccess, setAomaError } = aomaRequestSlice.actions;

export default aomaRequestSlice.reducer;
