import { GetAllAnkiCardsInDeckUsecase } from "@/use-cases/anki-usecases";
import AddAnkicardsView from "./add-ankicards-view";

export default async function AnkiDeckPage({
  params,
}: {
  params: Promise<{ deckId: string }>;
}) {
  const deckId = (await params).deckId;
  const deckCards = await GetAllAnkiCardsInDeckUsecase(deckId);

  if (deckCards.length <= 0) {
    return <AddAnkicardsView deckId={deckId} />;
  }

  return <div>Anki deck</div>;
}
