import { CreditCard, Transaction } from "@/types/creditCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, CreditCard as CreditCardIcon, DollarSign, Calendar, TrendingUp, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface CardDetailProps {
  card: CreditCard;
  transactions: Transaction[];
  onBack: () => void;
}

export const CardDetail = ({ card, transactions, onBack }: CardDetailProps) => {
  const usedPercentage = (card.currentBalance / card.creditLimit) * 100;
  const isHighUsage = usedPercentage >= 80;
  
  // Calculate interest projection if only minimum payment is made
  const monthlyInterest = (card.currentBalance * (card.interestRate / 100)) / 12;
  const projectedInterest = monthlyInterest * 12;

  // Group transactions by category
  const categorySummary = transactions.reduce((acc, transaction) => {
    if (transaction.type === 'purchase') {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  const sortedCategories = Object.entries(categorySummary)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  const getProgressVariant = () => {
    if (isHighUsage) return "danger";
    if (usedPercentage >= 60) return "warning";
    return "credit";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-background/80 border-b border-border/50">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <Button 
              onClick={onBack}
              variant="ghost" 
              size="icon"
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-lg shadow-subtle"
                style={{ backgroundColor: card.color }}
              >
                <CreditCardIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">{card.bankName}</h1>
                <p className="text-sm text-muted-foreground">•••• {card.lastFourDigits}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Credit usage card */}
        <Card className="p-6 gradient-card border-border/50 shadow-card">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Estado de la tarjeta</h2>
              {isHighUsage && (
                <div className="flex items-center gap-2 px-3 py-1 bg-destructive/10 rounded-full">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  <span className="text-xs text-destructive font-medium">Alto uso</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">
                  {formatCurrency(card.creditLimit)}
                </p>
                <p className="text-xs text-muted-foreground">Límite total</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-destructive">
                  {formatCurrency(card.currentBalance)}
                </p>
                <p className="text-xs text-muted-foreground">Utilizado</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-success">
                  {formatCurrency(card.availableCredit)}
                </p>
                <p className="text-xs text-muted-foreground">Disponible</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-warning">
                  {usedPercentage.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">Uso</p>
              </div>
            </div>

            <Progress 
              value={usedPercentage} 
              variant={getProgressVariant()}
              animated
              className="h-3"
            />
          </div>
        </Card>

        {/* Payment info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 gradient-card border-border/50 shadow-subtle">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground">Información de pago</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pago mínimo</span>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(card.minimumPayment)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fecha de vencimiento</span>
                  <span className="font-semibold text-foreground">
                    {new Date(card.dueDate).toLocaleDateString('es-ES')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tasa de interés</span>
                  <span className="font-semibold text-foreground">
                    {card.interestRate}% anual
                  </span>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 gradient-card border-border/50 shadow-subtle">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-warning/10">
                  <TrendingUp className="h-5 w-5 text-warning" />
                </div>
                <h3 className="font-semibold text-foreground">Proyección de intereses</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">
                    Si solo pagas el mínimo este año:
                  </p>
                  <p className="text-2xl font-bold text-warning">
                    {formatCurrency(projectedInterest)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    en intereses adicionales
                  </p>
                </div>
                <div className="p-3 bg-warning/5 rounded-lg border border-warning/20">
                  <p className="text-xs text-warning-foreground">
                    💡 Paga más del mínimo para reducir significativamente los intereses
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Category spending */}
        <Card className="p-6 gradient-card border-border/50 shadow-subtle">
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Gastos por categoría</h3>
            
            {sortedCategories.length > 0 ? (
              <div className="space-y-3">
                {sortedCategories.map(([category, amount]) => {
                  const percentage = (amount / card.currentBalance) * 100;
                  return (
                    <div key={category} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground capitalize">{category}</span>
                        <span className="font-medium text-foreground">
                          {formatCurrency(amount)} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress value={percentage} variant="default" size="sm" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No hay transacciones registradas</p>
              </div>
            )}
          </div>
        </Card>

        {/* Recent transactions */}
        <Card className="p-6 gradient-card border-border/50 shadow-subtle">
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Movimientos recientes</h3>
            
            {transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.slice(0, 10).map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
                    <div>
                      <p className="font-medium text-foreground">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.date).toLocaleDateString('es-ES')} • {transaction.category}
                      </p>
                    </div>
                    <span className={`font-semibold ${
                      transaction.type === 'payment' ? 'text-success' : 'text-destructive'
                    }`}>
                      {transaction.type === 'payment' ? '+' : '-'}{formatCurrency(Math.abs(transaction.amount))}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No hay movimientos registrados</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};