"use client"

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

// Define a type that accepts either the original AnkiDeckType or one with serialized dates
type SerializedAnkiDeckType = Omit<AnkiDeckType, 'createdAt' | 'updatedAt'> & {
  createdAt: string | number;
  updatedAt: string | number;
};

type AnkiDeckProps = {
  deck: AnkiDeckType | SerializedAnkiDeckType;
};

export default function AnkiDeck({ deck }: AnkiDeckProps) {
  return (
    <Card className="bg-white text-slate-900 border border-indigo-200 hover:shadow-sm transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      <CardHeader>
        <CardTitle>{deck.name}</CardTitle>
        <CardDescription>Start learning with this deck.</CardDescription>
      </CardHeader>
      <CardContent className="h-12 line-clamp-2 text-slate-700">
        Jump into {deck.name} words and keep learning
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <Button
          asChild
          variant={"default"}
          className="group bg-indigo-600 hover:bg-indigo-700 transition-colors duration-100"
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
        <AnkideckActions deckId={deck.id} deckUserId={deck.userId} deckName={deck.name} />
      </CardFooter>
    </Card>
  );
}
