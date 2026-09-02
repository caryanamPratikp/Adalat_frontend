import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import { adminApi } from '../../api/adminApi';
import { lawyerApi } from '../../api/lawyerApi';
import apiClient from '../../api/apiClient';
import { Users, UserCheck, ShieldCheck, CreditCard } from 'lucide-react';
import './AdminPortalPages.css';

const AdminDashboardPage = () => {
  const [pendingLawyers, setPendingLawyers] = useState([]);
  const [approvedLawyers, setApprovedLawyers] = useState([]);
  const [totalVolume, setTotalVolume] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      adminApi.getPendingLawyers().catch(() => ({ data: [] })),
      lawyerApi.getApprovedLawyers().catch(() => ({ data: [] })),
      apiClient.get('/api/admin/payments').catch(() => ({ data: [] }))
    ]).then(([pendingRes, approvedRes, paymentsRes]) => {
      setPendingLawyers((pendingRes && Array.isArray(pendingRes.data)) ? pendingRes.data : []);
      setApprovedLawyers((approvedRes && Array.isArray(approvedRes.data)) ? approvedRes.data : []);
      
      const payments = (paymentsRes && Array.isArray(paymentsRes.data)) ? paymentsRes.data : [];
      const sum = payments.reduce((acc, p) => acc + (p.amountNum || 0), 0);
      setTotalVolume(sum);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="portal-layout">
      <Sidebar portalType="admin" />

      <main className="portal-main-content">
        <div className="portal-header">
          <span className="badge badge-gold">Adalat Platform Administration</span>
          <h1>Admin Command Dashboard</h1>
          <p>Complete platform overview, advocate verification queue, transaction audit, and category reporting.</p>
        </div>

        <div className="metrics-grid">
          <div className="metric-card card">
            <div className="metric-icon-box navy"><Users size={22} /></div>
            <div>
              <h3>{approvedLawyers.length + pendingLawyers.length}</h3>
              <p>Total Registered Advocates</p>
            </div>
          </div>

          <div className="metric-card card">
            <div className="metric-icon-box gold"><ShieldCheck size={22} /></div>
            <div>
              <h3>{approvedLawyers.length}</h3>
              <p>Approved Lawyers</p>
            </div>
          </div>

          <div className="metric-card card">
            <div className="metric-icon-box teal"><UserCheck size={22} /></div>
            <div>
              <h3>{pendingLawyers.length} Pending</h3>
              <p>Lawyer Approvals</p>
            </div>
          </div>

          <div className="metric-card card">
            <div className="metric-icon-box navy"><CreditCard size={22} /></div>
            <div>
              <h3>₹{totalVolume.toFixed(2)}</h3>
              <p>Total Platform Financial Volume</p>
            </div>
          </div>
        </div>

        <div className="dashboard-content-grid">
          <div className="section-card card">
            <div className="card-header-row">
              <h3>Pending Verification Queue</h3>
              <Link to="/admin/verifications" className="view-all-link">Manage Queue</Link>
            </div>
            {loading ? (
              <LoadingState message="Loading pending lawyer applications..." />
            ) : pendingLawyers.length === 0 ? (
              <EmptyState 
                icon={ShieldCheck}
                title="Queue is Empty"
                message="No pending advocate verification applications awaiting admin review."
              />
            ) : (
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Advocate</th>
                      <th>Bar Reg No</th>
                      <th>Experience</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingLawyers.map(lawyer => (
                      <tr key={lawyer.lawyerId}>
                        <td>
                          <strong>{lawyer.fullName}</strong>
                          <div className="sub-text">{lawyer.email}</div>
                        </td>
                        <td>{lawyer.barEnrollmentNumber || 'Not Provided'}</td>
                        <td>{lawyer.yearsOfExperience !== null && lawyer.yearsOfExperience !== undefined ? `${lawyer.yearsOfExperience} Yrs` : 'N/A'}</td>
                        <td><StatusBadge status={lawyer.verificationStatus || 'PENDING'} /></td>
                        <td>
                          <Link to="/admin/verifications" className="btn btn-gold btn-sm">Review & Approve</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
