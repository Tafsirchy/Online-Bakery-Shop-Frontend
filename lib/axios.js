import axios from 'axios';

const DEFAULT_LOCAL_API_URL = 'http://localhost:5000/api';

const normalizeApiBaseUrl = (url) => {
  const base = url ? url.trim().replace(/\/+$/, '') : DEFAULT_LOCAL_API_URL.replace(/\/+$/, '');
  const withApi = base.endsWith('/api') ? base : `${base}/api`;
  return `${withApi}/`;
};

const instance = axios.create({
  baseURL: normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_URL),
});

// Add a request interceptor to include the token
instance.interceptors.request.use(
  (config) => {
    // Strip leading slash to ensure path is relative to baseURL (which ends in /api/)
    if (config.url && config.url.startsWith('/')) {
      config.url = config.url.substring(1);
    }

    const requestUrl = config.url || '';
    const isPublicAuthRoute =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/register') ||
      requestUrl.includes('/auth/google') ||
      requestUrl.includes('/auth/forgotpassword') ||
      requestUrl.includes('/auth/resetpassword');

    // Do not attach existing Authorization tokens to public auth endpoints.
    if (typeof window !== 'undefined' && !isPublicAuthRoute) {
      const authData = localStorage.getItem('auth-storage');
      if (authData) {
        const { state } = JSON.parse(authData);
        if (state?.token) {
          config.headers = config.headers || {};
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

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest = error.config?.url?.includes('/auth/login') || 
                         error.config?.url?.includes('/auth/register') || 
                         error.config?.url?.includes('/auth/google');

    if (error.response?.status === 401 && !isAuthRequest) {
      if (typeof window !== 'undefined') {
        const pathname = window.location.pathname;
        const isProtectedRoute = pathname.startsWith('/customer') || 
                               pathname.startsWith('/admin') || 
                               pathname.startsWith('/management') ||
                               pathname.startsWith('/checkout') ||
                               pathname.startsWith('/wishlist');

        localStorage.removeItem('auth-storage');
        
        if (isProtectedRoute) {
          window.location.href = '/login';
        } else {
          // Just reload to clear state or let the store handle it
          // window.location.reload(); 
        }
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
