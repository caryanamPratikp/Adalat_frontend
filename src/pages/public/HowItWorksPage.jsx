import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Clock, CreditCard, Bot, ArrowRight, UserCheck, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

const HowItWorksPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      }),
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const steps = [
    {
      icon: <UserCheck size={32} className="gold-icon" />,
      title: "1. Register & Verify",
      description: "Sign up with a one-time verification fee of ₹99. Complete OTP verification for secure access."
    },
    {
      icon: <Bot size={32} className="gold-icon" />,
      title: "2. Initial AI Assistance",
      description: "Chat with our legal AI to understand your issue and get preliminary guidance before speaking to a lawyer."
    },
    {
      icon: <Clock size={32} className="gold-icon" />,
      title: "3. Connect with Lawyers",
      description: "Browse verified advocates by category and start a free 10-minute chat to discuss your case."
    },
    {
      icon: <ShieldCheck size={32} className="gold-icon" />,
      title: "4. Book Consultation",
      description: "Choose a lawyer, pay securely, and schedule an extended consultation via chat or video call."
    }
  ];

  const faqs = [
    {
      q: "Is my data and chat history secure?",
      a: "Yes, all communication is end-to-end encrypted and strictly confidential under attorney-client privilege."
    },
    {
      q: "Why is there a ₹99 registration fee?",
      a: "The nominal fee ensures only serious users access the platform, reducing spam and helping us maintain a network of verified legal professionals."
    },
    {
      q: "How do I know the lawyers are genuine?",
      a: "Every advocate on our platform is verified through the Bar Council of India with their registration number."
    },
    {
      q: "What happens after the 10-minute free chat?",
      a: "If you wish to proceed, you can book a paid consultation at the lawyer's specified rate for detailed advice and representation."
    },
    {
      q: "Can I get a refund if the lawyer doesn't respond?",
      a: "Yes, if a scheduled consultation is missed by the lawyer, you are eligible for a full refund of the consultation fee."
    }
  ];

  return (
    <div className="page-wrapper" style={styles.wrapper}>
      <style>{`
        .animate-on-scroll { opacity: 0; transform: translateY(30px); transition: all 0.6s ease-out; }
        .animate-on-scroll.is-visible { opacity: 1; transform: translateY(0); }
        .step-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.1); border-color: var(--accent-gold); }
        .gold-icon { color: var(--accent-gold); }
      `}</style>

      {/* Hero Banner */}
      <section style={styles.hero}>
        <div style={styles.heroContent} className="animate-on-scroll">
          <div style={styles.badge}>SIMPLE & SECURE</div>
          <h1 style={styles.h1}>How Adalat Legal Works</h1>
          <p style={styles.subtitle}>Your journey to reliable, verified legal advice in four easy steps.</p>
        </div>
      </section>

      {/* Steps Section */}
      <section style={styles.section}>
        <div style={styles.container}>
          <div style={styles.stepsGrid}>
            {steps.map((step, idx) => (
              <div key={idx} className="step-card animate-on-scroll" style={{...styles.stepCard, transitionDelay: `${idx * 100}ms`}}>
                <div style={styles.stepIconWrapper}>
                  {step.icon}
                </div>
                <h3 style={styles.stepTitle}>{step.title}</h3>
                <p style={styles.stepDesc}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{...styles.section, backgroundColor: 'white'}}>
        <div style={styles.container}>
          <div style={styles.faqHeader} className="animate-on-scroll">
            <h2 style={styles.h2}>Frequently Asked Questions</h2>
            <p style={styles.text}>Everything you need to know about using Adalat.</p>
          </div>
          
          <div style={styles.faqList} className="animate-on-scroll">
            {faqs.map((faq, idx) => (
              <div key={idx} style={styles.faqItem} onClick={() => toggleFaq(idx)}>
                <div style={styles.faqQ}>
                  <h4 style={styles.faqTitle}>{faq.q}</h4>
                  {openFaq === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
                {openFaq === idx && (
                  <div style={styles.faqA}>
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={styles.ctaSection} className="animate-on-scroll">
        <div style={styles.container}>
          <h2 style={{...styles.h2, color: 'white'}}>Ready to Get Verified Legal Advice?</h2>
          <p style={{...styles.text, color: 'rgba(255,255,255,0.8)', marginBottom: '30px'}}>
            Join thousands of users who have found the right legal support on Adalat.
          </p>
          <Link to="/register" style={styles.ctaButton}>
            Register Now <ArrowRight size={18} style={{marginLeft: '8px'}} />
          </Link>
        </div>
      </section>
    </div>
  );
};

const styles = {
  wrapper: {
    fontFamily: 'var(--font-body, "Outfit", sans-serif)',
    color: 'var(--text-dark)',
    backgroundColor: 'var(--bg-ivory)'
  },
  hero: {
    background: 'linear-gradient(135deg, var(--primary-navy) 0%, #0a192f 100%)',
    padding: '80px 20px',
    textAlign: 'center',
    color: 'white',
    position: 'relative',
    overflow: 'hidden'
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto',
    position: 'relative',
    zIndex: 2
  },
  badge: {
    display: 'inline-block',
    padding: '6px 16px',
    background: 'rgba(201, 162, 39, 0.1)',
    color: 'var(--accent-gold)',
    border: '1px solid rgba(201, 162, 39, 0.3)',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: '600',
    letterSpacing: '1px',
    marginBottom: '20px'
  },
  h1: {
    fontFamily: 'var(--font-heading, "Cinzel", serif)',
    fontSize: '3.5rem',
    margin: '0 0 20px 0',
    color: '#FFFFFF',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
    fontWeight: '700',
    lineHeight: '1.2'
  },
  h2: {
    fontFamily: 'var(--font-heading, "Cinzel", serif)',
    fontSize: '2.5rem',
    margin: '0 0 15px 0',
    color: 'var(--primary-navy)'
  },
  subtitle: {
    fontSize: '1.2rem',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: '1.6',
    maxWidth: '600px',
    margin: '0 auto'
  },
  section: {
    padding: '80px 20px'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    padding: '20px 0'
  },
  stepCard: {
    background: 'white',
    padding: '40px 30px',
    borderRadius: '16px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    border: '1px solid var(--border-color)',
    transition: 'all 0.3s ease',
    textAlign: 'center'
  },
  stepIconWrapper: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    background: 'rgba(201, 162, 39, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px auto'
  },
  stepTitle: {
    fontFamily: 'var(--font-heading, "Cinzel", serif)',
    fontSize: '1.4rem',
    color: 'var(--primary-navy)',
    marginBottom: '15px'
  },
  stepDesc: {
    color: 'var(--text-secondary)',
    lineHeight: '1.6'
  },
  faqHeader: {
    textAlign: 'center',
    marginBottom: '50px'
  },
  text: {
    color: 'var(--text-secondary)',
    fontSize: '1.1rem'
  },
  faqList: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  faqItem: {
    borderBottom: '1px solid var(--border-color)',
    padding: '20px 0',
    cursor: 'pointer'
  },
  faqQ: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'var(--primary-navy)'
  },
  faqTitle: {
    fontSize: '1.1rem',
    fontWeight: '600',
    margin: 0
  },
  faqA: {
    paddingTop: '15px',
    color: 'var(--text-secondary)',
    lineHeight: '1.6'
  },
  ctaSection: {
    background: 'var(--primary-navy)',
    padding: '80px 20px',
    textAlign: 'center'
  },
  ctaButton: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '14px 32px',
    background: 'var(--accent-gold)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '1.1rem',
    transition: 'background 0.3s ease'
  }
};

export default HowItWorksPage;
