import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import { CreditCard } from 'lucide-react';
import './AdminPortalPages.css';

const AdminPaymentsPage = () => {
  const [transactions, setTransactions] = useState([]);

  return (
    <div className="portal-layout">
      <Sidebar portalType="admin" />

      <main className="portal-main-content">
        <div className="portal-header">
          <h1>Payment Transaction Audit History</h1>
          <p>Complete financial audit log of customer registration payments & advocate consultation settlements.</p>
        </div>

        <div className="section-card card">
          {transactions.length === 0 ? (
            <EmptyState 
              icon={CreditCard}
              title="No Financial Transactions Yet"
              message="Platform registration payments and advocate consultation transactions will appear here."
            />
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Customer</th>
                    <th>Lawyer / Service</th>
                    <th>Payment Type</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(tx => (
                    <tr key={tx.id}>
                      <td><code>{tx.id}</code></td>
                      <td><strong>{tx.customer}</strong></td>
                      <td>{tx.lawyer}</td>
                      <td><span className="badge badge-neutral">{tx.type}</span></td>
                      <td><strong>{tx.amount}</strong></td>
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

export default AdminPaymentsPage;
