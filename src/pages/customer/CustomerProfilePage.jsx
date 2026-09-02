import React from 'react';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, ShieldCheck } from 'lucide-react';

const CustomerProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="portal-layout">
      <Sidebar portalType="customer" />

      <main className="portal-main-content">
        <div className="portal-header">
          <h1>My Profile</h1>
          <p>Manage your account details and contact preferences.</p>
        </div>

        <div className="section-card card" style={{ maxWidth: '640px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #E2E8F0' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#102A43', color: '#C9A227', fontSize: '1.6rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {user?.fullName ? user.fullName.charAt(0) : 'C'}
            </div>
            <div>
              <h2 style={{ color: '#102A43' }}>{user?.fullName || 'Customer User'}</h2>
              <span className="badge badge-success" style={{ marginTop: '0.25rem' }}><ShieldCheck size={12} /> Account Active (₹99 Paid)</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" value={user?.fullName || ''} readOnly />
            </div>

            <div>
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" value={user?.email || ''} readOnly />
            </div>

            <div>
              <label className="form-label">Mobile Number</label>
              <input type="text" className="form-input" value={user?.mobileNumber || ''} readOnly />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerProfilePage;
