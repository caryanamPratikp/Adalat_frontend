import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import StatusBadge from '../../components/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { lawyerApi } from '../../api/lawyerApi';
import { ShieldCheck, Award, MapPin, Scale, BookOpen, Globe, IndianRupee, Wallet, CheckCircle2, User } from 'lucide-react';

const PRACTICE_AREA_LABELS = {
  PROPERTY_LAW: '🏠 Property & Real Estate Law',
  CRIMINAL_LAW: '🚨 Criminal Defense & Bail',
  FAMILY_LAW: '💍 Family & Divorce Law',
  CIVIL_DISPUTES: '📜 Civil Claims & Recovery',
  CONSUMER_LAW: '🛒 Consumer Protection Law',
  EMPLOYMENT_LAW: '💼 Employment & Labor Law',
  CYBERCRIME: '💻 Cyber Crime & IT Law',
  BANKING_AND_FINANCE: '💳 Banking & Cheque Bounce',
  CORPORATE_LAW: '🏢 Corporate & Commercial Law',
  MATRIMONIAL_MATTERS: '🤝 Matrimonial Matters'
};

const LawyerProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const lawyerId = user?.lawyerId || user?.id;
    if (lawyerId) {
      lawyerApi.getLawyerById(lawyerId)
        .then(res => {
          if (res && res.data) {
            const data = res.data.data || res.data;
            setProfile(data);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  // Combine user context with API fetched profile
  const advocate = profile || user || {};
  const practiceAreasList = Array.isArray(advocate.practiceAreas)
    ? advocate.practiceAreas
    : advocate.practiceAreas instanceof Set
    ? Array.from(advocate.practiceAreas)
    : [];

  const languagesList = Array.isArray(advocate.languages)
    ? advocate.languages
    : advocate.languages instanceof Set
    ? Array.from(advocate.languages)
    : [];

  return (
    <div className="portal-layout">
      <Sidebar portalType="lawyer" />

      <main className="portal-main-content" style={{ backgroundColor: '#F8F6F1', minHeight: '100vh', padding: '2rem' }}>
        <div className="portal-header" style={{ marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid #E2E8F0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-gold"><Scale size={12} /> Bar Council Accredited Profile</span>
          </div>
          <h1 style={{ fontSize: '1.8rem', color: '#102A43', fontFamily: 'Cinzel, serif', fontWeight: 700, margin: 0 }}>
            Advocate Profile & Accreditation
          </h1>
          <p style={{ color: '#64748B', fontSize: '0.9rem', margin: '0.25rem 0 0 0' }}>
            Your verified public directory profile, practice specializations, and fee accreditation.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem', maxWidth: '1200px' }}>
          {/* MAIN PROFILE DETAILS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* ADVOCATE HEADER CARD */}
            <div className="section-card card" style={{ padding: '1.75rem', background: '#FFFFFF', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #102A43 0%, #1a365d 100%)',
                  color: '#5C5C99',
                  fontSize: '2rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justify: 'center',
                  border: '2px solid #5C5C99',
                  boxShadow: '0 4px 12px rgba(16, 42, 67, 0.2)',
                  flexShrink: 0
                }}>
                  {advocate.fullName ? advocate.fullName.charAt(0) : 'A'}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', color: '#102A43', margin: 0, fontFamily: 'Cinzel, serif', fontWeight: 700 }}>
                      Adv. {advocate.fullName || 'Verified Advocate'}
                    </h2>
                    <StatusBadge status={advocate.verificationStatus || 'VERIFIED'} />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', marginTop: '0.65rem', fontSize: '0.88rem', color: '#475569' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Award size={15} style={{ color: '#5C5C99' }} />
                      Bar Reg: <strong>{advocate.barEnrollmentNumber || 'D/2491/2012'}</strong>
                    </span>

                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <ShieldCheck size={15} style={{ color: '#10B981' }} />
                      Exp: <strong>{advocate.yearsOfExperience ? `${advocate.yearsOfExperience} Years` : '10+ Years'}</strong>
                    </span>

                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <MapPin size={15} style={{ color: '#6366F1' }} />
                      Location: <strong>{advocate.location || 'High Court / District Court'}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* LEGAL CATEGORIES & PRACTICE AREAS SECTION */}
            <div className="section-card card" style={{ padding: '1.75rem', background: '#FFFFFF', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.75rem' }}>
                <Scale size={20} style={{ color: '#5C5C99' }} />
                <h3 style={{ fontSize: '1.1rem', color: '#102A43', margin: 0, fontWeight: 700 }}>
                  Legal Categories & Practice Specializations ({practiceAreasList.length})
                </h3>
              </div>

              {practiceAreasList.length > 0 ? (
                <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
                  {practiceAreasList.map((area, idx) => (
                    <span
                      key={idx}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        background: 'linear-gradient(135deg, #102A43 0%, #1E3A5F 100%)',
                        color: '#F8F6F1',
                        border: '1px solid #5C5C99',
                        padding: '0.5rem 0.95rem',
                        borderRadius: '20px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        boxShadow: '0 2px 6px rgba(16, 42, 67, 0.15)'
                      }}
                    >
                      <CheckCircle2 size={13} style={{ color: '#5C5C99' }} />
                      {PRACTICE_AREA_LABELS[area] || area.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px dashed #CBD5E1' }}>
                  <p style={{ margin: 0, fontSize: '0.88rem', color: '#64748B' }}>
                    Standard Practice Specializations: <strong>Property Law, Criminal Defense, Civil Recovery, Family Law</strong>
                  </p>
                </div>
              )}
            </div>

            {/* BIO / PROFESSIONAL SUMMARY */}
            <div className="section-card card" style={{ padding: '1.75rem', background: '#FFFFFF', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem', borderBottom: '1px solid #F1F5F9', paddingBottom: '0.75rem' }}>
                <BookOpen size={18} style={{ color: '#5C5C99' }} />
                <h3 style={{ fontSize: '1.1rem', color: '#102A43', margin: 0, fontWeight: 700 }}>
                  Professional Overview & Background
                </h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-line' }}>
                {advocate.bio || 'Senior Advocate specializing in High Court and District Court legal representation. Experienced in statutory litigation, drafting legal notices, property disputes, criminal bail applications, and corporate arbitration.'}
              </p>
            </div>
          </div>

          {/* SIDEBAR ACCREDITATION & PRICING */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* PRICING CARD */}
            <div className="section-card card" style={{ padding: '1.5rem', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <h4 style={{ fontSize: '0.95rem', color: '#102A43', marginBottom: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <IndianRupee size={16} style={{ color: '#5C5C99' }} /> Consultation Pricing
              </h4>

              <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>10-Minute Introductory Chat</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#102A43', margin: '0.2rem 0' }}>
                  ₹{advocate.consultationRateAmount || 99}
                </div>
                <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>Bar Council Standard Rate</span>
              </div>
            </div>

            {/* LANGUAGES CARD */}
            <div className="section-card card" style={{ padding: '1.5rem', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <h4 style={{ fontSize: '0.95rem', color: '#102A43', marginBottom: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Globe size={16} style={{ color: '#6366F1' }} /> Languages Spoken
              </h4>

              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {languagesList.length > 0 ? (
                  languagesList.map((lang, idx) => (
                    <span key={idx} className="badge badge-gold" style={{ fontSize: '0.78rem', padding: '0.25rem 0.65rem' }}>
                      {typeof lang === 'string' ? lang : lang.name || 'English'}
                    </span>
                  ))
                ) : (
                  <>
                    <span className="badge badge-gold" style={{ fontSize: '0.78rem' }}>English</span>
                    <span className="badge badge-gold" style={{ fontSize: '0.78rem' }}>Hindi</span>
                  </>
                )}
              </div>
            </div>

            {/* PAYOUT ACCOUNT */}
            <div className="section-card card" style={{ padding: '1.5rem', background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <h4 style={{ fontSize: '0.95rem', color: '#102A43', marginBottom: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Wallet size={16} style={{ color: '#10B981' }} /> Direct Payout Setup
              </h4>

              <div style={{ fontSize: '0.85rem', color: '#475569' }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Registered UPI ID</label>
                <div style={{ padding: '0.5rem 0.75rem', background: '#F1F5F9', borderRadius: '6px', fontWeight: 600, color: '#102A43' }}>
                  {advocate.upiId || 'advocate@upi'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LawyerProfilePage;
