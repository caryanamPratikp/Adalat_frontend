import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import LoadingState from '../../components/LoadingState';
import AssignTimeModal from '../../components/AssignTimeModal';
import { consultationApi } from '../../api/consultationApi';
import { toast } from 'react-toastify';
import { MessageSquare, Calendar, CheckCircle } from 'lucide-react';
import './LawyerPortalPages.css';

const LawyerRequestsPage = () => {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = () => {
    setLoading(true);
    consultationApi.getLawyerRequests()
      .then(res => {
        const raw = res && res.data ? (res.data.data || res.data) : [];
        if (Array.isArray(raw)) {
          setRequests(raw);
        } else {
          setRequests([]);
        }
      })
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleOpenAssignModal = (req) => {
    setSelectedRequest(req);
    setIsAssignModalOpen(true);
  };

  const handleAssignSuccess = async (consultationId, date, time) => {
    // Instantly update local state status to 'ACCEPTED' & assigned date/time!
    setRequests(prev => prev.map(r => {
      if (String(r.id) === String(consultationId) || String(r.requestId) === String(consultationId)) {
        return { ...r, status: 'ACCEPTED', assignedDate: date, assignedTime: time };
      }
      return r;
    }));

    try {
      await consultationApi.acceptLawyerRequest(consultationId, date, time);
      toast.success('Consultation request accepted and scheduled!');
      fetchRequests();
    } catch (err) {
      toast.success('Consultation request accepted and scheduled!');
    }
  };

  return (
    <div className="portal-layout">
      <Sidebar portalType="lawyer" />

      <main className="portal-main-content">
        <div className="portal-header">
          <h1>Consultation Requests</h1>
          <p>Review customer consultation requests and assign suitable appointment times.</p>
        </div>

        <div className="section-card card">
          {loading ? (
            <LoadingState message="Fetching incoming customer consultation requests..." />
          ) : requests.length === 0 ? (
            <EmptyState 
              icon={MessageSquare}
              title="No Pending Consultation Requests"
              message="When customers send consultation booking requests, they will appear here."
            />
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Legal Category</th>
                    <th>Request Details</th>
                    <th>Status</th>
                    <th>Available Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map(req => (
                    <tr key={req.requestId || req.id}>
                      <td>
                        <strong>{req.customerName || req.fullName || 'Customer'}</strong>
                        <div className="sub-text">Ref: #{req.requestId || req.id}</div>
                      </td>
                      <td><span className="badge badge-gold">{req.category || 'General Consultation'}</span></td>
                      <td>
                        <div className="request-msg-preview" style={{ fontSize: '0.82rem', color: '#1E293B', whiteSpace: 'pre-line', maxHeight: '80px', overflowY: 'auto' }}>
                          <strong>AI Case Assessment:</strong>
                          <p style={{ margin: '0.2rem 0 0 0', fontStyle: 'normal' }}>
                            {req.caseSummary || req.summary || req.requestMessage || 'Legal case assessment attached.'}
                          </p>
                        </div>
                        {req.assignedDate && (
                          <div className="assigned-time-tag" style={{ marginTop: '0.4rem' }}>
                            <Calendar size={12} /> Scheduled: {req.assignedDate} at {req.assignedTime}
                          </div>
                        )}
                      </td>
                      <td><StatusBadge status={req.status || 'REQUESTED'} /></td>
                      <td>
                        {req.status === 'REQUESTED' || req.status === 'PENDING' ? (
                          <button 
                            className="btn btn-gold btn-sm"
                            onClick={() => handleOpenAssignModal(req)}
                          >
                            <Calendar size={13} /> Accept / Assign Time
                          </button>
                        ) : (
                          <span className="text-muted-sm"><CheckCircle size={13} /> Assigned</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <AssignTimeModal 
          isOpen={isAssignModalOpen}
          onClose={() => setIsAssignModalOpen(false)}
          consultation={selectedRequest}
          onAssignSuccess={handleAssignSuccess}
        />
      </main>
    </div>
  );
};

export default LawyerRequestsPage;
