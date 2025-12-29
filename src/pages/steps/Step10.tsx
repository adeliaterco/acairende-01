import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFunnel } from '@/context/FunnelContext';
import StepLayout from '@/components/funnel/StepLayout';
import CTAButton from '@/components/funnel/CTAButton';
import { Gift } from 'lucide-react';

const Step10: React.FC = () => {
  const navigate = useNavigate();
  const { completeStep } = useFunnel();

  const handleContinue = () => {
    completeStep(10);
    navigate('/step/11');
  };

  return (
    <StepLayout>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[400px] aspect-[9/16] bg-gradient-to-b from-green-900/30 to-funnel-bg rounded-2xl relative overflow-hidden border border-funnel-border">
          {/* Blurred background */}
          <div className="absolute inset-0 bg-funnel-bg/80 backdrop-blur-md" />

          {/* CTA Overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-20 p-6">
            <div className="w-full text-center">
              <Gift className="w-20 h-20 text-funnel-success mx-auto mb-6 animate-bounce" />
              <h2 className="text-funnel-text text-2xl font-bold mb-4">
                Suas receitas estão prontas!
              </h2>
              <p className="text-funnel-muted mb-8">
                Clique para garantir acesso às receitas exclusivas de açaí
              </p>
              <CTAButton 
                onClick={handleContinue} 
                variant="success" 
                className="w-full text-xl py-6"
                pulse
              >
                👉 Garantir receitas 🎁
              </CTAButton>
            </div>
          </div>
        </div>
      </div>
    </StepLayout>
  );
};

export default Step10;
