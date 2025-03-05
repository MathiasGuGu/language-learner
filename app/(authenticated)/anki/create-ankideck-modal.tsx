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

export function CreateAnkideckModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"default"} size={"icon"}>
          <PlusCircle size={16} strokeWidth={1.5} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create anki deck</DialogTitle>
          <CreateAnkideckForm />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
