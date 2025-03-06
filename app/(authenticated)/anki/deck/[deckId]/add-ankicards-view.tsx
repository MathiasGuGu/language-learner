"use client";
export default function AddAnkicardsView({ deckId }: { deckId: string }) {
  return (
    <div className="w-screen h-[calc(100vh-64px)] flex items-center justify-center">
      <div className="w-full h-full container px-4 md:px-12 flex items-center justify-center">
        <div className="border h-full w-full"></div>
      </div>
    </div>
  );
}
