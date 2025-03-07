"use client";

import { AnkiDeckType } from "@/db/schema/schema";
import { useEffect, useState, useCallback, useRef } from "react";
import AnkiDeck from "./anki-deck";
import { DeckFilters } from "./deck-filter";

// Define a serialized version of AnkiDeckType where dates are strings
type SerializedAnkiDeckType = Omit<AnkiDeckType, 'createdAt' | 'updatedAt'> & {
  createdAt: string | number;
  updatedAt: string | number;
};

// Helper function to ensure dates are properly serialized
const serializeDecks = (decks: AnkiDeckType[]): SerializedAnkiDeckType[] => {
  return decks.map(deck => ({
    ...deck,
    // Convert Date objects to ISO strings if they're Date objects
    createdAt: deck.createdAt instanceof Date
      ? deck.createdAt.toISOString()
      : typeof deck.createdAt === 'number'
        ? deck.createdAt
        : new Date(deck.createdAt).getTime(),
    updatedAt: deck.updatedAt instanceof Date
      ? deck.updatedAt.toISOString()
      : typeof deck.updatedAt === 'number'
        ? deck.updatedAt
        : new Date(deck.updatedAt).getTime(),
  }));
};

type FilteredAnkiDecksListProps = {
  initialDecks: AnkiDeckType[];
};

export function FilteredAnkiDecksList({
  initialDecks,
}: FilteredAnkiDecksListProps) {
  console.log("FilteredAnkiDecksList rendered with", initialDecks.length, "decks");

  // Ensure dates are properly serialized
  const [decks, setDecks] = useState<SerializedAnkiDeckType[]>(() => serializeDecks(initialDecks));
  const [filteredDecks, setFilteredDecks] =
    useState<SerializedAnkiDeckType[]>(() => serializeDecks(initialDecks));
  const [recentlyDeletedId, setRecentlyDeletedId] = useState<string | null>(null);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<DeckFilters>({
    search: "",
    sortBy: "date",
    sortOrder: "desc",
    showEmpty: true,
  });

  // Store event handlers in refs to ensure consistent identity for event listeners
  const handleDeckDeletedRef = useRef<(event: CustomEvent<{ deckId: string }>) => void>(null!);
  const handleDeckCreatedRef = useRef<(event: CustomEvent<{ newDeck: SerializedAnkiDeckType }>) => void>(null!);
  const handleFilterChangeRef = useRef<(event: CustomEvent<DeckFilters>) => void>(null!);

  // Memoize the filter function to avoid recreating it on every render
  const applyFilters = useCallback((filters: DeckFilters, deckList: SerializedAnkiDeckType[]) => {
    let result = [...deckList];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter((deck) =>
        deck.name.toLowerCase().includes(searchLower)
      );
    }

    // Apply sort
    result.sort((a, b) => {
      if (filters.sortBy === "name") {
        return filters.sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        // Sort by date - ensure we're comparing timestamps
        const dateA = typeof a.createdAt === 'string'
          ? new Date(a.createdAt).getTime()
          : a.createdAt;
        const dateB = typeof b.createdAt === 'string'
          ? new Date(b.createdAt).getTime()
          : b.createdAt;
        return filters.sortOrder === "asc" ? Number(dateA) - Number(dateB) : Number(dateB) - Number(dateA);
      }
    });

    return result;
  }, []);

  // Update filtered decks when decks or filters change
  useEffect(() => {
    setFilteredDecks(applyFilters(currentFilters, decks));
  }, [decks, currentFilters, applyFilters]);

  // Initialize event handlers once
  useEffect(() => {
    // Create handler for filter changes
    handleFilterChangeRef.current = (event: CustomEvent<DeckFilters>) => {
      console.log("Filter changed:", event.detail);
      setCurrentFilters(event.detail);
    };

    // Create handler for deck deletion
    handleDeckDeletedRef.current = (event: CustomEvent<{ deckId: string }>) => {
      const { deckId } = event.detail;
      console.log("Deck deleted event received:", deckId);

      // Set the recently deleted ID for animation
      setRecentlyDeletedId(deckId);

      // Remove the deleted deck from the list after animation completes
      setTimeout(() => {
        setDecks(prevDecks => {
          const newDecks = prevDecks.filter(deck => deck.id !== deckId);
          console.log("Removed deck, new count:", newDecks.length);
          return newDecks;
        });
        setRecentlyDeletedId(null);
      }, 500); // Animation duration
    };

    // Create handler for deck creation
    handleDeckCreatedRef.current = (event: CustomEvent<{ newDeck: SerializedAnkiDeckType }>) => {
      const { newDeck } = event.detail;
      console.log("Deck created event received:", newDeck);

      // Make sure the newDeck is properly serialized
      const serializedNewDeck: SerializedAnkiDeckType = {
        ...newDeck,
        createdAt: typeof newDeck.createdAt === 'object' && newDeck.createdAt !== null && 'toISOString' in newDeck.createdAt
          ? (newDeck.createdAt as Date).toISOString()
          : newDeck.createdAt,
        updatedAt: typeof newDeck.updatedAt === 'object' && newDeck.updatedAt !== null && 'toISOString' in newDeck.updatedAt
          ? (newDeck.updatedAt as Date).toISOString()
          : newDeck.updatedAt,
      };

      // Set the recently added ID for animation
      setRecentlyAddedId(serializedNewDeck.id);

      // Add the new deck to the list
      setDecks(prevDecks => {
        // Check if deck already exists to avoid duplicates
        if (prevDecks.some(deck => deck.id === serializedNewDeck.id)) {
          return prevDecks;
        }

        const newDecks = [serializedNewDeck, ...prevDecks];
        console.log("Added deck, new count:", newDecks.length);
        return newDecks;
      });

      // Clear the animation state after a delay
      setTimeout(() => {
        setRecentlyAddedId(null);
      }, 1000); // Animation duration
    };
  }, []);

  // Setup event listeners
  useEffect(() => {
    const deckDeletedHandler = (event: Event) => {
      if (handleDeckDeletedRef.current) {
        handleDeckDeletedRef.current(event as CustomEvent<{ deckId: string }>);
      }
    };

    const deckCreatedHandler = (event: Event) => {
      if (handleDeckCreatedRef.current) {
        handleDeckCreatedRef.current(event as CustomEvent<{ newDeck: SerializedAnkiDeckType }>);
      }
    };

    const filterChangeHandler = (event: Event) => {
      if (handleFilterChangeRef.current) {
        handleFilterChangeRef.current(event as CustomEvent<DeckFilters>);
      }
    };

    // Add event listeners
    window.addEventListener("deck-deleted", deckDeletedHandler);
    window.addEventListener("deck-created", deckCreatedHandler);
    window.addEventListener("deck-filters-changed", filterChangeHandler);

    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener("deck-deleted", deckDeletedHandler);
      window.removeEventListener("deck-created", deckCreatedHandler);
      window.removeEventListener("deck-filters-changed", filterChangeHandler);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
      {filteredDecks.length > 0 ? (
        filteredDecks.map((deck) => (
          <div
            key={deck.id + deck.userId}
            className={`
              transition-all duration-300 ease-in-out
              ${recentlyDeletedId === deck.id ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}
              ${recentlyAddedId === deck.id ? 'animate-fadeIn' : ''}
            `}
          >
            <AnkiDeck deck={deck} />
          </div>
        ))
      ) : (
        <div className="col-span-2 p-8 text-center">
          <p className="text-slate-500">No decks found. Create a new deck to get started.</p>
        </div>
      )}
    </div>
  );
}
