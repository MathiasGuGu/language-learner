"use client";
import { AnkiCardType, AnkiDeckType } from "@/db/schema/schema";
import { LearnAnkicardsView } from "./learn-ankicards-view";
import AddAnkicardsView from "./add-ankicards-view";
import { useState } from "react";
export function AnkiViewSwitch({
  deckId,
  deckCards,
  deck,
}: {
  deckId: string;
  deckCards: AnkiCardType[];
  deck: AnkiDeckType;
}) {
  const [addingCards, setAddingCards] = useState(false);

  if (addingCards) {
    return <AddAnkicardsView deckId={deckId} setAddingCards={setAddingCards} />;
  }

  if (deckCards.length <= 0) {
    return (
      <AddAnkicardsView
        deckId={deckId}
        setAddingCards={setAddingCards}
      />
    );
  }

  return (
    <LearnAnkicardsView
      deckId={deckId}
      deckUserId={deck.userId}
      setAddingCards={setAddingCards}
    />
  );
}
