import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFunnel } from '@/context/FunnelContext';
import StepLayout from '@/components/funnel/StepLayout';
import CTAButton from '@/components/funnel/CTAButton';
import { Heart, MessageCircle, Share2, Music } from 'lucide-react';

const Step9: React.FC = () => {
  const navigate = useNavigate();
  const { completeStep } = useFunnel();

  const handleContinue = () => {
    completeStep(9);
    navigate('/step/10');
  };

  return (
    <StepLayout>
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[400px] aspect-[9/16] bg-gradient-to-b from-green-900/50 to-funnel-bg rounded-2xl relative overflow-hidden border border-funnel-border">
          {/* Overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="bg-black/60 backdrop-blur-sm px-6 py-4 rounded-xl text-center">
              <p className="text-funnel-success text-3xl font-bold">
                Quer R$1.500/mês?
              </p>
            </div>
          </div>

          {/* Video placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center opacity-50">
              <div className="w-24 h-24 bg-funnel-primary/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <div className="w-0 h-0 border-t-[15px] border-t-transparent border-l-[25px] border-l-funnel-text border-b-[15px] border-b-transparent ml-2" />
              </div>
            </div>
          </div>

          {/* Right side actions */}
          <div className="absolute right-4 bottom-40 flex flex-col gap-5 z-20">
            <div className="w-12 h-12 rounded-full bg-funnel-success border-2 border-funnel-text overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-600" />
            </div>
            <div className="flex flex-col items-center">
              <Heart className="w-8 h-8 text-funnel-text fill-funnel-danger" />
              <span className="text-funnel-text text-xs mt-1">15.2K</span>
            </div>
            <div className="flex flex-col items-center">
              <MessageCircle className="w-8 h-8 text-funnel-text" />
              <span className="text-funnel-text text-xs mt-1">3.1K</span>
            </div>
            <div className="flex flex-col items-center">
              <Share2 className="w-8 h-8 text-funnel-text" />
              <span className="text-funnel-text text-xs mt-1">Share</span>
            </div>
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-20">
            <p className="text-funnel-text font-semibold mb-1">@andreia.conf</p>
            <p className="text-funnel-text text-sm mb-3">
              R$80-160/dia vendendo açaí na garrafa 🍇💰 Método validado!
            </p>
            <div className="flex items-center gap-2 mb-4">
              <Music className="w-4 h-4 text-funnel-text" />
              <p className="text-funnel-text text-xs">Som original - @andreia.conf</p>
            </div>
            
            <CTAButton onClick={handleContinue} variant="success" className="w-full">
              Ver receitas
            </CTAButton>
          </div>
        </div>
      </div>
    </StepLayout>
  );
};

export default Step9;
