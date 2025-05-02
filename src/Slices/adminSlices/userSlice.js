// src/redux/slices/usersSlice.js
import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
  name: "users",
  initialState: {
    allUsers: [],
    loading: false,
    error: null,
  },
  reducers: {
    setAllUsers: (state, action) => {
      state.allUsers = action.payload;
    },
    setUsersLoading: (state) => {
      state.loading = true;
    },
    setUsersError: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setAllUsers, setUsersLoading, setUsersError } = usersSlice.actions;
export default usersSlice.reducer;
