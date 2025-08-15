import { CreditCard, Transaction } from "@/types/creditCard";

export const mockCards: CreditCard[] = [
  {
    id: "1",
    bankName: "Banco Santander",
    lastFourDigits: "1234",
    cardType: "visa",
    creditLimit: 150000,
    currentBalance: 45000,
    availableCredit: 105000,
    minimumPayment: 7500,
    dueDate: "2024-01-15",
    lastStatement: 45000,
    interestRate: 18.5,
    color: "#8B5CF6"
  },
  {
    id: "2", 
    bankName: "BBVA",
    lastFourDigits: "5678",
    cardType: "mastercard",
    creditLimit: 200000,
    currentBalance: 170000,
    availableCredit: 30000,
    minimumPayment: 10000,
    dueDate: "2024-01-20",
    lastStatement: 170000,
    interestRate: 19.2,
    color: "#06B6D4"
  },
  {
    id: "3",
    bankName: "Banco Galicia",
    lastFourDigits: "9012",
    cardType: "visa",
    creditLimit: 100000,
    currentBalance: 25000,
    availableCredit: 75000,
    minimumPayment: 5000,
    dueDate: "2024-01-25",
    lastStatement: 25000,
    interestRate: 17.8,
    color: "#10B981"
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: "1",
    cardId: "1",
    description: "Supermercado Disco",
    amount: 12500,
    category: "alimentación",
    date: "2024-01-10",
    type: "purchase"
  },
  {
    id: "2",
    cardId: "1", 
    description: "Netflix",
    amount: 1200,
    category: "entretenimiento",
    date: "2024-01-08",
    type: "purchase"
  },
  {
    id: "3",
    cardId: "1",
    description: "Estación de servicio YPF",
    amount: 8000,
    category: "transporte",
    date: "2024-01-07",
    type: "purchase"
  },
  {
    id: "4",
    cardId: "2",
    description: "Falabella",
    amount: 45000,
    category: "compras",
    date: "2024-01-09",
    type: "purchase"
  },
  {
    id: "5",
    cardId: "2",
    description: "Pago realizado",
    amount: 25000,
    category: "pago",
    date: "2024-01-05",
    type: "payment"
  },
  {
    id: "6", 
    cardId: "3",
    description: "Farmacia",
    amount: 3500,
    category: "salud",
    date: "2024-01-06",
    type: "purchase"
  }
];