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

// CORREÇÃO: Função para limpar completamente um vídeo (crítico para Safari iOS)
const cleanupVideo = (video: HTMLVideoElement | null) => {
  if (!video) return;
  try {
    video.pause();
    video.removeAttribute('src');
    video.load();
    video.onended = null;
    video.oncanplay = null;
    video.onerror = null;
    video.onloadeddata = null;
    video.src = '';
  } catch (e) {
    console.log('Cleanup error:', e);
  }
};

const VideoEpisode: React.FC<VideoEpisodeProps> = ({
  episode,
  totalEpisodes,
  title,
  likes,
  comments = '1.2K',
  isLocked = false,
  onNext,
  videoUrl,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(parseInt(likes) || 0);
  const [showEndMessage, setShowEndMessage] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [videoReady, setVideoReady] = useState(false);

  const currentVideoUrl = VIDEO_MAP[episode] ?? videoUrl ?? VIDEO_MAP[1];

  // CORREÇÃO 1: Limpeza agressiva ao montar/desmontar
  useEffect(() => {
    const video = videoRef.current;
    
    // Limpa TODOS os vídeos anteriores na página (libera memória)
    const allVideos = document.querySelectorAll('video');
    allVideos.forEach((v) => {
      if (v !== video) {
        cleanupVideo(v as HTMLVideoElement);
      }
    });

    return () => {
      cleanupVideo(video);
    };
  }, []);

  // CORREÇÃO 2: Reset estado quando episode muda
  useEffect(() => {
    setIsLoading(true);
    setVideoEnded(false);
    setShowEndMessage(false);
    setVideoReady(false);
  }, [episode]);

  // CORREÇÃO 3: Carregamento progressivo para Safari iOS
  useEffect(() => {
    const video = videoRef.current;
    if (!video || isLocked) return;

    const handleLoadedData = () => {
      console.log(`✅ Video data loaded - Episode: ${episode}`);
      setVideoReady(true);
    };

    const handleCanPlay = () => {
      console.log(`✅ Video can play - Episode: ${episode}`);
      setIsLoading(false);
    };

    const handleError = (e: Event) => {
      console.error(`❌ Video error - Episode: ${episode}`, e);
      setIsLoading(false);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    // CORREÇÃO 4: Delay no src para evitar race conditions no Safari
    const loadTimer = setTimeout(() => {
      if (video) {
        video.src = currentVideoUrl;
        video.load();
      }
    }, 100);

    return () => {
      clearTimeout(loadTimer);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [currentVideoUrl, episode, isLocked]);

  // CORREÇÃO 5: Autoplay quando vídeo estiver pronto
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoReady || isLocked) return;

    const playVideo = async () => {
      try {
        await video.play();
        console.log(`▶️ Video playing - Episode: ${episode}`);
      } catch (error) {
        console.log('⚠️ Autoplay blocked, waiting for user interaction');
        const handleTouch = async () => {
          try {
            await video.play();
            document.removeEventListener('touchstart', handleTouch);
          } catch (e) {
            console.log('Still blocked after touch');
          }
        };
        document.addEventListener('touchstart', handleTouch, { once: true });
      }
    };

    const timer = setTimeout(playVideo, 150);
    return () => clearTimeout(timer);
  }, [videoReady, isLocked, episode]);

  const handleVideoEnd = useCallback(() => {
    setVideoEnded(true);
    setShowEndMessage(true);
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

  // CORREÇÃO 6: Limpa vídeo antes de navegar
  const handleNavigation = useCallback(() => {
    if (videoEnded && !isLocked) {
      cleanupVideo(videoRef.current);
      setTimeout(() => {
        onNext();
      }, 50);
    }
  }, [videoEnded, isLocked, onNext]);

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

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden"
    >
      <div className="w-full max-w-[400px] aspect-[9/16] bg-black rounded-3xl relative overflow-hidden border-2 border-gray-800 shadow-2xl">
        
        {/* CORREÇÃO 7: Atributos específicos para Safari iOS */}
        {!isLocked && (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            onEnded={handleVideoEnd}
            playsInline
            webkit-playsinline="true"
            muted={false}
            loop={false}
            preload="metadata"
            crossOrigin="anonymous"
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
          <p className="text-white text-xs font-semibold">Episódio {episode + 1} de {totalEpisodes}</p>
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
