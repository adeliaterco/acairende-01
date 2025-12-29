import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFunnel } from '@/context/FunnelContext';
import StepLayout from '@/components/funnel/StepLayout';
import PointsBadge from '@/components/funnel/PointsBadge';
import { Target, TrendingUp, Rocket, Crown } from 'lucide-react';

const goals = [
  { id: 'extra', label: 'R$500-1.000/mês', sublabel: 'Renda extra', icon: Target },
  { id: 'salary', label: 'R$2.000-3.000/mês', sublabel: 'Substituir salário', icon: TrendingUp },
  { id: 'business', label: 'R$5.000-10.000/mês', sublabel: 'Negócio próprio', icon: Rocket },
  { id: 'empire', label: '+R$10.000/mês', sublabel: 'Império do açaí', icon: Crown },
];

const Step2: React.FC = () => {
  const navigate = useNavigate();
  const { addPoints, setSelectedGoal, completeStep } = useFunnel();
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (goalId: string) => {
    setSelected(goalId);
    setSelectedGoal(goalId);
    
    setTimeout(() => {
      addPoints(50);
      completeStep(2);
      navigate('/step/3');
    }, 300);
  };

  return (
    <StepLayout>
      <div className="flex-1 flex flex-col p-6">
        <div className="flex justify-center mb-8 pt-4">
          <PointsBadge />
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold text-funnel-text text-center mb-2">
          Quanto você quer ganhar com açaí?
        </h1>
        
        <p className="text-funnel-muted text-center mb-8">
          Escolha sua meta mensal
        </p>
        
        <div className="flex-1 flex flex-col justify-center gap-4 max-w-md mx-auto w-full">
          {goals.map((goal) => {
            const Icon = goal.icon;
            return (
              <button
                key={goal.id}
                onClick={() => handleSelect(goal.id)}
                className={`
                  flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-300
                  ${selected === goal.id 
                    ? 'border-funnel-success bg-funnel-success/10' 
                    : 'border-funnel-border bg-funnel-card hover:border-funnel-primary'
                  }
                `}
              >
                <div className={`
                  p-3 rounded-lg
                  ${selected === goal.id ? 'bg-funnel-success/20' : 'bg-funnel-primary/20'}
                `}>
                  <Icon className={`w-6 h-6 ${selected === goal.id ? 'text-funnel-success' : 'text-funnel-primary'}`} />
                </div>
                <div className="text-left">
                  <p className="text-funnel-text font-bold text-lg">{goal.label}</p>
                  <p className="text-funnel-muted text-sm">{goal.sublabel}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </StepLayout>
  );
};

export default Step2;
