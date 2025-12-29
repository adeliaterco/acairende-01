import React from 'react';
import { Heart, MessageCircle, Share2, Lock } from 'lucide-react';

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
}) => {
  return (
    <div className="min-h-screen bg-funnel-bg flex items-center justify-center p-4">
      <div className="w-full max-w-[400px] aspect-[9/16] bg-gradient-to-b from-funnel-card to-funnel-bg rounded-2xl relative overflow-hidden border border-funnel-border">
        {/* Episode badge */}
        <div className="absolute top-4 left-4 bg-funnel-primary/90 px-3 py-1 rounded-full">
          <span className="text-white font-bold text-sm">EP.{episode}/{totalEpisodes}</span>
        </div>

        {/* Video placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            {isLocked ? (
              <Lock className="w-20 h-20 text-funnel-warning mx-auto mb-4" />
            ) : (
              <div className="w-32 h-32 bg-funnel-primary/20 rounded-full flex items-center justify-center mb-4">
                <div className="w-0 h-0 border-t-[20px] border-t-transparent border-l-[35px] border-l-funnel-primary border-b-[20px] border-b-transparent ml-2" />
              </div>
            )}
            <h3 className="text-funnel-text text-xl font-bold">{title}</h3>
            {extraText && (
              <p className="text-funnel-success text-lg font-semibold mt-2">{extraText}</p>
            )}
          </div>
        </div>

        {/* Right side actions */}
        <div className="absolute right-4 bottom-32 flex flex-col gap-6">
          <div className="flex flex-col items-center">
            <Heart className="w-8 h-8 text-funnel-text" />
            <span className="text-funnel-text text-xs mt-1">{likes}</span>
          </div>
          <div className="flex flex-col items-center">
            <MessageCircle className="w-8 h-8 text-funnel-text" />
            <span className="text-funnel-text text-xs mt-1">{comments}</span>
          </div>
          <div className="flex flex-col items-center">
            <Share2 className="w-8 h-8 text-funnel-text" />
            <span className="text-funnel-text text-xs mt-1">Share</span>
          </div>
        </div>

        {/* Bottom section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <button
            onClick={onNext}
            className="w-full bg-funnel-success hover:bg-funnel-success/90 text-black font-bold py-4 rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoEpisode;
