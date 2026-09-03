import apiClient from './apiClient';

export const lawyerApi = {
  // Step 1: Account creation (Name, Email, Mobile, Password)
  registerStep1: (accountData) => {
    return apiClient.post('/api/lawyers/register/step1', accountData);
  },

  // Get saved lawyer registration progress
  getLawyerById: (id) => {
    return apiClient.get(`/api/lawyers/register/${id}`).catch(() => {
      return { status: 'FAIL', data: null, message: 'Lawyer record not found' };
    });
  },

  // Step 2: Professional details
  updateStep2: (lawyerId, profData) => {
    return apiClient.put(`/api/lawyers/register/${lawyerId}/step2`, profData);
  },

  // Step 3: Document Upload (multipart/form-data)
  uploadDocument: (lawyerId, documentType, file) => {
    const formData = new FormData();
    formData.append('documentType', documentType);
    formData.append('file', file);
    return apiClient.post(`/api/lawyers/register/${lawyerId}/step3`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // Step 4: Pricing setup (Accepts numeric amount or consultationRate enum)
  updateStep4: (lawyerId, amountOrRate) => {
    let payload = {};
    if (typeof amountOrRate === 'number' || (!isNaN(amountOrRate) && !String(amountOrRate).startsWith('RATE_'))) {
      payload = { amount: parseInt(amountOrRate, 10) || 99 };
    } else {
      payload = { consultationRate: amountOrRate || 'RATE_99' };
    }
    return apiClient.put(`/api/lawyers/register/${lawyerId}/step4`, payload);
  },

  // Step 5: UPI payout setup
  updateStep5: (lawyerId, upiId) => {
    return apiClient.put(`/api/lawyers/register/${lawyerId}/step5`, { upiId });
  },

  // Final Step: Submit for admin verification
  submitApplication: (lawyerId) => {
    return apiClient.put(`/api/lawyers/register/${lawyerId}/submit`);
  },
  submitForVerification: (lawyerId) => {
    return apiClient.put(`/api/lawyers/register/${lawyerId}/submit`);
  },

  // Lawyer Login
  login: (identifier, password) => {
    return apiClient.post('/api/lawyers/login', { identifier, password });
  },

  // Get all approved lawyers (Public directory from DB)
  getApprovedLawyers: () => {
    return apiClient.get('/api/lawyers/register/directory').catch(() => {
      return { status: 'SUCCESS', data: [] };
    });
  }
};
