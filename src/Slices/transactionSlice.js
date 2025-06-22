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
    totalPoints: 0,
  },
  reducers: {
    setTransactionLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setTransactionSuccess: (state, action) => {
      state.loading = false;
      state.transactions = action.payload.transactions || [];
      state.totalTransactions = action.payload.total || 0;
      state.totalPages = action.payload.totalPages || 0;
      state.currentPage = action.payload.currentPage || 1;
      state.totalPoints = action.payload.totalPoints || 0;
    },
    setTransactionError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    // ✅ ADD THIS
    setTransactionCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

// Export actions
export const {
  setTransactionLoading,
  setTransactionSuccess,
  setTransactionError,
  setTransactionCurrentPage, // ✅ Export here too
} = transactionSlice.actions;

export default transactionSlice.reducer;
