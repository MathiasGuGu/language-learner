import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { CreateAnkideckModal } from "./create-ankideck-modal";

export function AnkiDeckActions() {
  return (
    <div className="w-full h-16 flex items-center justify-end gap-4">
      <Button variant={"secondary"} size={"icon"}>
        <Filter size={16} strokeWidth={1.5} />
      </Button>
      <CreateAnkideckModal />
    </div>
  );
}
