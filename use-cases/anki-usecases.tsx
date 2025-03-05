"use server";
import { NewAnkiCardType, NewAnkiDeckType } from "@/db/schema/schema";
import { auth } from "@/lib/auth";
import {
  createAnkiCard,
  createAnkiDeck,
  deleteAnkiDeckById,
  getAllAnkiCardsByUserId,
  getAllAnkiCardsInDeck,
  getAllAnkiDeckByUserId,
  getAnkiCardById,
  getAnkiDeckById,
} from "@/repository/anki-repository";
import { headers } from "next/headers";

// Authentication wrapper for use cases
const withAuth = <T, P>(useCase: (params: P) => Promise<T>) => {
  return async (params: P): Promise<T> => {
    const h = await headers();
    const session = await auth.api.getSession({
      headers: h,
    });

    if (!session) throw new Error("User is not authenticated");

    const sessionHasExpired = session.session.expiresAt < new Date();
    if (sessionHasExpired) throw new Error("Session has expired");

    const invalidSession = !session.session.userId;
    if (invalidSession) throw new Error("Invalid session");

    const noValidUser = !session.user.id;
    if (noValidUser) throw new Error("No valid user");

    return useCase(params);
  };
};

// Anki Card Use Cases
export const GetAnkiCardByIdUsecase = withAuth(async (cardId: string) => {
  return getAnkiCardById(cardId);
});

export const GetAllAnkiCardsByUserIdUsecase = withAuth(
  async (userId: string) => {
    return getAllAnkiCardsByUserId(userId);
  }
);

export const GetAllAnkiCardsInDeckUsecase = withAuth(async (deckId: string) => {
  return getAllAnkiCardsInDeck(deckId);
});

export const CreateAnkiCardUsecase = withAuth(
  async (cardInfo: NewAnkiCardType) => {
    return createAnkiCard(cardInfo);
  }
);

// Anki Deck Use Cases
export const GetAnkiDeckByIdUsecase = withAuth(async (deckId: string) => {
  return getAnkiDeckById(deckId);
});

export const GetAllAnkiDeckByUserIdUsecase = withAuth(
  async (userId: string) => {
    return getAllAnkiDeckByUserId(userId);
  }
);

export const CreateAnkiDeckUsecase = withAuth(
  async (deckInfo: NewAnkiDeckType) => {
    return createAnkiDeck(deckInfo);
  }
);

export const DeleteAnkideckUsecase = withAuth(
  async ({ deckId, userId }: { deckId: string; userId: string }) => {
    return deleteAnkiDeckById({ deckId, userId });
  }
);
