import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFunnel } from '@/context/FunnelContext';
import VideoEpisode from '@/components/funnel/VideoEpisode';

const Step14: React.FC = () => {
  const navigate = useNavigate();
  const { completeStep } = useFunnel();

  const handleNext = () => {
    completeStep(14);
    navigate('/step/15');
  };

  return (
    <VideoEpisode
      episode={3}
      totalEpisodes={5}
      title="Açaí + Maracujá"
      likes="1.4K"
      comments="1.1K"
      extraText="R$160/dia"
      onNext={handleNext}
      buttonText="Próximo episódio"
    />
  );
};

export default Step14;
