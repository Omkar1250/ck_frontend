import { createSlice } from "@reduxjs/toolkit";

const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    transactions: [],
    loading: false,
    error: null,
    totalTransactions: 0,
    totalPages: 0,
    currentPage: 1,
    totalPoints: 0, // Add this
  },
  reducers: {
    setTransactionLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setTransactionSuccess: (state, action) => {
      state.loading = false;
      state.transactions = action.payload.transactions;
      state.totalTransactions = action.payload.totalTransactions;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
      state.totalPoints = action.payload.totalPoints; // Update here
    },
    setTransactionError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setTransactionLoading, setTransactionSuccess, setTransactionError } =
  transactionSlice.actions;

export default transactionSlice.reducer;