import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Heart, MessageCircle, Share2, Music, Bookmark, Volume2 } from 'lucide-react';

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
  videoUrl = 'https://nutricaoalimentos.shop/wp-content/uploads/2025/12/snaptik_7564016802565508372_v2.mp4',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(parseInt(likes));
  const [showEndMessage, setShowEndMessage] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [needsInteraction, setNeedsInteraction] = useState(false); // ← NOVO
  const [isMuted, setIsMuted] = useState(false);

  const handleVideoEnd = useCallback(() => {
    setVideoEnded(true);
    setShowEndMessage(true);
  }, []);

  const handleCanPlay = useCallback(() => {
    console.log('✅ Vídeo pronto para reproduzir');
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleVideoError = useCallback((e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('❌ ERRO ao carregar vídeo:', e);
    console.error('❌ URL:', videoUrl);
    const video = e.currentTarget;
    if (video.error) {
      console.error('❌ Código do erro:', video.error.code);
      console.error('❌ Mensagem:', video.error.message);
    }
    setIsLoading(false);
    setHasError(true);
  }, [videoUrl]);

  const handleLike = useCallback(() => {
    setIsLiked(prev => !prev);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  }, [isLiked]);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  }, []);

  // ← NOVO: Ativar som com interação do usuário
  const handleUserInteraction = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = false;
      setIsMuted(false);
      video.play()
        .then(() => {
          console.log('✅ Vídeo reproduzindo COM SOM após interação');
          setNeedsInteraction(false);
        })
        .catch((error) => {
          console.error('❌ Erro ao reproduzir com som:', error);
        });
    }
  }, []);

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

  // Desktop: Mouse wheel
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

  // Mobile: Touch swipe
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

  // Autoplay COM SOM
  useEffect(() => {
    const video = videoRef.current;
    if (video && !isLocked) {
      console.log('🎬 Tentando reproduzir vídeo COM SOM:', videoUrl);
      
      const timer = setTimeout(() => {
        // Tenta primeiro COM SOM
        video.muted = false;
        setIsMuted(false);
        
        video.play()
          .then(() => {
            console.log('✅ Vídeo iniciado COM SOM automaticamente!');
            setNeedsInteraction(false);
          })
          .catch((error) => {
            console.warn('⚠️ Autoplay com som bloqueado, precisa de interação do usuário');
            console.error('Erro:', error);
            
            // Fallback: inicia muted e pede interação
            video.muted = true;
            setIsMuted(true);
            video.play()
              .then(() => {
                console.log('✅ Vídeo iniciado SEM SOM (aguardando interação)');
                setNeedsInteraction(true); // Mostra overlay
              })
              .catch((err) => {
                console.error('❌ Falha total no autoplay:', err);
              });
          });
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isLocked, videoUrl]);

  useEffect(() => {
    console.log('📹 VideoEpisode montado');
    console.log('🎬 URL do vídeo:', videoUrl);
    console.log('🔒 isLocked:', isLocked);
  }, [videoUrl, isLocked]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden"
    >
      <div className="w-full max-w-[400px] aspect-[9/16] bg-black rounded-3xl relative overflow-hidden border-2 border-gray-800 shadow-2xl">
        
        {/* Video */}
        {!isLocked && (
          <video
            ref={videoRef}
            src={videoUrl}
            className="absolute inset-0 w-full h-full object-cover"
            onEnded={handleVideoEnd}
            onCanPlay={handleCanPlay}
            onError={handleVideoError}
            onLoadStart={() => console.log('⏳ Iniciando carregamento do vídeo...')}
            onLoadedMetadata={() => console.log('📊 Metadados carregados')}
            onLoadedData={() => console.log('📦 Dados carregados')}
            playsInline
            preload="auto"
            controls={false}
          />
        )}

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/10" />

        {/* ← NOVO: Overlay para ativar som */}
        {needsInteraction && !isLoading && !hasError && (
          <div 
            className="absolute inset-0 flex flex-col items-center justify-center z-50 bg-black/60 backdrop-blur-sm cursor-pointer"
            onClick={handleUserInteraction}
          >
            <div className="text-center animate-pulse">
              <div className="bg-white/20 backdrop-blur-md rounded-full p-6 mb-4 inline-block">
                <Volume2 className="w-12 h-12 text-white" />
              </div>
              <p className="text-white text-xl font-bold mb-2">Toque para ativar o som</p>
              <p className="text-white/70 text-sm">O navegador bloqueou o autoplay com áudio</p>
            </div>
          </div>
        )}

        {/* Botão de Som */}
        {!isLocked && !isLoading && !hasError && !needsInteraction && (
          <button
            onClick={toggleMute}
            className="absolute top-32 right-4 z-30 bg-black/50 backdrop-blur-sm p-3 rounded-full hover:bg-black/70 transition-all"
          >
            {isMuted ? (
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.26 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
            )}
          </button>
        )}

        {/* Loading */}
        {isLoading && !isLocked && !hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-40">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
              <p>Carregando vídeo...</p>
              <p className="text-xs mt-2 opacity-50">Episode {episode}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-40">
            <div className="text-white text-center p-4">
              <p className="text-2xl mb-2">⚠️</p>
              <p className="text-lg font-bold mb-2">Erro ao carregar vídeo</p>
              <p className="text-sm opacity-70 mb-4">Verifique a URL do vídeo</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/60 to-transparent">
          <span className="text-white font-medium text-sm">Seguindo</span>
          <span className="text-white font-bold border-b-2 border-white text-sm">Para Você</span>
          <span className="text-white text-lg cursor-pointer">🔍</span>
        </div>

        {/* Episode Counter */}
        <div className="absolute top-20 left-4 z-10 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
          <p className="text-white text-xs font-semibold">Episódio {episode} de {totalEpisodes}</p>
        </div>

        {/* Right Actions */}
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

        {/* Footer */}
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
              <button className="text-white" onClick={toggleMute}>
                {isMuted ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.26 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                  </svg>
                )}
              </button>

              <button className="text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* End Message */}
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