import React, { useEffect } from 'react';

const PrivacyPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={styles.wrapper}>
      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.h1}>Privacy Policy</h1>
          <p style={styles.subtitle}>Protecting your data and confidentiality.</p>
        </div>
      </section>

      {/* Content */}
      <section style={styles.section}>
        <div style={styles.container}>
          <div style={styles.content}>
            <h2 style={styles.h2}>1. Information We Collect</h2>
            <p style={styles.p}>
              We collect information you provide directly to us, such as your name, contact details, identification documents (for lawyers), and payment information. We also collect usage data, chat transcripts, and device information automatically.
            </p>

            <h2 style={styles.h2}>2. How We Use Information</h2>
            <p style={styles.p}>
              Your information is used to provide, maintain, and improve our services; process transactions; verify identities; and communicate with you. AI chat data is processed securely to provide relevant preliminary legal guidance.
            </p>

            <h2 style={styles.h2}>3. Data Security & Confidentiality</h2>
            <p style={styles.p}>
              We implement robust security measures, including end-to-end encryption for lawyer-client communications, to protect your data. All lawyer-client chats and shared documents are strictly confidential and privileged.
            </p>

            <h2 style={styles.h2}>4. Third Party Services</h2>
            <p style={styles.p}>
              We may share necessary data with trusted third-party service providers (like payment gateways and cloud hosting) solely for the purpose of operating our platform. We do not sell your personal data to advertisers.
            </p>

            <h2 style={styles.h2}>5. Your Rights</h2>
            <p style={styles.p}>
              You have the right to access, update, or delete your personal information. You can manage your data preferences through your account settings or by contacting our support team.
            </p>

            <h2 style={styles.h2}>6. Contact Us</h2>
            <p style={styles.p}>
              If you have any questions or concerns about this Privacy Policy, please contact our Data Protection Officer at privacy@adalatlegal.in.
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

export default PrivacyPage;
