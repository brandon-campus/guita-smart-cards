export interface CreditCard {
  id: string;
  bankName: string;
  lastFourDigits: string;
  cardType: 'visa' | 'mastercard' | 'amex' | 'other';
  creditLimit: number;
  currentBalance: number;
  availableCredit: number;
  minimumPayment: number;
  dueDate: string;
  lastStatement: number;
  interestRate: number;
  color: string;
}

export interface Transaction {
  id: string;
  cardId: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  type: 'purchase' | 'payment' | 'fee' | 'interest';
}

export interface MonthlySpending {
  category: string;
  amount: number;
  percentage: number;
}