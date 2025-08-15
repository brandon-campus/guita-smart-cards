import { useState } from "react";
import { CreditCard } from "@/types/creditCard";
import { CreditCardCard } from "./CreditCardCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Wallet, TrendingUp, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface DashboardProps {
  cards: CreditCard[];
  onCardClick: (card: CreditCard) => void;
  onAddCard: () => void;
  onScanStatement: (card: CreditCard) => void;
}

export const Dashboard = ({ cards, onCardClick, onAddCard, onScanStatement }: DashboardProps) => {
  const totalCreditLimit = cards.reduce((sum, card) => sum + card.creditLimit, 0);
  const totalUsed = cards.reduce((sum, card) => sum + card.currentBalance, 0);
  const totalAvailable = cards.reduce((sum, card) => sum + card.availableCredit, 0);
  const highUsageCards = cards.filter(card => (card.currentBalance / card.creditLimit) >= 0.8).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-10" />
        <div className="relative p-6 pb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                ¡Hola! 👋
              </h1>
              <p className="text-muted-foreground">
                Mantén el control de tus tarjetas de crédito
              </p>
            </div>
            <Button 
              onClick={onAddCard}
              variant="gradient"
              size="lg"
              className="shadow-glow"
            >
              <Plus className="h-5 w-5" />
              Agregar tarjeta
            </Button>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card className="p-6 gradient-card border-border/50 shadow-subtle">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Crédito total</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatCurrency(totalCreditLimit)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 gradient-card border-border/50 shadow-subtle">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-success/10">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Disponible</p>
                  <p className="text-2xl font-bold text-success">
                    {formatCurrency(totalAvailable)}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 gradient-card border-border/50 shadow-subtle">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-destructive/10">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Usado</p>
                  <p className="text-2xl font-bold text-destructive">
                    {formatCurrency(totalUsed)}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Alerts */}
          {highUsageCards > 0 && (
            <Card className="p-4 mb-6 bg-warning/5 border-warning/20">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-warning" />
                <div>
                  <p className="text-sm font-medium text-warning-foreground">
                    Atención: {highUsageCards} tarjeta{highUsageCards > 1 ? 's' : ''} con alto uso
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Considera hacer un pago para evitar intereses
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Cards grid */}
      <div className="p-6 pt-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-foreground">
            Mis tarjetas ({cards.length})
          </h2>
        </div>

        {cards.length === 0 ? (
          <Card className="p-12 text-center gradient-card border-border/50 shadow-subtle">
            <div className="max-w-sm mx-auto">
              <div className="p-4 rounded-2xl bg-primary/10 inline-block mb-4">
                <Plus className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Agrega tu primera tarjeta
              </h3>
              <p className="text-muted-foreground mb-6">
                Comienza a gestionar tus tarjetas de crédito de manera inteligente
              </p>
              <Button 
                onClick={onAddCard}
                variant="gradient"
                size="lg"
              >
                <Plus className="h-5 w-5" />
                Agregar tarjeta
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card) => (
              <div key={card.id} className="animate-fade-in">
                <CreditCardCard 
                  card={card} 
                  onClick={() => onCardClick(card)}
                  onScanStatement={() => onScanStatement(card)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};