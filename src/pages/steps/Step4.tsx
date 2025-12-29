import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFunnel } from '@/context/FunnelContext';
import StepLayout from '@/components/funnel/StepLayout';
import { Lock, MessageCircle } from 'lucide-react';

const Step4: React.FC = () => {
  const navigate = useNavigate();
  const { addPoints, completeStep } = useFunnel();

  const handleUnlock = () => {
    addPoints(50);
    completeStep(4);
    navigate('/step/5');
  };

  return (
    <StepLayout showBack={false}>
      <div className="flex-1 flex flex-col bg-gradient-to-b from-funnel-card to-funnel-bg">
        {/* Lock screen header */}
        <div className="text-center pt-16 pb-8">
          <Lock className="w-8 h-8 text-funnel-muted mx-auto mb-4" />
          <p className="text-funnel-muted text-sm">Terça-feira, 14:32</p>
        </div>
        
        {/* WhatsApp notification */}
        <div className="px-4 flex-1 flex flex-col justify-center">
          <div 
            onClick={handleUnlock}
            className="bg-funnel-card/90 backdrop-blur-sm border border-funnel-border rounded-2xl p-4 cursor-pointer hover:bg-funnel-card transition-colors animate-fade-in"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-funnel-whatsapp rounded-lg">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-funnel-text font-semibold">WhatsApp</span>
                  <span className="text-funnel-muted text-xs">agora</span>
                </div>
                <p className="text-funnel-text font-medium mt-1">Confeitaria Andreia</p>
                <p className="text-funnel-muted text-sm mt-1">
                  O atalho "sujo" para vender açaí todo dia sem precisar de loja física...
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <button
              onClick={handleUnlock}
              className="bg-funnel-success/20 border border-funnel-success text-funnel-success px-6 py-3 rounded-full font-medium hover:bg-funnel-success/30 transition-colors animate-pulse"
            >
              Toque para abrir
            </button>
          </div>
        </div>
        
        {/* Home indicator */}
        <div className="pb-8 pt-16">
          <div className="w-32 h-1 bg-funnel-muted/50 rounded-full mx-auto" />
        </div>
      </div>
    </StepLayout>
  );
};

export default Step4;
