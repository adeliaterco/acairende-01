import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFunnel } from '@/context/FunnelContext';
import StepLayout from '@/components/funnel/StepLayout';
import PointsBadge from '@/components/funnel/PointsBadge';
import ProgressBar from '@/components/funnel/ProgressBar';
import Confetti from 'react-confetti';
import { Wallet, CreditCard, PiggyBank, Coins } from 'lucide-react';

const investments = [
  { id: 'low', label: 'Até R$50', sublabel: 'Começar pequeno', icon: Coins },
  { id: 'medium', label: 'R$50 - R$100', sublabel: 'Investimento moderado', icon: PiggyBank },
  { id: 'high', label: 'R$100 - R$200', sublabel: 'Investir para crescer', icon: Wallet },
  { id: 'premium', label: 'Acima de R$200', sublabel: 'Negócio sério', icon: CreditCard },
];

const Step8: React.FC = () => {
  const navigate = useNavigate();
  const { addPoints, setSelectedInvestment, completeStep } = useFunnel();
  const [selected, setSelected] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const handleSelect = (investmentId: string) => {
    setSelected(investmentId);
    setSelectedInvestment(investmentId);
    setShowConfetti(true);
    
    setTimeout(() => {
      addPoints(115);
      completeStep(8);
      navigate('/step/9');
    }, 1500);
  };

  return (
    <StepLayout>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          colors={['#00FF00', '#7C3AED', '#FF6B00', '#FFD700']}
        />
      )}
      
      <div className="flex-1 flex flex-col p-6">
        <div className="flex justify-center mb-4 pt-4">
          <PointsBadge />
        </div>
        
        <div className="mb-6 max-w-md mx-auto w-full">
          <ProgressBar percentage={70} />
          <p className="text-funnel-muted text-center text-sm mt-2">70% completo</p>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold text-funnel-text text-center mb-2">
          Quanto você está disposto a investir?
        </h1>
        
        <p className="text-funnel-muted text-center mb-8">
          Para começar seu negócio de açaí
        </p>
        
        <div className="flex-1 flex flex-col justify-center gap-4 max-w-md mx-auto w-full">
          {investments.map((investment) => {
            const Icon = investment.icon;
            return (
              <button
                key={investment.id}
                onClick={() => handleSelect(investment.id)}
                disabled={selected !== null}
                className={`
                  flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300
                  ${selected === investment.id 
                    ? 'border-funnel-success bg-funnel-success/10 scale-105' 
                    : selected 
                      ? 'border-funnel-border bg-funnel-card opacity-50'
                      : 'border-funnel-border bg-funnel-card hover:border-funnel-primary'
                  }
                `}
              >
                <div className={`
                  p-3 rounded-lg
                  ${selected === investment.id ? 'bg-funnel-success/20' : 'bg-funnel-primary/20'}
                `}>
                  <Icon className={`w-6 h-6 ${selected === investment.id ? 'text-funnel-success' : 'text-funnel-primary'}`} />
                </div>
                <div className="text-left">
                  <p className="text-funnel-text font-bold text-lg">{investment.label}</p>
                  <p className="text-funnel-muted text-sm">{investment.sublabel}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </StepLayout>
  );
};

export default Step8;
