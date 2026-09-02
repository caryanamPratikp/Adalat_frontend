import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { lawyerApi } from '../../api/lawyerApi';
import { FileText, ShieldCheck, Upload } from 'lucide-react';

const LawyerDocumentsPage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (user?.id || user?.lawyerId) {
      lawyerApi.getLawyerById(user.id || user.lawyerId)
        .then(res => setProfile(res.data))
        .catch(() => {});
    }
  }, [user]);

  const docs = profile?.documents || [];

  return (
    <div className="portal-layout">
      <Sidebar portalType="lawyer" />

      <main className="portal-main-content">
        <div className="portal-header">
          <h1>My Verification Documents</h1>
          <p>Uploaded Bar Council Enrollment certificates and academic credentials.</p>
        </div>

        <div className="section-card card">
          <div className="card-header-row">
            <h3>Uploaded Credentials</h3>
            <StatusBadge status={user?.verificationStatus || 'PENDING'} />
          </div>

          {docs.length === 0 ? (
            <p style={{ color: '#64748B', fontSize: '0.9rem' }}>No verification documents uploaded yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Document Category</th>
                    <th>File Name</th>
                    <th>Upload Date</th>
                    <th>Verification Status</th>
                  </tr>
                </thead>
                <tbody>
                  {docs.map((doc, idx) => (
                    <tr key={idx}>
                      <td><span className="badge badge-gold">{doc.documentType}</span></td>
                      <td><FileText size={14} /> {doc.originalFileName || 'Bar_Certificate.pdf'}</td>
                      <td>{doc.createdAt || 'Recent'}</td>
                      <td><StatusBadge status={user?.verificationStatus || 'PENDING'} /></td>
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

export default LawyerDocumentsPage;
