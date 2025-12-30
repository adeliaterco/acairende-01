import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface FunnelState {
  currentStep: number;
  points: number;
  selectedGoal: string | null;
  selectedInvestment: string | null;
  completedSteps: number[];
}

interface FunnelContextType extends FunnelState {
  isHydrated: boolean;
  setCurrentStep: (step: number) => void;
  addPoints: (amount: number) => void;
  setSelectedGoal: (goal: string) => void;
  setSelectedInvestment: (investment: string) => void;
  completeStep: (step: number) => void;
  canAccessStep: (step: number) => boolean;
  resetFunnel: () => void;
}

const initialState: FunnelState = {
  currentStep: 1,
  points: 0,
  selectedGoal: null,
  selectedInvestment: null,
  completedSteps: [],
};

const FunnelContext = createContext<FunnelContextType | undefined>(undefined);

export const FunnelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<FunnelState>(initialState);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('funnelState');
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading funnel state:', error);
      }
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('funnelState', JSON.stringify(state));
    }
  }, [state, isHydrated]);

  const setCurrentStep = (step: number) => {
    setState(prev => ({ ...prev, currentStep: step }));
  };

  const addPoints = (amount: number) => {
    setState(prev => ({ ...prev, points: prev.points + amount }));
  };

  const setSelectedGoal = (goal: string) => {
    setState(prev => ({ ...prev, selectedGoal: goal }));
  };

  const setSelectedInvestment = (investment: string) => {
    setState(prev => ({ ...prev, selectedInvestment: investment }));
  };

  const completeStep = (step: number) => {
    setState(prev => ({
      ...prev,
      completedSteps: prev.completedSteps.includes(step) 
        ? prev.completedSteps 
        : [...prev.completedSteps, step],
    }));
  };

  const canAccessStep = (step: number) => {
    if (step === 1) return true;
    return state.completedSteps.includes(step - 1);
  };

  const resetFunnel = () => {
    setState(initialState);
    localStorage.removeItem('funnelState');
  };

  return (
    <FunnelContext.Provider
      value={{
        ...state,
        isHydrated,
        setCurrentStep,
        addPoints,
        setSelectedGoal,
        setSelectedInvestment,
        completeStep,
        canAccessStep,
        resetFunnel,
      }}
    >
      {children}
    </FunnelContext.Provider>
  );
};

export const useFunnel = () => {
  const context = useContext(FunnelContext);
  if (!context) {
    throw new Error('useFunnel must be used within a FunnelProvider');
  }
  return context;
};