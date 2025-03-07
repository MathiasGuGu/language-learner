"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { PlusCircle } from "lucide-react";
import { CreateAnkideckForm } from "./create-ankideck-form";
import { useState } from "react";

export function CreateAnkideckModal() {
  const [isOpen, setIsOpen] = useState(false);

  const handleSuccess = () => {
    // Close the dialog when creation is successful
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={"default"}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 gap-2 transition-all duration-300 shadow-sm"
        >
          <PlusCircle size={16} strokeWidth={1.5} />
          <span>New Deck</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="border border-slate-200 bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">Create Your Flashcard Deck</DialogTitle>
          <p className="text-slate-500 mt-2">Start your language journey with a new collection of cards</p>
          <CreateAnkideckForm onSuccess={handleSuccess} />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
