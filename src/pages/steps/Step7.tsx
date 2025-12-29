import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFunnel } from '@/context/FunnelContext';
import StepLayout from '@/components/funnel/StepLayout';
import { Phone, Mic, Volume2 } from 'lucide-react';

const Step7: React.FC = () => {
  const navigate = useNavigate();
  const { completeStep } = useFunnel();
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    const timeout = setTimeout(() => {
      completeStep(7);
      navigate('/step/8');
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate, completeStep]);

  const handleEnd = () => {
    completeStep(7);
    navigate('/step/8');
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Generate random heights for audio bars
  const audioBars = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    delay: i * 0.05,
  }));

  return (
    <StepLayout showBack={false}>
      <div className="flex-1 flex flex-col bg-gradient-to-b from-funnel-primary/30 to-funnel-bg items-center justify-center p-6">
        {/* Profile picture */}
        <div className="mb-6">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center border-4 border-funnel-text/20">
            <span className="text-4xl">👩‍🍳</span>
          </div>
        </div>

        {/* Caller info */}
        <div className="text-center mb-4">
          <h2 className="text-funnel-text text-xl font-bold">@andreia.conf</h2>
          <p className="text-funnel-success text-lg font-medium">{formatTime(43 + seconds)}</p>
        </div>

        {/* Audio wave visualization */}
        <div className="flex items-center justify-center gap-1 h-16 mb-8">
          {audioBars.map((bar) => (
            <div
              key={bar.id}
              className="w-1 bg-funnel-success rounded-full animate-audio-wave"
              style={{
                animationDelay: `${bar.delay}s`,
                height: `${20 + Math.random() * 80}%`,
              }}
            />
          ))}
        </div>

        {/* Call controls */}
        <div className="flex items-center gap-6 mb-8">
          <button className="w-14 h-14 rounded-full bg-funnel-card border border-funnel-border flex items-center justify-center">
            <Mic className="w-6 h-6 text-funnel-text" />
          </button>
          <button className="w-14 h-14 rounded-full bg-funnel-card border border-funnel-border flex items-center justify-center">
            <Volume2 className="w-6 h-6 text-funnel-text" />
          </button>
        </div>

        {/* End call button */}
        <button
          onClick={handleEnd}
          className="w-16 h-16 rounded-full bg-funnel-danger flex items-center justify-center hover:bg-funnel-danger/90 transition-colors"
        >
          <Phone className="w-8 h-8 text-white rotate-[135deg]" />
        </button>
        <span className="text-funnel-muted text-sm mt-2">Encerrar</span>
      </div>
    </StepLayout>
  );
};

export default Step7;
