import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, ShieldCheck, Mail, Phone, MapPin, ArrowUpRight, Heart } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="adalat-footer">
      {/* CTA Section */}
      <div className="footer-cta-section">
        <div className="footer-cta-content">
          <div className="cta-text">
            <h2>Ready for Legal Guidance?</h2>
            <p>Connect with top legal professionals across India today.</p>
          </div>
          <Link to="/register" className="footer-cta-btn">
            Get Started <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="footer-main">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-col brand-col">
            <Link to="/" className="footer-brand">
              <Scale size={28} className="brand-icon" />
              <span>ADALAT</span>
            </Link>
            <p className="brand-tagline">Justice Delivered. Online.</p>
            <p className="brand-description">
              India's premier legal platform connecting citizens with verified advocates for transparent, accessible, and reliable legal services.
            </p>
            <div className="footer-contact-info">
              <div className="contact-item">
                <Mail size={16} />
                <a href="mailto:support@adalat.legal">support@adalat.legal</a>
              </div>
              <div className="contact-item">
                <Phone size={16} />
                <a href="tel:+9118001023491">+91 1800-102-3491</a>
              </div>
              <div className="contact-item">
                <MapPin size={16} />
                <span>Supreme Court Bar Complex, New Delhi</span>
              </div>
            </div>
          </div>

          {/* Links Column 1: Legal Platform */}
          <div className="footer-col">
            <h4 className="footer-col-title">Legal Platform</h4>
            <ul className="footer-links">
              <li><Link to="/find-lawyer">Find a Lawyer</Link></li>
              <li><Link to="/how-it-works">How It Works</Link></li>
              <li><Link to="/legal-categories">Practice Areas</Link></li>
              <li><Link to="/register">Client Registration</Link></li>
              <li><Link to="/lawyer/register">Join as Lawyer</Link></li>
            </ul>
          </div>

          {/* Links Column 2: Policy & Trust */}
          <div className="footer-col">
            <h4 className="footer-col-title">Policy & Trust</h4>
            <ul className="footer-links">
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/refund-policy">Refund Policy</Link></li>
              <li><Link to="/ai-disclaimer">AI Disclaimer</Link></li>
            </ul>
          </div>

          {/* Links Column 3: Support & Contact */}
          <div className="footer-col">
            <h4 className="footer-col-title">Support</h4>
            <ul className="footer-links">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/help">Help Center</Link></li>
              <li><Link to="/faqs">FAQs</Link></li>
              <li><Link to="/admin/login">Admin Login</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="copyright">
            &copy; {new Date().getFullYear()} Adalat Legal Services. All rights reserved.
          </p>
          <div className="footer-badges">
            <span className="badge">
              <ShieldCheck size={14} className="badge-icon" />
              Bar Council Verification Compliant
            </span>
            <span className="made-in-india">
              Made in India with <Heart size={14} className="heart-icon" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
