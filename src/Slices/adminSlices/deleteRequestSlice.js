import { createSlice } from "@reduxjs/toolkit";

const deleteRequestsSlice = createSlice({
  name: "deleteRequests",
  initialState: {
    deleteRequests: [],
    loading: false,
    error: null,
    totalDeleteRequests: 0,
    totalPages: 0,
    currentPage: 1,
  },
  reducers: {
    setDeleteLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setDeleteSuccess: (state, action) => {
      state.loading = false;
      state.deleteRequests = action.payload.deleteRequests;
      state.totalDeleteRequests = action.payload.totalDeleteRequests;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },
    setDeleteError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setDeleteLoading, setDeleteSuccess, setDeleteError } = deleteRequestsSlice.actions;

export default deleteRequestsSlice.reducer;
