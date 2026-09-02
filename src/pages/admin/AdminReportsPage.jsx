import React from 'react';
import Sidebar from '../../components/Sidebar';
import { TrendingUp, Users, ShieldCheck, CreditCard } from 'lucide-react';

const AdminReportsPage = () => {
  return (
    <div className="portal-layout">
      <Sidebar portalType="admin" />

      <main className="portal-main-content">
        <div className="portal-header">
          <h1>Analytics & Financial Reports</h1>
          <p>Platform volume metrics, practice area demand, and growth analytics.</p>
        </div>

        <div className="metrics-grid">
          <div className="metric-card card">
            <div className="metric-icon-box navy"><Users size={22} /></div>
            <div>
              <h3>0</h3>
              <p>Total Customers</p>
            </div>
          </div>
          <div className="metric-card card">
            <div className="metric-icon-box gold"><ShieldCheck size={22} /></div>
            <div>
              <h3>0</h3>
              <p>Verified Advocates</p>
            </div>
          </div>
          <div className="metric-card card">
            <div className="metric-icon-box teal"><CreditCard size={22} /></div>
            <div>
              <h3>₹0.00</h3>
              <p>Total Volume</p>
            </div>
          </div>
        </div>

        <div className="section-card card text-center" style={{ padding: '3rem 2rem' }}>
          <TrendingUp size={48} style={{ color: '#5C5C99', marginBottom: '1rem' }} />
          <h3 style={{ color: '#102A43' }}>Analytics Data Processing</h3>
          <p style={{ color: '#64748B', maxWidth: '480px', margin: '0 auto' }}>
            Historical growth charts and practice area legal demand analytics will generate automatically as consultation sessions increase.
          </p>
        </div>
      </main>
    </div>
  );
};

export default AdminReportsPage;
