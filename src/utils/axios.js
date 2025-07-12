import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: 'https://job-application-backend-6jgg.onrender.com/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth headers if needed
api.interceptors.request.use(
  (config) => {
    // You can add auth headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear any stored auth data
      console.log('Unauthorized access - clearing auth data');
    }
    return Promise.reject(error);
  }
);

export default api; 