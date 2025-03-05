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
  DialogTrigger,
} from "@/components/ui/dialog";
import { DeleteAnkideckButton } from "./delete-ankideck-button";

export function DeleteAnkideckModal({
  deckId,
  deckUserId,
}: {
  deckId: string;
  deckUserId: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className="text-sm font-normal pl-2 py-1 w-full justify-start"
        >
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to delete this deck?</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          This will delete this deck forever and can not be undone
        </DialogDescription>
        <DialogFooter className="mt-8">
          <DeleteAnkideckButton deckId={deckId} deckUserId={deckUserId} />
          <DialogClose asChild>
            <Button>No go back</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
