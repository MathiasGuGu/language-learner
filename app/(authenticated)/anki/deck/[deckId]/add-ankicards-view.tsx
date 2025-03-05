"use client";
export default function AddAnkicardsView({ deckId }: { deckId: string }) {
  return (
    <div className="w-screen h-[calc(100vh-64px)] flex items-center justify-center">
      <div className="w-full h-full container px-4 md:px-12 flex items-center justify-center">
        <div className="h-[90%] aspect-square border rounded-lg shadow-sm p-12 flex flex-col gap-4 items-start justify-start">
          <h1 className="text-2xl font-bold text-start">This deck is empty</h1>
          <div className="text-start text-zinc-600">
            <p>You need to add cards to the deck to start learning from it.</p>
            <p>
              Simply click the add card button on the bottom, and start adding
              words!
            </p>
            <p>
              We recommend using the custom decks as a way to better remember
              words you already know, so when creating a custom deck, use words
              you have learned from other decks!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
