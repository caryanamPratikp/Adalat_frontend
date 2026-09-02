import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import LawyerCard from '../../components/LawyerCard';
import { Users, Search } from 'lucide-react';
import './CustomerDashboardPage.css';

const CustomerMyLawyersPage = () => {
  const [consultedLawyers, setConsultedLawyers] = useState([]);

  return (
    <div className="portal-layout">
      <Sidebar portalType="customer" />

      <main className="portal-main-content">
        <div className="portal-header">
          <div className="card-header-row" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1>My Advocates</h1>
              <p>Advocates you have consulted with or scheduled appointments with.</p>
            </div>
            <Link to="/find-lawyer" className="btn btn-gold btn-sm">
              <Search size={14} /> Find New Advocate
            </Link>
          </div>
        </div>

        <div className="section-card card">
          {consultedLawyers.length === 0 ? (
            <EmptyState 
              icon={Users}
              title="No Consulted Advocates Yet"
              message="Advocates you consult with or book appointments with will be listed here for quick access and re-consultation."
              buttonText="Browse Advocates Directory"
              buttonLink="/find-lawyer"
            />
          ) : (
            <div className="lawyers-grid">
              {consultedLawyers.map(lawyer => (
                <LawyerCard key={lawyer.lawyerId || lawyer.id} lawyer={lawyer} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CustomerMyLawyersPage;
