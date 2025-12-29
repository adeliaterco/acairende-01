import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFunnel } from '@/context/FunnelContext';
import StepLayout from '@/components/funnel/StepLayout';
import { Phone, PhoneOff, MessageCircle, Video } from 'lucide-react';

const Step6: React.FC = () => {
  const navigate = useNavigate();
  const { completeStep } = useFunnel();

  const handleAnswer = () => {
    completeStep(6);
    navigate('/step/7');
  };

  return (
    <StepLayout showBack={false}>
      <div className="flex-1 flex flex-col bg-gradient-to-b from-funnel-primary/30 to-funnel-bg items-center justify-center p-6">
        {/* Profile picture */}
        <div className="mb-6">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center border-4 border-funnel-text/20">
            <span className="text-5xl">👩‍🍳</span>
          </div>
        </div>

        {/* Caller info */}
        <div className="text-center mb-12">
          <h2 className="text-funnel-text text-2xl font-bold mb-1">@andreia.conf</h2>
          <p className="text-funnel-muted">Chamada de áudio...</p>
        </div>

        {/* Call actions */}
        <div className="flex items-center gap-8">
          <button className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-full bg-funnel-card border border-funnel-border flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-funnel-text" />
            </div>
            <span className="text-funnel-muted text-xs">Mensagem</span>
          </button>

          <button
            onClick={handleAnswer}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-20 h-20 rounded-full bg-funnel-success flex items-center justify-center animate-pulse hover:scale-105 transition-transform">
              <Phone className="w-10 h-10 text-black" />
            </div>
            <span className="text-funnel-success text-sm font-medium">Atender</span>
          </button>

          <button className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 rounded-full bg-funnel-danger flex items-center justify-center">
              <PhoneOff className="w-6 h-6 text-white" />
            </div>
            <span className="text-funnel-muted text-xs">Recusar</span>
          </button>
        </div>

        {/* Bottom actions */}
        <div className="mt-12 flex items-center gap-6">
          <button className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-funnel-card border border-funnel-border flex items-center justify-center">
              <Video className="w-5 h-5 text-funnel-text" />
            </div>
            <span className="text-funnel-muted text-xs">Vídeo</span>
          </button>
        </div>
      </div>
    </StepLayout>
  );
};

export default Step6;