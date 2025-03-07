"use client"
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Trash2 } from "lucide-react";
import { useState } from "react";
import { DeleteAnkideckModal } from "./delete-ankideck-modal";

export function AnkideckActions({
  deckId,
  deckUserId,
  deckName,
}: {
  deckId: string;
  deckUserId: string;
  deckName?: string;
}) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            size={"icon"}
            variant={"ghost"}
            className="hover:bg-slate-100 transition-colors duration-100"
          >
            <EllipsisVertical size={16} strokeWidth={1.5} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="border border-slate-200 bg-white">
          <DropdownMenuLabel className="text-slate-900">Deck actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault();
              setIsDeleteModalOpen(true);
              setIsDropdownOpen(false);
            }}
            className="flex items-center gap-2 text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            <Trash2 size={16} strokeWidth={1.5} />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteAnkideckModal
        deckId={deckId}
        deckUserId={deckUserId}
        deckName={deckName}
        isOpen={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
      />
    </>
  );
}
