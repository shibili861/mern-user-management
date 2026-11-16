// src/api.js
import axios from 'axios';

// 1. Create a custom Axios instance pointing to your backend
const api = axios.create({
  baseURL: 'http://localhost:5000', // Your Node.js server URL
});

// 2. Add an Interceptor (The Bouncer for outgoing requests)
// Before any request leaves the frontend, this function runs.
api.interceptors.request.use(
  (config) => {
    // Look inside localStorage for the user's data
    const userInfo = localStorage.getItem('userInfo');
    
    if (userInfo) {
      const parsedInfo = JSON.parse(userInfo);
      // If we have a token, attach it to the Authorization header!
      if (parsedInfo.token) {
        config.headers.Authorization = `Bearer ${parsedInfo.token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;