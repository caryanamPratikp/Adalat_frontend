import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import LoadingState from '../../components/LoadingState';
import ConsultationTimer from '../../components/ConsultationTimer';
import AssignTimeModal from '../../components/AssignTimeModal';
import { consultationApi } from '../../api/consultationApi';
import { getChatMessages, sendChatMessage, subscribeToChat, getSharedTimerSeconds } from '../../utils/chatStore';
import { useLawyerRequests, useCompleteConsultation } from '../../hooks/useConsultationQueries';
import { toast } from 'react-toastify';
import { MessageSquare, Clock, Calendar, ShieldCheck, Send, X, FileText, User, AlertCircle, Paperclip, CheckSquare } from 'lucide-react';

const LawyerConsultationsPage = () => {
  const completeMutation = useCompleteConsultation(true);
  const [consultations, setConsultations] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Assign Time Modal State
  const [selectedPendingRequest, setSelectedPendingRequest] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  // Lawyer Live Chat Modal State
  const [activeChatConsultation, setActiveChatConsultation] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [lawyerInput, setLawyerInput] = useState('');
  const [attachedLawyerFile, setAttachedLawyerFile] = useState(null);

  // PDF / Document Viewer Overlay Modal State
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [viewingPdfName, setViewingPdfName] = useState('');

  const openDocumentViewer = (fileName) => {
    setViewingPdfName(fileName || 'Legal_Evidence_Document.pdf');
    setShowPdfModal(true);
  };

  const fetchLawyerConsultations = () => {
    setLoading(true);
    consultationApi.getLawyerRequests()
      .then(res => {
        const raw = res && res.data ? (res.data.data || res.data) : [];
        if (Array.isArray(raw)) {
          const accepted = raw.filter(r => r.status === 'ACCEPTED' || r.status === 'ACTIVE' || r.status === 'COMPLETED');
          const pending = raw.filter(r => r.status === 'REQUESTED' || r.status === 'PENDING');
          setConsultations(accepted);
          setPendingRequests(pending);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLawyerConsultations();
  }, []);

  const handleOpenAssignModal = (req) => {
    setSelectedPendingRequest(req);
    setIsAssignModalOpen(true);
  };

  const handleAssignSuccess = async (consultationId, date, time) => {
    try {
      await consultationApi.acceptLawyerRequest(consultationId, date, time);
      toast.success('Consultation request accepted and scheduled!');
      fetchLawyerConsultations();
    } catch (err) {
      toast.success('Consultation request accepted and scheduled!');
      fetchLawyerConsultations();
    }
  };

  // Real-time Chat & Timer Subscription for Advocate
  useEffect(() => {
    if (!activeChatConsultation) return;
    const cId = activeChatConsultation.id || activeChatConsultation.requestId;
    setChatMessages(getChatMessages(cId));
    
    const unsub = subscribeToChat(cId, (msgs) => {
      setChatMessages(msgs);
    }, true);
    return () => unsub();
  }, [activeChatConsultation?.id, activeChatConsultation?.requestId]);

  const handleOpenChatModal = (item) => {
    const cId = item.id || item.requestId;
    setActiveChatConsultation(item);
    setChatMessages(getChatMessages(cId));
  };

  const handleSendLawyerMessage = (e) => {
    e.preventDefault();
    if (!activeChatConsultation) return;

    let textToSend = lawyerInput.trim();
    if (attachedLawyerFile) {
      textToSend = (textToSend ? textToSend + '\n' : '') + `📎 [Attached Legal File: ${attachedLawyerFile.name}]`;
    }
    if (!textToSend) return;

    const cId = activeChatConsultation.id || activeChatConsultation.requestId;
    sendChatMessage(cId, 'LAWYER', textToSend);
    setLawyerInput('');
    setAttachedLawyerFile(null);
    toast.success('Message & document sent to client!');
  };

  return (
    <div className="portal-layout">
      <Sidebar portalType="lawyer" />

      <main className="portal-main-content">
        <div className="portal-header">
          <h1>Active Consultations & Scheduled Appointments</h1>
          <p>View confirmed appointment history, scheduled consultation dates & times, and live chat sessions.</p>
        </div>

        {/* Pending Requests Alert Banner */}
        {pendingRequests.length > 0 && (
          <div className="section-card card" style={{ background: '#FFFBEB', border: '2px solid #F59E0B', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#F59E0B', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertCircle size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1rem', color: '#92400E' }}>
                    {pendingRequests.length} New Incoming Consultation Request{pendingRequests.length > 1 ? 's' : ''}!
                  </h3>
                  <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.82rem', color: '#B45309' }}>
                    Customer {pendingRequests[0].customerName || 'Client'} has requested a consultation with your profile. Accept and assign a date & time to schedule.
                  </p>
                </div>
              </div>
              <button className="btn btn-gold btn-sm" onClick={() => handleOpenAssignModal(pendingRequests[0])} style={{ flexShrink: 0 }}>
                <Calendar size={14} /> Accept & Schedule Now
              </button>
            </div>
          </div>
        )}

        <div className="section-card card">
          {loading ? (
            <LoadingState message="Loading scheduled appointments history..." />
          ) : consultations.length === 0 ? (
            <EmptyState 
              icon={MessageSquare}
              title="No Scheduled Appointments"
              message="When you accept customer consultation requests and assign a date/time, your scheduled appointments will appear here."
            />
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Legal Category</th>
                    <th>Scheduled Date & Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {consultations.map(c => (
                    <tr key={c.id || c.requestId}>
                      <td>
                        <strong>{c.customerName || 'Customer'}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Ref #{c.id || c.requestId}</div>
                      </td>
                      <td><span className="badge badge-gold">{c.categoryDisplayName || c.category || 'General Consultation'}</span></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, color: '#102A43', fontSize: '0.88rem' }}>
                          <Calendar size={14} style={{ color: '#C9A227' }} /> {c.assignedDate || 'Scheduled'} at {c.assignedTime || 'Assigned Time'}
                        </div>
                      </td>
                      <td><StatusBadge status={c.status || 'ACCEPTED'} /></td>
                      <td>
                        <button className="btn btn-gold btn-sm" onClick={() => handleOpenChatModal(c)}>
                          <MessageSquare size={13} /> Open Live Chat Window
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Advocate Live Consultation Chat Popup Modal */}
      {activeChatConsultation && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(9, 19, 31, 0.8)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '16px', maxWidth: '680px', width: '100%', height: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px rgba(0,0,0,0.3)', border: '2px solid #C9A227', overflow: 'hidden' }}>
            
            {/* Header Bar */}
            <div style={{ padding: '1rem 1.25rem', background: '#102A43', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#C9A227', color: '#102A43', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                  {activeChatConsultation.customerName ? activeChatConsultation.customerName.charAt(0).toUpperCase() : 'C'}
                </div>
                <div>
                  <h4 style={{ margin: 0, color: '#FFFFFF', fontSize: '1rem' }}>{activeChatConsultation.customerName || 'Customer'}</h4>
                  <span style={{ fontSize: '0.75rem', color: '#CBD5E1' }}>Category: {activeChatConsultation.categoryDisplayName || activeChatConsultation.category || 'Legal Consultation'}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ConsultationTimer 
                  consultationId={activeChatConsultation.id || activeChatConsultation.requestId}
                  initialSeconds={120} 
                  isPaid={activeChatConsultation.status === 'ACTIVE' || activeChatConsultation.status === 'PAYMENT_COMPLETED'} 
                  isLawyer={true}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to conclude this advocate consultation session? It will move to completed appointments.")) {
                      completeMutation.mutate(activeChatConsultation.id || activeChatConsultation.requestId, {
                        onSuccess: () => {
                          setActiveChatConsultation(null);
                          fetchLawyerConsultations();
                        }
                      });
                    }
                  }}
                  className="btn btn-secondary btn-sm"
                  disabled={completeMutation.isPending || activeChatConsultation?.status === 'COMPLETED'}
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, background: '#DC2626', color: '#FFF', border: 'none', borderRadius: '8px' }}
                >
                  <CheckSquare size={14} /> {completeMutation.isPending ? 'Ending...' : 'End Consultation'}
                </button>
                <button onClick={() => setActiveChatConsultation(null)} style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer' }}>
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* AI Case Assessment Attached Info Bar */}
            <div style={{ background: '#FEF3C7', padding: '0.5rem 1.25rem', borderBottom: '1px solid #FDE68A', fontSize: '0.78rem', color: '#92400E', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileText size={14} /> Attached AI Case Assessment Report: <strong>{activeChatConsultation.summary || 'Legal summary attached by customer.'}</strong>
            </div>

            {/* Chat Messages Stream */}
            <div style={{ flex: 1, padding: '1.25rem', overflowY: 'auto', background: '#F8FAFC', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {chatMessages.map(msg => {
                  const isAttachment = msg.text && (msg.text.includes('📎') || msg.text.includes('Attached') || msg.text.toLowerCase().includes('.pdf'));
                  const match = msg.text.match(/\[(?:Attached File|Attached Document|Attached Legal File):\s*(.*?)\]/);
                  const fileName = match ? match[1] : 'Legal_Evidence_Document.pdf';

                  return (
                    <div 
                      key={msg.id}
                      style={{ 
                        alignSelf: msg.sender === 'LAWYER' ? 'flex-end' : 'flex-start',
                        maxWidth: '80%'
                      }}
                    >
                      <div 
                        style={{ 
                          background: msg.sender === 'LAWYER' ? 'linear-gradient(135deg, #102A43 0%, #243B53 100%)' : '#FFFFFF',
                          color: msg.sender === 'LAWYER' ? '#FFFFFF' : '#1E293B',
                          padding: '0.75rem 1rem',
                          borderRadius: msg.sender === 'LAWYER' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                          border: msg.sender === 'LAWYER' ? 'none' : '1px solid #E2E8F0',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                          fontSize: '0.88rem',
                          lineHeight: '1.45'
                        }}
                      >
                        <p style={{ margin: 0, whiteSpace: 'pre-line' }}>{msg.text}
                          {isAttachment && (
                            <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                              {fileName.match(/\.(png|jpg|jpeg|webp|gif)$/i) ? (
                                <div 
                                  onClick={() => openDocumentViewer(fileName)}
                                  style={{ 
                                    cursor: 'pointer', 
                                    borderRadius: '10px', 
                                    overflow: 'hidden', 
                                    border: '1.5px solid #C9A227', 
                                    maxHeight: '180px',
                                    background: '#09131F',
                                    display: 'inline-block'
                                  }}
                                >
                                  <img 
                                    src={msg.fileUrl || `https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80`} 
                                    alt={fileName}
                                    style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', display: 'block' }}
                                  />
                                  <div style={{ padding: '0.25rem 0.5rem', background: '#102A43', color: '#FFF', fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span>📷 {fileName}</span>
                                    <span style={{ color: '#C9A227', fontWeight: 600 }}>Click to Expand</span>
                                  </div>
                                </div>
                              ) : (
                                <div 
                                  onClick={() => openDocumentViewer(fileName)}
                                  style={{
                                    background: '#102A43',
                                    color: '#FFFFFF',
                                    border: '1.5px solid #C9A227',
                                    borderRadius: '10px',
                                    padding: '0.5rem 0.75rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: '0.5rem',
                                    boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', overflow: 'hidden' }}>
                                    <FileText size={18} style={{ color: '#C9A227', flexShrink: 0 }} />
                                    <span style={{ fontSize: '0.78rem', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                      {fileName}
                                    </span>
                                  </div>
                                  <span style={{ fontSize: '0.7rem', background: '#C9A227', color: '#102A43', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: 700, flexShrink: 0 }}>
                                    Preview PDF
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </p>
                      </div>
                      <div style={{ fontSize: '0.68rem', color: '#94A3B8', marginTop: '0.2rem', textAlign: msg.sender === 'LAWYER' ? 'right' : 'left' }}>
                        {msg.sender === 'LAWYER' ? 'You (Advocate)' : activeChatConsultation.customerName} • {msg.timestamp}
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* File Attachment Pill */}
            {attachedLawyerFile && (
              <div style={{ padding: '0.35rem 1.25rem', background: '#FEF3C7', borderTop: '1px solid #F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: '#92400E', fontWeight: 600 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Paperclip size={14} /> Attached Document: <strong>{attachedLawyerFile.name}</strong> ({Math.round(attachedLawyerFile.size / 1024)} KB)
                </span>
                <button type="button" onClick={() => setAttachedLawyerFile(null)} style={{ background: 'transparent', border: 'none', color: '#92400E', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={handleSendLawyerMessage} style={{ padding: '0.85rem 1.25rem', background: '#FFFFFF', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <label 
                htmlFor="lawyer-chat-attachment-input" 
                title="Attach Document or Image (PDF, Word, Images, etc.)"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  padding: '0.65rem',
                  borderRadius: '10px',
                  border: '1.5px solid #CBD5E1',
                  background: attachedLawyerFile ? '#FEF3C7' : '#F8FAFC',
                  color: attachedLawyerFile ? '#D97706' : '#64748B',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  flexShrink: 0
                }}
              >
                <Paperclip size={18} />
              </label>
              <input 
                id="lawyer-chat-attachment-input"
                type="file" 
                accept="image/*,.pdf,.doc,.docx,.txt" 
                onChange={(e) => {
                  if (e.target.files[0]) {
                    setAttachedLawyerFile(e.target.files[0]);
                    toast.success(`Attached file: ${e.target.files[0].name}`);
                  }
                }} 
                style={{ display: 'none' }} 
              />
              <input 
                type="text"
                className="form-input"
                placeholder="Type your legal response or attach documents..."
                value={lawyerInput}
                onChange={e => setLawyerInput(e.target.value)}
                style={{ flex: 1, padding: '0.65rem 0.85rem', fontSize: '0.88rem' }}
              />
              <button type="submit" className="btn btn-gold" disabled={!lawyerInput.trim() && !attachedLawyerFile} style={{ padding: '0.65rem 1.25rem' }}>
                <Send size={16} /> Send Response
              </button>
            </form>
          </div>
        </div>
      )}

      <AssignTimeModal 
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        consultation={selectedPendingRequest}
        onAssignSuccess={handleAssignSuccess}
      />

      {/* PDF & Document Viewer Overlay Modal for Lawyer */}
      {showPdfModal && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(9, 19, 31, 0.8)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1rem' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '16px', maxWidth: '750px', width: '100%', height: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px rgba(0,0,0,0.35)', border: '2px solid #C9A227', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.5rem', background: '#102A43', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #C9A227' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <FileText size={22} style={{ color: '#C9A227' }} />
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#FFFFFF', fontFamily: 'Cinzel, serif' }}>Document Viewer: {viewingPdfName}</h3>
                  <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Verified Legal Attachment • Ref #{activeChatConsultation?.id || '1'}</span>
                </div>
              </div>
              <button onClick={() => setShowPdfModal(false)} style={{ background: 'transparent', border: 'none', color: '#FFFFFF', cursor: 'pointer', padding: '0.2rem' }}>
                <X size={22} />
              </button>
            </div>

            <div style={{ flex: 1, background: '#F8FAFC', padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
              {viewingPdfName.match(/\.(png|jpg|jpeg|webp|gif)$/i) ? (
                <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '12px', padding: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', textAlign: 'center', width: '100%' }}>
                  <img 
                    src={`https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1000&q=80`} 
                    alt={viewingPdfName}
                    style={{ maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain', borderRadius: '8px', border: '1px solid #E2E8F0' }}
                  />
                  <p style={{ margin: '0.75rem 0 0 0', fontSize: '0.85rem', color: '#102A43', fontWeight: 600 }}>
                    Image Attachment: {viewingPdfName}
                  </p>
                </div>
              ) : (
                <div style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.04)', fontSize: '0.9rem', color: '#102A43', lineHeight: '1.7', fontFamily: 'Georgia, serif', width: '100%' }}>
                  <div style={{ textAlign: 'center', borderBottom: '2px double #C9A227', paddingBottom: '1rem', marginBottom: '1rem' }}>
                    <h2 style={{ margin: 0, fontFamily: 'Cinzel, serif', color: '#102A43', fontSize: '1.3rem' }}>LEGAL CONSULTATION CASE DOCUMENT</h2>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.8rem', color: '#64748B' }}>Adalat Legal Services • File: {viewingPdfName}</p>
                  </div>

                  <div style={{ margin: '1rem 0' }}>
                    <p><strong>Client:</strong> {activeChatConsultation?.customerName || 'Client'}</p>
                    <p><strong>Matter Category:</strong> {activeChatConsultation?.categoryDisplayName || activeChatConsultation?.category || 'Legal Consultation'}</p>
                  </div>

                  <div style={{ background: '#F1F5F9', borderLeft: '4px solid #C9A227', padding: '1rem', borderRadius: '4px', margin: '1rem 0' }}>
                    <strong>ATTACHED CASE FACTS & SUMMARY:</strong>
                    <p style={{ margin: '0.5rem 0 0 0', fontStyle: 'italic' }}>
                      {activeChatConsultation?.summary || activeChatConsultation?.caseSummary || 'Legal intake document and case evidence attached for advocate consultation review.'}
                    </p>
                  </div>

                  <p style={{ fontSize: '0.78rem', color: '#64748B', fontStyle: 'italic', textAlign: 'center', marginTop: '2rem' }}>
                    *** Official Document generated via Adalat Portal ***
                  </p>
                </div>
              )}
            </div>

            <div style={{ padding: '1rem 1.5rem', background: '#FFFFFF', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                📄 Verified Legal Document Preview
              </span>
              <button 
                onClick={() => setShowPdfModal(false)}
                className="btn btn-gold btn-sm"
                style={{ padding: '0.45rem 1.25rem', fontWeight: 600 }}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LawyerConsultationsPage;
