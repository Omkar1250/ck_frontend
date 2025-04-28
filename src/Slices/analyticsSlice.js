import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  analytics: {},
  error: null,
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setAnalyticsData: (state, action) => {
      state.loading = false;
      state.analytics = action.payload;
    },
    setAnalyticsError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setLoading, setAnalyticsData, setAnalyticsError } = analyticsSlice.actions;
export default analyticsSlice.reducer;
