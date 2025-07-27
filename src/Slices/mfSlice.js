import { createSlice } from "@reduxjs/toolkit";

const mfClientsSlice = createSlice({
  name: "mfClients", // ✅ proper name for the slice
  initialState: {
    mfClients: [],              // ✅ stores leads
    loading: false,             // ✅ loading flag
    error: null,                // ✅ error storage
    totalMfClients: 0,          // ✅ total count
    totalPages: 0,              // ✅ total pages
    currentPage: 1,             // ✅ pagination
  },
  reducers: {
    setMfClientsLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setMfClientsSuccess: (state, action) => {
      state.loading = false;
      state.mfClients = action.payload.mfClients;
      state.totalMfClients = action.payload.totalMfClients;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },
    setMfClientsError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setMfClientsPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

export const {
  setMfClientsLoading,
  setMfClientsSuccess,
  setMfClientsError,
  setMfClientsPage,
} = mfClientsSlice.actions;

export default mfClientsSlice.reducer;
