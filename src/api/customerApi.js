import apiClient from './apiClient';

export const customerApi = {
  register: (customerData) => {
    return apiClient.post('/api/customer/register', customerData);
  },

  initiatePayment: (paymentData) => {
    return apiClient.post('/api/customer/payment/initiate', paymentData);
  },

  verifyPayment: (paymentData) => {
    return apiClient.post('/api/customer/payment/verify', paymentData);
  },

  login: (identifier, password) => {
    return apiClient.post('/api/customer/login', { identifier, password });
  },

  getProfile: (id) => {
    return apiClient.get(`/api/customer/${id}`);
  }
};
