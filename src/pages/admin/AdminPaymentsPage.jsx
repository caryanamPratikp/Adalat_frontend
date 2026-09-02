import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';
import LoadingState from '../../components/LoadingState';
import apiClient from '../../api/apiClient';
import { CreditCard, DollarSign, Users, UserCheck, ShieldCheck, RefreshCw } from 'lucide-react';
import './AdminPortalPages.css';

const AdminPaymentsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('ALL'); // 'ALL', 'REGISTRATION', 'CONSULTATION'

  const fetchRealTransactions = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/api/admin/payments');
      if (res && res.data && Array.isArray(res.data)) {
        setTransactions(res.data);
      } else {
        setTransactions([]);
      }
    } catch (e) {
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRealTransactions();
  }, []);

  // Filter transactions
  const filteredTransactions = transactions.filter(tx => {
    if (activeFilter === 'REGISTRATION') return tx.type === 'CUSTOMER_REGISTRATION';
    if (activeFilter === 'CONSULTATION') return tx.type === 'LAWYER_CONSULTATION';
    return true;
  });

  // Calculate real totals
  const totalVolume = transactions.reduce((sum, tx) => sum + (tx.amountNum || 0), 0);
  const regRevenue = transactions
    .filter(tx => tx.type === 'CUSTOMER_REGISTRATION')
    .reduce((sum, tx) => sum + (tx.amountNum || 99), 0);
  const lawyerPayouts = transactions
    .filter(tx => tx.type === 'LAWYER_CONSULTATION')
    .reduce((sum, tx) => sum + (tx.amountNum || 0), 0);

  return (
    <div className="portal-layout">
      <Sidebar portalType="admin" />

      <main className="portal-main-content">
        <div className="portal-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span className="badge badge-gold">MySQL Database Audit Log</span>
            <h1>Payment Transaction Audit History</h1>
            <p>Real-time financial audit log of customer registration payments & advocate consultation settlements fetched from MySQL database.</p>
          </div>
          <button onClick={fetchRealTransactions} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <RefreshCw size={14} /> Refresh Data
          </button>
        </div>

        {/* Financial Metrics Summary Bar */}
        <div className="metrics-grid" style={{ marginBottom: '1.5rem' }}>
          <div className="metric-card card">
            <div className="metric-icon-box navy"><DollarSign size={22} /></div>
            <div>
              <h3>₹{totalVolume.toFixed(2)}</h3>
              <p>Total Audited Volume</p>
            </div>
          </div>

          <div className="metric-card card">
            <div className="metric-icon-box gold"><ShieldCheck size={22} /></div>
            <div>
              <h3>₹{regRevenue.toFixed(2)}</h3>
              <p>Customer Registrations (₹99 Pool)</p>
            </div>
          </div>

          <div className="metric-card card">
            <div className="metric-icon-box teal"><UserCheck size={22} /></div>
            <div>
              <h3>₹{lawyerPayouts.toFixed(2)}</h3>
              <p>Advocate Direct Payouts</p>
            </div>
          </div>

          <div className="metric-card card">
            <div className="metric-icon-box navy"><CreditCard size={22} /></div>
            <div>
              <h3>{transactions.length}</h3>
              <p>MySQL DB Transactions</p>
            </div>
          </div>
        </div>

        {/* Section Card with Filter Tabs */}
        <div className="section-card card">
          <div className="card-header-row" style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '0.85rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard size={18} style={{ color: '#1C1C4A' }} />
              <h3 style={{ margin: 0 }}>MySQL Financial Audit Records</h3>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '0.4rem', background: '#F1F5F9', padding: '0.25rem', borderRadius: '8px' }}>
              <button 
                onClick={() => setActiveFilter('ALL')}
                style={{ 
                  background: activeFilter === 'ALL' ? '#1C1C4A' : 'transparent', 
                  color: activeFilter === 'ALL' ? '#FFFFFF' : '#5C5C99', 
                  border: 'none', 
                  padding: '0.35rem 0.75rem', 
                  borderRadius: '6px', 
                  fontSize: '0.75rem', 
                  fontWeight: 700, 
                  cursor: 'pointer' 
                }}
              >
                All Payments ({transactions.length})
              </button>

              <button 
                onClick={() => setActiveFilter('REGISTRATION')}
                style={{ 
                  background: activeFilter === 'REGISTRATION' ? '#1C1C4A' : 'transparent', 
                  color: activeFilter === 'REGISTRATION' ? '#FFFFFF' : '#5C5C99', 
                  border: 'none', 
                  padding: '0.35rem 0.75rem', 
                  borderRadius: '6px', 
                  fontSize: '0.75rem', 
                  fontWeight: 700, 
                  cursor: 'pointer' 
                }}
              >
                Customer Reg (₹99) ({transactions.filter(t => t.type === 'CUSTOMER_REGISTRATION').length})
              </button>

              <button 
                onClick={() => setActiveFilter('CONSULTATION')}
                style={{ 
                  background: activeFilter === 'CONSULTATION' ? '#1C1C4A' : 'transparent', 
                  color: activeFilter === 'CONSULTATION' ? '#FFFFFF' : '#5C5C99', 
                  border: 'none', 
                  padding: '0.35rem 0.75rem', 
                  borderRadius: '6px', 
                  fontSize: '0.75rem', 
                  fontWeight: 700, 
                  cursor: 'pointer' 
                }}
              >
                Advocate Payouts ({transactions.filter(t => t.type === 'LAWYER_CONSULTATION').length})
              </button>
            </div>
          </div>

          {loading ? (
            <LoadingState message="Fetching payment audit records from MySQL database..." />
          ) : filteredTransactions.length === 0 ? (
            <EmptyState 
              icon={CreditCard}
              title="No MySQL Financial Transactions Found"
              message="Real customer registration payments and advocate consultation transactions will appear here automatically when submitted to MySQL database."
            />
          ) : (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Customer</th>
                    <th>Service / Payout Receiver</th>
                    <th>Payment Category</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map(tx => (
                    <tr key={tx.id}>
                      <td><code>{tx.id}</code></td>
                      <td>
                        <strong>{tx.customer}</strong>
                        {tx.customerEmail && <div className="sub-text">{tx.customerEmail}</div>}
                      </td>
                      <td>
                        <strong>{tx.lawyer}</strong>
                        {tx.payoutReceiver && tx.payoutReceiver !== tx.lawyer && (
                          <div className="sub-text" style={{ color: '#059669', fontWeight: 600 }}>UPI: {tx.payoutReceiver}</div>
                        )}
                      </td>
                      <td>
                        <span 
                          style={{
                            display: 'inline-block',
                            background: tx.type === 'CUSTOMER_REGISTRATION' ? '#E0E7FF' : '#FEF3C7',
                            color: tx.type === 'CUSTOMER_REGISTRATION' ? '#3730A3' : '#92400E',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '12px',
                            fontSize: '0.72rem',
                            fontWeight: 700
                          }}
                        >
                          {tx.typeLabel || (tx.type === 'CUSTOMER_REGISTRATION' ? 'Customer Reg Fee' : 'Advocate Consultation')}
                        </span>
                      </td>
                      <td>
                        <strong style={{ color: '#059669', fontSize: '0.95rem' }}>{tx.amount}</strong>
                      </td>
                      <td>
                        <span className="sub-text" style={{ fontWeight: 600 }}>{tx.method || 'UPI (Instant)'}</span>
                      </td>
                      <td><span className="sub-text">{tx.date}</span></td>
                      <td><StatusBadge status={tx.status || 'COMPLETED'} /></td>
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
