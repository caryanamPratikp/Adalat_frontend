import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { Scale, Lock, Mail, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import './AuthPages.css';

const LoginPage = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { loginCustomer, loginLawyer, loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // 1. Try Customer Login
    try {
      const customerData = await loginCustomer(identifier, password);
      if (customerData) {
        toast.success('Welcome back! Signed in to Customer Portal.');
        navigate('/customer/dashboard');
        return;
      }
    } catch (err) {
      // Not a customer or customer credentials did not match
    }

    // 2. Try Lawyer Login
    try {
      const lawyerData = await loginLawyer(identifier, password);
      if (lawyerData) {
        if (lawyerData.registrationStatus !== 'SUBMITTED') {
          toast.info('Welcome back! Resuming your advocate onboarding wizard...');
          navigate(`/lawyer/onboarding?lawyerId=${lawyerData.lawyerId || ''}`);
        } else if (lawyerData.verificationStatus === 'PENDING') {
          toast.info('Welcome back! Application pending admin verification.');
          navigate(`/lawyer/onboarding?lawyerId=${lawyerData.lawyerId || ''}`);
        } else if (lawyerData.verificationStatus === 'APPROVED') {
          toast.success('Welcome back! Signed in to Advocate Portal.');
          navigate('/lawyer/dashboard');
        } else {
          navigate(`/lawyer/onboarding?lawyerId=${lawyerData.lawyerId || ''}`);
        }
        return;
      }
    } catch (err) {
      // Not a lawyer or lawyer credentials did not match
    }

    // 3. Try Admin Login
    try {
      const adminData = await loginAdmin(identifier, password);
      if (adminData) {
        toast.success('Signed in to Adalat Admin Console.');
        navigate('/admin/dashboard');
        return;
      }
    } catch (err) {
      // Not an admin or admin credentials did not match
    }

    // 4. If credentials failed across all roles
    const msg = 'Invalid email address, mobile number, or password. Please verify your credentials.';
    setError(msg);
    toast.error(msg);
    setLoading(false);
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
            <h2>Sign In to Adalat</h2>
            <p className="auth-subtitle">Enter your registered Email or Mobile Number and Password</p>
          </div>

          {error && (
            <div className="auth-error-alert">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email Address or Mobile Number <span className="required">*</span></label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input 
                  type="text"
                  className="form-input"
                  placeholder="e.g. user@gmail.com or 9876543210"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            </div>

            <button 
              type="submit" 
              className="btn btn-gold btn-block btn-lg"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'} <ArrowRight size={18} />
            </button>
          </form>

          <div className="auth-card-footer" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <p>New Customer? <Link to="/register" className="auth-link">Register Account (₹99)</Link></p>
            <p>Practicing Advocate? <Link to="/lawyer/register" className="auth-link">Free Lawyer Signup</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
