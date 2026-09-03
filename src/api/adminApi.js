import apiClient from './apiClient';

export const adminApi = {
  // Pending & Lawyer Management
  getPendingLawyers: () => {
    return apiClient.get('/api/admin/lawyers/pending').catch(() => {
      return { status: 'SUCCESS', data: [] };
    });
  },

  getLawyerDetails: (lawyerId) => {
    return apiClient.get(`/api/admin/lawyers/${lawyerId}`);
  },

  approveLawyer: (lawyerId) => {
    return apiClient.post(`/api/admin/lawyers/${lawyerId}/approve`);
  },

  rejectLawyer: (lawyerId, rejectionReason) => {
    return apiClient.post(`/api/admin/lawyers/${lawyerId}/reject`, { rejectionReason });
  },

  // Admin Legal Assistance Audit
  getAllLegalSessions: () => {
    return apiClient.get('/api/admin/legal-assistance/sessions');
  },

  getSessionDetail: (sessionId) => {
    return apiClient.get(`/api/admin/legal-assistance/sessions/${sessionId}`);
  },

  getSessionDocuments: (sessionId) => {
    return apiClient.get(`/api/admin/legal-assistance/sessions/${sessionId}/documents`);
  }
};
