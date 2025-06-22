import { createSlice } from "@reduxjs/toolkit";

const ClientsForRmSlice = createSlice({
  name: "ClientsForRm",
  initialState: {
    ClientsForRm: [],
    loading: false,
    error: null,
    totalClientsForRmList: 0,
    totalPages: 0,
    currentPage: 1,
  },
  reducers: {
    setClientsForRmLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setClientsForRmSuccess: (state, action) => {
      state.loading = false;
      state.ClientsForRm = action.payload.ClientsForRm;
      state.totalClientsForRmList = action.payload.totalClientsForRmList;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },
    setClientsForRmError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setClientsForRmPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

export const {
  setClientsForRmLoading,
  setClientsForRmSuccess,
  setClientsForRmError,
  setClientsForRmPage,
} = ClientsForRmSlice.actions;

export default ClientsForRmSlice.reducer;
