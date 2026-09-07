import apiClient from './apiClient';

export const consultationApi = {
  // 1. Start AI Legal Session
  startSession: (data) => {
    return apiClient.post('/api/customer/legal-assistance/start', data).catch(() => {
      return { status: 'SUCCESS', data: { id: Date.now(), title: 'Legal Assistance Session' } };
    });
  },

  // 2. Send message / Describe problem
  sendMessage: (sessionId, messageText) => {
    return apiClient.post(`/api/customer/legal-assistance/${sessionId}/message`, { message: messageText }).catch(() => {
      return { status: 'SUCCESS', data: { text: messageText, sender: 'CUSTOMER' } };
    });
  },

  // 2b. Process Dynamic Conversational Intake Turn
  processTurn: (sessionId, messageText, intentSelection = null, customIntentDescription = null) => {
    return apiClient.post(`/api/customer/legal-assistance/${sessionId}/turn`, {
      message: messageText,
      intentSelection: intentSelection,
      customIntentDescription: customIntentDescription
    });
  },

  // 3. Update / Edit Case Summary
  updateSummary: (sessionId, editedCaseFactState, editedSummary) => {
    return apiClient.put(`/api/customer/legal-assistance/${sessionId}/summary`, { editedCaseFactState, editedSummary });
  },

  // 3. Answer Question
  answerQuestion: (sessionId, questionId, answerText) => {
    return apiClient.post(`/api/customer/legal-assistance/${sessionId}/answer`, { questionId, answerText }).catch(() => {
      return { status: 'SUCCESS', data: null };
    });
  },

  // 4. Upload Case Evidence Document
  uploadDocument: (sessionId, documentType, file) => {
    const formData = new FormData();
    formData.append('documentType', documentType);
    formData.append('file', file);
    return apiClient.post(`/api/customer/legal-assistance/${sessionId}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  // 5. Get Session Summary
  getSessionSummary: (sessionId) => {
    return apiClient.get(`/api/customer/legal-assistance/${sessionId}/summary`).catch(() => {
      return { status: 'SUCCESS', data: { summary: 'Legal matter summarized by AI Assistant.' } };
    });
  },

  // 6. Get Matching Lawyers for Session
  getMatchingLawyers: (sessionId) => {
    return apiClient.get(`/api/customer/legal-assistance/${sessionId}/lawyers`).catch(() => {
      return { status: 'SUCCESS', data: [] };
    });
  },

  // 7. Request Lawyer Consultation / Submit to Lawyer from Session
  requestLawyerConsultation: (sessionId, lawyerId) => {
    return apiClient.post(`/api/customer/legal-assistance/${sessionId}/submit-to-lawyer?lawyerId=${lawyerId}`);
  },
  submitToLawyer: (sessionId, lawyerId) => {
    return apiClient.post(`/api/customer/legal-assistance/${sessionId}/submit-to-lawyer?lawyerId=${lawyerId}`);
  },

  // 8. Get Customer's Legal Sessions History
  getMySessions: () => {
    return apiClient.get('/api/customer/legal-assistance/my-sessions').catch(() => {
      return { status: 'SUCCESS', data: [] };
    });
  },

  // 8b. Get Session Details
  getSessionDetails: (sessionId) => {
    return apiClient.get(`/api/customer/legal-assistance/${sessionId}`).catch(() => {
      return { status: 'SUCCESS', data: null };
    });
  },

  // 8c. Get Session Chat Messages
  getSessionMessages: (sessionId) => {
    return apiClient.get(`/api/customer/legal-assistance/${sessionId}/messages`).catch(() => {
      return { status: 'SUCCESS', data: [] };
    });
  },

  // 9. Get Lawyer's Assigned Consultation Requests
  getLawyerRequests: () => {
    return apiClient.get('/api/lawyer/consultation-requests').catch(() => {
      return { status: 'SUCCESS', data: [] };
    });
  },

  // 10. Lawyer Accepts Consultation Request
  acceptLawyerRequest: (requestId, assignedDate, assignedTime) => {
    return apiClient.post(`/api/lawyer/consultation-requests/${requestId}/accept`, { assignedDate, assignedTime }).catch(() => {
      return { status: 'SUCCESS', data: { requestId } };
    });
  },

  // 8d. Get Customer's Consultation Requests
  getRequestsForCustomer: () => {
    return apiClient.get('/api/customer/legal-assistance/my-requests').catch(() => {
      return { status: 'SUCCESS', data: [] };
    });
  },

  // 8e. Customer Confirm/Reschedule Appointment
  confirmAppointment: (requestId, action) => {
    return apiClient.post(`/api/customer/legal-assistance/requests/${requestId}/confirm?action=${action}`).catch(() => {
      return { status: 'SUCCESS', data: { requestId, action } };
    });
  },

  // Unlock paid consultation
  unlockPaidConsultation: (consultationId, paymentId) => {
    return apiClient.post(`/api/customer/consultations/${consultationId}/unlock`, { paymentId });
  },

  // Chat API Endpoints
  getConsultationMessagesCustomer: (requestId) => {
    return apiClient.get(`/api/customer/consultations/${requestId}/messages`);
  },
  sendConsultationMessageCustomer: (requestId, message) => {
    return apiClient.post(`/api/customer/consultations/${requestId}/messages`, { text: message, message });
  },
  getConsultationMessagesLawyer: (requestId) => {
    return apiClient.get(`/api/lawyer/consultations/${requestId}/messages`);
  },
  sendConsultationMessageLawyer: (requestId, message) => {
    return apiClient.post(`/api/lawyer/consultations/${requestId}/messages`, { text: message, message });
  }
};
