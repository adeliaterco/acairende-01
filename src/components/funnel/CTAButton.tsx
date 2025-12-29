import React from 'react';

interface CTAButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'success' | 'warning' | 'danger';
  className?: string;
  pulse?: boolean;
}

const CTAButton: React.FC<CTAButtonProps> = ({
  children,
  onClick,
  variant = 'success',
  className = '',
  pulse = false,
}) => {
  const variants = {
    success: 'bg-funnel-success hover:bg-funnel-success/90 text-black',
    warning: 'bg-funnel-warning hover:bg-funnel-warning/90 text-black',
    danger: 'bg-gradient-to-r from-funnel-warning to-funnel-danger hover:from-funnel-warning/90 hover:to-funnel-danger/90 text-white',
  };

  return (
    <button
      onClick={onClick}
      className={`
        font-bold py-4 px-8 rounded-xl shadow-lg transition-all duration-300 
        hover:scale-105 active:scale-95
        ${variants[variant]}
        ${pulse ? 'animate-pulse-glow' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default CTAButton;
