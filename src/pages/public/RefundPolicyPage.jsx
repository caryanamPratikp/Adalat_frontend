import React, { useEffect } from 'react';

const RefundPolicyPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={styles.wrapper}>
      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.h1}>Refund & Cancellation Policy</h1>
          <p style={styles.subtitle}>Transparent guidelines on fees and refunds.</p>
        </div>
      </section>

      {/* Content */}
      <section style={styles.section}>
        <div style={styles.container}>
          <div style={styles.content}>
            <h2 style={styles.h2}>1. Registration Fee</h2>
            <p style={styles.p}>
              The platform registration fee of ₹99 is strictly <strong>non-refundable</strong> under any circumstances. This nominal fee covers verification and platform maintenance costs to ensure a high-quality experience for genuine users.
            </p>

            <h2 style={styles.h2}>2. Consultation Payments</h2>
            <p style={styles.p}>
              Payments made for scheduled consultations with lawyers are held securely by Adalat until the consultation is completed. If you cancel a consultation at least 24 hours prior to the scheduled time, you are eligible for a 100% refund.
            </p>

            <h2 style={styles.h2}>3. Missed Consultations</h2>
            <p style={styles.p}>
              If a lawyer fails to attend a scheduled consultation without prior notice, the user is entitled to a full refund. However, if the user fails to attend without cancelling 24 hours in advance, no refund will be issued and the fee will be transferred to the lawyer for their booked time.
            </p>

            <h2 style={styles.h2}>4. Refund Process</h2>
            <p style={styles.p}>
              Eligible refunds will be processed back to the original method of payment within 5-7 business days. You will receive an email confirmation once the refund has been initiated by our team.
            </p>

            <h2 style={styles.h2}>5. Dispute Resolution</h2>
            <p style={styles.p}>
              If you are dissatisfied with a consultation or believe you were charged unfairly, you may open a dispute within 48 hours of the consultation by contacting support@adalatlegal.in. Our team will review the chat logs and make a fair determination.
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

export default RefundPolicyPage;
