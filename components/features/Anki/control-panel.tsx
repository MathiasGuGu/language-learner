"use client";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  ArrowLeftCircle,
  ArrowRightCircle,
  Space,
  Rotate3D,
  RefreshCw,
  Trophy,
} from "lucide-react";

interface ControlPanelProps {
  currentCardIndex: number;
  totalCards: number;
  isTransitioning: boolean;
  isShuffling: boolean;
  onPrevious: (e: React.MouseEvent) => void;
  onNext: (e: React.MouseEvent) => void;
  onFlip: (e: React.MouseEvent) => void;
  onShuffle: () => void;
  onFinish: () => void;
}

export function ControlPanel({
  currentCardIndex,
  totalCards,
  isTransitioning,
  isShuffling,
  onPrevious,
  onNext,
  onFlip,
  onShuffle,
  onFinish,
}: ControlPanelProps) {
  return (
    <div className="mt-12 flex flex-col items-center gap-6">
      <div className="flex items-center gap-6 bg-white border  shadow-sm  border-zinc-200 rounded-lg p-4">
        <div className="flex flex-col items-center">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={currentCardIndex === 0 || isTransitioning}
            className="transition-all duration-200 bg-white"
          >
            <ArrowLeft className="mr-2" /> Previous
          </Button>
          <div className="flex items-center mt-2 text-xs text-slate-500">
            <ArrowLeftCircle className="h-3 w-3 mr-1" />
            <span>Left Arrow</span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <Button
            size="lg"
            onClick={onFlip}
            className="px-8 transition-all duration-200 hover:shadow-md bg-indigo-600 hover:bg-indigo-700 text-white border-none"
          >
            <Rotate3D className="mr-2" /> Flip Card
          </Button>
          <div className="flex items-center mt-2 text-xs text-slate-500">
            <Space className="h-3 w-3 mr-1" />
            <span>Space</span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <Button
            variant="outline"
            onClick={onNext}
            disabled={isTransitioning}
            className="transition-all duration-200"
          >
            Next <ArrowRight className="ml-2" />
          </Button>
          <div className="flex items-center mt-2 text-xs text-slate-500">
            <ArrowRightCircle className="h-3 w-3 mr-1" />
            <span>Right Arrow</span>
          </div>
        </div>
      </div>
    </div>
  );
}
