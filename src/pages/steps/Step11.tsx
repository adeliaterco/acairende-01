import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFunnel } from '@/context/FunnelContext';
import StepLayout from '@/components/funnel/StepLayout';
import CTAButton from '@/components/funnel/CTAButton';
import { Gift, Check } from 'lucide-react';

const Step11: React.FC = () => {
  const navigate = useNavigate();
  const { points, completeStep } = useFunnel();

  const handleContinue = () => {
    completeStep(11);
    navigate('/step/12');
  };

  return (
    <StepLayout showBack={false}>
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-funnel-primary to-funnel-bg">
        <div className="text-center">
          <div className="mb-6">
            <Gift className="w-24 h-24 text-funnel-warning mx-auto animate-bounce" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-funnel-text mb-4">
            Parabéns! 🎉
          </h1>
          
          <div className="bg-funnel-card/50 backdrop-blur-sm px-8 py-4 rounded-2xl mb-6 inline-block">
            <p className="text-funnel-success text-4xl font-bold">{points} pontos</p>
          </div>
          
          <p className="text-funnel-text text-xl mb-8">
            Você desbloqueou aulas gratuitas!
          </p>

          <div className="space-y-3 mb-8 max-w-xs mx-auto">
            <div className="flex items-center gap-3 bg-funnel-card/30 px-4 py-3 rounded-xl">
              <Check className="w-6 h-6 text-funnel-success" />
              <span className="text-funnel-text">Receitas premium de açaí</span>
            </div>
            <div className="flex items-center gap-3 bg-funnel-card/30 px-4 py-3 rounded-xl">
              <Check className="w-6 h-6 text-funnel-success" />
              <span className="text-funnel-text">Robô de R$250/dia</span>
            </div>
          </div>

          <CTAButton onClick={handleContinue} variant="success" className="w-full max-w-xs text-xl" pulse>
            Assistir agora
          </CTAButton>
        </div>
      </div>
    </StepLayout>
  );
};

export default Step11;
