import React, { useEffect } from 'react';
import { ShieldCheck, MessageCircle, Map, Target, Users, Award, Zap } from 'lucide-react';

const AboutPage = () => {
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

  return (
    <div style={styles.wrapper}>
      <style>{`
        .animate-on-scroll { opacity: 0; transform: translateY(30px); transition: all 0.6s ease-out; }
        .animate-on-scroll.is-visible { opacity: 1; transform: translateY(0); }
        .value-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
      `}</style>

      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroContent} className="animate-on-scroll">
          <div style={styles.badge}>OUR STORY</div>
          <h1 style={styles.h1}>About Adalat Legal</h1>
          <p style={styles.subtitle}>Democratizing access to legal services across India.</p>
        </div>
      </section>

      {/* Mission */}
      <section style={styles.section}>
        <div style={styles.container}>
          <div style={styles.textCenter} className="animate-on-scroll">
            <h2 style={styles.h2}>Our Mission</h2>
            <p style={styles.paragraph}>
              Adalat was founded with a singular vision: to make quality legal advice accessible, transparent, and affordable for every citizen. The Indian legal system is complex, and finding the right advocate can be daunting. We bridge this gap through technology.
            </p>
            <p style={styles.paragraph}>
              By combining AI-driven preliminary guidance with a nationwide network of Bar Council verified advocates, we ensure that you get the right advice at the right time, without geographical or financial barriers holding you back.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{...styles.section, background: 'white'}}>
        <div style={styles.container}>
          <div style={styles.statsGrid}>
            {[
              { icon: <Users size={32}/>, value: '500+', label: 'Verified Advocates' },
              { icon: <MessageCircle size={32}/>, value: '10,000+', label: 'Consultations' },
              { icon: <Award size={32}/>, value: '100%', label: 'Bar Verified' },
              { icon: <Zap size={32}/>, value: '24/7', label: 'AI Assistance' }
            ].map((stat, idx) => (
              <div key={idx} className="animate-on-scroll" style={{...styles.statBox, transitionDelay: `${idx * 100}ms`}}>
                <div style={styles.statIcon}>{stat.icon}</div>
                <h3 style={styles.statValue}>{stat.value}</h3>
                <p style={styles.statLabel}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={styles.section}>
        <div style={styles.container}>
          <h2 style={{...styles.h2, textAlign: 'center', marginBottom: '40px'}} className="animate-on-scroll">Why Choose Us</h2>
          <div style={styles.valuesGrid}>
            {[
              { icon: <ShieldCheck size={36}/>, title: 'Bar Verified', desc: 'Every advocate on our platform is rigorously verified using their Bar Council registration.' },
              { icon: <MessageCircle size={36}/>, title: '10m Free Chat', desc: 'Connect with any lawyer for 10 minutes free before committing to a paid consultation.' },
              { icon: <Map size={36}/>, title: 'Pan-India Network', desc: 'Find experts in your specific jurisdiction and legal category, anywhere in India.' }
            ].map((val, idx) => (
              <div key={idx} className="value-card animate-on-scroll" style={{...styles.valueCard, transitionDelay: `${idx * 100}ms`}}>
                <div style={styles.valueIcon}>{val.icon}</div>
                <h3 style={styles.valueTitle}>{val.title}</h3>
                <p style={styles.valueDesc}>{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section style={{...styles.section, background: 'var(--primary-navy)', color: 'white'}} className="animate-on-scroll">
        <div style={styles.container}>
          <div style={styles.contactWrapper}>
            <h2 style={{...styles.h2, color: 'white', marginBottom: '20px'}}>Get in Touch</h2>
            <p style={{marginBottom: '10px'}}>Email: support@adalatlegal.in</p>
            <p style={{marginBottom: '10px'}}>Phone: +91 1800-123-4567</p>
            <p>Address: Adalat Tech Pvt Ltd, Cyber City, Gurugram, Haryana - 122002</p>
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
    color: 'var(--text-dark)'
  },
  hero: {
    background: 'linear-gradient(135deg, var(--primary-navy) 0%, #0a192f 100%)',
    padding: '70px 20px',
    textAlign: 'center',
    color: 'white'
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto'
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
    marginBottom: '20px'
  },
  h1: {
    fontFamily: 'var(--font-heading, "Cinzel", serif)',
    fontSize: '3rem',
    margin: '0 0 15px 0',
    color: '#FFFFFF',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
    fontWeight: '700'
  },
  h2: {
    fontFamily: 'var(--font-heading, "Cinzel", serif)',
    fontSize: '2.5rem',
    color: 'var(--primary-navy)',
    margin: '0 0 20px 0'
  },
  subtitle: {
    fontSize: '1.2rem',
    color: 'rgba(255, 255, 255, 0.8)'
  },
  section: {
    padding: '80px 20px'
  },
  container: {
    maxWidth: '1000px',
    margin: '0 auto'
  },
  textCenter: {
    textAlign: 'center',
    maxWidth: '800px',
    margin: '0 auto'
  },
  paragraph: {
    fontSize: '1.1rem',
    lineHeight: '1.8',
    color: 'var(--text-secondary)',
    marginBottom: '20px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '30px',
    textAlign: 'center'
  },
  statBox: {
    padding: '30px 20px'
  },
  statIcon: {
    color: 'var(--accent-gold)',
    marginBottom: '15px'
  },
  statValue: {
    fontFamily: 'var(--font-heading, "Cinzel", serif)',
    fontSize: '2.5rem',
    color: 'var(--primary-navy)',
    margin: '0 0 10px 0'
  },
  statLabel: {
    color: 'var(--text-secondary)',
    fontWeight: '600',
    fontSize: '1.1rem',
    margin: 0
  },
  valuesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px'
  },
  valueCard: {
    background: 'white',
    padding: '40px 30px',
    borderRadius: '16px',
    border: '1px solid var(--border-color)',
    textAlign: 'center',
    transition: 'all 0.3s ease'
  },
  valueIcon: {
    width: '80px',
    height: '80px',
    background: 'rgba(201, 162, 39, 0.1)',
    color: 'var(--accent-gold)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px auto'
  },
  valueTitle: {
    fontFamily: 'var(--font-heading, "Cinzel", serif)',
    fontSize: '1.4rem',
    color: 'var(--primary-navy)',
    marginBottom: '15px'
  },
  valueDesc: {
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    margin: 0
  },
  contactWrapper: {
    textAlign: 'center',
    padding: '40px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.1)'
  }
};

export default AboutPage;
