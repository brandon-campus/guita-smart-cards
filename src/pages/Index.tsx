import { useState } from "react";
import { CreditCard, Transaction } from "@/types/creditCard";
import { Dashboard } from "@/components/Dashboard";
import { CardDetail } from "@/components/CardDetail";
import { AddCardForm } from "@/components/AddCardForm";
import { StatementScanner } from "@/components/StatementScanner";
import { mockCards, mockTransactions } from "@/data/mockData";
import { ExtractedData } from "@/services/ocrService";

type View = "dashboard" | "card-detail" | "add-card" | "scan-statement";

const Index = () => {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null);
  const [scanningCard, setScanningCard] = useState<CreditCard | null>(null);
  const [cards, setCards] = useState<CreditCard[]>(mockCards);
  const [transactions] = useState<Transaction[]>(mockTransactions);

  const handleCardClick = (card: CreditCard) => {
    setSelectedCard(card);
    setCurrentView("card-detail");
  };

  const handleAddCard = (newCard: Omit<CreditCard, 'id'>) => {
    const card: CreditCard = {
      ...newCard,
      id: Math.random().toString(36).substr(2, 9)
    };
    setCards([...cards, card]);
    setCurrentView("dashboard");
  };

  const handleScanStatement = (card: CreditCard) => {
    setScanningCard(card);
    setCurrentView("scan-statement");
  };

  const handleDataExtracted = (cardId: string, data: ExtractedData) => {
    setCards(prev => prev.map(card => {
      if (card.id === cardId) {
        const updatedCard = { ...card };
        
        // Update extracted data
        if (data.creditLimit) updatedCard.creditLimit = data.creditLimit;
        if (data.currentBalance !== undefined) updatedCard.currentBalance = data.currentBalance;
        if (data.availableCredit !== undefined) updatedCard.availableCredit = data.availableCredit;
        if (data.minimumPayment) updatedCard.minimumPayment = data.minimumPayment;
        if (data.dueDate) updatedCard.dueDate = data.dueDate;
        
        // Recalculate available credit if needed
        if (data.creditLimit && data.currentBalance !== undefined && !data.availableCredit) {
          updatedCard.availableCredit = data.creditLimit - data.currentBalance;
        }
        
        return updatedCard;
      }
      return card;
    }));
  };

  const getCardTransactions = (cardId: string) => {
    return transactions.filter(t => t.cardId === cardId);
  };

  if (currentView === "add-card") {
    return (
      <AddCardForm
        onBack={() => setCurrentView("dashboard")}
        onAddCard={handleAddCard}
      />
    );
  }

  if (currentView === "scan-statement" && scanningCard) {
    return (
      <StatementScanner
        card={scanningCard}
        onDataExtracted={handleDataExtracted}
        onClose={() => setCurrentView("dashboard")}
      />
    );
  }

  if (currentView === "card-detail" && selectedCard) {
    return (
      <CardDetail
        card={selectedCard}
        transactions={getCardTransactions(selectedCard.id)}
        onBack={() => setCurrentView("dashboard")}
      />
    );
  }

  return (
    <Dashboard
      cards={cards}
      onCardClick={handleCardClick}
      onAddCard={() => setCurrentView("add-card")}
      onScanStatement={handleScanStatement}
    />
  );
};

export default Index;
