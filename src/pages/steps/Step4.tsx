import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFunnel } from '@/context/FunnelContext';
import VideoEpisode from '@/components/funnel/VideoEpisode';

const Step4: React.FC = () => {
  const navigate = useNavigate();
  const { addPoints, completeStep } = useFunnel();

  const handleNext = () => {
    addPoints(50);
    completeStep(4);
    navigate('/step/5');
  };

  return (
    <VideoEpisode
      episode={0}
      totalEpisodes={5}
      title="Do ZERO a R$5.000/mês vendendo açaí na garrafa"
      likes="12.8K"
      comments="2.4K"
      onNext={handleNext}
      buttonText="Próximo"
    />
  );
};

export default Step4;