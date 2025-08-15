import { useState } from "react";
import { CreditCard, Transaction } from "@/types/creditCard";
import { Dashboard } from "@/components/Dashboard";
import { CardDetail } from "@/components/CardDetail";
import { AddCardForm } from "@/components/AddCardForm";
import { mockCards, mockTransactions } from "@/data/mockData";

type View = "dashboard" | "card-detail" | "add-card";

const Index = () => {
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [selectedCard, setSelectedCard] = useState<CreditCard | null>(null);
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
    />
  );
};

export default Index;
