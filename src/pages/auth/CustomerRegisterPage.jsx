import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { customerApi } from '../../api/customerApi';
import { useAuth } from '../../context/AuthContext';
import PaymentModal from '../../components/PaymentModal';
import { toast } from 'react-toastify';
import { Scale, Lock, Mail, User, Phone, ShieldCheck, ArrowRight, Eye, EyeOff } from 'lucide-react';
import './AuthPages.css';

const CustomerRegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: ''
  });

  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [policyModalContent, setPolicyModalContent] = useState(null); // 'TERMS' or 'PRIVACY' or null

  const { loginCustomer } = useAuth();
  const navigate = useNavigate();

  const calculatePasswordStrength = (pwd) => {
    if (!pwd) return { score: 0, label: '', color: '#CBD5E1' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd) || /[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak (Must be 6+ chars with letters & numbers)', color: '#EF4444' };
    if (score === 2 || score === 3) return { score: 2, label: 'Medium (Good password strength)', color: '#F59E0B' };
    return { score: 4, label: 'Strong (Excellent security)', color: '#10B981' };
  };

  const pwdStrength = calculatePasswordStrength(formData.password);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }
    if (!/[0-9]/.test(formData.password) || !/[a-zA-Z]/.test(formData.password)) {
      toast.error('Password must contain both letters and numbers for security.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      toast.error('You must accept the Terms & Conditions and Privacy Policy.');
      return;
    }
    // Validation passed! Open ₹99 QR Payment Modal
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (paymentRef) => {
    setShowPaymentModal(false);
    setLoading(true);

    try {
      const res = await customerApi.register({
        fullName: formData.fullName,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        termsAccepted: true,
        privacyPolicyAccepted: true,
        paymentTransactionId: paymentRef.gatewayPaymentId
      });

      if (res.status === 'SUCCESS') {
        toast.success('Registration & ₹99 activation successful!');
        await loginCustomer(formData.email, formData.password);
        navigate('/customer/dashboard');
      }
    } catch (err) {
      toast.error(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="container auth-container">
        <div className="auth-card card">
          <div className="auth-card-header">
            <Link to="/" className="auth-brand-logo">
              <div className="auth-logo-icon"><Scale size={24} /></div>
              <span className="auth-brand-name">ADALAT</span>
            </Link>
            <h2>Customer Account Registration</h2>
            <p className="auth-subtitle">One-Time ₹99 Platform Account Activation Fee Required</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Full Name <span className="required">*</span></label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input 
                  type="text"
                  className="form-input"
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address <span className="required">*</span></label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input 
                  type="email"
                  className="form-input"
                  placeholder="e.g. customer@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Mobile Number <span className="required">*</span></label>
              <div className="input-with-icon">
                <Phone size={18} className="input-icon" />
                <input 
                  type="tel"
                  className="form-input"
                  placeholder="e.g. 9876543210"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password <span className="required">*</span></label>
              <div className="input-with-icon" style={{ position: 'relative' }}>
                <Lock size={18} className="input-icon" />
                <input 
                  type={showPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  style={{ paddingRight: '2.5rem' }}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.2rem' }}
                  title={showPassword ? "Hide Password" : "Show Password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formData.password && (
                <div style={{ marginTop: '0.4rem' }}>
                  <div style={{ height: '4px', background: '#E2E8F0', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(pwdStrength.score / 4) * 100}%`, background: pwdStrength.color, transition: 'all 0.3s' }}></div>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: pwdStrength.color, fontWeight: 600, marginTop: '0.25rem', display: 'block' }}>
                    {pwdStrength.label}
                  </span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password <span className="required">*</span></label>
              <div className="input-with-icon" style={{ position: 'relative' }}>
                <Lock size={18} className="input-icon" />
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  style={{ paddingRight: '2.5rem' }}
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0.2rem' }}
                  title={showConfirmPassword ? "Hide Password" : "Show Password"}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group checkbox-group" style={{ margin: '1.15rem 0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.84rem', color: '#334155', cursor: 'pointer', userSelect: 'none' }}>
                <input 
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#C9A227', cursor: 'pointer', flexShrink: 0 }}
                  required
                />
                <span>
                  I accept the{' '}
                  <span onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPolicyModalContent('TERMS'); }} style={{ color: '#C9A227', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}>
                    Terms & Conditions
                  </span>{' '}
                  and{' '}
                  <span onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPolicyModalContent('PRIVACY'); }} style={{ color: '#C9A227', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}>
                    Privacy Policy
                  </span>{' '}
                  <span className="required">*</span>
                </span>
              </label>
            </div>

            <button type="submit" className="btn btn-gold btn-block btn-lg" disabled={loading || !agreeTerms}>
              Proceed to ₹99 Account Activation <ArrowRight size={18} />
            </button>
          </form>

          <div className="auth-card-footer">
            <p>Already have an account? <Link to="/login" className="auth-link">Sign In</Link></p>
          </div>
        </div>
      </div>

      <PaymentModal 
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        title="Adalat Customer Activation Fee"
        amount="99.00"
        lawyerName="Adalat Platform Activation"
        lawyerUpiId="adalat@upi"
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Terms & Conditions / Privacy Policy Overlay Modal */}
      {policyModalContent && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(9, 19, 31, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '16px', maxWidth: '540px', width: '100%', padding: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', border: '2px solid #C9A227', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#102A43', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheck size={20} style={{ color: '#C9A227' }} /> {policyModalContent === 'TERMS' ? 'Terms & Conditions Agreement' : 'Client Privacy & Data Security Policy'}
              </h3>
              <button onClick={() => setPolicyModalContent(null)} style={{ background: 'transparent', border: 'none', color: '#64748B', cursor: 'pointer', fontSize: '1.2rem', fontWeight: 700 }}>✕</button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', fontSize: '0.85rem', color: '#334155', lineHeight: '1.6', paddingRight: '0.5rem' }}>
              {policyModalContent === 'TERMS' ? (
                <>
                  <p><strong>1. Account Registration & ₹99 Fee:</strong> By creating an account on Adalat, you agree to pay a one-time platform activation fee of ₹99. This fee unlocks access to AI legal assistance and verified advocate consultations.</p>
                  <p><strong>2. Confidentiality & Privilege:</strong> All consultations, AI case assessment documents, and communications conducted via the Adalat portal remain strictly confidential under legal privilege guidelines.</p>
                  <p><strong>3. Consultation Rates:</strong> Initial 10-minute consultations with verified advocates are covered under platform rates. Subsequent legal representation is agreed upon directly with your advocate.</p>
                </>
              ) : (
                <>
                  <p><strong>1. End-to-End Encryption:</strong> Your case details, uploaded legal documents, and personal details are encrypted using 256-bit SSL protocols.</p>
                  <p><strong>2. Data Protection:</strong> Adalat does not share, sell, or disclose customer personal data or consultation records to unauthorized third parties.</p>
                  <p><strong>3. Secure UPI Payments:</strong> All account activation and consultation payouts are processed through verified bank settlement gateways.</p>
                </>
              )}
            </div>

            <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid #E2E8F0', textAlign: 'right' }}>
              <button onClick={() => setPolicyModalContent(null)} className="btn btn-gold" style={{ padding: '0.45rem 1.5rem', fontWeight: 600 }}>
                I Agree & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerRegisterPage;
