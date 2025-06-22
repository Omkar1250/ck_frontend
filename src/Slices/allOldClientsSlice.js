import { createSlice } from "@reduxjs/toolkit";

const allBatchClientsSlice = createSlice({
  name: "allBatchClients",
  initialState: {
    allBatchClients: [],
    loading: false,
    error: null,
    totalClientsBatchList: 0,
    totalPages: 0,
    currentPage: 1,
  },
  reducers: {
    setAllBatchClientsLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setAllBatchClientsSuccess: (state, action) => {
      state.loading = false;
      state.allBatchClients = action.payload.allBatchClients;
      state.totalClientsBatchList = action.payload.totalClientsBatchList;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },
    setAllBatchClientsError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setAllBatchClientsPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

export const {
  setAllBatchClientsLoading,
  setAllBatchClientsSuccess,
  setAllBatchClientsError,
  setAllBatchClientsPage,
} = allBatchClientsSlice.actions;

export default allBatchClientsSlice.reducer;
