import { createSlice } from "@reduxjs/toolkit";

const AdvanceCodedRequestSlice = createSlice({
  name: "advanceCodedRequests",
  initialState: {
    advanceCodedRequests: [],
    loading: false,
    error: null,
    totalAdvanceCodedRequests: 0,
    totalPages: 0,
    currentPage: 1,
  },
  reducers: {
    setAdvanceCodedLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setAdvanceCodedSuccess: (state, action) => {
      state.loading = false;
      state.advanceCodedRequests = action.payload.advanceCodedRequests;
      state.totalAdvanceCodedRequests = action.payload.totalAdvanceCodedRequests;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },
    setAdvanceCodedError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  setAdvanceCodedLoading,
  setAdvanceCodedSuccess,
  setAdvanceCodedError,
} = AdvanceCodedRequestSlice.actions;

export default AdvanceCodedRequestSlice.reducer;
