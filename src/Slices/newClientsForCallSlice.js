import { createSlice } from "@reduxjs/toolkit";

const newClientForCallSlice = createSlice({
  name: "newClientForCall",
  initialState: {
    newClientForCall: [],
    loading: false,
    error: null,
    totalNewClientForCall: 0,
    totalPages: 0,
    currentPage: 1,
  },
  reducers: {
    setNewClientForCallLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setNewClientForCallSuccess: (state, action) => {
      state.loading = false;
      state.newClientForCall = action.payload.newClientForCall;
      state.totalNewClientForCall = action.payload.totalNewClientForCall;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },
    setNewClientForCallError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setNewClientForCallPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

export const {
  setNewClientForCallLoading,
  setNewClientForCallSuccess,
  setNewClientForCallError,
  setNewClientForCallPage,
} = newClientForCallSlice.actions;

export default newClientForCallSlice.reducer;
