import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import { Users } from 'lucide-react';

const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);

  return (
    <div className="portal-layout">
      <Sidebar portalType="admin" />

      <main className="portal-main-content">
        <div className="portal-header">
          <h1>Customer Management</h1>
          <p>Registered customer directory and activation payment statuses.</p>
        </div>

        <div className="section-card card">
          {customers.length === 0 ? (
            <EmptyState 
              icon={Users}
              title="No Registered Customers Yet"
              message="New customers will appear here after registering and completing their ₹99 activation payment."
            />
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Email</th>
                    <th>Mobile Number</th>
                    <th>Registration Fee</th>
                    <th>Account Status</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map(c => (
                    <tr key={c.id}>
                      <td><strong>{c.fullName}</strong></td>
                      <td>{c.email}</td>
                      <td>{c.mobileNumber}</td>
                      <td>₹99.00 ({c.paymentStatus || 'PAID'})</td>
                      <td><StatusBadge status={c.accountStatus || 'ACTIVE'} /></td>
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

export default AdminCustomersPage;
