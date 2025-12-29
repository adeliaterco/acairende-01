import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFunnel } from '@/context/FunnelContext';
import { Heart, MessageCircle, Share2, Music } from 'lucide-react';

const Step5: React.FC = () => {
  const navigate = useNavigate();
  const { addPoints, completeStep } = useFunnel();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Quando o vídeo termina, muda de tela automaticamente
  const handleVideoEnd = () => {
    addPoints(50);
    completeStep(5);
    navigate('/step/6');
  };

  // Iniciar reprodução automática
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => console.error('Erro ao reproduzir vídeo:', err));
    }
  }, []);

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-funnel-bg">
      <div className="w-full max-w-[400px] aspect-[9/16] bg-black rounded-2xl relative overflow-hidden border border-funnel-border shadow-2xl">
        
        {/* Video Background */}
        <video
          ref={videoRef}
          src="https://nutricaoalimentos.shop/ssstik-io_1767035842478/"
          className="absolute inset-0 w-full h-full object-cover"
          onEnded={handleVideoEnd}
          autoPlay
          playsInline
          muted={false}
        />

        {/* Dark overlay para melhor legibilidade do texto */}
        <div className="absolute inset-0 bg-black/20" />

        {/* TikTok header */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
          <span className="text-white font-medium text-sm">Following</span>
          <span className="text-white font-bold border-b-2 border-white text-sm">For You</span>
          <span className="text-white text-lg">🔍</span>
        </div>

        {/* Right side actions */}
        <div className="absolute right-4 bottom-40 flex flex-col gap-5 z-20">
          {/* Profile Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-white overflow-hidden flex items-center justify-center">
            <span className="text-lg">👩‍🍳</span>
          </div>

          {/* Like Button */}
          <div className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform">
            <Heart className="w-8 h-8 text-white fill-red-500" />
            <span className="text-white text-xs mt-1 font-semibold">12.8K</span>
          </div>

          {/* Comment Button */}
          <div className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform">
            <MessageCircle className="w-8 h-8 text-white" />
            <span className="text-white text-xs mt-1 font-semibold">2.4K</span>
          </div>

          {/* Share Button */}
          <div className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform">
            <Share2 className="w-8 h-8 text-white" />
            <span className="text-white text-xs mt-1 font-semibold">Share</span>
          </div>

          {/* Music Note */}
          <div className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform">
            <Music className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Bottom info gradient */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent z-20">
          {/* Username */}
          <p className="text-white font-bold text-sm mb-1">@andreia.conf</p>

          {/* Description */}
          <p className="text-white text-xs mb-3 leading-relaxed">
            Do ZERO a R$5.000/mês vendendo açaí na garrafa 🍇💰 #empreendedorismo #acai
          </p>

          {/* Music info */}
          <div className="flex items-center gap-2 mb-4">
            <Music className="w-3 h-3 text-white" />
            <p className="text-white text-xs">Som original - @andreia.conf</p>
          </div>

          {/* Progress indicator */}
          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white rounded-full transition-all duration-100"
              style={{
                width: videoRef.current ? `${(videoRef.current.currentTime / videoRef.current.duration) * 100}%` : '0%'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step5;