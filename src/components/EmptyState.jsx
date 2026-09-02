import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import './LoadingEmptyState.css';

const EmptyState = ({ 
  icon: Icon = ShieldAlert, 
  title = "No Records Found", 
  message = "There are currently no items to display.", 
  buttonText, 
  buttonLink 
}) => {
  return (
    <div className="state-wrapper empty-state">
      <div className="empty-icon-box">
        <Icon size={44} />
      </div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-message">{message}</p>
      {buttonText && buttonLink && (
        <Link to={buttonLink} className="btn btn-gold btn-sm" style={{ marginTop: '1rem' }}>
          {buttonText}
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
