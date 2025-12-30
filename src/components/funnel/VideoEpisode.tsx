import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Heart, MessageCircle, Share2, Music, Bookmark } from 'lucide-react';

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

const VIDEO_MAP: Record<number, string> = {
  0: 'https://nutricaoalimentos.shop/wp-content/uploads/2025/12/01-vd-Salario.Ai_.mp4',
  1: 'https://nutricaoalimentos.shop/wp-content/uploads/2025/12/snaptik_7564016802565508372_v2.mp4',
  2: 'https://nutricaoalimentos.shop/wp-content/uploads/2025/12/03-vd-acainutella1.mp4',
};

const VideoEpisode: React.FC<VideoEpisodeProps> = ({
  episode,
  totalEpisodes,
  title,
  likes,
  comments = '1.2K',
  extraText,
  isLocked = false,
  onNext,
  videoUrl,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(parseInt(likes));
  const [showEndMessage, setShowEndMessage] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const currentVideoUrl = VIDEO_MAP[episode] || videoUrl || VIDEO_MAP[1];

  const handleVideoEnd = useCallback(() => {
    setVideoEnded(true);
    setShowEndMessage(true);
  }, []);

  const handleCanPlay = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleLike = useCallback(() => {
    setIsLiked(prev => !prev);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  }, [isLiked]);

  const formatNumber = useCallback((num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
  }, []);

  const handleNavigation = useCallback(() => {
    if (videoEnded && !isLocked) {
      onNext();
    }
  }, [videoEnded, isLocked, onNext]);

  useEffect(() => {
    setIsLoading(true);
    setVideoEnded(false);
    setShowEndMessage(false);
  }, [episode]);

  // MUDANÇA #1: Cleanup sem dependência [episode]
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        const video = videoRef.current;
        video.pause();
        video.src = '';
        video.load();
      }
    };
  }, []);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 30) {
        handleNavigation();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: true });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [handleNavigation]);

  useEffect(() => {
    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      if (touchStartY - touchEndY > 50) {
        handleNavigation();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      container.addEventListener('touchend', handleTouchEnd, { passive: true });
      return () => {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [handleNavigation]);

  useEffect(() => {
    if (videoRef.current && !isLocked) {
      const video = videoRef.current;
      
      const playVideo = async () => {
        try {
          await video.play();
        } catch (error) {
          console.log('⚠️ Autoplay bloqueado:', error);
        }
      };
      
      const timer = setTimeout(playVideo, 100);
      return () => clearTimeout(timer);
    }
  }, [isLocked, episode]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden"
    >
      <div className="w-full max-w-[400px] aspect-[9/16] bg-black rounded-3xl relative overflow-hidden border-2 border-gray-800 shadow-2xl">
        
        {!isLocked && (
          <video
            key={`video-${episode}`}
            ref={videoRef}
            src={currentVideoUrl}
            className="absolute inset-0 w-full h-full object-cover"
            onEnded={handleVideoEnd}
            onCanPlay={handleCanPlay}
            autoPlay
            playsInline
            muted={false}
            loop={false}
            preload="metadata"
          />
        )}

        <div className="absolute inset-0 bg-black/10" />

        {isLoading && !isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-40">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
              <p>Carregando...</p>
            </div>
          </div>
        )}

        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/60 to-transparent">
          <span className="text-white font-medium text-sm">Seguindo</span>
          <span className="text-white font-bold border-b-2 border-white text-sm">Para Você</span>
          <span className="text-white text-lg cursor-pointer">🔍</span>
        </div>

        <div className="absolute top-20 left-4 z-10 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
          <p className="text-white text-xs font-semibold">Episódio {episode} de {totalEpisodes}</p>
        </div>

        <div className="absolute right-4 bottom-32 flex flex-col gap-6 z-20">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-white flex items-center justify-center cursor-pointer">
            <span className="text-lg">👩‍🍳</span>
          </div>

          <div className="flex flex-col items-center cursor-pointer" onClick={handleLike}>
            <Heart className={`w-8 h-8 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            <span className="text-white text-xs mt-1 font-semibold">{formatNumber(likeCount)}</span>
          </div>

          <div className="flex flex-col items-center cursor-pointer">
            <MessageCircle className="w-8 h-8 text-white" />
            <span className="text-white text-xs mt-1 font-semibold">{comments}</span>
          </div>

          <div className="flex flex-col items-center cursor-pointer">
            <Share2 className="w-8 h-8 text-white" />
            <span className="text-white text-xs mt-1 font-semibold">Compartilhar</span>
          </div>

          <div className="flex flex-col items-center cursor-pointer">
            <Bookmark className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent z-20">
          <div className="p-4 pt-6">
            <p className="text-white font-bold text-sm mb-2">@andreia.conf</p>
            <p className="text-white text-xs mb-4 leading-relaxed line-clamp-2">
              {title} 🍇💰 #empreendedorismo #acai
            </p>

            <div className="flex items-center gap-2 mb-4 cursor-pointer">
              <Music className="w-3 h-3 text-white flex-shrink-0" />
              <p className="text-white text-xs truncate">Som original - @andreia.conf</p>
            </div>
          </div>

          <div className="flex items-center justify-between px-4 pb-4 border-t border-white/10">
            <div className="flex-1 flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mr-2">
              <input
                type="text"
                placeholder="Comentar..."
                className="flex-1 bg-transparent text-white text-xs placeholder-white/50 outline-none"
                disabled
              />
              <span className="text-white/50 text-xs">😊</span>
            </div>

            <div className="flex items-center gap-3">
              <button className="text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.26 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
              </button>

              <button className="text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {showEndMessage && !isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-black/40 backdrop-blur-sm">
            <div className="text-center">
              <p className="text-white text-2xl font-bold mb-4">✨</p>
              <p className="text-white text-xl font-bold mb-6">Vídeo finalizado!</p>
              <p className="text-white text-lg font-semibold animate-bounce">
                ⬆️ Arrasta pra cima para continuar
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoEpisode;