// src/store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

// 2. Initial State: The default values when the app first loads
const initialState = {
  userInfo: userInfoFromStorage,
};

// 3. The Slice: Holds the state and the reducers (functions that change the state)
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // When a user logs in, we save their data to Redux AND localStorage
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    // When a user logs out, we wipe the data from Redux AND localStorage
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;