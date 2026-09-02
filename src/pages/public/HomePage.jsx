import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LawyerCard from '../../components/LawyerCard';
import LoadingState from '../../components/LoadingState';
import { lawyerApi } from '../../api/lawyerApi';
import { 
  Scale, ShieldCheck, Clock, Users, ArrowRight, Bot, CheckCircle, 
  Search, MessageSquare, CreditCard, Star, Award, Heart, Home, 
  ShieldAlert, Lock, Briefcase, Building, Car, ShoppingBag, 
  Zap, Globe, TrendingUp 
} from 'lucide-react';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredLawyers, setFeaturedLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTopic, setActiveTopic] = useState(0);

  const sampleTopics = [
    {
      id: 'property',
      label: 'Property Dispute',
      query: 'Tenant refusing to vacate commercial property despite lease expiry notice.',
      category: 'Property & Real Estate Law',
      matchedLawyer: 'Adv. Vikramaditya Sen',
      exp: '18 Yrs Experience',
      court: 'Delhi High Court'
    },
    {
      id: 'family',
      label: 'Divorce & Custody',
      query: 'Mutual consent divorce legal timeline and child custody arrangement terms.',
      category: 'Divorce & Family Law',
      matchedLawyer: 'Adv. Meenakshi Rao',
      exp: '14 Yrs Experience',
      court: 'Bombay High Court'
    },
    {
      id: 'criminal',
      label: 'Bail & FIR Defense',
      query: 'Urgent anticipatory bail filing in High Court under section 420 IPC matter.',
      category: 'Criminal Defense Law',
      matchedLawyer: 'Adv. Rajeshwar Tyagi',
      exp: '22 Yrs Experience',
      court: 'Supreme Court of India'
    },
    {
      id: 'cyber',
      label: 'Online Fraud',
      query: 'Unauthorized net-banking withdrawal & cyber police complaint procedure.',
      category: 'Cyber Crime & IT Law',
      matchedLawyer: 'Adv. Ananya Deshmukh',
      exp: '10 Yrs Experience',
      court: 'Karnataka High Court'
    }
  ];

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        const response = await lawyerApi.getApprovedLawyers();
        const raw = response && response.data ? (response.data.data || response.data) : [];
        if (Array.isArray(raw)) {
          setFeaturedLawyers(raw.slice(0, 6));
        }
      } catch (error) {
        console.error('Failed to fetch lawyers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLawyers();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    
    return () => observer.disconnect();
  }, []);

  const handleAiAssistantClick = () => {
    navigate('/customer/legal-assistant');
  };

  const categories = [
    { icon: <ShieldAlert size={28} />, name: 'Criminal Law', count: '140+', desc: 'Bail, FIRs, cybercrime, and criminal defense.' },
    { icon: <Heart size={28} />, name: 'Divorce & Family', count: '210+', desc: 'Mutual divorce, alimony, child custody.' },
    { icon: <Home size={28} />, name: 'Property Law', count: '185+', desc: 'Property disputes, verification, tenant issues.' },
    { icon: <Scale size={28} />, name: 'Civil Law', count: '320+', desc: 'Contracts, recovery, civil disputes.' },
    { icon: <ShoppingBag size={28} />, name: 'Consumer Law', count: '95+', desc: 'Defective products, service deficiency.' },
    { icon: <Lock size={28} />, name: 'Cyber Law', count: '65+', desc: 'Online fraud, data breach, harassment.' },
    { icon: <Briefcase size={28} />, name: 'Employment Law', count: '110+', desc: 'Wrongful termination, PF, unpaid salary.' },
    { icon: <Building size={28} />, name: 'Corporate Law', count: '150+', desc: 'Startup compliance, IP, agreements.' },
    { icon: <CreditCard size={28} />, name: 'Banking & Finance', count: '85+', desc: 'Cheque bounce, loan disputes.' },
    { icon: <Car size={28} />, name: 'Motor Vehicle', count: '120+', desc: 'Accident claims, challans, insurance.' },
  ];

  return (
    <div className="homepage-container">
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="hero-orb orb-1"></div>
        <div className="hero-orb orb-2"></div>
        <div className="hero-orb orb-3"></div>
        
        <div className="hero-content-wrapper">
          <div className="hero-left animate-on-scroll slide-up">
            <div className="hero-badge">
              <Award size={16} className="badge-icon" />
              <span>Supreme Court & High Court Advocates Network</span>
            </div>
            
            <h1 className="hero-title">
              Instant Legal Consultation with <span>Verified Advocates</span> Across India
            </h1>
            
            <p className="hero-subtitle">
              Get clarity on your legal matters instantly. Connect with expert lawyers 
              for a 10-minute free consultation, guided by our advanced AI assistant.
            </p>
            
            <div className="hero-actions">
              <Link to="/register?type=customer" className="btn-primary-glow">
                Register for ₹99
                <ArrowRight size={18} />
              </Link>
              <Link to="/find-lawyer" className="btn-outline-light">
                Browse Advocates
                <Search size={18} />
              </Link>
            </div>
            
            <div className="hero-stats">
              <div className="stat-item">
                <Clock size={20} />
                <span>10 Mins FREE</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <ShieldCheck size={20} />
                <span>100% Verified</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <CreditCard size={20} />
                <span>₹99 Fee</span>
              </div>
            </div>
          </div>
          
          {/* Hero Right: Interactive Legal AI Match Showcase */}
          <div className="hero-right animate-on-scroll slide-up" style={{ transitionDelay: '0.2s' }}>
            <div className="hero-showcase-container">
              {/* Floating Top Badge */}
              <div className="floating-glass-pill pill-top">
                <ShieldCheck size={16} className="pill-gold-icon" />
                <span>100% Bar Council Verified</span>
              </div>

              {/* Main Interactive Showcase Card */}
              <div className="hero-hub-card">
                <div className="hub-card-header">
                  <div className="hub-bot-badge">
                    <Bot size={22} />
                    <span className="pulse-dot"></span>
                  </div>
                  <div>
                    <h3 className="hub-title">Smart Legal Assistant</h3>
                    <span className="hub-subtitle-text">Instant AI Matching & 10-Min Free Chat</span>
                  </div>
                </div>

                <div className="hub-topic-chips">
                  <button 
                    className={`topic-chip ${activeTopic === 0 ? 'active' : ''}`}
                    onClick={() => setActiveTopic(0)}
                  >
                    <Home size={14} /> Property
                  </button>
                  <button 
                    className={`topic-chip ${activeTopic === 1 ? 'active' : ''}`}
                    onClick={() => setActiveTopic(1)}
                  >
                    <Heart size={14} /> Family
                  </button>
                  <button 
                    className={`topic-chip ${activeTopic === 2 ? 'active' : ''}`}
                    onClick={() => setActiveTopic(2)}
                  >
                    <ShieldAlert size={14} /> Criminal
                  </button>
                  <button 
                    className={`topic-chip ${activeTopic === 3 ? 'active' : ''}`}
                    onClick={() => setActiveTopic(3)}
                  >
                    <Lock size={14} /> Cyber Crime
                  </button>
                </div>

                {/* Active Case Query Preview Box */}
                <div className="query-preview-container" onClick={handleAiAssistantClick}>
                  <div className="query-preview-header">
                    <span className="query-tag">Sample Issue</span>
                    <span className="query-arrow"><Zap size={14} /> Auto-Detect</span>
                  </div>
                  <p className="query-text">"{sampleTopics[activeTopic].query}"</p>
                </div>

                {/* Matched Advocate Card Preview */}
                <div className="matched-advocate-preview">
                  <div className="advocate-avatar-box">
                    <Scale size={20} />
                  </div>
                  <div className="advocate-info">
                    <div className="advocate-name-row">
                      <h4>{sampleTopics[activeTopic].matchedLawyer}</h4>
                      <span className="rating-badge"><Star size={12} fill="#EAB308" color="#EAB308" /> 4.9</span>
                    </div>
                    <p className="advocate-meta">{sampleTopics[activeTopic].court} • {sampleTopics[activeTopic].exp}</p>
                    <span className="category-pill">{sampleTopics[activeTopic].category}</span>
                  </div>
                </div>

                {/* CTA Action */}
                <button className="btn-hub-action" onClick={handleAiAssistantClick}>
                  Consult Advocate Free (10 Mins)
                  <ArrowRight size={18} />
                </button>
              </div>

              {/* Floating Bottom Badge */}
              <div className="floating-glass-pill pill-bottom">
                <Clock size={16} className="pill-gold-icon" />
                <span>Response Time &lt; 2 Mins</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUSTED BY SECTION */}
      <section className="trusted-section">
        <div className="marquee-container">
          <div className="marquee-content">
            <div className="trust-badge"><ShieldCheck size={20} /> Bar Council Verified</div>
            <div className="trust-badge"><Lock size={20} /> SSL Encrypted</div>
            <div className="trust-badge"><Building size={20} /> DPIIT Registered</div>
            <div className="trust-badge"><Users size={20} /> 1000+ Consultations</div>
            <div className="trust-badge"><Bot size={20} /> 24/7 AI Support</div>
            {/* Duplicate for seamless looping */}
            <div className="trust-badge"><ShieldCheck size={20} /> Bar Council Verified</div>
            <div className="trust-badge"><Lock size={20} /> SSL Encrypted</div>
            <div className="trust-badge"><Building size={20} /> DPIIT Registered</div>
            <div className="trust-badge"><Users size={20} /> 1000+ Consultations</div>
            <div className="trust-badge"><Bot size={20} /> 24/7 AI Support</div>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section className="how-it-works-section">
        <div className="section-header animate-on-scroll slide-up">
          <h2>How Adalat Works</h2>
          <p>Get legal resolution in four simple steps</p>
          <div className="accent-line"></div>
        </div>
        
        <div className="steps-grid">
          <div className="step-card animate-on-scroll slide-up">
            <div className="step-number">01</div>
            <div className="step-icon"><CreditCard size={32} /></div>
            <h3>Activate Account</h3>
            <p>Pay a nominal one-time registration fee of ₹99 to activate your account and prevent spam.</p>
          </div>
          
          <div className="step-card animate-on-scroll slide-up" style={{ transitionDelay: '0.1s' }}>
            <div className="step-number">02</div>
            <div className="step-icon"><Bot size={32} /></div>
            <h3>AI Categorization</h3>
            <p>Describe your issue to our AI. It instantly analyzes and categorizes your specific legal need.</p>
          </div>
          
          <div className="step-card animate-on-scroll slide-up" style={{ transitionDelay: '0.2s' }}>
            <div className="step-number">03</div>
            <div className="step-icon"><MessageSquare size={32} /></div>
            <h3>10-Min Free Chat</h3>
            <p>Connect with a matched specialist advocate for a free 10-minute introductory consultation.</p>
          </div>
          
          <div className="step-card animate-on-scroll slide-up" style={{ transitionDelay: '0.3s' }}>
            <div className="step-number">04</div>
            <div className="step-icon"><Scale size={32} /></div>
            <h3>Extend or Appoint</h3>
            <p>Choose to extend the consultation at the lawyer's standard rate or formally appoint them.</p>
          </div>
        </div>
      </section>

      {/* 4. LEGAL CATEGORIES SECTION */}
      <section className="categories-section bg-light">
        <div className="section-header animate-on-scroll slide-up">
          <h2>Find Specialized Advocates</h2>
          <p>Expert legal representation across all major practice areas</p>
          <div className="accent-line"></div>
        </div>
        
        <div className="categories-grid">
          {categories.map((cat, index) => (
            <div 
              key={index} 
              className="category-card animate-on-scroll slide-up" 
              style={{ transitionDelay: `${index * 0.05}s` }}
              onClick={() => navigate('/find-lawyer')}
            >
              <div className="category-icon-wrapper">
                {cat.icon}
              </div>
              <div className="category-content">
                <h4>{cat.name}</h4>
                <span className="category-count">{cat.count} Advocates</span>
                <p>{cat.desc}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-4 animate-on-scroll slide-up">
          <Link to="/find-lawyer" className="btn-secondary">
            View All Categories
          </Link>
        </div>
      </section>

      {/* 5. WHY CHOOSE ADALAT SECTION */}
      <section className="why-choose-section">
        <div className="section-header animate-on-scroll slide-up">
          <h2>Why Choose Adalat</h2>
          <p>We're redefining how Indians access legal services</p>
          <div className="accent-line"></div>
        </div>
        
        <div className="features-grid">
          <div className="feature-card animate-on-scroll slide-up">
            <div className="feature-icon"><ShieldCheck size={40} /></div>
            <h3>100% Bar Council Verified</h3>
            <p>Every advocate on our platform goes through a rigorous verification process checking their Bar Council credentials and practice history.</p>
          </div>
          
          <div className="feature-card animate-on-scroll slide-up" style={{ transitionDelay: '0.1s' }}>
            <div className="feature-icon"><Clock size={40} /></div>
            <h3>10-Min Free Consultation</h3>
            <p>Don't pay blindly. Get a complimentary 10-minute session to explain your case and gauge the lawyer's expertise before committing.</p>
          </div>
          
          <div className="feature-card animate-on-scroll slide-up" style={{ transitionDelay: '0.2s' }}>
            <div className="feature-icon"><Zap size={40} /></div>
            <h3>AI-Powered Legal Matching</h3>
            <p>Our intelligent system understands the nuances of your case and connects you with advocates who specialize exactly in your required field.</p>
          </div>
        </div>
      </section>



      {/* 7. TESTIMONIALS SECTION */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2>Client Success Stories</h2>
          <p>Real experiences from people who found justice through Adalat</p>
          <div className="accent-line"></div>
        </div>
        
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="stars">
              <Star size={16} fill="#C9A227" color="#C9A227" />
              <Star size={16} fill="#C9A227" color="#C9A227" />
              <Star size={16} fill="#C9A227" color="#C9A227" />
              <Star size={16} fill="#C9A227" color="#C9A227" />
              <Star size={16} fill="#C9A227" color="#C9A227" />
            </div>
            <p className="quote">"Adalat helped me resolve my property dispute within 2 weeks. The AI matching was incredibly accurate, and the 10-minute free chat gave me confidence in my lawyer."</p>
            <div className="author">
              <h4>Priya Sharma</h4>
              <span>Business Owner</span>
            </div>
          </div>
          
          <div className="testimonial-card">
            <div className="stars">
              <Star size={16} fill="#C9A227" color="#C9A227" />
              <Star size={16} fill="#C9A227" color="#C9A227" />
              <Star size={16} fill="#C9A227" color="#C9A227" />
              <Star size={16} fill="#C9A227" color="#C9A227" />
              <Star size={16} fill="#C9A227" color="#C9A227" />
            </div>
            <p className="quote">"Finding a good corporate lawyer for my startup was daunting until I found Adalat. The ₹99 fee is nothing compared to the quality of verified advocates available."</p>
            <div className="author">
              <h4>Rahul Verma</h4>
              <span>Tech Entrepreneur</span>
            </div>
          </div>
          
          <div className="testimonial-card">
            <div className="stars">
              <Star size={16} fill="#C9A227" color="#C9A227" />
              <Star size={16} fill="#C9A227" color="#C9A227" />
              <Star size={16} fill="#C9A227" color="#C9A227" />
              <Star size={16} fill="#C9A227" color="#C9A227" />
              <Star size={16} color="#C9A227" />
            </div>
            <p className="quote">"I was confused about my consumer rights against a major e-commerce brand. The AI assistant guided me perfectly and connected me with an expert who sent a legal notice instantly."</p>
            <div className="author">
              <h4>Anjali Desai</h4>
              <span>Marketing Professional</span>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CTA BANNER SECTION */}
      <section className="cta-banner-section">
        <div className="cta-content animate-on-scroll scale-up">
          <h2>Ready to Get Legal Guidance?</h2>
          <p>Join thousands of Indians who have found the right legal support through Adalat.</p>
          <div className="cta-actions">
            <Link to="/register?type=customer" className="btn-primary-glow">
              Register Now
            </Link>
            <Link to="/register?type=lawyer" className="btn-outline-light">
              For Advocates (Join Free)
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
