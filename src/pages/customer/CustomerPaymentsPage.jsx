import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import { CreditCard } from 'lucide-react';

const CustomerPaymentsPage = () => {
  const [payments, setPayments] = useState([
    {
      id: 'PAY-REG-99',
      service: 'Adalat Customer Account Activation',
      amount: '₹99.00',
      date: new Date().toLocaleDateString(),
      status: 'PAID'
    }
  ]);

  return (
    <div className="portal-layout">
      <Sidebar portalType="customer" />

      <main className="portal-main-content">
        <div className="portal-header">
          <h1>Payment History</h1>
          <p>Audit log of account activation fees & extended advocate consultation payments.</p>
        </div>

        <div className="section-card card">
          {payments.length === 0 ? (
            <EmptyState 
              icon={CreditCard}
              title="No Payment History"
              message="Your payment history will appear here."
            />
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Payment Ref</th>
                    <th>Service Description</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(p => (
                    <tr key={p.id}>
                      <td><code>{p.id}</code></td>
                      <td><strong>{p.service}</strong></td>
                      <td><strong>{p.amount}</strong></td>
                      <td>{p.date}</td>
                      <td><StatusBadge status={p.status} /></td>
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

export default CustomerPaymentsPage;
