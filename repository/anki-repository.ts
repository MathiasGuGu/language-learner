"use server";
import db from "@/db";
import {
  AnkiCard,
  AnkiDeck,
  NewAnkiCardType,
  NewAnkiDeckType,
} from "@/db/schema/schema";
import { and, eq } from "drizzle-orm";

// Anki card
// GET
export const getAnkiCardById = async (cardId: string) => {
  return db.query.AnkiCard.findFirst({
    where: (AnkiCard, { eq }) => eq(AnkiCard.id, cardId),
  });
};
export const getAllAnkiCardsByUserId = async (userId: string) => {
  return db.query.AnkiCard.findMany({
    where: (AnkiCard, { eq }) => eq(AnkiCard.userId, userId),
  });
};
export const getAllAnkiCardsInDeck = async (deckId: string) => {
  return db.query.AnkiCard.findMany({
    where: (AnkiCard, { eq }) => eq(AnkiCard.deckId, deckId),
  });
};
// POST
export const createAnkiCard = async (cardInfo: NewAnkiCardType) => {
  return db.insert(AnkiCard).values(cardInfo).returning();
};

// Anki deck
// GET
export const getAnkiDeckById = async (deckId: string) => {
  return db.query.AnkiDeck.findFirst({
    where: (AnkiDeck, { eq }) => eq(AnkiDeck.id, deckId),
  });
};

export const getAllAnkiDeckByUserId = async (userId: string) => {
  return db.query.AnkiDeck.findMany({
    where: (AnkiDeck, { eq }) => eq(AnkiDeck.userId, userId),
  });
};
// POST
export const createAnkiDeck = async (deckInfo: NewAnkiDeckType) => {
  return db.insert(AnkiDeck).values(deckInfo).returning();
};

// DELETE
export const deleteAnkiDeckById = async ({
  deckId,
  userId,
}: {
  deckId: string;
  userId: string;
}) => {
  return db
    .delete(AnkiDeck)
    .where(and(eq(AnkiDeck.id, deckId), eq(AnkiDeck.userId, userId)));
};
