"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, ArrowLeft, Plus, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { CreateAnkiCardUsecase } from "@/use-cases/anki-usecases";
import { GetAllAnkiCardsInDeckUsecase } from "@/use-cases/anki-usecases";
import { AnkiCardType } from "@/db/schema/schema";
import { authClient } from "@/lib/auth-client";
import { Progress } from "@/components/ui/progress";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";

type Step = "empty" | "add-card" | "success";

export default function AddAnkicardsView({ deckId }: { deckId: string }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("empty");
  const [cards, setCards] = useState<AnkiCardType[]>([]);
  const [loading, setLoading] = useState(false);
  const [original, setOriginal] = useState("");
  const [translation, setTranslation] = useState("");
  const { data } = authClient.useSession();
  const userId = data?.user.id;

  // Fetch existing cards in the deck
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const deckCards = await GetAllAnkiCardsInDeckUsecase(deckId);
        setCards(deckCards || []);

        // If there are already cards, skip the empty state
        if (deckCards && deckCards.length > 0) {
          setStep("add-card");
        }
      } catch (error) {
        console.error("Failed to fetch cards:", error);
      }
    };

    fetchCards();
  }, [deckId]);

  const handleAddCard = async () => {
    if (!original || !translation) return;

    setLoading(true);
    try {
      if (!userId) throw new Error("Not authenticated");
      const newCard = {
        deckId,
        userId, // This will be filled by the server
        original,
        translation,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await CreateAnkiCardUsecase(newCard);

      // Add to local state for immediate UI update
      setCards([...cards, newCard as AnkiCardType]);
      setOriginal("");
      setTranslation("");
      setStep("success");
    } catch (error) {
      console.error("Failed to add card:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMore = () => {
    setStep("add-card");
  };

  const handleFinish = () => {
    router.push(`/anki/deck/${deckId}`);
  };

  // Calculate progress based on current step
  const getProgress = () => {
    switch (step) {
      case "empty":
        return 33;
      case "add-card":
        return 66;
      case "success":
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div className="w-screen h-[calc(100vh-64px)] flex bg-slate-50">
      {/* Left side - Card showcase with stacked effect */}
      <div className="w-1/3 h-full bg-gradient-to-br from-slate-100 to-slate-200 p-8 overflow-hidden relative">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Your Flashcards</h2>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-white">
              {cards.length} {cards.length === 1 ? "Card" : "Cards"}
            </Badge>
            <Badge variant="outline" className="bg-white">
              {deckId}
            </Badge>
          </div>
        </div>

        {cards.length === 0 ? (
          <div className="flex items-center justify-center h-[70%] text-slate-400 flex-col">
            <div className="w-48 h-64 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center mb-4">
              <Plus className="h-12 w-12 text-slate-300" />
            </div>
            <p className="text-center font-medium">
              No cards yet. Add your first card!
            </p>
          </div>
        ) : (
          <div className="relative h-[70%] flex items-center justify-center">
            {/* Stacked cards effect */}
            {cards
              .slice(Math.max(0, cards.length - 5))
              .reverse()
              .map((card, index, array) => (
                <motion.div
                  key={card.id || index}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{
                    y: index * -8,
                    opacity: 1,
                    rotateZ: (index - Math.floor(array.length / 2)) * 2,
                    scale: 1 - (array.length - index - 1) * 0.03,
                  }}
                  transition={{ delay: index * 0.1 }}
                  className="absolute w-64 h-80 bg-white rounded-lg shadow-md p-6 flex flex-col"
                  style={{ zIndex: index }}
                >
                  <div className="text-sm text-slate-500 mb-2">Original</div>
                  <h3 className="text-xl font-bold mb-4 flex-grow">
                    {card.original}
                  </h3>
                  <div className="border-t pt-4">
                    <div className="text-sm text-slate-500 mb-2">
                      Translation
                    </div>
                    <p className="text-slate-700">{card.translation}</p>
                  </div>
                </motion.div>
              ))}

            {cards.length > 5 && (
              <div className="absolute bottom-0 left-0 right-0 text-center text-slate-500 text-sm">
                +{cards.length - 5} more cards
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right side - Multi-step form with progress indicator */}
      <div className="w-2/3 h-full flex flex-col bg-white">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Badge variant={step === "empty" ? "default" : "outline"}>
                1
              </Badge>
              <span className={step === "empty" ? "font-medium" : ""}>
                Start
              </span>
            </div>
            <div className="h-px bg-slate-200 flex-grow mx-4"></div>
            <div className="flex items-center gap-2">
              <Badge variant={step === "add-card" ? "default" : "outline"}>
                2
              </Badge>
              <span className={step === "add-card" ? "font-medium" : ""}>
                Add Cards
              </span>
            </div>
            <div className="h-px bg-slate-200 flex-grow mx-4"></div>
            <div className="flex items-center gap-2">
              <Badge variant={step === "success" ? "default" : "outline"}>
                3
              </Badge>
              <span className={step === "success" ? "font-medium" : ""}>
                Complete
              </span>
            </div>
          </div>
          <Progress value={getProgress()} className="h-2" />
        </div>

        <div className="flex-grow flex items-center justify-center p-8 overflow-y-auto">
          <div className="w-full max-w-xl">
            {step === "empty" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-8 shadow-sm border"
              >
                <h1 className="text-3xl font-bold mb-6">
                  Welcome to Your New Deck
                </h1>
                <p className="text-lg text-slate-600 mb-8">
                  Your deck is empty and ready for new flashcards. Start by
                  adding your first card to begin your learning journey.
                </p>
                <div className="flex justify-center">
                  <Button
                    onClick={() => setStep("add-card")}
                    size="lg"
                    className="px-8 py-6 text-lg shadow-md hover:shadow-lg transition-all"
                  >
                    Create Your First Card <ArrowRight className="ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "add-card" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-8 shadow-sm border"
              >
                <h1 className="text-2xl font-bold mb-6">
                  Create a New Flashcard
                </h1>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Original Text
                    </label>
                    <Textarea
                      value={original}
                      onChange={(e) => setOriginal(e.target.value)}
                      placeholder="Enter the word or phrase you want to learn"
                      className="h-24 resize-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">
                      Translation
                    </label>
                    <Textarea
                      value={translation}
                      onChange={(e) => setTranslation(e.target.value)}
                      placeholder="Enter the translation or meaning"
                      className="h-24 resize-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="flex justify-between pt-8">
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/anki/deck/${deckId}`)}
                  >
                    <ArrowLeft className="mr-2" /> Back to Deck
                  </Button>
                  <Button
                    onClick={handleAddCard}
                    disabled={!original || !translation || loading}
                    className="shadow-sm"
                  >
                    {loading ? (
                      <>
                        Adding <span className="ml-2 animate-pulse">...</span>
                      </>
                    ) : (
                      <>
                        Add Card <Plus className="ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-8 shadow-sm border text-center"
              >
                <div className="flex justify-center mb-6">
                  <div className="bg-green-50 p-4 rounded-full">
                    <Check className="h-16 w-16 text-green-500" />
                  </div>
                </div>
                <h1 className="text-2xl font-bold mb-4">
                  Card Added Successfully!
                </h1>
                <p className="text-slate-600 mb-8">
                  Your flashcard has been added to the deck. What would you like
                  to do next?
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    variant="outline"
                    onClick={handleAddMore}
                    className="px-6"
                  >
                    Add More Cards <Plus className="ml-2" />
                  </Button>
                  <Button onClick={handleFinish} className="px-6 shadow-sm">
                    Go to Deck <ArrowRight className="ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
