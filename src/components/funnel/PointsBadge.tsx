import React, { useEffect, useState } from 'react';
import { useFunnel } from '@/context/FunnelContext';
import { Star } from 'lucide-react';

interface PointsBadgeProps {
  className?: string;
}

const PointsBadge: React.FC<PointsBadgeProps> = ({ className = '' }) => {
  const { points } = useFunnel();
  const [displayPoints, setDisplayPoints] = useState(points);

  useEffect(() => {
    if (displayPoints !== points) {
      const diff = points - displayPoints;
      const step = Math.ceil(diff / 20);
      const interval = setInterval(() => {
        setDisplayPoints(prev => {
          if (prev + step >= points) {
            clearInterval(interval);
            return points;
          }
          return prev + step;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [points, displayPoints]);

  return (
    <div className={`inline-flex items-center gap-2 bg-funnel-card px-4 py-2 rounded-full border border-funnel-border ${className}`}>
      <Star className="w-5 h-5 text-funnel-warning fill-funnel-warning" />
      <span className="text-funnel-text font-bold">Seus pontos: {displayPoints}</span>
    </div>
  );
};

export default PointsBadge;
