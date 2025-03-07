"use client";
import { motion, AnimatePresence } from "motion/react";
import { GetAllAnkiCardsInDeckUsecase } from "@/use-cases/anki-usecases";
import { AnkiCardType } from "@/db/schema/schema";
import { useEffect, useState, useCallback } from "react";
import { FinishDeckModal } from "./finish-deck-modal";
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Trophy } from "lucide-react";
import {
  CelebrationEffects,
  ControlPanel,
  DeckVisualization,
  FlashcardDisplay,
  KeyboardShortcutsPanel,
  LoadingState,
  ShuffleAnimation,
} from "@/components/features/Anki";
import { authClient } from "@/lib/auth-client";

// Final achievement message
const ACHIEVEMENT_MESSAGE = "Congratulations! Full Deck Mastered! 🏆";

export function LearnAnkicardsView({
  deckId,
  deckUserId,
  setAddingCards,
}: {
  deckId: string;
  deckUserId?: string;
  setAddingCards: (addingCards: boolean) => void;
}) {
  const session = authClient.useSession();
  const userId = session.data?.user.id;
  const [cards, setCards] = useState<AnkiCardType[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [isDeckCompleted, setIsDeckCompleted] = useState(false);

  // States for completion celebration
  const [showCelebration, setShowCelebration] = useState(false);
  const [showAchievement, setShowAchievement] = useState(false);
  const [achievementMessage, setAchievementMessage] = useState("");
  const [lastCompletedCard, setLastCompletedCard] = useState(-1);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const deckCards = await GetAllAnkiCardsInDeckUsecase(deckId);
        // Shuffle the cards for better learning experience
        const shuffledCards = [...(deckCards || [])].sort(
          () => Math.random() - 0.5
        );
        setCards(shuffledCards);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch cards:", error);
        setLoading(false);
      }
    };

    fetchCards();
  }, [deckId]);

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isTransitioning) return;

    // Allow next click on the last card to trigger completion view
    if (currentCardIndex === cards.length - 1) {
      setIsTransitioning(true);
      setIsFlipped(false);

      // Animate the last card into the deck and show completion view
      setTimeout(() => {
        setAchievementMessage(ACHIEVEMENT_MESSAGE);
        setShowAchievement(true);
        setShowCelebration(true);
        setIsDeckCompleted(true);
        setIsTransitioning(false);
        setTimeout(() => setShowAchievement(false), 4000);
      }, 400);
      return;
    }

    setIsTransitioning(true);
    setIsFlipped(false);

    // Update completed card tracking
    if (currentCardIndex === lastCompletedCard) {
      setLastCompletedCard(currentCardIndex + 1);
    }

    setTimeout(() => {
      setCurrentCardIndex((prev) => prev + 1);
      setIsTransitioning(false);
    }, 400);
  };

  const handleFinishDeck = () => {
    setShowFinishModal(true);
  };

  const handleRestartDeck = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setIsDeckCompleted(false);
    // Optionally reshuffle
    setCards((prevCards) => [...prevCards].sort(() => Math.random() - 0.5));
  };

  const handleBackToDeck = () => {
    window.history.back();
  };

  const handlePrevious = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isTransitioning || currentCardIndex <= 0) return;

    setIsTransitioning(true);
    setIsFlipped(false);

    setTimeout(() => {
      setCurrentCardIndex((prev) => prev - 1);
      setIsTransitioning(false);
    }, 400);
  };

  const handleFlip = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!isTransitioning) {
      setIsFlipped(!isFlipped);
    }
  };

  // Add keyboard shortcut handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (isTransitioning || isDeckCompleted) return;

      if (e.code === "Space") {
        e.preventDefault();
        setIsFlipped(!isFlipped);
      } else if (
        e.code === "ArrowRight" &&
        currentCardIndex < cards.length - 1
      ) {
        e.preventDefault();
        handleNext();
      } else if (e.code === "ArrowLeft" && currentCardIndex > 0) {
        e.preventDefault();
        handlePrevious();
      }
    },
    [
      isFlipped,
      isTransitioning,
      currentCardIndex,
      cards.length,
      isDeckCompleted,
    ]
  );

  const handleShuffle = () => {
    setIsShuffling(true);

    // Wait for animation to complete before actually shuffling
    setTimeout(() => {
      setCurrentCardIndex(0);
      setIsFlipped(false);
      setCards((prevCards) => [...prevCards].sort(() => Math.random() - 0.5));
      setIsShuffling(false);
    }, 1500); // Animation duration
  };

  // Set up keyboard event listeners
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Calculate progress percentage
  const progressPercentage =
    Math.round((currentCardIndex / (cards.length - 1)) * 100) || 0;

  // Render loading and empty states
  if (loading || cards.length === 0) {
    return (
      <LoadingState
        isLoading={loading}
        isEmpty={!loading && cards.length === 0}
        onBack={() => window.history.back()}
      />
    );
  }

  // Render completion view
  const renderCompletionView = () => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center justify-center h-full w-full"
      >
        <div className="bg-white rounded-xl p-8 shadow-md border border-slate-200 max-w-md w-full text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center">
              <Trophy className="h-10 w-10 text-green-500" />
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-2">Deck Completed!</h2>
          <p className="text-slate-600 mb-8">
            Congratulations! You've reviewed all the cards in this deck. What
            would you like to do next?
          </p>

          <div className="space-y-3">
            <Button
              onClick={handleRestartDeck}
              className="w-full flex items-center justify-center gap-2"
              variant="outline"
            >
              <RotateCcw className="h-4 w-4" />
              Practice Again
            </Button>

            <Button
              onClick={handleFinishDeck}
              className="w-full flex items-center justify-center gap-2"
              variant="default"
            >
              <Trophy className="h-4 w-4" />
              Complete & Earn Points
            </Button>

            <Button
              onClick={handleBackToDeck}
              className="w-full flex items-center justify-center gap-2"
              variant="ghost"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Deck
            </Button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-screen h-[calc(100vh-64px)] flex bg-gradient-to-br from-indigo-50 via-white to-blue-50 relative overflow-hidden">
      <FinishDeckModal
        isOpen={showFinishModal}
        onClose={() => setShowFinishModal(false)}
        points={100}
        deckId={deckId}
        deckName={""}
      />

      <CelebrationEffects
        showCelebration={showCelebration}
        showAchievement={showAchievement}
        achievementMessage={achievementMessage}
      />

      <KeyboardShortcutsPanel
        onShuffle={handleShuffle}
        isShuffling={isShuffling}
        isDeckCompleted={isDeckCompleted}
        isUsersDeck={deckUserId === userId}
        setAddingCards={setAddingCards}
      />

      <DeckVisualization
        cards={cards}
        currentCardIndex={currentCardIndex}
        isShuffling={isShuffling}
        progressPercentage={progressPercentage}
      />

      {/* Right side - Current card and controls */}
      <div className="w-2/3 h-full flex flex-col items-center justify-center p-8 bg-white/80 backdrop-blur-sm">
        {isDeckCompleted ? (
          renderCompletionView()
        ) : (
          <>
            <div className="relative w-[480px] h-[320px] mb-12">
              <AnimatePresence mode="wait">
                {!isShuffling && cards.length > 0 && (
                  <motion.div
                    key={`card-container-${currentCardIndex}`}
                    initial={{
                      x: 300,
                      y: -100,
                      opacity: 0,
                      scale: 0.8,
                      rotateZ: 5,
                    }}
                    animate={{
                      x: 0,
                      y: 0,
                      opacity: 1,
                      scale: 1,
                      rotateZ: 0,
                    }}
                    exit={{
                      x: -300,
                      y: 100,
                      opacity: 0,
                      scale: 0.8,
                      rotateZ: -5,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                    }}
                    className="absolute inset-0 [perspective:1000px]"
                  >
                    <FlashcardDisplay
                      card={cards[currentCardIndex]}
                      isFlipped={isFlipped}
                      isTransitioning={isTransitioning}
                      onFlip={() => setIsFlipped(!isFlipped)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Shuffle animation */}
              <ShuffleAnimation isShuffling={isShuffling} cards={cards} />
            </div>

            {/* Controls - Now outside the animation container */}
            <div onClick={() => !isTransitioning && setIsFlipped(!isFlipped)}>
              <ControlPanel
                currentCardIndex={currentCardIndex}
                totalCards={cards.length}
                isTransitioning={isTransitioning}
                isShuffling={isShuffling}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onFlip={handleFlip}
                onShuffle={handleShuffle}
                onFinish={handleFinishDeck}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
