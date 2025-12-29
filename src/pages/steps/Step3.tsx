import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFunnel } from '@/context/FunnelContext';
import StepLayout from '@/components/funnel/StepLayout';
import PointsBadge from '@/components/funnel/PointsBadge';
import { MessageCircle } from 'lucide-react';

const notifications = [
  {
    id: 'whatsapp',
    app: 'WhatsApp',
    color: 'bg-funnel-whatsapp',
    icon: MessageCircle,
    title: 'Confeitaria Andreia',
    message: 'Destravar vendas de açaí agora...',
    time: 'Agora',
    isClickable: true,
  },
  {
    id: 'nubank1',
    app: 'Nubank',
    color: 'bg-funnel-nubank',
    title: 'Transferência recebida',
    message: 'R$ 32,00 de Maria Silva',
    time: '2 min',
    isClickable: false,
  },
  {
    id: 'nubank2',
    app: 'Nubank',
    color: 'bg-funnel-nubank',
    title: 'Transferência recebida',
    message: 'R$ 33,00 de João Santos',
    time: '5 min',
    isClickable: false,
  },
  {
    id: 'nubank3',
    app: 'Nubank',
    color: 'bg-funnel-nubank',
    title: 'Transferência recebida',
    message: 'R$ 32,50 de Ana Paula',
    time: '8 min',
    isClickable: false,
  },
];

const Step3: React.FC = () => {
  const navigate = useNavigate();
  const { addPoints, completeStep } = useFunnel();

  const handleWhatsAppClick = () => {
    addPoints(50);
    completeStep(3);
    navigate('/step/4');
  };

  return (
    <StepLayout>
      <div className="flex-1 flex flex-col p-6">
        <div className="flex justify-center mb-6 pt-4">
          <PointsBadge />
        </div>
        
        <div className="text-center mb-6">
          <p className="text-funnel-muted text-sm">Terça-feira, 14:32</p>
          <h2 className="text-funnel-text text-lg font-medium mt-1">Notificações</h2>
        </div>
        
        <div className="flex-1 flex flex-col gap-3 max-w-md mx-auto w-full">
          {notifications.map((notif, index) => (
            <div
              key={notif.id}
              onClick={notif.isClickable ? handleWhatsAppClick : undefined}
              className={`
                p-4 rounded-xl bg-funnel-card border border-funnel-border
                animate-fade-in
                ${notif.isClickable ? 'cursor-pointer hover:bg-funnel-card/80 transition-colors ring-2 ring-funnel-success/50' : 'opacity-90'}
              `}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${notif.color}`}>
                  {notif.icon ? (
                    <notif.icon className="w-5 h-5 text-white" />
                  ) : (
                    <div className="w-5 h-5 flex items-center justify-center text-white font-bold text-xs">
                      Nu
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-funnel-text font-semibold text-sm">{notif.app}</span>
                    <span className="text-funnel-muted text-xs">{notif.time}</span>
                  </div>
                  <p className="text-funnel-text font-medium text-sm mt-1">{notif.title}</p>
                  <p className="text-funnel-muted text-sm">{notif.message}</p>
                </div>
              </div>
              {notif.isClickable && (
                <div className="mt-3 text-center">
                  <span className="text-funnel-success text-xs font-medium animate-pulse">
                    Toque para abrir
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </StepLayout>
  );
};

export default Step3;
