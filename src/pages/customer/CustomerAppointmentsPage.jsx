import React from 'react';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import LoadingState from '../../components/LoadingState';
import { Calendar, MessageSquare, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCustomerRequests } from '../../hooks/useConsultationQueries';

const CustomerAppointmentsPage = () => {
  const { data: requests = [], isLoading } = useCustomerRequests();

  const appointments = requests.map(r => ({
    id: r.id || r.requestId,
    lawyerId: r.lawyerId || 1,
    lawyerName: r.lawyerName || 'Advocate',
    category: r.categoryDisplayName || r.category || 'Legal Consultation',
    scheduledTime: r.assignedDate ? `${r.assignedDate} at ${r.assignedTime || 'Scheduled Time'}` : (r.scheduledAt || 'Scheduled'),
    status: r.status || 'ACCEPTED'
  }));

  return (
    <div className="portal-layout">
      <Sidebar portalType="customer" />

      <main className="portal-main-content">
        <div className="portal-header">
          <h1>My Appointments & Completed Sessions</h1>
          <p>View your scheduled and completed advocate consultation appointments.</p>
        </div>

        <div className="section-card card">
          {isLoading ? (
            <LoadingState message="Loading your appointments via TanStack Query..." />
          ) : appointments.length === 0 ? (
            <EmptyState 
              icon={Calendar}
              title="No Appointments Found"
              message="Your scheduled and completed advocate consultations will appear here."
            />
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Advocate Name</th>
                    <th>Legal Category</th>
                    <th>Scheduled Date & Time</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(app => (
                    <tr key={app.id}>
                      <td><strong>{app.lawyerName}</strong></td>
                      <td>{app.category}</td>
                      <td>{app.scheduledTime}</td>
                      <td>
                        <span className={`badge ${app.status === 'COMPLETED' ? 'badge-success' : 'badge-gold'}`}>
                          {app.status === 'COMPLETED' ? 'Closed / Completed' : app.status}
                        </span>
                      </td>
                      <td>
                        {app.status === 'COMPLETED' ? (
                          <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                            <CheckCircle size={14} /> Consultation Closed
                          </span>
                        ) : (
                          <Link to={`/customer/consultations?lawyerId=${app.lawyerId}`} className="btn btn-gold btn-sm">
                            <MessageSquare size={13} /> Open Session
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerAppointmentsPage;
