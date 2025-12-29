import React, { useState } from 'react';
import { useFunnel } from '@/context/FunnelContext';
import StepLayout from '@/components/funnel/StepLayout';
import CTAButton from '@/components/funnel/CTAButton';
import { Check, Gift, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const benefits = [
  '30+ receitas premium de açaí',
  'Robô de vendas automático',
  'Guia de precificação',
  'Lista de fornecedores',
  'Suporte por WhatsApp',
];

const Checkout: React.FC = () => {
  const { resetFunnel } = useFunnel();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Preencha todos os campos!');
      return;
    }

    toast.success('Compra realizada com sucesso! 🎉');
    
    // Reset after showing success
    setTimeout(() => {
      resetFunnel();
    }, 2000);
  };

  return (
    <StepLayout showBack={false}>
      <div className="flex-1 flex flex-col items-center p-6 overflow-y-auto">
        <div className="max-w-md w-full">
          {/* Header */}
          <div className="text-center mb-8">
            <Gift className="w-16 h-16 text-funnel-success mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-funnel-text mb-2">
              Parabéns! 🎉
            </h1>
            <p className="text-funnel-muted">
              Você está a um passo de transformar sua vida!
            </p>
          </div>

          {/* Benefits */}
          <div className="bg-funnel-card border border-funnel-border rounded-xl p-5 mb-6">
            <h2 className="text-funnel-text font-bold text-lg mb-4">
              O que você vai receber:
            </h2>
            <div className="space-y-3">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-funnel-success/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-funnel-success" />
                  </div>
                  <span className="text-funnel-text">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="bg-gradient-to-r from-funnel-primary/20 to-funnel-success/20 border border-funnel-success/30 rounded-xl p-5 mb-6 text-center">
            <p className="text-funnel-muted text-sm line-through mb-1">De R$297,00</p>
            <p className="text-funnel-success text-4xl font-bold">R$47,00</p>
            <p className="text-funnel-muted text-sm mt-1">Pagamento único</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div>
              <label className="block text-funnel-text text-sm font-medium mb-2">
                Nome completo
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-funnel-card border border-funnel-border rounded-xl px-4 py-3 text-funnel-text placeholder:text-funnel-muted focus:outline-none focus:border-funnel-success transition-colors"
                placeholder="Digite seu nome"
              />
            </div>

            <div>
              <label className="block text-funnel-text text-sm font-medium mb-2">
                E-mail
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-funnel-card border border-funnel-border rounded-xl px-4 py-3 text-funnel-text placeholder:text-funnel-muted focus:outline-none focus:border-funnel-success transition-colors"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-funnel-text text-sm font-medium mb-2">
                WhatsApp
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-funnel-card border border-funnel-border rounded-xl px-4 py-3 text-funnel-text placeholder:text-funnel-muted focus:outline-none focus:border-funnel-success transition-colors"
                placeholder="(11) 99999-9999"
              />
            </div>

            <CTAButton onClick={() => {}} variant="success" className="w-full text-xl py-5" pulse>
              Finalizar Compra <ArrowRight className="w-6 h-6 inline ml-2" />
            </CTAButton>
          </form>

          {/* Security badges */}
          <div className="text-center">
            <p className="text-funnel-muted text-xs">
              🔒 Pagamento 100% seguro | Acesso imediato
            </p>
          </div>
        </div>
      </div>
    </StepLayout>
  );
};

export default Checkout;
