import { createSlice } from "@reduxjs/toolkit";

const advanceMsTeamsRequests = createSlice({
  name: "advanceMsTeamsRequests",
  initialState: {
    advanceMsTeamsRequests: [],
    loading: false,
    error: null,
    totalAdvanceMsTeamsRequests: 0,
    totalPages: 0,
    currentPage: 1,
  },
  reducers: {
    setAdvanceMsTeamsLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setAdvanceMsTeamsSuccess: (state, action) => {
      state.loading = false;
      state.advanceMsTeamsRequests = action.payload.advanceMsTeamsRequests;
      state.totalAdvanceMsTeamsRequests = action.payload.totalAdvanceMsTeamsRequests;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },
    setAdvanceMsTeamsError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setAdvanceMsTeamsLoading,
  setAdvanceMsTeamsSuccess,
  setAdvanceMsTeamsError,
} = advanceMsTeamsRequests.actions;

export default advanceMsTeamsRequests.reducer;
