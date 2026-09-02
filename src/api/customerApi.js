import apiClient from './apiClient';

export const customerApi = {
  register: (customerData) => {
    return apiClient.post('/api/customer/register', customerData);
  },

  login: (identifier, password) => {
    return apiClient.post('/api/customer/login', { identifier, password });
  },

  getProfile: (id) => {
    return apiClient.get(`/api/customer/${id}`);
  }
};
