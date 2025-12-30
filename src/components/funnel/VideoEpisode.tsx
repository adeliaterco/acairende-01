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

// Função para limpar completamente um elemento de vídeo (crítico para Safari iOS)
const cleanupVideo = (video: HTMLVideoElement | null) => {
  if (!video) return;
  
  try {
    video.pause();
    video.removeAttribute('src');
    video.load();
    
    // Remove event listeners
    video.onended = null;
    video.oncanplay = null;
    video.onerror = null;
    video.onloadeddata = null;
    
    // Força garbage collection
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

  // Limpeza agressiva ao montar/desmontar - CRÍTICO para Safari iOS
  useEffect(() => {
    const video = videoRef.current;
    
    // Cleanup de vídeos anteriores na página (força liberação de memória)
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

  // Reset estado quando episode muda
  useEffect(() => {
    setIsLoading(true);
    setVideoEnded(false);
    setShowEndMessage(false);
    setVideoReady(false);
  }, [episode]);

  // Carregamento progressivo do vídeo para Safari iOS
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

    // Carrega o vídeo com delay para Safari iOS
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

  // Autoplay quando vídeo estiver pronto
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoReady || isLocked) return;

    const playVideo = async () => {
      try {
        await video.play();
        console.log(`▶️ Video playing - Episode: ${episode}`);
      } catch (error) {
        console.log('⚠️ Autoplay blocked, waiting for user interaction');
        // Safari iOS pode bloquear autoplay - adiciona listener de toque
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

  const handleNavigation = useCallback(() => {
    if (videoEnded && !isLocked) {
      // Limpa vídeo antes de navegar
      cleanupVideo(videoRef.current);
      
      // Pequeno delay para garantir limpeza
      setTimeout(() => {
        onNext();
      }, 50);
    }
  }, [videoEnded, isLocked, onNext]);

  // Swipe handling
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

  // Wheel handling para desktop
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

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden"
    >
      <div className="w-full max-w-[400px] aspect-[9/16] bg-background rounded-3xl relative overflow-hidden border-2 border-border shadow-2xl">
        
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

        <div className="absolute inset-0 bg-background/10 pointer-events-none" />

        {isLoading && !isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-40">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-foreground text-sm font-medium">Carregando...</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-background/60 to-transparent">
          <span className="text-foreground/80 font-medium text-sm">Seguindo</span>
          <span className="text-foreground font-bold border-b-2 border-primary text-sm">Para Você</span>
          <span className="text-foreground text-lg cursor-pointer">🔍</span>
        </div>

        {/* Episode Badge */}
        <div className="absolute top-20 left-4 z-10 bg-background/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border">
          <p className="text-foreground text-xs font-semibold">
            Episódio {episode + 1} de {totalEpisodes}
          </p>
        </div>

        {/* Right Actions */}
        <div className="absolute right-4 bottom-36 flex flex-col gap-5 z-20">
          <div className="w-12 h-12 rounded-full gradient-primary border-2 border-foreground flex items-center justify-center cursor-pointer shadow-glow">
            <span className="text-lg">👩‍🍳</span>
          </div>

          <div 
            className="flex flex-col items-center cursor-pointer group" 
            onClick={handleLike}
          >
            <Heart 
              className={`w-8 h-8 transition-all duration-200 ${
                isLiked 
                  ? 'fill-primary text-primary animate-heart-pop' 
                  : 'text-foreground group-hover:text-primary'
              }`} 
            />
            <span className="text-foreground text-xs mt-1 font-semibold">
              {formatNumber(likeCount)}
            </span>
          </div>

          <div className="flex flex-col items-center cursor-pointer group">
            <MessageCircle className="w-8 h-8 text-foreground group-hover:text-primary transition-colors" />
            <span className="text-foreground text-xs mt-1 font-semibold">{comments}</span>
          </div>

          <div className="flex flex-col items-center cursor-pointer group">
            <Share2 className="w-8 h-8 text-foreground group-hover:text-primary transition-colors" />
            <span className="text-foreground text-xs mt-1 font-semibold">Enviar</span>
          </div>

          <div className="flex flex-col items-center cursor-pointer group">
            <Bookmark className="w-8 h-8 text-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 gradient-overlay z-20">
          <div className="p-4 pt-8">
            <p className="text-foreground font-bold text-sm mb-2">@andreia.conf</p>
            <p className="text-foreground/90 text-xs mb-4 leading-relaxed line-clamp-2">
              {title} 🍇💰 #empreendedorismo #acai
            </p>

            <div className="flex items-center gap-2 mb-4 cursor-pointer group">
              <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center animate-spin" style={{ animationDuration: '3s' }}>
                <Music className="w-3 h-3 text-foreground" />
              </div>
              <p className="text-foreground/80 text-xs truncate group-hover:text-foreground transition-colors">
                Som original - @andreia.conf
              </p>
            </div>
          </div>

          {/* Comment Input */}
          <div className="flex items-center justify-between px-4 pb-4 border-t border-border/30">
            <div className="flex-1 flex items-center gap-2 bg-muted/50 rounded-full px-4 py-2.5 mr-3">
              <input
                type="text"
                placeholder="Comentar..."
                className="flex-1 bg-transparent text-foreground text-xs placeholder-muted-foreground outline-none"
                disabled
              />
              <span className="text-muted-foreground text-sm">😊</span>
            </div>
          </div>
        </div>

        {/* End Message Overlay */}
        {showEndMessage && !isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-background/60 backdrop-blur-sm">
            <div className="text-center animate-slide-up">
              <div className="text-5xl mb-4">✨</div>
              <p className="text-foreground text-xl font-bold mb-6">Vídeo finalizado!</p>
              <div className="flex flex-col items-center gap-2">
                <div className="animate-bounce-soft">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </div>
                <p className="text-foreground text-lg font-semibold">
                  Arrasta pra cima
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoEpisode;