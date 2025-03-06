"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { motion } from "motion/react";
import { Trophy, Star, Medal, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";

interface FinishDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  points?: number;
}

export function FinishDeckModal({
  isOpen,
  onClose,
  points = 100,
}: FinishDeckModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-indigo-50 via-white to-blue-50 border-none shadow-xl">
        <div className="sr-only">
          <DialogTitle>Deck finished</DialogTitle>
        </div>
        <div className="flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
          {/* Animated trophy */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 1.5 }}
            className="mb-6"
          >
            <div className="w-24 h-24 rounded-full bg-yellow-100 flex items-center justify-center">
              <Trophy className="w-12 h-12 text-yellow-500" />
            </div>
          </motion.div>

          {/* Floating stars */}
          <motion.div className="absolute inset-0 pointer-events-none">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0.5, 1.5, 0.5],
                    x: Math.cos((i * 72 * Math.PI) / 180) * 100,
                    y: Math.sin((i * 72 * Math.PI) / 180) * 100,
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                >
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                </motion.div>
              ))}
          </motion.div>

          {/* Congratulatory text with animation */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-indigo-900 mb-4"
          >
            Congratulations! 🎉
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-indigo-700 mb-6"
          >
            <p>You've mastered this deck!</p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Medal className="w-5 h-5 text-yellow-500" />
              <span className="text-lg font-semibold">
                {points} Points Earned
              </span>
            </div>
          </motion.div>

          {/* Achievement badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4 mb-6"
          >
            <div className="flex flex-col items-center bg-white/50 rounded-lg p-3 shadow-sm">
              <PartyPopper className="w-6 h-6 text-indigo-500 mb-1" />
              <span className="text-xs font-medium text-indigo-700">
                Deck Master
              </span>
            </div>
            <div className="flex flex-col items-center bg-white/50 rounded-lg p-3 shadow-sm">
              <Star className="w-6 h-6 text-yellow-500 mb-1" />
              <span className="text-xs font-medium text-indigo-700">
                Perfect Score
              </span>
            </div>
          </motion.div>

          {/* Close button */}
          <Button
            onClick={onClose}
            className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white shadow-md hover:shadow-lg transition-all"
          >
            Continue Learning
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
