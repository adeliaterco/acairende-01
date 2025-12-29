import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFunnel } from '@/context/FunnelContext';
import StepLayout from '@/components/funnel/StepLayout';
import CTAButton from '@/components/funnel/CTAButton';
import { AlertTriangle } from 'lucide-react';

const Step1: React.FC = () => {
  const navigate = useNavigate();
  const { completeStep } = useFunnel();

  const handleNext = () => {
    completeStep(1);
    navigate('/step/2');
  };

  return (
    <StepLayout showBack={false}>
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="mb-8 animate-shake">
          <AlertTriangle className="w-24 h-24 text-funnel-warning mx-auto" />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-funnel-text mb-4 leading-tight">
          ATENÇÃO
        </h1>
        
        <p className="text-xl md:text-2xl text-funnel-text mb-8">
          Tem um jeito <span className="text-funnel-warning">sujo</span>, mas legal de ganhar dinheiro 💰
        </p>
        
        <div className="w-full max-w-sm">
          <CTAButton onClick={handleNext} variant="success" className="w-full text-xl" pulse>
            Acessar agora
          </CTAButton>
        </div>
      </div>
    </StepLayout>
  );
};

export default Step1;
