import React from 'react';
import { Scale } from 'lucide-react';
import './LoadingEmptyState.css';

const LoadingState = ({ message = "Loading legal data..." }) => {
  return (
    <div className="state-wrapper loading-state">
      <div className="spinner-logo">
        <Scale size={32} className="spin-icon" />
      </div>
      <p className="state-message">{message}</p>
    </div>
  );
};

export default LoadingState;
