import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle } from 'lucide-react';

const AssignTimeModal = ({ isOpen, onClose, consultation, onAssignSuccess }) => {
  const [assignedDate, setAssignedDate] = useState('');
  const [assignedTime, setAssignedTime] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !consultation) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!assignedDate || !assignedTime) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (onAssignSuccess) {
        onAssignSuccess(consultation.id, assignedDate, assignedTime);
      }
      onClose();
    }, 800);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="payment-modal-header">
          <h3>Accept & Assign Consultation Time</h3>
          <button onClick={onClose} className="close-btn"><X size={20} /></button>
        </div>

        <div style={{ margin: '1rem 0' }}>
          <p style={{ margin: '0.2rem 0' }}><strong>Customer:</strong> {consultation.customerName || consultation.fullName || 'Client'}</p>
          <p style={{ margin: '0.2rem 0' }}><strong>Matter Category:</strong> {consultation.categoryDisplayName || consultation.category || 'General Legal Matter'}</p>
          {(consultation.caseSummary || consultation.summary || consultation.requestMessage) && (
            <div style={{ background: '#F8FAFC', padding: '0.75rem', borderRadius: '8px', borderLeft: '3px solid #C9A227', marginTop: '0.5rem', fontSize: '0.82rem', color: '#102A43', whiteSpace: 'pre-line', lineHeight: '1.4' }}>
              <div style={{ fontWeight: 700, color: '#C9A227', marginBottom: '0.25rem' }}>📌 Shared AI Case Assessment Summary:</div>
              {consultation.caseSummary || consultation.summary || consultation.requestMessage}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Select Meeting Date <span className="required">*</span></label>
            <input 
              type="date" 
              className="form-input"
              value={assignedDate}
              onChange={(e) => setAssignedDate(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Select Meeting Time <span className="required">*</span></label>
            <input 
              type="time" 
              className="form-input"
              value={assignedTime}
              onChange={(e) => setAssignedTime(e.target.value)}
              required 
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button type="button" className="btn btn-secondary flex-1" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-gold flex-1" disabled={loading}>
              {loading ? 'Assigning...' : 'Confirm Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignTimeModal;
