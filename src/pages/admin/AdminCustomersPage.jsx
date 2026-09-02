import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import LoadingState from '../../components/LoadingState';
import apiClient from '../../api/apiClient';
import { Users, RefreshCw } from 'lucide-react';

const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = () => {
    setLoading(true);
    apiClient.get('/api/admin/customers')
      .then(res => {
        if (res && res.data && Array.isArray(res.data)) {
          setCustomers(res.data);
        } else {
          setCustomers([]);
        }
      })
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="portal-layout">
      <Sidebar portalType="admin" />

      <main className="portal-main-content">
        <div className="portal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span className="badge badge-gold">Database Directory</span>
            <h1>Customer Management</h1>
            <p>Registered customer directory and activation payment statuses fetched directly from MySQL database.</p>
          </div>
          <button onClick={fetchCustomers} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>

        <div className="section-card card">
          {loading ? (
            <LoadingState message="Fetching registered customers from database..." />
          ) : customers.length === 0 ? (
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
                    <tr key={c.customerId || c.id}>
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
