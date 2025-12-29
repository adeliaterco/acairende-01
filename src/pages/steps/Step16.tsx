import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFunnel } from '@/context/FunnelContext';
import StepLayout from '@/components/funnel/StepLayout';
import CTAButton from '@/components/funnel/CTAButton';
import { Heart, MessageCircle, Share2, Sparkles } from 'lucide-react';

const Step16: React.FC = () => {
  const navigate = useNavigate();
  const { completeStep } = useFunnel();

  const handleContinue = () => {
    completeStep(16);
    navigate('/step/17');
  };

  return (
    <StepLayout>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[400px] aspect-[9/16] bg-gradient-to-b from-funnel-warning/30 to-funnel-bg rounded-2xl relative overflow-hidden border border-funnel-border">
          {/* Episode badge */}
          <div className="absolute top-4 left-4 bg-funnel-warning/90 px-3 py-1 rounded-full z-10">
            <span className="text-white font-bold text-sm">EP.5/5</span>
          </div>

          {/* Video placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Sparkles className="w-20 h-20 text-funnel-warning mx-auto mb-4" />
              <h3 className="text-funnel-text text-xl font-bold">Bônus Especial</h3>
              <p className="text-funnel-warning font-semibold mt-2">Aula exclusiva</p>
              <p className="text-funnel-muted text-sm mt-2">Gerenciador de Anúncios</p>
            </div>
          </div>

          {/* Right side actions */}
          <div className="absolute right-4 bottom-32 flex flex-col gap-6">
            <div className="flex flex-col items-center">
              <Heart className="w-8 h-8 text-funnel-text fill-funnel-danger" />
              <span className="text-funnel-text text-xs mt-1">2.1K</span>
            </div>
            <div className="flex flex-col items-center">
              <MessageCircle className="w-8 h-8 text-funnel-text" />
              <span className="text-funnel-text text-xs mt-1">1.5K</span>
            </div>
            <div className="flex flex-col items-center">
              <Share2 className="w-8 h-8 text-funnel-text" />
              <span className="text-funnel-text text-xs mt-1">Share</span>
            </div>
          </div>

          {/* Bottom section */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <CTAButton onClick={handleContinue} variant="warning" className="w-full">
              Liberar acesso
            </CTAButton>
          </div>
        </div>
      </div>
    </StepLayout>
  );
};

export default Step16;
