'use client';

import { CreateAnkideckModal } from "./create-ankideck-modal";
import { DeckFilter, DeckFilters } from "./deck-filter";
import { useState } from "react";

export function AnkiDeckActions() {
  const [filters, setFilters] = useState<DeckFilters>({
    search: "",
    sortBy: "date",
    sortOrder: "desc",
    showEmpty: true,
  });

  const handleFiltersChange = (newFilters: DeckFilters) => {
    setFilters(newFilters);
    // We'll use a custom event to communicate with the FilteredAnkiDecksList component
    const event = new CustomEvent("deck-filters-changed", {
      detail: newFilters,
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="w-full h-16 flex items-center justify-end gap-4">
      <DeckFilter onFiltersChange={handleFiltersChange} />
      <CreateAnkideckModal />
    </div>
  );
}
