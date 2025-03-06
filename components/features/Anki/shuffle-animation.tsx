"use client";
import { motion } from "motion/react";
import { BookOpen } from "lucide-react";
import { AnkiCardType } from "@/db/schema/schema";

interface ShuffleAnimationProps {
  isShuffling: boolean;
  cards: AnkiCardType[];
}

export function ShuffleAnimation({ isShuffling, cards }: ShuffleAnimationProps) {
  if (!isShuffling) return null;

  return (
    <motion.div
      className="absolute inset-0 z-20 flex items-center justify-center"
      style={{ willChange: "transform, opacity" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Create cards that fly in from different directions with improved animation */}
      {Array(Math.min(cards.length, 5))
        .fill(0)
        .map((_, i) => {
          // More varied starting positions for a professional look
          const direction = i % 6; // 0-5: different starting positions
          let initialX = 0;
          let initialY = 0;

          // Create a more varied and interesting pattern of card movements
          switch (direction) {
            case 0:
              initialX = 400;
              initialY = -100;
              break;
            case 1:
              initialX = -400;
              initialY = -100;
              break;
            case 2:
              initialX = 200;
              initialY = 300;
              break;
            case 3:
              initialX = -200;
              initialY = 300;
              break;
            case 4:
              initialX = 300;
              initialY = 100;
              break;
            case 5:
              initialX = -300;
              initialY = 100;
              break;
          }

          // Calculate a consistent but varied rotation for each card
          const rotation = ((i % 7) - 3) * 5; // -15 to +15 degrees

          return (
            <motion.div
              key={`shuffle-card-${i}`}
              className="absolute w-64 h-80 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden"
              style={{
                boxShadow:
                  "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                transformOrigin: "center center",
              }}
              initial={{
                x: initialX,
                y: initialY,
                rotateZ: rotation * 2,
                opacity: 0,
                scale: 0.8,
              }}
              animate={{
                x: 0,
                y: -i * 2,
                rotateZ: 0,
                opacity: 1,
                scale: 1
              }}
              transition={{
                type: "spring",
                stiffness: 120,
                damping: 14,
                mass: 0.8,
                delay: i * 0.08,
              }}
            >
              {/* Enhanced card design with subtle gradient and better visual hierarchy */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-white to-slate-50">
                {/* Card number with improved styling */}
                <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-medium text-sm border border-slate-200 shadow-sm">
                  {i + 1}
                </div>

                {/* Center logo with enhanced styling */}
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center shadow-inner">
                  <BookOpen className="h-8 w-8 text-slate-400" />
                </div>
                <div className="mt-3 text-slate-500 font-medium text-sm">
                  Card {i + 1}
                </div>

                {/* Subtle card pattern for visual interest */}
                <div className="absolute inset-0 pointer-events-none opacity-5">
                  <div className="grid grid-cols-4 gap-2 p-4 h-full">
                    {Array(16)
                      .fill(0)
                      .map((_, j) => (
                        <div
                          key={j}
                          className="bg-slate-400 rounded-md"
                        ></div>
                      ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

      {/* Current card animation - flies to the deck first */}
      <motion.div
        className="absolute w-[480px] h-[320px] bg-white rounded-xl shadow-md border border-slate-200"
        initial={{
          x: 0,
          y: 0,
          scale: 1,
          rotateZ: 0,
          opacity: 1,
        }}
        animate={{
          x: -300,
          y: 100,
          scale: 0.6,
          rotateZ: -10,
          opacity: 0,
        }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
          mass: 1,
          duration: 0.8,
        }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <BookOpen className="h-12 w-12 text-slate-300" />
          <div className="mt-3 text-slate-300 font-medium">
            Current Card
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}