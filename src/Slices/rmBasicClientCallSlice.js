import { createSlice } from "@reduxjs/toolkit";

const rmBasicMsTeamsClientsSlice = createSlice({
  name: "rmBasicMsTeamsClients",
  initialState: {
    rmBasicMsTeamsClients: [],
    loading: false,
    error: null,
    TotalrmBasicMsTeamsClients: 0,
    totalPages: 0,
    currentPage: 1,
  },
  reducers: {
    setRmBasicMsTeamsClientsLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setRmBasicMsTeamsClientsSuccess: (state, action) => {
      state.loading = false;
      state.rmBasicMsTeamsClients = action.payload.rmBasicMsTeamsClients;
      state.TotalrmBasicMsTeamsClients = action.payload.TotalrmBasicMsTeamsClients;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },
    setRmBasicMsTeamsClientsError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setRmBasicMsTeamsClientsPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

export const {
  setRmBasicMsTeamsClientsLoading,
  setRmBasicMsTeamsClientsSuccess,
  setRmBasicMsTeamsClientsError,
  setRmBasicMsTeamsClientsPage,
} = rmBasicMsTeamsClientsSlice.actions;

export default rmBasicMsTeamsClientsSlice.reducer;
