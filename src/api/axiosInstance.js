import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://backend-jolkhabar.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Add interceptor to include token in every request
// Attach JWT token dynamically in every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// ✅ Handle 401/403 errors ONLY for protected endpoints
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;

    // Only redirect to login for protected endpoints (cart, orders, payment)
    const protectedEndpoints = ['/cart', '/orders', '/payment'];
    const isProtectedEndpoint = protectedEndpoints.some(endpoint => url?.includes(endpoint));

    if ((status === 401 || status === 403) && isProtectedEndpoint) {
      console.error('🔒 Authentication required. Redirecting to login...');
      
      // Clear stored auth data
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Redirect to login only once
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;