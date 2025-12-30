import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFunnel } from '@/context/FunnelContext';
import VideoEpisode from '@/components/funnel/VideoEpisode';

const Step13: React.FC = () => {
  const navigate = useNavigate();
  const { completeStep } = useFunnel();

  const handleNext = () => {
    completeStep(13);
    navigate('/step/14');
  };

  return (
    <VideoEpisode
      episode={2}
      totalEpisodes={5}
      title="Açaí + Nutella"
      likes="1.4K"
      comments="923"
      onNext={handleNext}
      buttonText="Próximo episódio"
    />
  );
};

export default Step13;