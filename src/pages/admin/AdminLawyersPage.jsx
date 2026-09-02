import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import { lawyerApi } from '../../api/lawyerApi';
import { User } from 'lucide-react';

const AdminLawyersPage = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    lawyerApi.getApprovedLawyers()
      .then(res => {
        if (res && res.data && Array.isArray(res.data)) {
          setLawyers(res.data);
        } else {
          setLawyers([]);
        }
      })
      .catch(() => setLawyers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="portal-layout">
      <Sidebar portalType="admin" />

      <main className="portal-main-content">
        <div className="portal-header">
          <h1>Lawyer Directory Management</h1>
          <p>Complete directory of all registered advocates across India.</p>
        </div>

        <div className="section-card card">
          {loading ? (
            <LoadingState message="Fetching registered advocates directory..." />
          ) : lawyers.length === 0 ? (
            <EmptyState 
              icon={User}
              title="No Advocates Listed"
              message="No verified advocates are currently listed in the system directory."
            />
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Lawyer Name</th>
                    <th>Bar Reg No</th>
                    <th>Location</th>
                    <th>Rate</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {lawyers.map(lawyer => (
                    <tr key={lawyer.lawyerId}>
                      <td>
                        <strong>{lawyer.fullName}</strong>
                        <div className="sub-text">{lawyer.email} • {lawyer.mobileNumber}</div>
                      </td>
                      <td><strong>{lawyer.barEnrollmentNumber || 'N/A'}</strong></td>
                      <td>{lawyer.location || 'N/A'}</td>
                      <td>{lawyer.consultationRate ? lawyer.consultationRate.replace('RATE_', '₹') : 'N/A'}</td>
                      <td><StatusBadge status={lawyer.verificationStatus || 'PENDING'} /></td>
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

export default AdminLawyersPage;
