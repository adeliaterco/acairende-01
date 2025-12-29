import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFunnel } from '@/context/FunnelContext';
import StepLayout from '@/components/funnel/StepLayout';
import CTAButton from '@/components/funnel/CTAButton';
import { Heart, MessageCircle, Share2, Music } from 'lucide-react';

const Step5: React.FC = () => {
  const navigate = useNavigate();
  const { addPoints, completeStep } = useFunnel();

  const handleContinue = () => {
    addPoints(50);
    completeStep(5);
    navigate('/step/6');
  };

  return (
    <StepLayout>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[400px] aspect-[9/16] bg-gradient-to-b from-purple-900/50 to-funnel-bg rounded-2xl relative overflow-hidden border border-funnel-border">
          {/* TikTok header */}
          <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
            <span className="text-funnel-text font-medium">Following</span>
            <span className="text-funnel-text font-bold border-b-2 border-funnel-text">For You</span>
            <span className="text-funnel-text">🔍</span>
          </div>

          {/* Video placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 bg-funnel-primary/30 rounded-full flex items-center justify-center mb-4 mx-auto">
                <div className="w-0 h-0 border-t-[20px] border-t-transparent border-l-[35px] border-l-funnel-text border-b-[20px] border-b-transparent ml-2" />
              </div>
              <p className="text-funnel-text text-xl font-bold">Açaí na Garrafa</p>
              <p className="text-funnel-success font-semibold mt-2">Do ZERO a R$5.000/mês</p>
            </div>
          </div>

          {/* Right side actions */}
          <div className="absolute right-4 bottom-40 flex flex-col gap-5">
            <div className="w-12 h-12 rounded-full bg-funnel-primary border-2 border-funnel-text overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500" />
            </div>
            <div className="flex flex-col items-center">
              <Heart className="w-8 h-8 text-funnel-text fill-funnel-danger" />
              <span className="text-funnel-text text-xs mt-1">12.8K</span>
            </div>
            <div className="flex flex-col items-center">
              <MessageCircle className="w-8 h-8 text-funnel-text" />
              <span className="text-funnel-text text-xs mt-1">2.4K</span>
            </div>
            <div className="flex flex-col items-center">
              <Share2 className="w-8 h-8 text-funnel-text" />
              <span className="text-funnel-text text-xs mt-1">Share</span>
            </div>
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-funnel-text font-semibold mb-1">@andreia.conf</p>
            <p className="text-funnel-text text-sm mb-3">
              Do ZERO a R$5.000/mês vendendo açaí na garrafa 🍇💰 #empreendedorismo #acai
            </p>
            <div className="flex items-center gap-2 mb-4">
              <Music className="w-4 h-4 text-funnel-text" />
              <p className="text-funnel-text text-xs">Som original - @andreia.conf</p>
            </div>
            
            <CTAButton onClick={handleContinue} variant="success" className="w-full">
              Continuar
            </CTAButton>
          </div>
        </div>
      </div>
    </StepLayout>
  );
};

export default Step5;
