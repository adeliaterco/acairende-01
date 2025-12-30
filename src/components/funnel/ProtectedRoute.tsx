import React from 'react';
import { Navigate } from 'react-router-dom';
import { useFunnel } from '@/context/FunnelContext';

interface ProtectedRouteProps {
  step: number;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ step, children }) => {
  const { canAccessStep, isHydrated } = useFunnel();

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!canAccessStep(step)) {
    return <Navigate to="/step/1" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;