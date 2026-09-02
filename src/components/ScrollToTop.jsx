import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronUp } from 'lucide-react';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const buttonStyle = {
    position: 'fixed',
    bottom: '2rem',
    right: '2rem',
    zIndex: 99,
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    backgroundColor: '#C9A227', // accent-gold
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    transition: 'all 0.3s ease-in-out',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    pointerEvents: isVisible ? 'auto' : 'none',
  };

  return (
    <button
      onClick={scrollToTop}
      style={buttonStyle}
      aria-label="Scroll to top"
      onMouseOver={(e) => (e.currentTarget.style.transform = isVisible ? 'scale(1.1) translateY(0)' : 'translateY(20px)')}
      onMouseOut={(e) => (e.currentTarget.style.transform = isVisible ? 'scale(1) translateY(0)' : 'translateY(20px)')}
    >
      <ChevronUp size={24} />
    </button>
  );
};

export default ScrollToTop;
