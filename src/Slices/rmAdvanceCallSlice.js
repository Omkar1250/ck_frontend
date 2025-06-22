import { createSlice } from "@reduxjs/toolkit";

const rmAdvanceMsTeamsClientsSlice = createSlice({
  name: "rmAdvanceMsTeamsClients",
  initialState: {
    rmAdvanceMsTeamsClients: [],
    loading: false,
    error: null,
    totalrmAdvanceMsTeamsClients: 0,
    totalPages: 0,
    currentPage: 1,
  },
  reducers: {
    setRmAdvanceMsTeamsClientsLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setRmAdvanceMsTeamsClientsSuccess: (state, action) => {
      state.loading = false;
      state.rmAdvanceMsTeamsClients = action.payload.rmAdvanceMsTeamsClients;
      state.totalrmAdvanceMsTeamsClients = action.payload.totalrmAdvanceMsTeamsClients;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },
    setRmAdvanceMsTeamsClientsError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setRmAdvanceMsTeamsClientsPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

export const {
  setRmAdvanceMsTeamsClientsLoading,
  setRmAdvanceMsTeamsClientsSuccess,
  setRmAdvanceMsTeamsClientsError,
  setRmAdvanceMsTeamsClientsPage,
} = rmAdvanceMsTeamsClientsSlice.actions;

export default rmAdvanceMsTeamsClientsSlice.reducer;
