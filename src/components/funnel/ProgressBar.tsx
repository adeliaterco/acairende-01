import React from 'react';

interface ProgressBarProps {
  percentage: number;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, className = '' }) => {
  return (
    <div className={`w-full bg-funnel-card rounded-full h-3 overflow-hidden ${className}`}>
      <div
        className="h-full bg-gradient-to-r from-funnel-primary to-funnel-success transition-all duration-500 ease-out rounded-full"
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  );
};

export default ProgressBar;
