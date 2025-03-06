"use client";
import { motion, AnimatePresence } from "motion/react";
import { AnkiCardType } from "@/db/schema/schema";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen } from "lucide-react";

interface DeckVisualizationProps {
  cards: AnkiCardType[];
  currentCardIndex: number;
  isShuffling: boolean;
  progressPercentage: number;
}

export function DeckVisualization({
  cards,
  currentCardIndex,
  isShuffling,
  progressPercentage,
}: DeckVisualizationProps) {
  return (
    <div className="w-1/3 h-full bg-gradient-to-br from-slate-100 to-slate-200 p-8 overflow-hidden relative">
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-2">Study Session</h2>
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline" className="bg-white">
            Card {currentCardIndex + 1} of {cards.length}
          </Badge>
          <Badge
            variant={progressPercentage === 100 ? "default" : "outline"}
            className={progressPercentage === 100 ? "bg-green-500" : "bg-white"}
          >
            {progressPercentage}% Complete
          </Badge>
        </div>
        <Progress value={progressPercentage} className="h-2" />
      </div>

      <div className="relative h-[70%] flex items-center justify-center">
        {/* Deck base - visual enhancement */}
        <div className="absolute w-64 h-80 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg shadow-md" />

        {/* Remaining cards in deck with improved visibility */}
        <AnimatePresence>
          {!isShuffling &&
            cards.slice(currentCardIndex + 1).map((_, index, array) => (
              <motion.div
                key={`deck-${index}`}
                className="absolute w-64 h-80 bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden"
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{
                  y: index * -3,
                  x: index % 2 === 0 ? index * 0.5 : index * -0.5,
                  rotateZ: (index - Math.floor(array.length / 2)) * 0.8,
                  scale: 1 - index * 0.01,
                  opacity: 1,
                }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: index * 0.05,
                }}
                style={{ zIndex: index }}
              >
                {/* Card back design */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {/* Card number */}
                  <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-medium text-sm border border-slate-200">
                    {cards.length - currentCardIndex - index}
                  </div>

                  {/* Card back pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="grid grid-cols-4 gap-2 p-4 h-full">
                      {Array(16)
                        .fill(0)
                        .map((_, i) => (
                          <div
                            key={i}
                            className="bg-slate-400 rounded-md"
                          ></div>
                        ))}
                    </div>

                    {/* Center logo */}
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-slate-300" />
                    </div>
                    <div className="mt-3 text-slate-300 font-medium text-sm">
                      Flashcard
                    </div>

                    {/* Bottom corner numbers */}
                    <div className="absolute bottom-3 right-3 text-slate-300 font-medium text-sm">
                      {cards.length - index}/{cards.length}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
        </AnimatePresence>

        {/* Card edges for 3D effect */}
        {cards.length > currentCardIndex + 1 && (
          <div className="absolute w-64 h-80 rounded-lg overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-slate-300 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-t from-slate-300 to-transparent"></div>
            <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-r from-slate-300 to-transparent"></div>
            <div className="absolute top-0 bottom-0 right-0 w-1 bg-gradient-to-l from-slate-300 to-transparent"></div>
          </div>
        )}

        {/* Visual indicator for completed cards */}
        {currentCardIndex > 0 && (
          <motion.div
            className="absolute -bottom-16 left-0 right-0 text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200 px-3 py-1 text-sm shadow-sm"
            >
              {currentCardIndex} {currentCardIndex === 1 ? "card" : "cards"}{" "}
              completed
            </Badge>
          </motion.div>
        )}

        {/* Empty deck indicator */}
        {cards.length === currentCardIndex + 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-slate-400 font-medium text-center">
              <div className="border-2 border-dashed border-slate-300 rounded-lg w-48 h-64 mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">✓</span>
              </div>
              <p>All cards reviewed</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
