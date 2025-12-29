import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFunnel } from '@/context/FunnelContext';
import { MessageCircle, Wifi, Battery, Signal } from 'lucide-react';

const notifications = [
  {
    id: 'nubank1',
    app: 'Nubank',
    color: 'bg-[#820AD1]',
    title: 'Transferência recebida',
    message: 'R$ 32,00 de Maria Silva',
    time: '2 min',
    isClickable: false,
  },
  {
    id: 'nubank2',
    app: 'Nubank',
    color: 'bg-[#820AD1]',
    title: 'Transferência recebida',
    message: 'R$ 33,00 de João Santos',
    time: '5 min',
    isClickable: false,
  },
  {
    id: 'nubank3',
    app: 'Nubank',
    color: 'bg-[#820AD1]',
    title: 'Transferência recebida',
    message: 'R$ 32,50 de Ana Paula',
    time: '8 min',
    isClickable: false,
  },
  {
    id: 'nubank4',
    app: 'Nubank',
    color: 'bg-[#820AD1]',
    title: 'Transferência recebida',
    message: 'R$ 34,50 de Carlos Mendes',
    time: '11 min',
    isClickable: false,
  },
  {
    id: 'nubank5',
    app: 'Nubank',
    color: 'bg-[#820AD1]',
    title: 'Transferência recebida',
    message: 'R$ 31,80 de Fernanda Costa',
    time: '14 min',
    isClickable: false,
  },
  {
    id: 'nubank6',
    app: 'Nubank',
    color: 'bg-[#820AD1]',
    title: 'Transferência recebida',
    message: 'R$ 33,20 de Roberto Lima',
    time: '17 min',
    isClickable: false,
  },
  {
    id: 'whatsapp',
    app: 'WhatsApp',
    color: 'bg-[#25D366]',
    icon: MessageCircle,
    title: 'Confeitaria Andreia',
    message: 'Destravar vendas de açaí agora...',
    time: 'Agora',
    isClickable: true,
  },
];

const Step3: React.FC = () => {
  const navigate = useNavigate();
  const { addPoints, completeStep } = useFunnel();
  
  const [visibleCount, setVisibleCount] = useState(0);
  const [currentTime, setCurrentTime] = useState('');
  
  const notificationSound = 'https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3';

  // Atualizar hora em tempo real
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Animação sequencial das notificações
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    notifications.forEach((_, index) => {
      const timeout = setTimeout(() => {
        setVisibleCount(prev => prev + 1);
        
        const audio = new Audio(notificationSound);
        audio.volume = 0.5;
        audio.play().catch(err => console.error('Erro ao tocar som:', err));
      }, index * 800);
      
      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  const handleWhatsAppClick = () => {
    addPoints(50);
    completeStep(3);
    navigate('/step/4');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black flex flex-col overflow-hidden">
      {/* Status Bar - Estilo iOS */}
      <div className="relative z-50 bg-black/40 backdrop-blur-xl">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl"></div>
        
        {/* Status Bar Content */}
        <div className="flex items-center justify-between px-6 pt-3 pb-2 text-white text-sm font-medium">
          <div className="flex items-center gap-1">
            <span className="font-semibold">{currentTime}</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <Signal className="w-4 h-4" />
            <Wifi className="w-4 h-4" />
            <Battery className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Lock Screen Content */}
      <div className="flex-1 flex flex-col px-4 pt-12 pb-8 overflow-y-auto">
        {/* Data e Hora Central */}
        <div className="text-center mb-8">
          <h1 className="text-white text-7xl font-light tracking-tight mb-1">
            {currentTime}
          </h1>
          <p className="text-white/70 text-lg font-medium">
            Terça-feira, 28 de Janeiro
          </p>
        </div>

        {/* Notificações */}
        <div className="flex flex-col gap-2 max-w-md mx-auto w-full">
          {visibleCount > 0 && (
            <div className="mb-3">
              <h2 className="text-white/60 text-xs font-semibold uppercase tracking-wider px-4">
                Notificações
              </h2>
            </div>
          )}

          {notifications.slice(0, visibleCount).map((notif, index) => (
            <div
              key={notif.id}
              onClick={notif.isClickable ? handleWhatsAppClick : undefined}
              className={`
                bg-white/10 backdrop-blur-2xl rounded-2xl p-4
                border border-white/20 shadow-2xl
                transform transition-all duration-300
                ${notif.isClickable ? 'cursor-pointer hover:bg-white/15 hover:scale-[1.02] ring-2 ring-green-400/50' : ''}
              `}
              style={{
                animation: 'slideDown 0.4s ease-out',
              }}
            >
              <div className="flex items-start gap-3">
                {/* App Icon */}
                <div className={`${notif.color} rounded-xl p-2.5 shadow-lg flex-shrink-0`}>
                  {notif.icon ? (
                    <notif.icon className="w-6 h-6 text-white" />
                  ) : (
                    <div className="w-6 h-6 flex items-center justify-center text-white font-bold text-sm">
                      Nu
                    </div>
                  )}
                </div>

                {/* Notification Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-semibold text-sm">
                      {notif.app}
                    </span>
                    <span className="text-white/50 text-xs font-medium">
                      {notif.time}
                    </span>
                  </div>
                  <p className="text-white text-sm font-medium mb-0.5">
                    {notif.title}
                  </p>
                  <p className="text-white/70 text-sm">
                    {notif.message}
                  </p>
                </div>
              </div>

              {notif.isClickable && (
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="text-center">
                    <span className="text-green-400 text-sm font-semibold animate-pulse">
                      Toque para abrir →
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Dica de deslizar (aparece após todas as notificações) */}
        {visibleCount >= notifications.length && (
          <div className="mt-8 text-center animate-bounce">
            <p className="text-white/40 text-xs font-medium">
              Deslize para cima para desbloquear
            </p>
          </div>
        )}
      </div>

      {/* Home Indicator - Barra inferior do iPhone */}
      <div className="flex justify-center pb-2">
        <div className="w-32 h-1 bg-white/30 rounded-full"></div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Step3;