"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { DeleteAnkideckUsecase } from "@/use-cases/anki-usecases";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";

export function DeleteAnkideckButton({
  deckUserId,
  deckId,
}: {
  deckUserId: string;
  deckId: string;
}) {
  const router = useRouter();

  const { mutate: deleteDeck, isPending } = useMutation({
    mutationFn: async ({
      deckId,
      userId,
    }: {
      deckId: string;
      userId: string;
    }) => await DeleteAnkideckUsecase({ deckId, userId }),
    onSettled: () => {
      router.refresh();
    },
  });

  const handleDeleteDeck = async () => {
    try {
      if (!deckUserId) throw new Error("Not authenticated");
      return deleteDeck({
        deckId,
        userId: deckUserId,
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Button onClick={handleDeleteDeck} variant={"destructive"} className="w-48">
      {isPending ? (
        <Loader size={15} strokeWidth={1.5} className="animate-spin" />
      ) : (
        "Yes, Delete this deck"
      )}
    </Button>
  );
}
