import React, { useRef, useEffect, useState } from 'react';
import { Heart, MessageCircle, Share2, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoEpisodeProps {
  episode: number;
  totalEpisodes: number;
  title: string;
  likes: string;
  comments: string;
  videoUrl: string;
  onNext: () => void;
  buttonText?: string;
}

const VideoEpisode: React.FC<VideoEpisodeProps> = ({
  episode,
  totalEpisodes,
  title,
  likes,
  comments,
  videoUrl,
  onNext,
  buttonText = 'Próximo episódio',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log('Autoplay prevented:', error);
      });
    }
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="relative w-full max-w-md aspect-[9/16] bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
        {/* Video */}
        <video
          ref={videoRef}
          src={videoUrl}
          className="absolute inset-0 w-full h-full object-cover"
          loop
          playsInline
          muted={isMuted}
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

        {/* Episode counter */}
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-white text-sm font-medium">
            Episódio {episode}/{totalEpisodes}
          </span>
        </div>

        {/* Mute button */}
        <button
          onClick={toggleMute}
          className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm p-2 rounded-full hover:bg-black/70 transition-colors"
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5 text-white" />
          ) : (
            <Volume2 className="w-5 h-5 text-white" />
          )}
        </button>

        {/* Right sidebar - TikTok style */}
        <div className="absolute right-4 bottom-24 flex flex-col gap-6">
          <div className="flex flex-col items-center gap-1">
            <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
              <Heart className="w-6 h-6 text-white" />
            </button>
            <span className="text-white text-xs font-semibold">{likes}</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
              <MessageCircle className="w-6 h-6 text-white" />
            </button>
            <span className="text-white text-xs font-semibold">{comments}</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
              <Share2 className="w-6 h-6 text-white" />
            </button>
            <span className="text-white text-xs font-semibold">Compartilhar</span>
          </div>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-4">
          <div className="space-y-2">
            <h3 className="text-white text-lg font-bold">{title}</h3>
            <p className="text-white/80 text-sm">
              🔥 Essa combinação é irresistível! Qual você prefere?
            </p>
          </div>

          <Button
            onClick={onNext}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-6 rounded-xl shadow-lg"
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoEpisode;