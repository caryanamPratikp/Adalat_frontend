import React, { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { lawyerApi } from '../../api/lawyerApi';
import LawyerCard from '../../components/LawyerCard';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';
import './FindLawyerPage.css';

const CATEGORIES = [
  { id: 'ALL', label: 'All Categories' },
  { id: 'CRIMINAL_LAW', label: 'Criminal Law' },
  { id: 'FAMILY_LAW', label: 'Family Law' },
  { id: 'PROPERTY_LAW', label: 'Property Law' },
  { id: 'CIVIL_DISPUTES', label: 'Civil Disputes' },
  { id: 'CONSUMER_LAW', label: 'Consumer Law' },
  { id: 'CORPORATE_LAW', label: 'Corporate Law' },
  { id: 'CYBERCRIME', label: 'Cybercrime' },
  { id: 'EMPLOYMENT_LAW', label: 'Employment Law' }
];

const FindLawyerPage = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      }),
      { threshold: 0.05, rootMargin: '0px 0px 100px 0px' }
    );
    // Timeout ensures DOM elements are rendered
    const timer = setTimeout(() => {
      document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
    }, 100);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [loading, lawyers.length]);

  useEffect(() => {
    fetchLawyers();
  }, []);

  const fetchLawyers = async () => {
    setLoading(true);
    try {
      const response = await lawyerApi.getApprovedLawyers();
      const raw = response && response.data ? (response.data.data || response.data) : [];
      setLawyers(Array.isArray(raw) ? raw : []);
    } catch (error) {
      console.error('Error fetching lawyers:', error);
      setLawyers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredLawyers = lawyers.filter(lawyer => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
                          lawyer.fullName?.toLowerCase().includes(searchLower) || 
                          lawyer.education?.toLowerCase().includes(searchLower) ||
                          lawyer.location?.toLowerCase().includes(searchLower) ||
                          (Array.isArray(lawyer.practiceAreas) && lawyer.practiceAreas.some(p => p.toLowerCase().includes(searchLower)));
    
    const matchesCategory = selectedCategory === 'ALL' || 
                            (Array.isArray(lawyer.practiceAreas) && lawyer.practiceAreas.includes(selectedCategory));
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="find-lawyer-page">
      {/* Hero Banner */}
      <section className="lawyer-hero">
        <div className="hero-content animate-on-scroll">
          <div className="badge">VERIFIED ADVOCATES</div>
          <h1>Find the Right Lawyer</h1>
          <p>Connect with top-rated legal professionals across India for advice and representation.</p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="search-section">
        <div className="container animate-on-scroll">
          <div className="search-container">
            <div className="search-input-wrapper">
              <Search className="search-icon" size={20} />
              <input 
                type="text" 
                placeholder="Search by name, specialization, court..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-wrapper">
              <Filter className="filter-icon" size={20} />
              <select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="category-select"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="results-section">
        <div className="container">
          {loading ? (
            <LoadingState message="Finding the best lawyers for you..." />
          ) : filteredLawyers.length > 0 ? (
            <div className="lawyers-grid">
              {filteredLawyers.map((lawyer, index) => (
                <div key={lawyer.lawyerId || lawyer.id || index} style={{ opacity: 1 }}>
                  <LawyerCard lawyer={lawyer} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState 
              title="No Lawyers Found" 
              message="We couldn't find any lawyers matching your current criteria. Please try adjusting your search or category filter."
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default FindLawyerPage;
