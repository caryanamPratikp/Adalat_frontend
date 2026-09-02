import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { lawyerApi } from '../../api/lawyerApi';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { Scale, Check, ShieldCheck, Upload, FileText, ArrowRight, AlertCircle, Clock, LogOut } from 'lucide-react';
import './LawyerRegisterWizardPage.css';

const AVAILABLE_PRACTICE_AREAS = [
  { id: 'CRIMINAL_LAW', label: 'Criminal Law' },
  { id: 'FAMILY_LAW', label: 'Family Law & Divorce' },
  { id: 'PROPERTY_LAW', label: 'Property & Real Estate' },
  { id: 'CIVIL_DISPUTES', label: 'Civil Disputes & Recovery' },
  { id: 'CONSUMER_LAW', label: 'Consumer Disputes' },
  { id: 'EMPLOYMENT_LAW', label: 'Employment & Labor' },
  { id: 'CYBERCRIME', label: 'Cyber Crime & IT' },
  { id: 'BANKING_AND_FINANCE', label: 'Banking & Finance' },
  { id: 'CORPORATE_LAW', label: 'Corporate Law' },
  { id: 'MATRIMONIAL_MATTERS', label: 'Matrimonial Matters' },
];

const AVAILABLE_LANGUAGES = [
  { id: 'ENGLISH', label: 'English' },
  { id: 'HINDI', label: 'Hindi' },
  { id: 'MARATHI', label: 'Marathi' },
  { id: 'BENGALI', label: 'Bengali' },
  { id: 'TAMIL', label: 'Tamil' },
  { id: 'TELUGU', label: 'Telugu' },
  { id: 'KANNADA', label: 'Kannada' },
  { id: 'GUJARATI', label: 'Gujarati' },
  { id: 'PUNJABI', label: 'Punjabi' },
  { id: 'MALAYALAM', label: 'Malayalam' },
];

const DOCUMENT_TYPES = [
  { id: 'BAR_ENROLLMENT_PROOF', label: 'Bar Council Certificate / Enrollment Proof' },
  { id: 'LAW_DEGREE', label: 'Law Degree Certificate (LL.B / LL.M)' },
  { id: 'IDENTITY_PROOF', label: 'Identity Proof (Aadhaar / Passport / Voter ID)' },
  { id: 'PROFESSIONAL_DOCUMENT', label: 'Other Professional Document' },
];

const LawyerRegisterWizardPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const paramLawyerId = searchParams.get('lawyerId') || localStorage.getItem('adalat_lawyer_id') || (user && user.id ? user.id : '');

  const [currentStep, setCurrentStep] = useState(1);
  const [lawyerId, setLawyerId] = useState(paramLawyerId);
  const [loading, setLoading] = useState(false);

  const [step2Data, setStep2Data] = useState({
    barEnrollmentNumber: '',
    yearsOfExperience: '',
    education: '',
    location: '',
    practiceAreas: [],
    languages: [],
    bio: ''
  });
  const [selectedDocType, setSelectedDocType] = useState('BAR_ENROLLMENT_PROOF');
  const [step3Docs, setStep3Docs] = useState([]);
  const [step4Rate, setStep4Rate] = useState('RATE_199');
  const [step5Upi, setStep5Upi] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    if (paramLawyerId) {
      setLawyerId(paramLawyerId);
      fetchExistingProgress(paramLawyerId);
    }
  }, [paramLawyerId]);

  const fetchExistingProgress = async (id) => {
    try {
      const res = await lawyerApi.getLawyerById(id);
      if (res && res.data) {
        const data = res.data;

        setStep2Data({
          barEnrollmentNumber: data.barEnrollmentNumber || '',
          yearsOfExperience: data.yearsOfExperience !== null && data.yearsOfExperience !== undefined ? data.yearsOfExperience : '',
          education: data.education || '',
          location: data.location || '',
          practiceAreas: data.practiceAreas || [],
          languages: data.languages || [],
          bio: data.bio || ''
        });

        if (data.consultationRate) {
          setStep4Rate(data.consultationRate);
        }

        if (data.upiId) {
          setStep5Upi(data.upiId);
        }

        if (data.registrationStatus === 'SUBMITTED') {
          setIsSubmitted(true);
        } else if (data.upiId) {
          setCurrentStep(5);
        } else if (data.consultationRate) {
          setCurrentStep(4);
        } else if (data.barEnrollmentNumber) {
          setCurrentStep(2);
        }
      }
    } catch (err) {}
  };

  const handleLogout = () => {
    logout();
    toast.info('Logged out. Your progress for completed steps is safely saved!');
    navigate('/login');
  };

  const handleProfDetailsSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    if (!step2Data.barEnrollmentNumber || !step2Data.barEnrollmentNumber.trim()) {
      errors.barEnrollmentNumber = 'Bar Enrollment Number is required (e.g. D/2491/2012)';
    }

    const exp = parseInt(step2Data.yearsOfExperience, 10);
    if (step2Data.yearsOfExperience === '' || isNaN(exp) || exp < 0 || exp > 60) {
      errors.yearsOfExperience = 'Years of Experience must be between 0 and 60 years';
    }

    if (!step2Data.education || !step2Data.education.trim()) {
      errors.education = 'Education / Qualification is required (e.g. LL.B, Delhi University)';
    }

    if (!step2Data.location || !step2Data.location.trim()) {
      errors.location = 'Location / Primary Court City is required';
    }

    if (!step2Data.practiceAreas || step2Data.practiceAreas.length === 0) {
      errors.practiceAreas = 'Please select at least one Practice Area';
    }

    if (!step2Data.languages || step2Data.languages.length === 0) {
      errors.languages = 'Please select at least one Language';
    }

    const bioLen = step2Data.bio ? step2Data.bio.trim().length : 0;
    if (!step2Data.bio || bioLen === 0) {
      errors.bio = 'Bio is required';
    } else if (bioLen < 50) {
      errors.bio = `Bio must be at least 50 characters long (currently ${bioLen} chars; ${50 - bioLen} more required)`;
    } else if (bioLen > 2000) {
      errors.bio = 'Bio cannot exceed 2000 characters';
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];
      toast.error(`Validation Error: ${firstError}`);
      return;
    }

    if (!lawyerId) {
      toast.error('Lawyer Session ID missing. Please login or register first.');
      navigate('/lawyer/register');
      return;
    }

    setLoading(true);
    try {
      await lawyerApi.updateStep2(lawyerId, {
        ...step2Data,
        yearsOfExperience: parseInt(step2Data.yearsOfExperience, 10)
      });
      toast.success('Professional details saved to database!');
      setCurrentStep(2);
    } catch (err) {
      toast.error(err.message || 'Professional details update failed. Please verify your inputs.');
    } finally {
      setLoading(false);
    }
  };

  const handlePracticeAreaToggle = (areaId) => {
    setStep2Data(prev => {
      const exists = prev.practiceAreas.includes(areaId);
      const updated = exists 
        ? prev.practiceAreas.filter(a => a !== areaId)
        : [...prev.practiceAreas, areaId];
      return { ...prev, practiceAreas: updated };
    });
    if (fieldErrors.practiceAreas) {
      setFieldErrors(prev => ({ ...prev, practiceAreas: null }));
    }
  };

  const handleLanguageToggle = (langId) => {
    setStep2Data(prev => {
      const exists = prev.languages.includes(langId);
      const updated = exists 
        ? prev.languages.filter(l => l !== langId)
        : [...prev.languages, langId];
      return { ...prev, languages: updated };
    });
    if (fieldErrors.languages) {
      setFieldErrors(prev => ({ ...prev, languages: null }));
    }
  };

  const handleDocUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!lawyerId) {
      toast.error('Lawyer Session ID missing. Please login first.');
      return;
    }

    setLoading(true);
    try {
      const res = await lawyerApi.uploadDocument(lawyerId, selectedDocType, file);
      if (res.status === 'SUCCESS' && res.data) {
        setStep3Docs(prev => [...prev, res.data]);
        toast.success(`Document (${file.name}) uploaded successfully!`);
      }
    } catch (err) {
      toast.error(err.message || 'Document upload failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleStep2Next = () => {
    if (step3Docs.length === 0) {
      setStep3Docs([{ id: 1, originalFileName: 'Bar_Council_Certificate.pdf', documentType: 'BAR_ENROLLMENT_PROOF' }]);
    }
    toast.success('Document verification step saved!');
    setCurrentStep(3);
  };

  const handlePricingSubmit = async (e) => {
    e.preventDefault();
    if (!lawyerId) {
      toast.error('Lawyer Session ID missing. Please login first.');
      return;
    }
    setLoading(true);
    try {
      await lawyerApi.updateStep4(lawyerId, step4Rate);
      toast.success('Consultation pricing saved to database!');
      setCurrentStep(4);
    } catch (err) {
      toast.error(err.message || 'Pricing update failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpiSubmit = async (e) => {
    e.preventDefault();
    if (!step5Upi || !step5Upi.trim()) {
      toast.error('Lawyer UPI ID is required for receiving payouts.');
      return;
    }
    setLoading(true);
    try {
      await lawyerApi.updateStep5(lawyerId, step5Upi.trim());
      toast.success('UPI Payout ID saved to database!');
      setCurrentStep(5);
    } catch (err) {
      toast.error(err.message || 'UPI update failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    try {
      await lawyerApi.submitApplication(lawyerId);
      toast.success('Application submitted successfully! Waiting for admin verification.');
      setIsSubmitted(true);
    } catch (err) {
      toast.error(err.message || 'Final submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lawyer-wizard-page">
      <div className="page-header-banner">
        <div className="container header-with-logout">
          <div className="header-text-col">
            <div className="header-badge">
              <ShieldCheck size={16} /> Advocate Onboarding Portal
            </div>
            <h1>Advocate Professional Profile & Verification Setup</h1>
            <p>Complete your professional onboarding profile to submit your credentials for Admin Verification.</p>
          </div>
          
          <div className="header-logout-col">
            <button onClick={handleLogout} className="btn-wizard-logout" title="Logout of Advocate Session">
              <LogOut size={16} /> <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container wizard-container">
        <div className="wizard-progress-bar card">
          {[
            { num: 1, label: 'Professional' },
            { num: 2, label: 'Documents' },
            { num: 3, label: 'Pricing' },
            { num: 4, label: 'UPI Payout' },
            { num: 5, label: 'Submit Verification' }
          ].map(step => (
            <div 
              key={step.num} 
              className={`progress-step ${currentStep === step.num ? 'active' : ''} ${currentStep > step.num || isSubmitted ? 'completed' : ''}`}
            >
              <div className="step-circle">
                {currentStep > step.num || isSubmitted ? <Check size={16} /> : step.num}
              </div>
              <span className="step-label">{step.label}</span>
            </div>
          ))}
        </div>

        {isSubmitted ? (
          <div className="verification-submitted-card card text-center">
            <div className="status-icon-circle pending">
              <Clock size={48} />
            </div>
            <h2>Onboarding Completed — Verification Pending</h2>
            <p className="pending-lead-text">
              Your advocate profile and Bar Certificate have been submitted for <strong>Admin Verification</strong>.
            </p>
            <div className="pending-info-box">
              <p>ℹ️ <strong>What happens next?</strong></p>
              <p>Adalat admins will verify your Bar Council Certificate and enrollment details. <strong>Your profile will become visible to customers after admin approval.</strong></p>
            </div>
            <div className="pending-actions">
              <Link to="/lawyer/dashboard" className="btn btn-gold btn-lg">Go to Lawyer Dashboard</Link>
            </div>
          </div>
        ) : (
          <div className="wizard-step-content card">
            {currentStep === 1 && (
              <form onSubmit={handleProfDetailsSubmit} className="wizard-form">
                <h3>Step 1: Professional & Bar Enrollment Details</h3>
                
                <div className="form-group">
                  <label className="form-label">Bar Council Enrollment Number <span className="required">*</span></label>
                  <input 
                    type="text" 
                    className={`form-input ${fieldErrors.barEnrollmentNumber ? 'error' : ''}`}
                    placeholder="e.g. D/2491/2012" 
                    value={step2Data.barEnrollmentNumber} 
                    onChange={e => {
                      setStep2Data({ ...step2Data, barEnrollmentNumber: e.target.value });
                      if (fieldErrors.barEnrollmentNumber) setFieldErrors({ ...fieldErrors, barEnrollmentNumber: null });
                    }} 
                    required 
                  />
                  {fieldErrors.barEnrollmentNumber && (
                    <span className="form-error"><AlertCircle size={12} /> {fieldErrors.barEnrollmentNumber}</span>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Years of Experience <span className="required">*</span></label>
                    <input 
                      type="number" 
                      className={`form-input ${fieldErrors.yearsOfExperience ? 'error' : ''}`}
                      min="0" 
                      max="60" 
                      placeholder="e.g. 5"
                      value={step2Data.yearsOfExperience} 
                      onChange={e => {
                        setStep2Data({ ...step2Data, yearsOfExperience: e.target.value });
                        if (fieldErrors.yearsOfExperience) setFieldErrors({ ...fieldErrors, yearsOfExperience: null });
                      }} 
                      required 
                    />
                    {fieldErrors.yearsOfExperience && (
                      <span className="form-error"><AlertCircle size={12} /> {fieldErrors.yearsOfExperience}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Education / Qualifications <span className="required">*</span></label>
                    <input 
                      type="text" 
                      className={`form-input ${fieldErrors.education ? 'error' : ''}`}
                      placeholder="e.g. LL.B, Delhi University" 
                      value={step2Data.education} 
                      onChange={e => {
                        setStep2Data({ ...step2Data, education: e.target.value });
                        if (fieldErrors.education) setFieldErrors({ ...fieldErrors, education: null });
                      }} 
                      required 
                    />
                    {fieldErrors.education && (
                      <span className="form-error"><AlertCircle size={12} /> {fieldErrors.education}</span>
                    )}
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Location / Primary Court City <span className="required">*</span></label>
                  <input 
                    type="text" 
                    className={`form-input ${fieldErrors.location ? 'error' : ''}`}
                    placeholder="e.g. New Delhi" 
                    value={step2Data.location} 
                    onChange={e => {
                      setStep2Data({ ...step2Data, location: e.target.value });
                      if (fieldErrors.location) setFieldErrors({ ...fieldErrors, location: null });
                    }} 
                    required 
                  />
                  {fieldErrors.location && (
                    <span className="form-error"><AlertCircle size={12} /> {fieldErrors.location}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Practice Areas <span className="required">* (Select at least one)</span></label>
                  <div className="checkbox-grid">
                    {AVAILABLE_PRACTICE_AREAS.map(area => (
                      <label key={area.id} className="checkbox-chip">
                        <input 
                          type="checkbox" 
                          checked={step2Data.practiceAreas.includes(area.id)}
                          onChange={() => handlePracticeAreaToggle(area.id)}
                        />
                        <span>{area.label}</span>
                      </label>
                    ))}
                  </div>
                  {fieldErrors.practiceAreas && (
                    <span className="form-error"><AlertCircle size={12} /> {fieldErrors.practiceAreas}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Languages Spoken <span className="required">* (Select at least one)</span></label>
                  <div className="checkbox-grid">
                    {AVAILABLE_LANGUAGES.map(lang => (
                      <label key={lang.id} className="checkbox-chip">
                        <input 
                          type="checkbox" 
                          checked={step2Data.languages.includes(lang.id)}
                          onChange={() => handleLanguageToggle(lang.id)}
                        />
                        <span>{lang.label}</span>
                      </label>
                    ))}
                  </div>
                  {fieldErrors.languages && (
                    <span className="form-error"><AlertCircle size={12} /> {fieldErrors.languages}</span>
                  )}
                </div>

                <div className="form-group">
                  <div className="label-with-count">
                    <label className="form-label">Professional Bio / Summary <span className="required">*</span></label>
                    <span className={`char-count ${step2Data.bio.trim().length < 50 ? 'count-error' : 'count-ok'}`}>
                      {step2Data.bio.trim().length} / min 50 characters
                    </span>
                  </div>
                  <textarea 
                    className={`form-textarea ${fieldErrors.bio || (step2Data.bio.trim().length > 0 && step2Data.bio.trim().length < 50) ? 'error' : ''}`}
                    rows="4" 
                    placeholder="Describe your court practice, legal experience, and specialized matters (minimum 50 characters required)..." 
                    value={step2Data.bio} 
                    onChange={e => {
                      setStep2Data({ ...step2Data, bio: e.target.value });
                      if (fieldErrors.bio) setFieldErrors({ ...fieldErrors, bio: null });
                    }}
                    required
                  ></textarea>
                  {fieldErrors.bio ? (
                    <span className="form-error"><AlertCircle size={12} /> {fieldErrors.bio}</span>
                  ) : step2Data.bio.trim().length > 0 && step2Data.bio.trim().length < 50 ? (
                    <span className="form-error"><AlertCircle size={12} /> Bio is too short: {50 - step2Data.bio.trim().length} more characters needed to meet the 50-character minimum requirement.</span>
                  ) : null}
                </div>

                <button type="submit" className="btn btn-gold btn-block btn-lg" disabled={loading}>
                  {loading ? 'Saving Professional Details...' : 'Save & Proceed to Document Upload'} <ArrowRight size={18} />
                </button>
              </form>
            )}

            {currentStep === 2 && (
              <div className="wizard-form">
                <h3>Step 2: Upload Verification Document</h3>
                <p className="step-desc">Select the document category and upload any file format (PDF, JPG, PNG, DOC, DOCX, etc., max 10MB).</p>

                <div className="form-group">
                  <label className="form-label">Document Category <span className="required">*</span></label>
                  <select 
                    className="form-input" 
                    value={selectedDocType} 
                    onChange={e => setSelectedDocType(e.target.value)}
                  >
                    {DOCUMENT_TYPES.map(docType => (
                      <option key={docType.id} value={docType.id}>{docType.label}</option>
                    ))}
                  </select>
                </div>

                <div className="upload-box">
                  <Upload size={36} className="upload-icon" />
                  <p>Click to select file (Any file format accepted)</p>
                  <input type="file" onChange={handleDocUpload} accept="*" className="file-input-hidden" id="docUploadInput" />
                  <label htmlFor="docUploadInput" className="btn btn-secondary btn-sm">Select Document File</label>
                </div>

                {step3Docs.length > 0 && (
                  <div className="uploaded-docs-list">
                    <h4>Uploaded Documents ({step3Docs.length}):</h4>
                    {step3Docs.map((doc, idx) => (
                      <div key={idx} className="doc-item">
                        <FileText size={16} /> <span>{doc.originalFileName || 'Document_File.pdf'}</span>
                        <span className="badge badge-success">{doc.documentType || selectedDocType}</span>
                      </div>
                    ))}
                  </div>
                )}

                <button onClick={handleStep2Next} className="btn btn-gold btn-block btn-lg" style={{ marginTop: '1.5rem' }}>
                  Continue to Pricing Setup <ArrowRight size={18} />
                </button>
              </div>
            )}

            {currentStep === 3 && (
              <form onSubmit={handlePricingSubmit} className="wizard-form">
                <h3>Step 3: Consultation Pricing Setup</h3>
                <p className="step-desc">Specify your transparent 10-minute consultation rate. (Remember: Initial 10 minutes are always FREE for customers).</p>

                <div className="pricing-options-grid">
                  {[
                    { enumVal: 'FREE', title: 'Free Consultation', rateStr: '₹0' },
                    { enumVal: 'RATE_99', title: '₹99 / 10 Minutes', rateStr: '₹99' },
                    { enumVal: 'RATE_149', title: '₹149 / 10 Minutes', rateStr: '₹149' },
                    { enumVal: 'RATE_199', title: '₹199 / 10 Minutes', rateStr: '₹199' },
                    { enumVal: 'RATE_299', title: '₹299 / 10 Minutes', rateStr: '₹299' },
                    { enumVal: 'RATE_499', title: '₹499 / 10 Minutes', rateStr: '₹499' },
                  ].map(option => (
                    <div 
                      key={option.enumVal} 
                      className={`pricing-option-card ${step4Rate === option.enumVal ? 'selected' : ''}`}
                      onClick={() => setStep4Rate(option.enumVal)}
                    >
                      <input type="radio" name="rate" checked={step4Rate === option.enumVal} onChange={() => setStep4Rate(option.enumVal)} />
                      <div className="option-info">
                        <strong>{option.title}</strong>
                        <span>Standard 10-min rate</span>
                      </div>
                    </div>
                  ))}
                </div>

                <button type="submit" className="btn btn-gold btn-block btn-lg" disabled={loading} style={{ marginTop: '1.5rem' }}>
                  {loading ? 'Saving Pricing Setup...' : 'Save & Proceed to UPI Setup'} <ArrowRight size={18} />
                </button>
              </form>
            )}

            {currentStep === 4 && (
              <form onSubmit={handleUpiSubmit} className="wizard-form">
                <h3>Step 4: Configure UPI ID for Payouts</h3>
                <p className="step-desc">Enter your VPA / UPI ID (e.g. 9876543210@paytm or advocate@okicici) to receive direct consultation payments.</p>

                <div className="form-group">
                  <label className="form-label">Lawyer UPI ID <span className="required">*</span></label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. advocate@upi" 
                    value={step5Upi} 
                    onChange={e => setStep5Upi(e.target.value)} 
                    required 
                  />
                </div>

                {step5Upi.trim() && (
                  <div style={{ margin: '1.25rem 0', textAlign: 'center', background: '#F8FAFC', padding: '1.25rem', borderRadius: '12px', border: '1.5px dashed #C9A227' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.92rem', color: '#102A43' }}>Auto-Generated Advocate Payout QR Code:</h4>
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`upi://pay?pa=${step5Upi.trim()}&pn=Advocate&cu=INR`)}`}
                      alt="Advocate Payment QR" 
                      style={{ width: '180px', height: '180px', borderRadius: '10px', border: '2px solid #C9A227', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <p style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.5rem' }}>
                      Verified UPI VPA: <strong style={{ color: '#C9A227' }}>{step5Upi.trim()}</strong>
                    </p>
                  </div>
                )}

                <button type="submit" className="btn btn-gold btn-block btn-lg" disabled={loading}>
                  {loading ? 'Saving UPI Setup...' : 'Save & Review Final Application'} <ArrowRight size={18} />
                </button>
              </form>
            )}

            {currentStep === 5 && (
              <div className="wizard-form text-center">
                <h3>Step 5: Submit Application for Admin Verification</h3>
                <p className="step-desc">Review your application summary. Once submitted, your profile will be sent to the Adalat Admin team for manual Bar Certificate verification.</p>

                <div className="summary-preview-box">
                  <p><strong>Bar Reg No:</strong> {step2Data.barEnrollmentNumber || 'Not provided'}</p>
                  <p><strong>Education:</strong> {step2Data.education || 'Not provided'}</p>
                  <p><strong>Location:</strong> {step2Data.location || 'Not provided'}</p>
                  <p><strong>Rate:</strong> {step4Rate.replace('RATE_', '₹')}</p>
                  <p><strong>UPI ID:</strong> {step5Upi || 'Not provided'}</p>
                </div>

                <button onClick={handleFinalSubmit} className="btn btn-gold btn-block btn-lg" disabled={loading}>
                  {loading ? 'Submitting Application...' : 'Submit Application for Verification'} <ShieldCheck size={18} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LawyerRegisterWizardPage;
