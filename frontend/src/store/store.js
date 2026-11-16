// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice.js';

const store = configureStore({
  reducer: {
    auth: authReducer, // We connect our authSlice here
  },
  devTools: true, // This enables the Redux DevTools extension in your browser
});

export default store;