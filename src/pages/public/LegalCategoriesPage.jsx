import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Scale, Users, Home, FileText, ShoppingCart, ShieldAlert, Briefcase, Landmark, Car, HeartHandshake, ArrowRight } from 'lucide-react';

const LegalCategoriesPage = () => {
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

  const categories = [
    { id: 'CRIMINAL_LAW', name: 'Criminal Law', icon: <Scale size={32} />, count: '120+', desc: 'Defense, bail, FIRs, and criminal trials' },
    { id: 'FAMILY_LAW', name: 'Divorce & Family', icon: <HeartHandshake size={32} />, count: '150+', desc: 'Divorce, custody, alimony, and adoption' },
    { id: 'PROPERTY_LAW', name: 'Property', icon: <Home size={32} />, count: '200+', desc: 'Real estate, tenant disputes, and registration' },
    { id: 'CIVIL_DISPUTES', name: 'Civil Disputes', icon: <FileText size={32} />, count: '180+', desc: 'Contracts, recovery, and injunctions' },
    { id: 'CONSUMER_LAW', name: 'Consumer Law', icon: <ShoppingCart size={32} />, count: '90+', desc: 'Product defects, service deficiency' },
    { id: 'CYBERCRIME', name: 'Cybercrime', icon: <ShieldAlert size={32} />, count: '60+', desc: 'Online fraud, data theft, and IT Act' },
    { id: 'EMPLOYMENT_LAW', name: 'Employment', icon: <Users size={32} />, count: '85+', desc: 'Labour laws, wrongful termination, PF' },
    { id: 'CORPORATE_LAW', name: 'Corporate', icon: <Briefcase size={32} />, count: '110+', desc: 'Startup compliance, mergers, IP' },
    { id: 'BANKING', name: 'Banking', icon: <Landmark size={32} />, count: '75+', desc: 'Cheque bounce, loan disputes, DRT' },
    { id: 'MOTOR_VEHICLE', name: 'Motor Vehicle', icon: <Car size={32} />, count: '130+', desc: 'Accident claims, challans, MACT' }
  ];

  return (
    <div style={styles.wrapper}>
      <style>{`
        .animate-on-scroll { opacity: 0; transform: translateY(30px); transition: all 0.6s ease-out; }
        .animate-on-scroll.is-visible { opacity: 1; transform: translateY(0); }
        .cat-card { transition: all 0.3s ease; }
        .cat-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.08); border-left: 4px solid var(--accent-gold); }
      `}</style>

      {/* Hero Banner */}
      <section style={styles.hero}>
        <div style={styles.heroContent} className="animate-on-scroll">
          <div style={styles.badge}>EXPERTISE</div>
          <h1 style={styles.h1}>Practice Areas & Legal Categories</h1>
          <p style={styles.subtitle}>Find specialized legal experts for your specific needs.</p>
        </div>
      </section>

      {/* Grid Section */}
      <section style={styles.section}>
        <div style={styles.container}>
          <div style={styles.grid}>
            {categories.map((cat, idx) => (
              <div key={idx} className="cat-card animate-on-scroll" style={{...styles.card, transitionDelay: `${idx * 50}ms`}}>
                <div style={styles.iconWrapper}>{cat.icon}</div>
                <h3 style={styles.cardTitle}>{cat.name}</h3>
                <span style={styles.count}>{cat.count} Advocates</span>
                <p style={styles.desc}>{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={styles.cta} className="animate-on-scroll">
        <h2 style={styles.h2}>Find The Right Legal Expert Today</h2>
        <Link to="/find-lawyer" style={styles.btn}>
          Browse All Lawyers <ArrowRight size={18} style={{marginLeft: '8px'}} />
        </Link>
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
    fontSize: '2.2rem',
    margin: '0 0 20px 0',
    color: '#FFFFFF',
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
    fontWeight: '700'
  },
  subtitle: {
    fontSize: '1.2rem',
    color: 'rgba(255, 255, 255, 0.8)'
  },
  section: {
    padding: '60px 20px'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '25px'
  },
  card: {
    background: 'white',
    padding: '30px 25px',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
    borderLeft: '4px solid transparent',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
  },
  iconWrapper: {
    color: 'var(--primary-navy)',
    marginBottom: '20px'
  },
  cardTitle: {
    fontFamily: 'var(--font-heading, "Cinzel", serif)',
    fontSize: '1.3rem',
    color: 'var(--primary-navy)',
    margin: '0 0 5px 0'
  },
  count: {
    display: 'inline-block',
    fontSize: '0.85rem',
    color: 'var(--accent-gold)',
    fontWeight: '600',
    marginBottom: '15px'
  },
  desc: {
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
    margin: 0,
    fontSize: '0.95rem'
  },
  cta: {
    background: 'var(--primary-navy)',
    padding: '60px 20px',
    textAlign: 'center'
  },
  btn: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '12px 28px',
    background: 'var(--accent-gold)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '1.1rem'
  }
};

export default LegalCategoriesPage;
