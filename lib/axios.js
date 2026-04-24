import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});

// Add a request interceptor to include the token
instance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const authData = localStorage.getItem('auth-storage');
      if (authData) {
        const { state } = JSON.parse(authData);
        if (state.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
