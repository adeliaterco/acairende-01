import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFunnel } from '@/context/FunnelContext';
import { Heart, MessageCircle, Share2, Music, Bookmark } from 'lucide-react';

const Step4: React.FC = () => {
  const navigate = useNavigate();
  const { addPoints, completeStep } = useFunnel();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(12800);

  // Quando o vídeo termina, muda de tela automaticamente
  const handleVideoEnd = () => {
    addPoints(50);
    completeStep(4);
    navigate('/step/5');
  };

  // Iniciar reprodução automática
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => console.error('Erro ao reproduzir vídeo:', err));
    }
  }, []);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-black min-h-screen">
      <div className="w-full max-w-[400px] aspect-[9/16] bg-black rounded-3xl relative overflow-hidden border-2 border-gray-800 shadow-2xl">
        
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
        <div className="absolute inset-0 bg-black/10" />

        {/* TikTok header */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/60 to-transparent">
          <span className="text-white font-medium text-sm">Seguindo</span>
          <span className="text-white font-bold border-b-2 border-white text-sm">Para Você</span>
          <span className="text-white text-lg cursor-pointer hover:scale-110 transition-transform">🔍</span>
        </div>

        {/* Right side actions - Vertical */}
        <div className="absolute right-4 bottom-32 flex flex-col gap-6 z-20">
          {/* Profile Avatar */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-white overflow-hidden flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
            <span className="text-lg">👩‍🍳</span>
          </div>

          {/* Like Button */}
          <div className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform" onClick={handleLike}>
            <Heart className={`w-8 h-8 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            <span className="text-white text-xs mt-1 font-semibold">{formatNumber(likeCount)}</span>
          </div>

          {/* Comment Button */}
          <div className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform">
            <MessageCircle className="w-8 h-8 text-white" />
            <span className="text-white text-xs mt-1 font-semibold">2.4K</span>
          </div>

          {/* Share Button */}
          <div className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform">
            <Share2 className="w-8 h-8 text-white" />
            <span className="text-white text-xs mt-1 font-semibold">Compartilhar</span>
          </div>

          {/* Bookmark Button */}
          <div className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform">
            <Bookmark className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Bottom info with gradient */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent z-20">
          {/* Username and Description */}
          <div className="p-4 pt-6">
            <p className="text-white font-bold text-sm mb-2">@andreia.conf</p>
            <p className="text-white text-xs mb-4 leading-relaxed line-clamp-2">
              Do ZERO a R$5.000/mês vendendo açaí na garrafa 🍇💰 #empreendedorismo #acai
            </p>

            {/* Music info */}
            <div className="flex items-center gap-2 mb-4 cursor-pointer hover:opacity-80 transition-opacity">
              <Music className="w-3 h-3 text-white flex-shrink-0" />
              <p className="text-white text-xs truncate">Som original - @andreia.conf</p>
            </div>
          </div>

          {/* Bottom Action Bar - Horizontal */}
          <div className="flex items-center justify-between px-4 pb-4 border-t border-white/10">
            {/* Comment Input */}
            <div className="flex-1 flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mr-2">
              <input
                type="text"
                placeholder="Comentar..."
                className="flex-1 bg-transparent text-white text-xs placeholder-white/50 outline-none"
                disabled
              />
              <span className="text-white/50 text-xs">😊</span>
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-3">
              {/* Sound On/Off */}
              <button className="text-white hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.26 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
              </button>

              {/* More Options */}
              <button className="text-white hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step4;