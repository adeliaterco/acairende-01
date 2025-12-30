import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFunnel } from '@/context/FunnelContext';

const Step13: React.FC = () => {
  const navigate = useNavigate();
  const { completeStep } = useFunnel();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🔵 Step13 montado');
    
    return () => {
      console.log('🔴 Step13 desmontado');
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = '';
      }
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      
      const handleCanPlay = () => {
        console.log('✅ Vídeo pronto para reproduzir');
        setIsLoading(false);
      };

      const handleError = (e: Event) => {
        console.error('❌ Erro ao carregar vídeo:', e);
      };

      const handleLoadStart = () => {
        console.log('⏳ Iniciando carregamento do vídeo');
      };

      video.addEventListener('canplay', handleCanPlay);
      video.addEventListener('error', handleError);
      video.addEventListener('loadstart', handleLoadStart);

      video.play().catch(err => {
        console.error('❌ Erro no autoplay:', err);
      });

      return () => {
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('error', handleError);
        video.removeEventListener('loadstart', handleLoadStart);
      };
    }
  }, []);

  const handleVideoEnd = () => {
    completeStep(13);
    navigate('/step/14');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] aspect-[9/16] bg-black rounded-3xl relative overflow-hidden border-2 border-gray-800">
        
        <video
          ref={videoRef}
          src="https://nutricaoalimentos.shop/wp-content/uploads/2025/12/snaptik_7564016802565508372_v2.mp4"
          className="absolute inset-0 w-full h-full object-cover"
          onEnded={handleVideoEnd}
          playsInline
          muted={false}
          preload="auto"
        />

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
              <p>Carregando Step13 (teste isolado)...</p>
            </div>
          </div>
        )}

        <div className="absolute top-4 left-4 z-10 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
          <p className="text-white text-xs font-semibold">TESTE ISOLADO - Step13</p>
        </div>
      </div>
    </div>
  );
};

export default Step13;