import React from 'react';
import { Navigate } from 'react-router-dom';
import { useFunnel } from '@/context/FunnelContext';

interface ProtectedRouteProps {
  step: number;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ step, children }) => {
  const { canAccessStep } = useFunnel();

  if (!canAccessStep(step)) {
    // Find the last completed step + 1, or step 1
    return <Navigate to="/step/1" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
