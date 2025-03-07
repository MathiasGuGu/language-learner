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
  try {
    const result = await db.insert(AnkiDeck).values(deckInfo).returning();


    if (result && result.length > 0) {
      const serializedDeck = {
        ...result[0],
        createdAt: result[0].createdAt instanceof Date
          ? result[0].createdAt.toISOString()
          : result[0].createdAt,
        updatedAt: result[0].updatedAt instanceof Date
          ? result[0].updatedAt.toISOString()
          : result[0].updatedAt,
      };

      return {
        success: true,
        createdDeck: serializedDeck
      };
    }

    return {
      success: false,
      error: "Failed to create deck"
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    };
  }
};

// DELETE
export const deleteAnkiDeckById = async ({
  deckId,
  userId,
}: {
  deckId: string;
  userId: string;
}) => {
  try {
    await db
      .delete(AnkiDeck)
      .where(and(eq(AnkiDeck.id, deckId), eq(AnkiDeck.userId, userId)));
    return {
      success: true,
      deletedDeckId: deckId
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
