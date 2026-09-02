import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import { CreditCard, TrendingUp } from 'lucide-react';

const LawyerEarningsPage = () => {
  const [transactions, setTransactions] = useState([]);

  return (
    <div className="portal-layout">
      <Sidebar portalType="lawyer" />

      <main className="portal-main-content">
        <div className="portal-header">
          <h1>Earnings & UPI Payouts</h1>
          <p>Track direct customer consultation payments received to your UPI ID.</p>
        </div>

        <div className="metrics-grid">
          <div className="metric-card card">
            <div className="metric-icon-box teal"><CreditCard size={22} /></div>
            <div>
              <h3>₹0.00</h3>
              <p>Total Earnings</p>
            </div>
          </div>
          <div className="metric-card card">
            <div className="metric-icon-box gold"><TrendingUp size={22} /></div>
            <div>
              <h3>₹0.00</h3>
              <p>Today's Earnings</p>
            </div>
          </div>
          <div className="metric-card card">
            <div className="metric-icon-box navy"><CreditCard size={22} /></div>
            <div>
              <h3>0</h3>
              <p>Completed Consultations</p>
            </div>
          </div>
        </div>

        <div className="section-card card">
          <h3>Transaction History</h3>
          {transactions.length === 0 ? (
            <div style={{ marginTop: '1rem' }}>
              <EmptyState 
                icon={CreditCard}
                title="No Earnings Received Yet"
                message="Direct customer consultation payments to your UPI ID will appear in this history."
              />
            </div>
          ) : (
            <div className="table-responsive" style={{ marginTop: '1rem' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ref ID</th>
                    <th>Customer</th>
                    <th>Duration</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(tx => (
                    <tr key={tx.id}>
                      <td><code>{tx.id}</code></td>
                      <td>{tx.customerName}</td>
                      <td>{tx.duration}</td>
                      <td>{tx.amount}</td>
                      <td>{tx.date}</td>
                      <td><StatusBadge status={tx.status} /></td>
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

export default LawyerEarningsPage;
