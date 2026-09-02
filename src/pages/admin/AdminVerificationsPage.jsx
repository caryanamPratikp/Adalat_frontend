import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import { adminApi } from '../../api/adminApi';
import { UserCheck, ShieldCheck, FileText, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import './AdminPortalPages.css';

const AdminVerificationsPage = () => {
  const [pendingLawyers, setPendingLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const fetchPending = () => {
    setLoading(true);
    adminApi.getPendingLawyers()
      .then(res => {
        if (res && res.data && Array.isArray(res.data)) {
          setPendingLawyers(res.data);
        } else {
          setPendingLawyers([]);
        }
      })
      .catch(() => setPendingLawyers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApprove = async (lawyerId) => {
    setActionLoading(true);
    setMsg('');
    try {
      await adminApi.approveLawyer(lawyerId);
      const successMsg = `Lawyer ID ${lawyerId} successfully APPROVED! Account is now ACTIVE and visible to customers.`;
      setMsg(successMsg);
      toast.success(successMsg);
      fetchPending();
    } catch (err) {
      const errMsg = err.message || 'Approval failed.';
      setMsg(errMsg);
      toast.error(errMsg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim() || !selectedLawyer) return;
    setActionLoading(true);
    try {
      await adminApi.rejectLawyer(selectedLawyer.lawyerId, rejectionReason);
      const rejectMsg = `Lawyer ID ${selectedLawyer.lawyerId} REJECTED.`;
      setMsg(rejectMsg);
      toast.info(rejectMsg);
      setShowRejectModal(false);
      setRejectionReason('');
      fetchPending();
    } catch (err) {
      const errMsg = err.message || 'Rejection failed.';
      setMsg(errMsg);
      toast.error(errMsg);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="portal-layout">
      <Sidebar portalType="admin" />

      <main className="portal-main-content">
        <div className="portal-header">
          <div className="header-badge-row">
            <span className="badge badge-gold"><UserCheck size={13} /> Admin Panel</span>
          </div>
          <h1>Lawyer Verification Management</h1>
          <p>Review advocate Bar Council certificates, academic documents, and approve accounts for public customer listing.</p>
        </div>

        {msg && (
          <div className="admin-alert-banner card">
            <CheckCircle size={18} /> {msg}
          </div>
        )}

        <div className="section-card card">
          {loading ? (
            <LoadingState message="Fetching pending lawyer applications..." />
          ) : pendingLawyers.length === 0 ? (
            <EmptyState 
              icon={ShieldCheck}
              title="No Pending Applications"
              message="There are currently no pending lawyer verification applications awaiting admin review."
            />
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Advocate Info</th>
                    <th>Bar Reg Number</th>
                    <th>Experience</th>
                    <th>Specializations</th>
                    <th>UPI ID</th>
                    <th>Documents</th>
                    <th>Status</th>
                    <th>Admin Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingLawyers.map(lawyer => (
                    <tr key={lawyer.lawyerId}>
                      <td>
                        <strong>{lawyer.fullName}</strong>
                        <div className="sub-text">{lawyer.email} • {lawyer.mobileNumber}</div>
                      </td>
                      <td><strong>{lawyer.barEnrollmentNumber || 'Not Provided'}</strong></td>
                      <td>{lawyer.yearsOfExperience !== null && lawyer.yearsOfExperience !== undefined ? `${lawyer.yearsOfExperience} Yrs` : 'N/A'}</td>
                      <td>
                        <div className="tags-flex">
                          {lawyer.practiceAreas && lawyer.practiceAreas.length > 0 ? (
                            lawyer.practiceAreas.map((p, i) => (
                              <span key={i} className="mini-tag">{typeof p === 'string' ? p.replace('_', ' ') : p}</span>
                            ))
                          ) : (
                            <span className="sub-text">None selected</span>
                          )}
                        </div>
                      </td>
                      <td><code>{lawyer.upiId || 'Not Set'}</code></td>
                      <td>
                        {lawyer.documents && lawyer.documents.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            {lawyer.documents.map((doc, idx) => (
                              <a 
                                key={idx} 
                                href={`http://localhost:8082/uploads/lawyers/${doc.filePath || ''}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="btn btn-secondary btn-sm"
                                style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                              >
                                <FileText size={12} /> {doc.documentType || 'Inspect Document'}
                              </a>
                            ))}
                          </div>
                        ) : (
                          <span className="sub-text">No document uploaded</span>
                        )}
                      </td>
                      <td><StatusBadge status={lawyer.verificationStatus || 'PENDING'} /></td>
                      <td>
                        <div className="admin-action-btns">
                          <button 
                            className="btn btn-gold btn-sm"
                            onClick={() => handleApprove(lawyer.lawyerId)}
                            disabled={actionLoading}
                          >
                            <CheckCircle size={13} /> Approve
                          </button>
                          <button 
                            className="btn btn-danger btn-sm"
                            onClick={() => { setSelectedLawyer(lawyer); setShowRejectModal(true); }}
                            disabled={actionLoading}
                          >
                            <XCircle size={13} /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {showRejectModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Reject Lawyer Application</h3>
              <p>Advocate: <strong>{selectedLawyer?.fullName}</strong></p>
              <form onSubmit={handleRejectSubmit} className="form-group" style={{ marginTop: '1rem' }}>
                <label className="form-label">Rejection Reason <span className="required">*</span></label>
                <textarea 
                  className="form-textarea" 
                  rows="3" 
                  placeholder="e.g. Invalid Bar Council Enrollment certificate or incomplete document details..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  required 
                ></textarea>
                <div className="modal-actions-row" style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem' }}>
                  <button type="button" className="btn btn-secondary flex-1" onClick={() => setShowRejectModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-danger flex-1" disabled={actionLoading}>Confirm Rejection</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminVerificationsPage;
