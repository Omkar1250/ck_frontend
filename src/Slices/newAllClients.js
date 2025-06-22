import { createSlice } from "@reduxjs/toolkit";

const jrmLeadsAllMyClientsSlice = createSlice({
  name: "jrmLeadsAllMyClients",
  initialState: {
    jrmLeadsAllMyClients: [],
    loading: false,
    error: null,
    totalJrmLeadsAllMyClients: 0,
    totalPages: 0,
    currentPage: 1,
  },
  reducers: {
    setJrmBasicMsTeamsClientsLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setJrmBasicMsTeamsClientsSuccess: (state, action) => {
      state.loading = false;
      state.jrmLeadsAllMyClients = action.payload.jrmLeadsAllMyClients;
      state.totalJrmLeadsAllMyClients = action.payload.totalJrmLeadsAllMyClients;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },
    setJrmBasicMsTeamsClientsError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setJrmBasicMsTeamsClientsPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

export const {
  setJrmBasicMsTeamsClientsLoading,
  setJrmBasicMsTeamsClientsSuccess,
  setJrmBasicMsTeamsClientsError,
  setJrmBasicMsTeamsClientsPage,
} = jrmLeadsAllMyClientsSlice.actions;

export default jrmLeadsAllMyClientsSlice.reducer;
