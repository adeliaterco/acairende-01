import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFunnel } from '@/context/FunnelContext';
import VideoEpisode from '@/components/funnel/VideoEpisode';

const Step15: React.FC = () => {
  const navigate = useNavigate();
  const { completeStep } = useFunnel();

  const handleNext = () => {
    completeStep(15);
    navigate('/step/16');
  };

  return (
    <VideoEpisode
      episode={4}
      totalEpisodes={5}
      title="Açaí + Leite Condensado"
      likes="1.4K"
      comments="987"
      isLocked={true}
      onNext={handleNext}
      buttonText="Desbloquear próximo"
    />
  );
};

export default Step15;
