import { createSlice } from "@reduxjs/toolkit";

const codedRequestSlice = createSlice({
  name: "codedRequests",
  initialState: {
    codedRequests: [],
    loading: false,
    error: null,
    totalCodedRequests: 0,
    totalPages: 0,
    currentPage: 1,
  },
  reducers: {
    setCodedLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setCodedSuccess: (state, action) => {
      state.loading = false;
      state.codedRequests = action.payload.codedRequests;
      state.totalCodedRequests = action.payload.totalCodedRequests;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },
    setCodedError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setCodedLoading, setCodedSuccess, setCodedError } = codedRequestSlice.actions;

export default codedRequestSlice.reducer;
