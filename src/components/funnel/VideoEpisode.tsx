import React, { useRef, useState, useEffect, useCallback } from 'react';

/* =========================
   Tipagem das Propriedades
   ========================= */
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

/* =========================
   Componente Principal
   ========================= */
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
    /* Refs e Estados */
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [videoEnded, setVideoEnded] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState<number>(parseInt(likes, 10));

    /* ============
       Utilidades
       ============ */
    const formatNumber = useCallback((num: number): string => {
        return num >= 1000 ? `${(num / 1000).toFixed(1).replace(/\.0$/, '')}K` : num.toString();
    }, []);

    /* =============
       Handlers
       ============= */
    const handleVideoEnd = () => setVideoEnded(true);

    const handleLike = () => {
        setIsLiked(prev => !prev);
        setLikeCount(prev => (isLiked ? prev - 1 : prev + 1));
    };

    /* =====================
       Autoplay otimizado iOS
       ===================== */
    useEffect(() => {
        const video = videoRef.current;
        if (!video || isLocked) return;

        const playVideo = async () => {
            try {
                video.load();          // iOS exige load() explícito
                video.muted = true;    // precisa iniciar mudo
                await video.play();
                setTimeout(() => (video.muted = false), 100); // desmuta após iniciar
            } catch (err) {
                console.warn('Autoplay bloqueado:', err);
            }
        };

        playVideo();
    }, [episode, isLocked]);

    /* ==================
       Limpa buffer iOS
       ================== */
    useEffect(() => {
        return () => {
            const video = videoRef.current;
            if (video) {
                video.pause();
                video.src = '';
                video.load(); // libera conexões/buffer
            }
        };
    }, [episode]);

    /* ================
       Loading Spinner
       ================ */
    const handleCanPlay = () => setIsLoading(false);

    /* ================
       Navegação Swipe
       ================ */
    const handleSwipeUp = useCallback(
        (startY: number, endY: number) => {
            if (startY - endY > 50 && videoEnded && !isLocked) onNext();
        },
        [videoEnded, isLocked, onNext],
    );

    useEffect(() => {
        let touchStartY = 0;
        const handleTouchStart = (e: TouchEvent) => (touchStartY = e.touches[0].clientY);
        const handleTouchEnd = (e: TouchEvent) => handleSwipeUp(touchStartY, e.changedTouches[0].clientY);

        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });
        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, [handleSwipeUp]);

    /* ===============
       Renderização
       =============== */
    return (
        <div className="relative w-full max-w-[400px] aspect-[9/16] bg-black rounded-2xl overflow-hidden">
            {/* Vídeo */}
            {!isLocked && (
                <video
                    key={`ep-${episode}`}    // força novo nó DOM a cada episódio
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

            {/* Spinner */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
                    <div className="animate-spin h-10 w-10 border-4 border-white border-b-transparent rounded-full" />
                </div>
            )}

            {/* Overlay Informações */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-10">
                <p className="text-white text-sm font-semibold mb-1">
                    Episódio {episode} de {totalEpisodes}
                </p>
                <p className="text-white text-lg font-bold mb-1">{title}</p>
                {extraText && <p className="text-white text-xs mb-2">{extraText}</p>}

                {/* Ações */}
                <div className="flex items-center gap-4">
                    <button onClick={handleLike} className="text-white">
                        {isLiked ? '💖' : '🤍'} {formatNumber(likeCount)}
                    </button>
                    <span className="text-white text-xs">{comments}</span>
                    {videoEnded && !isLocked && (
                        <button onClick={onNext} className="ml-auto bg-white/20 px-3 py-1 rounded-full text-white text-xs">
                            {buttonText}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VideoEpisode;