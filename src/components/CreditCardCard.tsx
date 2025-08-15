import { CreditCard } from "@/types/creditCard";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CreditCard as CreditCardIcon, Eye, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface CreditCardCardProps {
  card: CreditCard;
  onClick: () => void;
}

export const CreditCardCard = ({ card, onClick }: CreditCardCardProps) => {
  const usedPercentage = (card.currentBalance / card.creditLimit) * 100;
  const isHighUsage = usedPercentage >= 80;
  const isMediumUsage = usedPercentage >= 60;

  const getProgressVariant = () => {
    if (isHighUsage) return "danger";
    if (isMediumUsage) return "warning";
    return "credit";
  };

  return (
    <Card 
      className="relative overflow-hidden p-6 gradient-card border-border/50 shadow-card hover:shadow-glow transition-spring cursor-pointer group"
      onClick={onClick}
    >
      {/* Background gradient overlay */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{ background: card.color }}
      />
      
      {/* Alert indicator for high usage */}
      {isHighUsage && (
        <div className="absolute top-4 right-4">
          <AlertTriangle className="h-5 w-5 text-destructive animate-pulse" />
        </div>
      )}

      <div className="relative space-y-4">
        {/* Card header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-lg shadow-subtle"
              style={{ backgroundColor: card.color }}
            >
              <CreditCardIcon className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground">{card.bankName}</h3>
              <p className="text-sm text-muted-foreground">•••• {card.lastFourDigits}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-smooth">
            <Eye className="h-4 w-4" />
          </Button>
        </div>

        {/* Usage progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Crédito utilizado</span>
            <span className={`font-medium ${isHighUsage ? 'text-destructive' : 'text-card-foreground'}`}>
              {usedPercentage.toFixed(1)}%
            </span>
          </div>
          <Progress 
            value={usedPercentage} 
            variant={getProgressVariant()}
            animated
            className="h-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatCurrency(card.currentBalance)}</span>
            <span>{formatCurrency(card.creditLimit)}</span>
          </div>
        </div>

        {/* Available credit */}
        <div className="pt-2 border-t border-border/50">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Crédito disponible</span>
            <span className="text-lg font-semibold text-success">
              {formatCurrency(card.availableCredit)}
            </span>
          </div>
        </div>

        {/* Due date warning */}
        {new Date(card.dueDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && (
          <div className="flex items-center gap-2 p-2 bg-warning/10 rounded-lg border border-warning/20">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <span className="text-xs text-warning-foreground">
              Vencimiento próximo: {new Date(card.dueDate).toLocaleDateString('es-ES')}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};