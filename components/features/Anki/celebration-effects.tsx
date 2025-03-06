"use client";
import { useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Star, Trophy } from "lucide-react";

interface CelebrationEffectsProps {
  showCelebration: boolean;
  showAchievement: boolean;
  achievementMessage: string;
}

export function CelebrationEffects({
  showCelebration,
  showAchievement,
  achievementMessage,
}: CelebrationEffectsProps) {
  const confettiRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* Confetti celebration container */}
      <div
        ref={confettiRef}
        className="absolute inset-0 pointer-events-none z-50 overflow-hidden"
      >
        {/* Celebration particles */}
        {showCelebration && (
          <>
            {/* Confetti particles */}
            {Array(20)
              .fill(0)
              .map((_, i) => (
                <motion.div
                  key={`confetti-${i}`}
                  className={`absolute w-2 h-2 rounded-full ${
                    [
                      "bg-yellow-400",
                      "bg-green-400",
                      "bg-blue-400",
                      "bg-pink-400",
                      "bg-purple-400",
                    ][i % 5]
                  }`}
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: -20,
                    opacity: 1,
                  }}
                  animate={{
                    y: window.innerHeight + 20,
                    x: Math.random() * window.innerWidth,
                    opacity: [1, 1, 0],
                    rotate: Math.random() * 360,
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    ease: "easeOut",
                  }}
                />
              ))}

            {/* Stars */}
            {Array(10)
              .fill(0)
              .map((_, i) => (
                <motion.div
                  key={`star-${i}`}
                  className="absolute text-yellow-400"
                  initial={{
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    scale: 0,
                    opacity: 0,
                  }}
                  animate={{
                    scale: [0, 1.5, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.1,
                    ease: "easeInOut",
                  }}
                >
                  <Star className="h-6 w-6 fill-yellow-400" />
                </motion.div>
              ))}
          </>
        )}
      </div>

      {/* Achievement notification - compact version */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-lg shadow-md z-50 text-sm font-medium flex items-center gap-2"
          >
            <Trophy className="h-4 w-4 text-yellow-100" />
            <span>{achievementMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}