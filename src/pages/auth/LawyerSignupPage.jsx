import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { lawyerApi } from '../../api/lawyerApi';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { Scale, Lock, Mail, User, Phone, ShieldCheck, ArrowRight } from 'lucide-react';
import './AuthPages.css';

const LawyerSignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    password: ''
  });

  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const { loginLawyer } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      toast.error('You must accept the Terms & Conditions and Privacy Policy.');
      return;
    }
    setLoading(true);

    try {
      // POST /api/lawyers/register/step1
      const res = await lawyerApi.registerStep1({
        ...formData,
        confirmPassword: formData.password,
        termsAccepted: true,
        privacyPolicyAccepted: true
      });
      if (res.status === 'SUCCESS' && res.data) {
        const lawyerId = res.data.lawyerId;
        localStorage.setItem('adalat_lawyer_id', lawyerId);
        toast.success('Advocate Account Created! Proceeding to Onboarding Wizard...');

        // Authenticate lawyer session & redirect smoothly to wizard
        try {
          await loginLawyer(formData.email, formData.password);
        } catch (err) {}

        navigate(`/lawyer/onboarding?lawyerId=${lawyerId}`);
      }
    } catch (err) {
      toast.error(err.message || 'Lawyer signup failed.');
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
            <h2>Advocate Portal Signup</h2>
            <p className="auth-subtitle">100% Free Registration for Practicing Advocates Across India</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Full Name (Advocate) <span className="required">*</span></label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input 
                  type="text"
                  className="form-input"
                  placeholder="e.g. Adv. Rajesh Verma"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Official Email Address <span className="required">*</span></label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input 
                  type="email"
                  className="form-input"
                  placeholder="e.g. advocate@adalat.legal"
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
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input 
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
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
                <span>I accept the <strong style={{ color: '#C9A227' }}>Terms & Conditions</strong> and <strong style={{ color: '#C9A227' }}>Privacy Policy</strong> <span className="required">*</span></span>
              </label>
            </div>

            <button type="submit" className="btn btn-gold btn-block btn-lg" disabled={loading || !agreeTerms}>
              {loading ? 'Creating Account...' : 'Create Account & Continue Onboarding'} <ArrowRight size={18} />
            </button>
          </form>

          <div className="auth-card-footer">
            <p>Already registered as an Advocate? <Link to="/login" className="auth-link">Sign In to Advocate Portal</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawyerSignupPage;
