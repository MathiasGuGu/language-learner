"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DeleteAnkideckButton } from "./delete-ankideck-button";

export function DeleteAnkideckModal({
  deckId,
  deckUserId,
  deckName,
  isOpen = false,
  onOpenChange,
}: {
  deckId: string;
  deckUserId: string;
  deckName?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  // Function to close modal after successful deletion
  const handleSuccess = () => {
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="border border-slate-200 bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">
            Delete Deck
          </DialogTitle>
          <DialogDescription className="text-slate-600 mt-2">
            Are you sure you want to delete {deckName ? `"${deckName}"` : "this deck"}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-8 space-x-2">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors duration-100"
            >
              Cancel
            </Button>
          </DialogClose>
          <DeleteAnkideckButton
            deckId={deckId}
            deckUserId={deckUserId}
            deckName={deckName}
            onSuccess={handleSuccess}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
