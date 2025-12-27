import React from 'react';
import { IncidentStatus, Severity, IncidentType } from '../../types';

interface BadgeProps {
  type?: 'status' | 'severity' | 'type';
  value: IncidentStatus | Severity | IncidentType | string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ type = 'status', value, className = '' }) => {
  let styles = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ";

  if (type === 'status') {
    switch (value) {
      case IncidentStatus.UNVERIFIED:
        styles += "bg-slate-800 text-slate-400 border-slate-700";
        break;
      case IncidentStatus.VERIFIED:
        styles += "bg-blue-900/30 text-blue-400 border-blue-800";
        break;
      case IncidentStatus.RESOLVED:
        styles += "bg-emerald-900/30 text-emerald-400 border-emerald-800";
        break;
    }
  } else if (type === 'severity') {
    switch (value) {
      case Severity.LOW:
        styles += "bg-slate-800 text-slate-300 border-slate-700";
        break;
      case Severity.MEDIUM:
        styles += "bg-yellow-900/30 text-yellow-500 border-yellow-800";
        break;
      case Severity.HIGH:
        styles += "bg-orange-900/30 text-orange-500 border-orange-800";
        break;
      case Severity.CRITICAL:
        styles += "bg-red-900/30 text-red-500 border-red-800 animate-pulse";
        break;
    }
  } else {
    // Type badge
    styles += "bg-slate-800 text-slate-300 border-slate-600";
  }

  return (
    <span className={`${styles} ${className}`}>
      {value}
    </span>
  );
};
