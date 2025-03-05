import { auth } from "@/lib/auth";
import { getAllAnkiDeckByUserId } from "@/repository/anki-repository";
import { headers } from "next/headers";
import AnkiDeck from "./anki-deck";

export default async function AnkiDecksList() {
  const h = await headers();
  const session = await auth.api.getSession({
    headers: h,
  });
  const userId = session?.user.id;
  const data = await getAllAnkiDeckByUserId(userId!);
  return (
    <div className="grid grid-cols-3 gap-4">
      {data.map((deck) => {
        return <AnkiDeck key={deck.id + deck.userId} deck={deck} />;
      })}
    </div>
  );
}
