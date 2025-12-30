import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Heart, MessageCircle, Share2, Music, Bookmark, Loader2, AlertCircle } from 'lucide-react';

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

const MAX_RETRIES = 3;

const VideoEpisode: React.FC<VideoEpisodeProps> = ({
  episode,
  totalEpisodes,
  title,
  likes,
  comments = '1.2K',
  extraText,
  isLocked = false,
  onNext,
  videoUrl = 'https://nutricaoalimentos.shop/wp-content/uploads/2025/12/snaptik_7564016802565508372_v2.mp4',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(parseInt(likes));
  const [showEndMessage, setShowEndMessage] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleVideoEnd = useCallback(() => {
    setVideoEnded(true);
    setShowEndMessage(true);
  }, []);

  const handleVideoLoadStart = useCallback(() => {
    setIsLoading(true);
    setVideoError(null);
  }, []);

  const handleVideoCanPlayThrough = useCallback(() => {
    setIsLoading(false);
    setVideoError(null);
    if (videoRef.current && !isLocked) {
      videoRef.current.play().catch(err => {
        console.error('Erro ao reproduzir vídeo automaticamente:', err);
        setIsLoading(false);
      });
    }
  }, [isLocked]);

  const handleVideoError = useCallback(() => {
    if (retryCount < MAX_RETRIES) {
      setRetryCount(prev => prev + 1);
      console.warn(`Erro ao carregar vídeo. Tentando novamente (${retryCount + 1}/${MAX_RETRIES})...`);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.load();
        }
      }, 2000);
    } else {
      setIsLoading(false);
      setVideoError('Não foi possível carregar o vídeo. Tente novamente mais tarde.');
      console.error('Falha ao carregar vídeo após múltiplas tentativas.');
    }
  }, [retryCount]);

  useEffect(() => {
    setVideoEnded(false);
    setShowEndMessage(false);
    setIsLoading(true);
    setVideoError(null);
    setRetryCount(0);

    if (videoRef.current && !isLocked) {
      videoRef.current.load();
    }
  }, [videoUrl, isLocked]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientY);
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.changedTouches[0].clientY);
    requestAnimationFrame(() => {
      const swipeDistance = touchStart - e.changedTouches[0].clientY;
      if (videoEnded && swipeDistance > 50 && !isNavigating) {
        setIsNavigating(true);
        onNext();
      }
    });
  }, [videoEnded, touchStart, onNext, isNavigating]);

  const handleLike = useCallback(() => {
    setIsLiked(prev => !prev);
    setLikeCount(prev => (isLiked ? prev - 1 : prev + 1));
  }, [isLiked]);

  const formatNumber = useCallback((num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
  }, []);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{ pointerEvents: isNavigating ? 'none' : 'auto' }}
    >
      <div className="w-full max-w-[400px] aspect-[9/16] bg-black rounded-3xl relative overflow-hidden border-2 border-gray-800 shadow-2xl will-change-transform">
        
        {!isLocked && (
          <>
            <video
              ref={videoRef}
              src={videoUrl}
              className="absolute inset-0 w-full h-full object-cover"
              onEnded={handleVideoEnd}
              onLoadStart={handleVideoLoadStart}
              onCanPlayThrough={handleVideoCanPlayThrough}
              onError={handleVideoError}
              autoPlay
              playsInline
              muted={false}
              loop={false}
            >
              Seu navegador não suporta o formato de vídeo.
            </video>

            {isLoading && !videoError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-40 animate-pulse">
                <Loader2 className="w-10 h-10 text-white animate-spin" />
                <p className="text-white ml-3">Carregando vídeo...</p>
              </div>
            )}

            {videoError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-40 text-center p-4">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <p className="text-white text-lg font-semibold mb-2">Erro ao carregar vídeo</p>
                <p className="text-gray-300 text-sm">{videoError}</p>
                {retryCount < MAX_RETRIES && (
                  <button
                    onClick={() => {
                      setRetryCount(prev => prev + 1);
                      setVideoError(null);
                      setIsLoading(true);
                      if (videoRef.current) videoRef.current.load();
                    }}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Tentar Novamente ({retryCount + 1}/{MAX_RETRIES})
                  </button>
                )}
              </div>
            )}
          </>
        )}

        <div className="absolute inset-0 bg-black/10" />

        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/60 to-transparent">
          <span className="text-white font-medium text-sm">Seguindo</span>
          <span className="text-white font-bold border-b-2 border-white text-sm">Para Você</span>
          <span className="text-white text-lg cursor-pointer hover:scale-110 transition-transform">🔍</span>
        </div>

        <div className="absolute top-20 left-4 z-10 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
          <p className="text-white text-xs font-semibold">Episódio {episode} de {totalEpisodes}</p>
        </div>

        <div className="absolute right-4 bottom-32 flex flex-col gap-6 z-20">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-white overflow-hidden flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
            <span className="text-lg">👩‍🍳</span>
          </div>

          <div className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform" onClick={handleLike}>
            <Heart className={`w-8 h-8 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            <span className="text-white text-xs mt-1 font-semibold">{formatNumber(likeCount)}</span>
          </div>

          <div className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform">
            <MessageCircle className="w-8 h-8 text-white" />
            <span className="text-white text-xs mt-1 font-semibold">{comments}</span>
          </div>

          <div className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform">
            <Share2 className="w-8 h-8 text-white" />
            <span className="text-white text-xs mt-1 font-semibold">Compartilhar</span>
          </div>

          <div className="flex flex-col items-center cursor-pointer hover:scale-110 transition-transform">
            <Bookmark className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent z-20">
          <div className="p-4 pt-6">
            <p className="text-white font-bold text-sm mb-2">@andreia.conf</p>
            <p className="text-white text-xs mb-4 leading-relaxed line-clamp-2">
              {title} 🍇💰 #empreendedorismo #acai
            </p>

            <div className="flex items-center gap-2 mb-4 cursor-pointer hover:opacity-80 transition-opacity">
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
              <button className="text-white hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.26 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
              </button>

              <button className="text-white hover:scale-110 transition-transform">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {showEndMessage && !isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-black/40 backdrop-blur-sm animate-fade-in">
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