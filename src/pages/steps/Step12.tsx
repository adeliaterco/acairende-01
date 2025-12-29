import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFunnel } from '@/context/FunnelContext';
import VideoEpisode from '@/components/funnel/VideoEpisode';

const Step12: React.FC = () => {
  const navigate = useNavigate();
  const { completeStep } = useFunnel();

  const handleNext = () => {
    completeStep(12);
    navigate('/step/13');
  };

  return (
    <VideoEpisode
      episode={1}
      totalEpisodes={5}
      title="Açaí + Leitinho"
      likes="1.4K"
      comments="856"
      onNext={handleNext}
      buttonText="Próximo episódio"
    />
  );
};

export default Step12;
