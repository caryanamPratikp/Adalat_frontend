import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8082',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor to attach JWT auth token (Tab-isolated via sessionStorage)
apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('adalat_token') || localStorage.getItem('adalat_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor to extract backend ApiResponseDTO data cleanly
apiClient.interceptors.response.use((response) => {
  return response.data;
}, (error) => {
  const errorMsg = error.response?.data?.message || error.response?.data || error.message || 'Server request failed';
  return Promise.reject(new Error(errorMsg));
});

export default apiClient;
