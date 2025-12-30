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
  /* refs e estados */
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState<number>(parseInt(likes, 10));
  const [showEndMessage, setShowEndMessage] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [key, setKey] = useState(0);           // força remount

  /* ===== util ===== */
  const kFormatter = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K` : `${n}`;

  /* ===== handlers ===== */
  const handleLike = () => {
    setIsLiked(p => !p);
    setLikeCount(p => (isLiked ? p - 1 : p + 1));
  };

  const handleCanPlay = () => setIsLoading(false);
  const handleVideoEnd = () => {
    setVideoEnded(true);
    setShowEndMessage(true);
  };

  const goNext = () => {
    if (videoEnded && !isLocked) onNext();
  };

  /* ===== swipe up / wheel ===== */
  useEffect(() => {
    /* desktop */
    const wheel = (e: WheelEvent) => e.deltaY > 30 && goNext();
    /* mobile */
    let touchY = 0;
    const tStart = (e: TouchEvent) => (touchY = e.touches[0].clientY);
    const tEnd = (e: TouchEvent) =>
      touchY - e.changedTouches[0].clientY > 50 && goNext();

    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', wheel, { passive: true });
    el.addEventListener('touchstart', tStart, { passive: true });
    el.addEventListener('touchend', tEnd, { passive: true });
    return () => {
      el.removeEventListener('wheel', wheel);
      el.removeEventListener('touchstart', tStart);
      el.removeEventListener('touchend', tEnd);
    };
  }, [goNext]);

  /* ===== reset a cada episódio ===== */
  useEffect(() => {
    setIsLoading(true);
    setVideoEnded(false);
    setShowEndMessage(false);
    setKey(k => k + 1);
  }, [episode, videoUrl]);

  /* ===== autoplay iOS seguro ===== */
  useEffect(() => {
    const v = videoRef.current;
    if (!v || isLocked) return;

    const tryPlay = async () => {
      try {
        v.load();          // assegura novo buffer
        v.muted = true;
        await v.play();
        setTimeout(() => (v.muted = false), 150);
      } catch {
        /* fallback após 1 s */
        setTimeout(async () => {
          try {
            v.muted = true;
            await v.play();
            setTimeout(() => (v.muted = false), 150);
          } catch (err) {
            console.warn('Autoplay bloqueado:', err);
          }
        }, 1000);
      }
    };
    tryPlay();
  }, [key, isLocked]);

  /* ===== libera buffer ao desmontar ===== */
  useEffect(() => {
    return () => {
      const v = videoRef.current;
      if (v) {
        v.pause();
        v.src = '';
        v.load();
      }
    };
  }, [episode]);

  /* ===== render ===== */
  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden"
    >
      <div className="w-full max-w-[400px] aspect-[9/16] bg-black rounded-3xl relative overflow-hidden border-2 border-gray-800 shadow-2xl">
        {/* vídeo */}
        {!isLocked && (
          <video
            key={`ep-${key}`}
            ref={videoRef}
            src={videoUrl}
            className="absolute inset-0 w-full h-full object-cover"
            playsInline
            autoPlay
            muted
            preload="metadata"
            onEnded={handleVideoEnd}
            onCanPlay={handleCanPlay}
          />
        )}

        {/* overlay dark */}
        <div className="absolute inset-0 bg-black/10" />

        {/* loading spinner */}
        {isLoading && !isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-40">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
          </div>
        )}

        {/* header estilo TikTok */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/60 to-transparent">
          <span className="text-white font-medium text-sm">Seguindo</span>
          <span className="text-white font-bold border-b-2 border-white text-sm">Para Você</span>
          <span className="text-white text-lg">🔍</span>
        </div>

        {/* episódio / contador */}
        <div className="absolute top-20 left-4 z-10 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
          <p className="text-white text-xs font-semibold">Episódio {episode} de {totalEpisodes}</p>
        </div>

        {/* ações laterais */}
        <div className="absolute right-4 bottom-32 flex flex-col gap-6 z-20">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-white flex items-center justify-center">
            <span className="text-lg">👩‍🍳</span>
          </div>

          <div className="flex flex-col items-center" onClick={handleLike}>
            <Heart className={`w-8 h-8 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
            <span className="text-white text-xs mt-1 font-semibold">{kFormatter(likeCount)}</span>
          </div>

          <div className="flex flex-col items-center">
            <MessageCircle className="w-8 h-8 text-white" />
            <span className="text-white text-xs mt-1 font-semibold">{comments}</span>
          </div>

          <div className="flex flex-col items-center">
            <Share2 className="w-8 h-8 text-white" />
            <span className="text-white text-xs mt-1 font-semibold">Compartilhar</span>
          </div>

          <div className="flex flex-col items-center">
            <Bookmark className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* footer estilo TikTok */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent z-20">
          <div className="p-4 pt-6">
            <p className="text-white font-bold text-sm mb-2">@andreia.conf</p>
            <p className="text-white text-xs mb-4 leading-relaxed line-clamp-2">
              {title} 🍇💰 #empreendedorismo #acai
            </p>

            <div className="flex items-center gap-2 mb-4">
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
              <button
                className="text-white"
                onClick={() => {
                  if (videoRef.current) videoRef.current.muted = !videoRef.current.muted;
                }}
              >
                🔈
              </button>
              <button className="text-white">⋯</button>
            </div>
          </div>
        </div>

        {/* mensagem final + swipe hint */}
        {showEndMessage && !isLocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-30 bg-black/40 backdrop-blur-sm">
            <p className="text-white text-2xl font-bold mb-2">✨</p>
            <p className="text-white text-xl font-bold mb-6">Vídeo finalizado!</p>
            <p className="text-white text-lg font-semibold animate-bounce">⬆️ Arrasta pra cima para continuar</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoEpisode;