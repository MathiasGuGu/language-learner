"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import {
  Keyboard,
  Space,
  ArrowLeftCircle,
  ArrowRightCircle,
  RefreshCw,
  ArrowLeft,
  Plus,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface KeyboardShortcutsPanelProps {
  onShuffle: () => void;
  isShuffling: boolean;
  isDeckCompleted?: boolean;
  isUsersDeck?: boolean;
  setAddingCards: (addingCards: boolean) => void;
}

export function KeyboardShortcutsPanel({
  onShuffle,
  isShuffling,
  isDeckCompleted = false,
  isUsersDeck = false,
  setAddingCards,
}: KeyboardShortcutsPanelProps) {
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);

  // Don't render anything if the deck is completed
  if (isDeckCompleted) return null;

  return (
    <div className="absolute top-4 right-4 z-10">
      <div className="flex gap-2">
        {isUsersDeck && (
          <Button
            variant="outline"
            size="sm"
            className="bg-white shadow-sm"
            onClick={() => setAddingCards(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add more cards
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          className="bg-white shadow-sm"
          onClick={onShuffle}
          disabled={isShuffling}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isShuffling ? "animate-spin" : ""}`}
          />
          {isShuffling ? "Shuffling..." : "Shuffle Deck"}
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="bg-white shadow-sm"
                onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
              >
                <Keyboard className="h-4 w-4 mr-2" />
                Shortcuts
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle keyboard shortcuts panel</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Keyboard shortcuts panel */}
      {showKeyboardShortcuts && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-12 right-0 bg-white rounded-lg shadow-md border p-4 w-64"
        >
          <h3 className="font-medium text-sm mb-3 text-slate-700">
            Keyboard Shortcuts
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Space className="h-4 w-4 mr-2 text-slate-500" />
                <span className="text-sm">Space</span>
              </div>
              <span className="text-xs text-slate-500">Flip Card</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ArrowLeftCircle className="h-4 w-4 mr-2 text-slate-500" />
                <span className="text-sm">Left Arrow</span>
              </div>
              <span className="text-xs text-slate-500">Previous Card</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ArrowRightCircle className="h-4 w-4 mr-2 text-slate-500" />
                <span className="text-sm">Right Arrow</span>
              </div>
              <span className="text-xs text-slate-500">Next Card</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
