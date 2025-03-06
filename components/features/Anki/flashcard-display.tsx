"use client";
import { motion } from "motion/react";
import { AnkiCardType } from "@/db/schema/schema";

interface FlashcardDisplayProps {
  card: AnkiCardType;
  isFlipped: boolean;
  isTransitioning: boolean;
  onFlip: () => void;
}

export function FlashcardDisplay({
  card,
  isFlipped,
  isTransitioning,
  onFlip,
}: FlashcardDisplayProps) {
  return (
    <div
      className={`w-full max-w-2xl aspect-[3/2] relative ${isTransitioning ? 'pointer-events-none' : ''}`}
      onClick={onFlip}
    >
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{
          rotateY: isFlipped ? 180 : 0,
        }}
        transition={{
          duration: 0.4,
          ease: "easeInOut",
        }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Front of card */}
        <div
          className="absolute inset-0 bg-white rounded-2xl p-8 flex flex-col items-center justify-center shadow-lg border border-slate-200"
          style={{
            backfaceVisibility: "hidden",
          }}
        >
          <div className="text-sm text-slate-500 mb-4">Original</div>
          <h2 className="text-3xl font-bold text-center">{card.original}</h2>
        </div>

        {/* Back of card */}
        <div
          className="absolute inset-0 bg-white rounded-2xl p-8 flex flex-col items-center justify-center shadow-lg border border-slate-200"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <div className="text-sm text-slate-500 mb-4">Translation</div>
          <h2 className="text-3xl font-bold text-center">{card.translation}</h2>
        </div>
      </motion.div>
    </div>
  );
}