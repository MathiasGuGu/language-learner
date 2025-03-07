"use client"
import { getAllAnkiDeckByUserId } from "@/repository/anki-repository";
import { FilteredAnkiDecksList } from "./filtered-anki-decks-list";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnkiDecksList() {
  const { data } = authClient.useSession();
  const userId = data?.user.id;

  const { data: decks, isLoading } = useQuery({
    queryKey: ["anki-decks", userId],
    queryFn: async () => await getAllAnkiDeckByUserId(userId!),
  });

  if (isLoading) {
    return (
      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex items-center justify-between mt-4">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-8 w-24 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <FilteredAnkiDecksList initialDecks={decks || []} />;
}
