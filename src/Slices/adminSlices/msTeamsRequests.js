import { createSlice } from "@reduxjs/toolkit";

const msTeamsRequestSlice = createSlice({
  name: "msTeamsRequests",
  initialState: {
    msTeamsRequests: [],
    loading: false,
    error: null,
    totalMsTeamsRequests: 0,
    totalPages: 0,
    currentPage: 1,
  },
  reducers: {
    setMsTeamsLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setMsTeamsSuccess: (state, action) => {
      state.loading = false;
      state.msTeamsRequests = action.payload.msTeamsRequests;
      state.totalMsTeamsRequests = action.payload.totalMsTeamsRequests;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },
    setMsTeamsError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setMsTeamsLoading, setMsTeamsSuccess, setMsTeamsError } = msTeamsRequestSlice.actions;

export default msTeamsRequestSlice.reducer;
