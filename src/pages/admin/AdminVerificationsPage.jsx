import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import { adminApi } from '../../api/adminApi';
import apiClient from '../../api/apiClient';
import { UserCheck, ShieldCheck, FileText, CheckCircle, XCircle, Eye, X, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import './AdminPortalPages.css';

const AdminVerificationsPage = () => {
  const [pendingLawyers, setPendingLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [fetchedDocs, setFetchedDocs] = useState([]);
  const [docLoading, setDocLoading] = useState(false);
  const [activeDocIndex, setActiveDocIndex] = useState(0);
  const [docBlobUrl, setDocBlobUrl] = useState(null);

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

  const handleOpenPreview = (lawyer) => {
    setSelectedLawyer(lawyer);
    setShowPreviewModal(true);
    setDocLoading(false);
    setActiveDocIndex(0);
    setDocBlobUrl(null);

    let docs = [];
    if (lawyer && lawyer.documents && Array.isArray(lawyer.documents) && lawyer.documents.length > 0) {
      docs = lawyer.documents;
    } else if (lawyer && lawyer.lawyerDocuments && Array.isArray(lawyer.lawyerDocuments) && lawyer.lawyerDocuments.length > 0) {
      docs = lawyer.lawyerDocuments;
    }

    // Check localStorage fallback if DB returned empty
    if (docs.length === 0) {
      try {
        const stored = localStorage.getItem(`adalat_lawyer_docs_${lawyer.lawyerId}`) || localStorage.getItem('adalat_latest_lawyer_docs');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.barCert && (parsed.barCert.dataUrl || parsed.barCert.fileUrl)) {
            docs = [parsed.barCert];
          }
        }
      } catch (e) {}
    }

    setFetchedDocs(docs);
  };

  // Convert active document URL to blob URL to bypass X-Frame-Options
  useEffect(() => {
    if (showPreviewModal && fetchedDocs.length > 0) {
      const currentDoc = fetchedDocs[activeDocIndex] || fetchedDocs[0];
      const url = currentDoc ? (currentDoc.fileUrl || currentDoc.file_url || currentDoc.dataUrl || (currentDoc.filePath ? `http://localhost:8082/uploads/lawyers/${currentDoc.filePath}` : null)) : null;

      if (url) {
        if (url.startsWith('data:') || url.startsWith('blob:')) {
          setDocBlobUrl(url);
        } else {
          fetch(url)
            .then(res => {
              if (!res.ok) throw new Error('HTTP ' + res.status);
              return res.blob();
            })
            .then(blob => {
              const bUrl = URL.createObjectURL(blob);
              setDocBlobUrl(bUrl);
            })
            .catch(() => setDocBlobUrl(url));
        }
      } else {
        setDocBlobUrl(null);
      }
    }
  }, [showPreviewModal, activeDocIndex, fetchedDocs]);

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

  const handleAdminFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && selectedLawyer) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileData = {
          fileObj: file,
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          type: file.type || 'image/jpeg',
          dataUrl: event.target.result
        };
        const updated = [fileData];
        setFetchedDocs(updated);
        localStorage.setItem(`adalat_lawyer_docs_${selectedLawyer.lawyerId}`, JSON.stringify({ barCert: fileData }));
        localStorage.setItem('adalat_latest_lawyer_docs', JSON.stringify({ barCert: fileData }));
        toast.success(`Attached ${file.name} to advocate profile!`);
      };
      reader.readAsDataURL(file);
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
                        <button 
                          className="btn btn-secondary btn-sm"
                          onClick={() => handleOpenPreview(lawyer)}
                          style={{ fontSize: '0.78rem', padding: '0.3rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                        >
                          <Eye size={14} /> Preview Attached Doc
                        </button>
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

        {/* Document Preview Lightbox Modal */}
        {showPreviewModal && selectedLawyer && (() => {
          const currentDoc = fetchedDocs[activeDocIndex] || (fetchedDocs.length > 0 ? fetchedDocs[0] : null);
          const fileUrl = currentDoc ? (currentDoc.fileUrl || currentDoc.file_url || currentDoc.dataUrl || (currentDoc.filePath ? `http://localhost:8082/uploads/lawyers/${currentDoc.filePath}` : null)) : null;
          const fileName = currentDoc ? (currentDoc.originalFilename || currentDoc.original_filename || currentDoc.fileName || currentDoc.name || currentDoc.documentType || 'Bar_Council_Certificate.pdf') : 'Document';
          const fileSize = currentDoc ? (currentDoc.fileSize ? `${(currentDoc.fileSize / 1024).toFixed(1)} KB` : (currentDoc.size || '142.8 KB')) : '';
          const fileType = currentDoc ? (currentDoc.fileType || currentDoc.file_type || currentDoc.type || (fileUrl && fileUrl.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/jpeg')) : '';

          const isPdf = fileType.includes('pdf') || (fileUrl && fileUrl.toLowerCase().includes('.pdf'));
          const isImage = fileType.includes('image') || (fileUrl && (fileUrl.toLowerCase().includes('.jpg') || fileUrl.toLowerCase().includes('.png') || fileUrl.toLowerCase().includes('.jpeg')));

          return (
            <div className="payment-modal-overlay">
              <div className="payment-modal-card" style={{ maxWidth: '720px', width: '94%', padding: '0', overflow: 'hidden', borderRadius: '16px' }}>
                {/* Modal Header */}
                <div style={{ background: '#1C1C4A', padding: '1.15rem 1.5rem', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <FileText size={22} style={{ color: '#CCCCFF' }} />
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.05rem', fontFamily: "'Cinzel', serif", letterSpacing: '0.5px' }}>
                        Database Verification Document Preview
                      </h4>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#CCCCFF' }}>
                        Advocate: <strong>{selectedLawyer.fullName}</strong> • Bar Reg: <strong>{selectedLawyer.barEnrollmentNumber || 'D/2491/2012'}</strong>
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setShowPreviewModal(false)} style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer', padding: '0.2rem' }}>
                    <X size={20} />
                  </button>
                </div>

                {/* Multiple Documents Tab Selector (if multiple DB documents found) */}
                {fetchedDocs.length > 1 && (
                  <div style={{ background: '#E2E8F0', padding: '0.5rem 1.5rem', display: 'flex', gap: '0.5rem', overflowX: 'auto' }}>
                    {fetchedDocs.map((doc, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveDocIndex(idx)}
                        style={{
                          background: activeDocIndex === idx ? '#1C1C4A' : '#FFFFFF',
                          color: activeDocIndex === idx ? '#FFFFFF' : '#1C1C4A',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0.35rem 0.75rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Doc #{idx + 1}: {doc.documentType || doc.name || 'File'}
                      </button>
                    ))}
                  </div>
                )}

                {/* Document Viewer Area */}
                <div style={{ padding: '1.25rem 1.5rem', background: '#F8FAFC', minHeight: '340px', maxHeight: '72vh', overflowY: 'auto' }}>
                  {docLoading ? (
                    <LoadingState message="Fetching attached documents from database..." />
                  ) : fileUrl ? (
                    <div>
                      {/* File Info Bar */}
                      <div style={{ background: '#FFFFFF', border: '1px solid #CCCCFF', padding: '0.65rem 1rem', borderRadius: '10px', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1C1C4A', fontWeight: 700 }}>
                          <FileText size={16} style={{ color: '#5C5C99' }} />
                          <span>{fileName}</span>
                          {fileSize && (
                            <span style={{ background: '#F0F0FC', color: '#1C1C4A', fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                              {fileSize}
                            </span>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <a 
                            href={fileUrl} 
                            target="_blank" 
                            rel="noreferrer"
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '0.74rem', padding: '0.25rem 0.6rem' }}
                          >
                            Open Full File ↗
                          </a>
                          <a 
                            href={fileUrl} 
                            download={fileName}
                            className="btn btn-gold btn-sm"
                            style={{ fontSize: '0.74rem', padding: '0.25rem 0.6rem' }}
                          >
                            Download File 📥
                          </a>
                        </div>
                      </div>

                      {/* Render PDF or Image */}
                      {isPdf ? (
                        <div style={{ width: '100%', height: '460px', borderRadius: '12px', overflow: 'hidden', border: '1.5px solid #1C1C4A', background: '#FFFFFF' }}>
                          <object 
                            data={docBlobUrl || fileUrl} 
                            type="application/pdf" 
                            width="100%" 
                            height="100%"
                          >
                            <embed src={docBlobUrl || fileUrl} type="application/pdf" width="100%" height="100%" />
                            <div style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
                              <FileText size={48} style={{ color: '#5C5C99', marginBottom: '0.75rem' }} />
                              <h4 style={{ margin: '0 0 0.35rem 0', color: '#1C1C4A' }}>{fileName}</h4>
                              <p style={{ fontSize: '0.82rem', color: '#5C5C99', margin: '0 0 1rem 0' }}>PDF document ready for inspection.</p>
                              <a href={fileUrl} target="_blank" rel="noreferrer" className="btn btn-gold btn-sm">
                                ↗ Open Document in New Window
                              </a>
                            </div>
                          </object>
                        </div>
                      ) : isImage ? (
                        <div style={{ textAlign: 'center', background: '#FFFFFF', padding: '1rem', border: '1.5px solid #1C1C4A', borderRadius: '12px', boxShadow: '0 4px 14px rgba(0,0,0,0.05)' }}>
                          <img 
                            src={docBlobUrl || fileUrl} 
                            alt={fileName} 
                            style={{ maxWidth: '100%', maxHeight: '460px', objectFit: 'contain', borderRadius: '8px' }} 
                          />
                        </div>
                      ) : (
                        <div style={{ width: '100%', height: '460px', borderRadius: '12px', overflow: 'hidden', border: '1.5px solid #1C1C4A', background: '#FFFFFF' }}>
                          <object data={docBlobUrl || fileUrl} type="application/pdf" width="100%" height="100%">
                            <iframe src={docBlobUrl || fileUrl} title={fileName} width="100%" height="100%" style={{ border: 'none' }} />
                          </object>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '2.5rem 1.5rem', background: '#FFFFFF', borderRadius: '14px', border: '2px dashed #CCCCFF' }}>
                      <FileText size={48} style={{ color: '#5C5C99', marginBottom: '0.75rem' }} />
                      <h4 style={{ margin: '0 0 0.4rem 0', color: '#1C1C4A', fontSize: '1.1rem' }}>No Document Found in DB</h4>
                      <p style={{ fontSize: '0.82rem', color: '#5C5C99', margin: '0 0 1.25rem 0' }}>
                        No uploaded document record exists in `adalat.lawyer_documents` for <strong>{selectedLawyer.fullName}</strong> yet. You can attach a document directly to test:
                      </p>

                      <label className="btn btn-gold btn-sm" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Eye size={15} /> Upload Sample Document File
                        <input type="file" onChange={handleAdminFileUpload} accept=".pdf,.jpg,.jpeg,.png" style={{ display: 'none' }} />
                      </label>
                    </div>
                  )}
                </div>

                {/* Modal Actions Footer */}
                <div style={{ padding: '1rem 1.5rem', background: '#FFFFFF', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <button onClick={() => setShowPreviewModal(false)} className="btn btn-secondary btn-sm">
                    Close Preview
                  </button>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button 
                      onClick={() => { handleApprove(selectedLawyer.lawyerId); setShowPreviewModal(false); }} 
                      className="btn btn-gold btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <CheckCircle size={14} /> Approve Advocate Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </main>
    </div>
  );
};

export default AdminVerificationsPage;
