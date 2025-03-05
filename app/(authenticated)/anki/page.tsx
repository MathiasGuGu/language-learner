import AnkiDecksList from "./anki-decks-list";
import { AnkiDeckActions } from "./anki-decklist-actionbar";

function AnkiDecksTitle() {
  return (
    <div className="w-full  flex items-center">
      <h1 className="text-2xl font-bold">Your deck collection</h1>
    </div>
  );
}

export default function AnkiPage() {
  return (
    <div className="w-screen h-[calc(100vh_-_64px)] flex items-center justify-center">
      <div className="container flex flex-col gap-4 h-full items-start justify-start pt-8">
        <div className="w-full h-16 grid grid-cols-2 grid-rows-1">
          <AnkiDecksTitle />
          <AnkiDeckActions />
        </div>
        <AnkiDecksList />
      </div>
    </div>
  );
}
