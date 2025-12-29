import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFunnel } from '@/context/FunnelContext';
import StepLayout from '@/components/funnel/StepLayout';
import CTAButton from '@/components/funnel/CTAButton';
import { Lock, Check, AlertTriangle } from 'lucide-react';

const benefits = [
  'Precificar corretamente seu açaí',
  'Comprar materiais com desconto',
  'Usar IA e Robô para vender mais',
  'Conseguir clientes por menos de R$1',
  'Acessar TODAS as receitas premium',
];

const Step17: React.FC = () => {
  const navigate = useNavigate();
  const { completeStep } = useFunnel();

  const handleCheckout = () => {
    completeStep(17);
    navigate('/checkout');
  };

  return (
    <StepLayout showBack={false}>
      {/* Background - Step 16 blurred */}
      <div className="absolute inset-0 bg-funnel-bg">
        <div className="w-full h-full bg-gradient-to-b from-funnel-warning/10 to-funnel-bg blur-sm" />
      </div>

      {/* Modal overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-10">
        <div className="bg-funnel-card border-2 border-funnel-danger/50 rounded-2xl p-6 max-w-sm w-full animate-fade-in">
          {/* Lock icon */}
          <div className="text-center mb-4">
            <Lock className="w-16 h-16 text-funnel-danger mx-auto" />
          </div>

          {/* Warning */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-funnel-warning" />
            <span className="text-funnel-warning font-bold">ATENÇÃO</span>
          </div>

          {/* Title */}
          <h2 className="text-funnel-text text-xl font-bold text-center mb-4">
            Liberar acesso completo
          </h2>

          {/* Description */}
          <p className="text-funnel-muted text-center text-sm mb-6">
            Aprenda tudo que você precisa para vender açaí na garrafa:
          </p>

          {/* Benefits list */}
          <div className="space-y-3 mb-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <Check className="w-5 h-5 text-funnel-success flex-shrink-0" />
                <span className="text-funnel-text text-sm">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <CTAButton onClick={handleCheckout} variant="danger" className="w-full text-lg py-5" pulse>
            🔥 Garantir Acesso Completo
          </CTAButton>

          <p className="text-funnel-muted text-xs text-center mt-4">
            Oferta por tempo limitado
          </p>
        </div>
      </div>
    </StepLayout>
  );
};

export default Step17;
