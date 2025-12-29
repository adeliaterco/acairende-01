import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface StepLayoutProps {
  children: React.ReactNode;
  showBack?: boolean;
  className?: string;
}

const StepLayout: React.FC<StepLayoutProps> = ({ children, showBack = true, className = '' }) => {
  const navigate = useNavigate();

  return (
    <div className={`min-h-screen bg-funnel-bg flex flex-col animate-fade-in ${className}`}>
      {showBack && (
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-50 p-2 text-funnel-muted hover:text-funnel-text transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      {children}
    </div>
  );
};

export default StepLayout;
