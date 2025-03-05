import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnkiDeckType } from "@/db/schema/schema";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { AnkideckActions } from "./anki-deck-actions";

export default function AnkiDeck({ deck }: { deck: AnkiDeckType }) {
  return (
    <Card className="bg-gradient-to-tr text-indigo-950 from-indigo-50 to-indigo-50/40 border border-indigo-200">
      <CardHeader>
        <CardTitle>{deck.name}</CardTitle>
        <CardDescription>Start learning with this deck.</CardDescription>
      </CardHeader>
      <CardContent className="h-12 line-clamp-2 text-indigo-950/80">
        Jump into {deck.name} words and keep learning
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Button
          asChild
          variant={"default"}
          className="group bg-indigo-900 hover:bg-indigo-950 transition-colors duration-100"
        >
          <Link href={`/anki/deck/${deck.id}`}>
            Start learning{" "}
            <ArrowRight
              size={16}
              strokeWidth={1.6}
              className="group-hover:ml-2 transition-all duration-300"
            />
          </Link>
        </Button>
        <AnkideckActions deckId={deck.id} deckUserId={deck.userId} />
      </CardFooter>
    </Card>
  );
}
