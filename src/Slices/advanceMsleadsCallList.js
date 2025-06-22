import { createSlice } from "@reduxjs/toolkit";

const AdvanceCallDoneSlice = createSlice({
  name: "AdvanceCallDone",
  initialState: {
    AdvanceCallDone: [],
    loading: false,
    error: null,
    totalAdvanceMsLeadsCallDone: 0,
    totalPages: 0,
    currentPage: 1,
  },
  reducers: {
    setAdvanceCallDoneLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setAdvanceCallDoneSuccess: (state, action) => {
      state.loading = false;
      state.AdvanceCallDone = action.payload.AdvanceCallDone;
      state.totalAdvanceMsLeadsCallDone = action.payload.totalAdvanceMsLeadsCallDone;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },
    setAdvanceCallDoneError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setAdvanceCallDonePage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

export const {
  setAdvanceCallDoneLoading,
  setAdvanceCallDoneSuccess,
  setAdvanceCallDoneError,
  setAdvanceCallDonePage,
} = AdvanceCallDoneSlice.actions;

export default AdvanceCallDoneSlice.reducer;
