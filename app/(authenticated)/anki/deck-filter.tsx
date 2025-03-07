import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Filter } from "lucide-react";
import { useCallback, useState } from "react";

export type DeckFilters = {
  search: string;
  sortBy: "name" | "date";
  sortOrder: "asc" | "desc";
  showEmpty: boolean;
};

type DeckFilterProps = {
  onFiltersChange: (filters: DeckFilters) => void;
};

export function DeckFilter({ onFiltersChange }: DeckFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<DeckFilters>({
    search: "",
    sortBy: "date",
    sortOrder: "desc",
    showEmpty: true,
  });

  const handleFilterChange = useCallback(
    (partialFilters: Partial<DeckFilters>) => {
      const newFilters = { ...filters, ...partialFilters };
      setFilters(newFilters);
      onFiltersChange(newFilters);
    },
    [filters, onFiltersChange]
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          size={"icon"}
          className={`border-slate-200 ${isOpen ? "bg-slate-100" : ""}`}
        >
          <Filter size={16} strokeWidth={1.5} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Filter Decks</h4>
            <p className="text-sm text-muted-foreground">
              Customize how your decks are displayed
            </p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search by deck name..."
                value={filters.search}
                onChange={(e) => handleFilterChange({ search: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Sort by</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={filters.sortBy === "name" ? "default" : "outline"}
                  className={cn({
                    "bg-indigo-600 text-white hover:bg-indigo-700":
                      filters.sortBy === "name",
                  })}
                  onClick={() => handleFilterChange({ sortBy: "name" })}
                >
                  Name
                </Button>
                <Button
                  variant={filters.sortBy === "date" ? "default" : "outline"}
                  className={cn({
                    "bg-indigo-600 text-white hover:bg-indigo-700":
                      filters.sortBy === "date",
                  })}
                  onClick={() => handleFilterChange({ sortBy: "date" })}
                >
                  Date
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Sort order</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={filters.sortOrder === "asc" ? "default" : "outline"}
                  className={cn({
                    "bg-indigo-600 text-white hover:bg-indigo-700":
                      filters.sortOrder === "asc",
                  })}
                  onClick={() => handleFilterChange({ sortOrder: "asc" })}
                >
                  Ascending
                </Button>
                <Button
                  variant={filters.sortOrder === "desc" ? "default" : "outline"}
                  className={cn({
                    "bg-indigo-600 text-white hover:bg-indigo-700":
                      filters.sortOrder === "desc",
                  })}
                  onClick={() => handleFilterChange({ sortOrder: "desc" })}
                >
                  Descending
                </Button>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="show-empty"
                checked={filters.showEmpty}
                className="data-[state=checked]:bg-indigo-600 data-[state=unchecked]:bg-indigo-200"
                onCheckedChange={(checked) =>
                  handleFilterChange({ showEmpty: checked as boolean })
                }
              />
              <Label htmlFor="show-empty">Show empty decks</Label>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
