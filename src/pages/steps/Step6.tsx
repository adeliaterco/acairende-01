import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFunnel } from '@/context/FunnelContext';
import { Phone, PhoneOff, MessageCircle, Video, Signal, Wifi, Battery } from 'lucide-react';

const Step6: React.FC = () => {
  const navigate = useNavigate();
  const { completeStep } = useFunnel();
  
  const [isAnswered, setIsAnswered] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [vibrationSupported, setVibrationSupported] = useState(false);
  const vibrationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const vibrationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Verificar suporte a vibração e iniciar
  useEffect(() => {
    // Verificar se a API de vibração está disponível
    const hasVibration = !!(navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate);
    setVibrationSupported(hasVibration);

    if (isAnswered || !hasVibration) return;

    // Função para executar vibração
    const triggerVibration = () => {
      const vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
      if (vibrate) {
        // Padrão de vibração realista: 400ms vibra, 200ms pausa, 400ms vibra, 500ms pausa
        vibrate.call(navigator, [400, 200, 400, 500]);
      }
    };

    // Iniciar vibração imediatamente
    triggerVibration();

    // Continuar vibrando a cada 1.5 segundos
    vibrationIntervalRef.current = setInterval(() => {
      triggerVibration();
    }, 1500);

    // Cleanup
    return () => {
      if (vibrationIntervalRef.current) {
        clearInterval(vibrationIntervalRef.current);
      }
      if (vibrationTimeoutRef.current) {
        clearTimeout(vibrationTimeoutRef.current);
      }
      // Parar vibração
      const vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
      if (vibrate) {
        vibrate.call(navigator, 0);
      }
    };
  }, [isAnswered]);

  const handleAnswer = () => {
    // Parar vibração imediatamente
    if (vibrationIntervalRef.current) {
      clearInterval(vibrationIntervalRef.current);
    }
    if (vibrationTimeoutRef.current) {
      clearTimeout(vibrationTimeoutRef.current);
    }

    const vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
    if (vibrate) {
      vibrate.call(navigator, 0);
    }

    setIsAnswered(true);

    // Pequeno delay para transição suave
    setTimeout(() => {
      completeStep(6);
      navigate('/step/7');
    }, 500);
  };

  const handleReject = () => {
    // Não faz nada - botão inativo
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

      {/* Call Screen Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Indicador de Vibração (debug) */}
        {!vibrationSupported && (
          <div className="absolute top-24 bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 px-4 py-2 rounded-lg text-xs font-medium">
            ⚠️ Vibração não suportada neste dispositivo
          </div>
        )}

        {/* Profile Picture com efeito de vibração visual */}
        <div className={`mb-8 ${!isAnswered ? 'animate-vibrate' : ''}`}>
          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center border-4 border-white/20 shadow-2xl">
            <span className="text-7xl">👩‍🍳</span>
          </div>
        </div>

        {/* Caller Info */}
        <div className="text-center mb-12">
          <h2 className="text-white text-3xl font-bold mb-2">@andreia.conf</h2>
          <p className={`text-white/70 text-lg font-medium ${!isAnswered ? 'animate-pulse' : ''}`}>
            {isAnswered ? 'Chamada conectada...' : 'Chamada de áudio...'}
          </p>
        </div>

        {/* Call Actions */}
        <div className="flex items-center justify-center gap-12 mb-12">
          {/* Message Button */}
          <button className="flex flex-col items-center gap-2 hover:scale-110 transition-transform">
            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <span className="text-white/60 text-xs font-medium">Mensagem</span>
          </button>

          {/* Answer Button */}
          <button
            onClick={handleAnswer}
            disabled={isAnswered}
            className={`flex flex-col items-center gap-2 ${!isAnswered ? 'hover:scale-110' : ''} transition-transform`}
          >
            <div className={`w-24 h-24 rounded-full bg-green-500 flex items-center justify-center shadow-2xl ${!isAnswered ? 'animate-pulse-strong' : 'bg-opacity-50'}`}>
              <Phone className="w-12 h-12 text-white" />
            </div>
            <span className="text-green-400 text-sm font-bold">Atender</span>
          </button>

          {/* Reject Button - Visível mas inativo */}
          <button
            onClick={handleReject}
            className="flex flex-col items-center gap-2 hover:scale-110 transition-transform"
          >
            <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-2xl">
              <PhoneOff className="w-7 h-7 text-white" />
            </div>
            <span className="text-red-400 text-xs font-medium">Recusar</span>
          </button>
        </div>

        {/* Video Button */}
        <button className="flex flex-col items-center gap-2 hover:scale-110 transition-transform">
          <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
            <Video className="w-6 h-6 text-white" />
          </div>
          <span className="text-white/60 text-xs font-medium">Vídeo</span>
        </button>
      </div>

      {/* Home Indicator */}
      <div className="flex justify-center pb-2">
        <div className="w-32 h-1 bg-white/30 rounded-full"></div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes vibrate {
          0%, 100% {
            transform: translateX(0);
          }
          10% {
            transform: translateX(-3px);
          }
          20% {
            transform: translateX(3px);
          }
          30% {
            transform: translateX(-3px);
          }
          40% {
            transform: translateX(3px);
          }
          50% {
            transform: translateX(0);
          }
        }

        @keyframes pulse-strong {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.05);
          }
        }

        .animate-vibrate {
          animation: vibrate 0.8s infinite;
        }

        .animate-pulse-strong {
          animation: pulse-strong 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default Step6;