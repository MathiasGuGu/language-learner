import { GetAllAnkiCardsInDeckUsecase, GetAnkiDeckByIdUsecase } from "@/use-cases/anki-usecases";
import AddAnkicardsView from "./add-ankicards-view";
import { LearnAnkicardsView } from "./learn-ankicards-view";
import { AnkiViewSwitch } from "./anki-view-switch";
import { AnkiDeckType } from "@/db/schema/schema";

export default async function AnkiDeckPage({
  params,
}: {
  params: Promise<{ deckId: string }>;
}) {
  const deckId = (await params).deckId;
  const deckCards = await GetAllAnkiCardsInDeckUsecase(deckId);
  const deck = await GetAnkiDeckByIdUsecase(deckId);

  if (!deck) {
    return <div>Deck not found</div>;
  }

  return (
    <AnkiViewSwitch
      deckId={deckId}
      deckCards={deckCards}
      deck={deck}
    />
  );
}
