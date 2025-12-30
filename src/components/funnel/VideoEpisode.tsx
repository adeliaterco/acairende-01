import React, { useRef, useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Lock, Music, Bookmark } from 'lucide-react';

interface VideoEpisodeProps {
  episode: number;
  totalEpisodes: number;
  title: string;
  likes: string;
  comments?: string;
  extraText?: string;
  isLocked?: boolean;
  onNext: () => void;
  buttonText?: string;
  videoUrl?: string;
}

const VideoEpisode: React.FC<VideoEpisodeProps> = ({
  episode,
  totalEpisodes,
  title,
  likes,
  comments = '1.2K',
  extraText,
  isLocked = false,
  onNext,
  buttonText = 'Próximo episódio',
  videoUrl = 'https://nutricaoalimentos.shop/wp-content/uploads/2025/12/snaptik_7564016802565508372_v2.mp4',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(parseInt(likes));
  const [showEndMessage, setShowEndMessage] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  // Detectar fim do vídeo
  const handleVideoEnd = () => {
    setShowEndMessage(true);
  };

  // Detectar swipe para cima
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEnd(e.changedTouches[0].clientY);
    handleSwipe();
  };

  const handleSwipe = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe para cima detectado (diferença maior que 50px)
      onNext();
    }
  };

  // Iniciar reprodução automática
  useEffect(() => {
    if (videoRef.current && !isLocked) {
      videoRef.current.play().catch(err => console.error('Erro ao reproduzir vídeo:', err));
    }
  }, [isLocked]);

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

  const handleButtonClick = () => {
    onNext();
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-funnel-bg flex items-center justify-center p-4"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="w-full max-w-[400px] aspect-[9/16] bg-black rounded-2xl relative overflow-hidden border border-funnel-border shadow-2xl">
        
        {/* Video Background */}
        {!isLocked && (
          <video
            ref={videoRef}
            src={videoUrl}
            className="absolute inset-0 w-full h-full object-cover"
            onEnded={handleVideoEnd}
            autoPlay
            playsInline
            muted={false}
          />
        )}

        {/* Dark overlay para melhor legibilidade */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Episode badge */}
        <div className="absolute top-4 left-4 bg-funnel-primary/90 px-3 py-1 rounded-full z-10">
          <span className="text-white font-bold text-sm">EP.{episode}/{totalEpisodes}</span>
        </div>

        {/* Video placeholder - Aparece se estiver locked ou se não houver vídeo */}
        {isLocked && (
          <div className="absolute inset-0 flex items-center justify-center z-5">
            <div className="text-center">
              <Lock className="w-20 h-20 text-funnel-warning mx-auto mb-4" />
              <h3 className="text-funnel-text text-xl font-bold">{title}</h3>
              {extraText && (
                <p className="text-funnel-success text-lg font-semibold mt-2">{extraText}</p>
              )}
            </div>
          </div>
        )}

        {/* Right side actions - Vertical */}
        <div className="absolute right-4 bottom-40 flex flex-col gap-6 z-20">
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
            <span className="text-white text-xs mt-1 font-semibold">{comments}</span>
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
              {title} 🍇💰 #empreendedorismo #acai
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

          {/* Button Section */}
          <div className="px-4 pb-4">
            <button
              onClick={handleButtonClick}
              className="w-full bg-funnel-success hover:bg-funnel-success/90 text-black font-bold py-4 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              {buttonText}
            </button>
          </div>
        </div>

        {/* End Message - Aparece quando vídeo termina */}
        {showEndMessage && !isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="text-center">
              <p className="text-white text-2xl font-bold mb-4">✨</p>
              <p className="text-white text-xl font-bold mb-6">Vídeo finalizado!</p>
              <div className="flex flex-col items-center gap-3">
                <p className="text-white text-lg font-semibold animate-bounce">
                  ⬆️ Arrasta pra cima para continuar
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default VideoEpisode;