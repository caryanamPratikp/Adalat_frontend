import React, { useEffect } from 'react';

const TermsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={styles.wrapper}>
      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.h1}>Terms of Service</h1>
          <p style={styles.subtitle}>Last Updated: October 2023</p>
        </div>
      </section>

      {/* Content */}
      <section style={styles.section}>
        <div style={styles.container}>
          <div style={styles.content}>
            <h2 style={styles.h2}>1. Introduction</h2>
            <p style={styles.p}>
              Welcome to Adalat. By accessing or using our platform, you agree to be bound by these Terms of Service. Please read them carefully. Adalat acts as an intermediary connecting users with independent legal professionals.
            </p>

            <h2 style={styles.h2}>2. Account Registration</h2>
            <p style={styles.p}>
              To access certain features, you must register for an account. A non-refundable registration fee of ₹99 is applicable. You agree to provide accurate, current, and complete information during registration and to keep this information up to date.
            </p>

            <h2 style={styles.h2}>3. Consultation Terms</h2>
            <p style={styles.p}>
              The first 10 minutes of text chat with any lawyer are free. Subsequent consultations, whether by text, audio, or video, are subject to the fees set by the respective lawyer. Adalat does not dictate these fees.
            </p>

            <h2 style={styles.h2}>4. AI Disclaimer</h2>
            <p style={styles.p}>
              The AI assistant on Adalat provides general legal information and is not a substitute for professional legal advice. Reliance on any information provided by the AI is solely at your own risk.
            </p>

            <h2 style={styles.h2}>5. Payment Terms</h2>
            <p style={styles.p}>
              All payments are processed securely through our payment partners. Users are responsible for any charges incurred. Refunds are governed by our separate Refund Policy.
            </p>

            <h2 style={styles.h2}>6. Limitation of Liability</h2>
            <p style={styles.p}>
              Adalat is not a law firm. We do not provide legal representation. We are not liable for the quality, accuracy, or outcome of advice provided by the independent lawyers on our platform.
            </p>

            <h2 style={styles.h2}>7. Governing Law</h2>
            <p style={styles.p}>
              These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in New Delhi.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

const styles = {
  wrapper: {
    fontFamily: 'var(--font-body, "Outfit", sans-serif)',
    backgroundColor: 'var(--bg-ivory)',
    color: 'var(--text-dark)',
    minHeight: '100vh'
  },
  hero: {
    background: 'linear-gradient(135deg, var(--primary-navy) 0%, #0a192f 100%)',
    padding: '60px 20px',
    textAlign: 'center',
    color: 'white'
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  h1: {
    fontFamily: 'var(--font-heading, "Cinzel", serif)',
    fontSize: '2.8rem',
    margin: '0 0 10px 0',
    color: '#FFFFFF',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
    fontWeight: '700'
  },
  subtitle: {
    fontSize: '1rem',
    color: 'var(--accent-gold)'
  },
  section: {
    padding: '60px 20px'
  },
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    background: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
    border: '1px solid var(--border-color)'
  },
  content: {
    lineHeight: '1.7'
  },
  h2: {
    fontFamily: 'var(--font-heading, "Cinzel", serif)',
    fontSize: '1.5rem',
    color: 'var(--primary-navy)',
    marginTop: '30px',
    marginBottom: '15px'
  },
  p: {
    color: 'var(--text-secondary)',
    marginBottom: '20px',
    fontSize: '1.05rem'
  }
};

export default TermsPage;
