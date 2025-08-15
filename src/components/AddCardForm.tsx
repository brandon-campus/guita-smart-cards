import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, CreditCard as CreditCardIcon } from "lucide-react";
import { CreditCard } from "@/types/creditCard";

interface AddCardFormProps {
  onBack: () => void;
  onAddCard: (card: Omit<CreditCard, 'id'>) => void;
}

const cardColors = [
  "#8B5CF6", // Purple
  "#06B6D4", // Cyan
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5A2B", // Brown
  "#6B7280", // Gray
  "#EC4899", // Pink
];

const bankOptions = [
  "Banco Santander",
  "BBVA",
  "Banco Nación",
  "Banco Galicia",
  "Banco Macro",
  "Banco Provincia",
  "HSBC",
  "Banco Patagonia",
  "Banco Supervielle",
  "Banco Comafi",
  "Otro"
];

export const AddCardForm = ({ onBack, onAddCard }: AddCardFormProps) => {
  const [formData, setFormData] = useState({
    bankName: "",
    lastFourDigits: "",
    cardType: "visa" as const,
    creditLimit: "",
    currentBalance: "",
    minimumPayment: "",
    dueDate: "",
    interestRate: "",
    color: cardColors[0]
  });

  const [customBank, setCustomBank] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const creditLimit = parseFloat(formData.creditLimit);
    const currentBalance = parseFloat(formData.currentBalance) || 0;
    const availableCredit = creditLimit - currentBalance;
    
    const newCard: Omit<CreditCard, 'id'> = {
      bankName: formData.bankName === "Otro" ? customBank : formData.bankName,
      lastFourDigits: formData.lastFourDigits,
      cardType: formData.cardType,
      creditLimit,
      currentBalance,
      availableCredit,
      minimumPayment: parseFloat(formData.minimumPayment) || creditLimit * 0.05,
      dueDate: formData.dueDate,
      lastStatement: currentBalance,
      interestRate: parseFloat(formData.interestRate) || 18,
      color: formData.color
    };

    onAddCard(newCard);
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
            <h1 className="text-xl font-semibold text-foreground">Agregar nueva tarjeta</h1>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-md mx-auto space-y-6">
          {/* Preview card */}
          <Card className="p-6 gradient-card border-border/50 shadow-card">
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-lg shadow-subtle transition-smooth"
                style={{ backgroundColor: formData.color }}
              >
                <CreditCardIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">
                  {formData.bankName || "Nombre del banco"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  •••• {formData.lastFourDigits || "0000"}
                </p>
              </div>
            </div>
          </Card>

          {/* Form */}
          <Card className="p-6 gradient-card border-border/50 shadow-subtle">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bank">Banco</Label>
                <Select 
                  value={formData.bankName} 
                  onValueChange={(value) => setFormData({...formData, bankName: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar banco" />
                  </SelectTrigger>
                  <SelectContent>
                    {bankOptions.map((bank) => (
                      <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {formData.bankName === "Otro" && (
                  <Input
                    placeholder="Nombre del banco"
                    value={customBank}
                    onChange={(e) => setCustomBank(e.target.value)}
                    required
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lastFour">Últimos 4 dígitos</Label>
                  <Input
                    id="lastFour"
                    placeholder="0000"
                    maxLength={4}
                    value={formData.lastFourDigits}
                    onChange={(e) => setFormData({...formData, lastFourDigits: e.target.value.replace(/\D/g, '')})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cardType">Tipo</Label>
                  <Select 
                    value={formData.cardType} 
                    onValueChange={(value: any) => setFormData({...formData, cardType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visa">Visa</SelectItem>
                      <SelectItem value="mastercard">Mastercard</SelectItem>
                      <SelectItem value="amex">American Express</SelectItem>
                      <SelectItem value="other">Otra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="creditLimit">Límite de crédito</Label>
                  <Input
                    id="creditLimit"
                    type="number"
                    placeholder="100000"
                    value={formData.creditLimit}
                    onChange={(e) => setFormData({...formData, creditLimit: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentBalance">Saldo actual</Label>
                  <Input
                    id="currentBalance"
                    type="number"
                    placeholder="0"
                    value={formData.currentBalance}
                    onChange={(e) => setFormData({...formData, currentBalance: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Fecha de vencimiento</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interestRate">Tasa de interés (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.1"
                    placeholder="18.0"
                    value={formData.interestRate}
                    onChange={(e) => setFormData({...formData, interestRate: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Color de la tarjeta</Label>
                <div className="flex flex-wrap gap-2">
                  {cardColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 transition-smooth ${
                        formData.color === color ? 'border-primary scale-110' : 'border-border'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData({...formData, color})}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  variant="gradient" 
                  size="lg" 
                  className="w-full"
                  disabled={!formData.bankName || !formData.lastFourDigits || !formData.creditLimit || !formData.dueDate}
                >
                  Agregar tarjeta
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};