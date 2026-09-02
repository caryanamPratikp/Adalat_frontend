import React from 'react';

const StatusBadge = ({ status = 'PENDING' }) => {
  const getBadgeConfig = (st) => {
    switch (st?.toUpperCase()) {
      case 'APPROVED':
      case 'ACTIVE':
      case 'SUCCESS':
      case 'PAID':
      case 'ACCEPTED':
        return { className: 'badge-success', label: st };
      case 'PENDING':
      case 'DRAFT':
      case 'SUBMITTED':
      case 'REQUESTED':
      case 'ACTIVE_FREE':
        return { className: 'badge-warning', label: st };
      case 'REJECTED':
      case 'FAILED':
      case 'CANCELLED':
        return { className: 'badge-danger', label: st };
      default:
        return { className: 'badge-neutral', label: st };
    }
  };

  const config = getBadgeConfig(status);

  return (
    <span className={`badge ${config.className}`}>
      {config.label.replace('_', ' ')}
    </span>
  );
};

export default StatusBadge;
