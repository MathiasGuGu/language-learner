"use client";
import { Button } from "@/components/ui/button";
import { DeleteAnkideckUsecase } from "@/use-cases/anki-usecases";
import { useMutation } from "@tanstack/react-query";
import { Loader, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type DeleteResponse = {
  success: boolean;
  deletedDeckId: string;
};

export function DeleteAnkideckButton({
  deckUserId,
  deckId,
  deckName,
  onSuccess,
}: {
  deckUserId: string;
  deckId: string;
  deckName?: string;
  onSuccess?: () => void;
}) {
  const router = useRouter();

  const { mutate: deleteDeck, isPending } = useMutation({
    mutationFn: async ({
      deckId,
      userId,
    }: {
      deckId: string;
      userId: string;
    }): Promise<DeleteResponse> => {
      // Expected to return the properly serialized response
      return await DeleteAnkideckUsecase({ deckId, userId }) as DeleteResponse;
    },
    onSuccess: (data) => {
      // Verify we got the expected response format
      if (!data.success) {
        toast.error("Unexpected response format when deleting deck");
        return;
      }

      // Call onSuccess callback first (to close modal) before any other operations
      if (onSuccess) {
        onSuccess();
      }

      // Show success toast
      toast.success(`"${deckName || 'Deck'}" has been deleted`);

      // Emit a custom event to update the deck list
      try {
        const event = new CustomEvent("deck-deleted", {
          detail: { deckId: data.deletedDeckId }
        });
        window.dispatchEvent(event);
      } catch (error) {
        console.error("Failed to dispatch deck-deleted event:", error);
      }

      // Refresh the page to update the server data - do this last
      setTimeout(() => {
        router.refresh();
      }, 100);
    },
    onError: (error) => {
      toast.error("Failed to delete deck. Please try again.");
      console.error("Failed to delete deck:", error);
    }
  });

  const handleDeleteDeck = async () => {
    try {
      if (!deckUserId) throw new Error("Not authenticated");
      return deleteDeck({
        deckId,
        userId: deckUserId,
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete deck. Please try again.");
    }
  };

  return (
    <Button
      onClick={handleDeleteDeck}
      variant={"destructive"}
      className="gap-2 transition-colors duration-100"
    >
      {isPending ? (
        <Loader size={16} strokeWidth={1.5} className="animate-spin" />
      ) : (
        <>
          <Trash2 size={16} strokeWidth={1.5} />
          <span>Delete Deck</span>
        </>
      )}
    </Button>
  );
}
