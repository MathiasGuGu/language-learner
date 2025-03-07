"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, ArrowLeft, Plus, Check, Layers } from "lucide-react";
import { useRouter } from "next/navigation";
import { CreateAnkiCardUsecase } from "@/use-cases/anki-usecases";
import { GetAllAnkiCardsInDeckUsecase } from "@/use-cases/anki-usecases";
import { AnkiCardType } from "@/db/schema/schema";
import { authClient } from "@/lib/auth-client";
import { Progress } from "@/components/ui/progress";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";

type Step = "empty" | "add-card" | "success";

export default function AddAnkicardsView({
  deckId,
  setAddingCards,
}: {
  deckId: string;
  setAddingCards: (addingCards: boolean) => void;
}) {
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
    setAddingCards(false);
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
    <div className="w-screen h-[calc(100vh-64px)] overflow-y-auto bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="w-full flex flex-col gap-8">
          {/* Header Section - Improved */}
          <div className="relative rounded-lg bg-white p-8 shadow-sm border border-indigo-200 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-indigo-600"></div>
            <div className="relative flex justify-between items-start">
              <div className="w-full lg:w-1/2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                    <Layers className="h-5 w-5 text-indigo-600" strokeWidth={1.5} />
                  </div>
                  <Badge variant="outline" className="border-indigo-200 bg-indigo-50 text-indigo-700 font-medium">
                    {cards.length} {cards.length === 1 ? "Card" : "Cards"}
                  </Badge>
                </div>
                <h1 className="text-3xl font-bold mb-2 text-slate-900">
                  Create Flashcards
                </h1>
                <p className="text-slate-600 text-lg mb-4">
                  Build your deck with new vocabulary cards to enhance your learning
                </p>
                <Progress
                  value={getProgress()}
                  className="h-1.5 w-full lg:w-3/4 mt-2 mb-1"
                />
                <p className="text-sm text-slate-500">
                  {step === "empty"
                    ? "Get started by adding your first card"
                    : step === "add-card"
                      ? "Creating new flashcards"
                      : "Card successfully created"}
                </p>
              </div>
              <div className="hidden lg:flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setAddingCards(false);
                    router.push(`/anki/deck/${deckId}`);
                  }}
                  className="border-slate-200 hover:bg-slate-100 transition-colors duration-100"
                >

                  <ArrowLeft className="mr-2 h-4 w-4" strokeWidth={1.6} /> Back to Deck
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Card Form Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {step === "empty" ? "Get Started" : step === "add-card" ? "Add a Card" : "Success!"}
                  </h2>
                </div>
                <div className="p-6">
                  {step === "empty" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center py-8"
                    >
                      <div className="mb-6 inline-flex p-4 rounded-full bg-indigo-50">
                        <Plus className="h-12 w-12 text-indigo-600" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-xl font-bold mb-4 text-slate-900">
                        Welcome to Your New Deck
                      </h3>
                      <p className="text-slate-600 mb-8 max-w-md mx-auto">
                        Your deck is empty and ready for new flashcards. Start by
                        adding your first card to begin your learning journey.
                      </p>
                      <Button
                        onClick={() => setStep("add-card")}
                        size="lg"
                        className="bg-indigo-600 hover:bg-indigo-700 transition-colors duration-100"
                      >
                        Create Your First Card <ArrowRight className="ml-2 group-hover:ml-3 transition-all duration-300" strokeWidth={1.6} />
                      </Button>
                    </motion.div>
                  )}

                  {step === "add-card" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6"
                    >
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">
                          Original Text
                        </label>
                        <Textarea
                          value={original}
                          onChange={(e) => setOriginal(e.target.value)}
                          placeholder="Enter the word or phrase you want to learn"
                          className="h-24 resize-none focus:ring-2 focus:ring-indigo-500 border-slate-200"
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
                          className="h-24 resize-none focus:ring-2 focus:ring-indigo-500 border-slate-200"
                        />
                      </div>
                      <div className="pt-4 flex justify-end">
                        <Button
                          onClick={handleAddCard}
                          disabled={!original || !translation || loading}
                          className="bg-indigo-600 hover:bg-indigo-700 transition-colors duration-100"
                        >
                          {loading ? (
                            <>
                              Adding <span className="ml-2 animate-pulse">...</span>
                            </>
                          ) : (
                            <>
                              Add Card <Plus className="ml-2" strokeWidth={1.6} />
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
                      className="text-center py-8"
                    >
                      <div className="mb-6 inline-flex p-4 rounded-full bg-emerald-50">
                        <Check className="h-12 w-12 text-emerald-600" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-xl font-bold mb-4 text-slate-900">
                        Card Added Successfully!
                      </h3>
                      <p className="text-slate-600 mb-8 max-w-md mx-auto">
                        Your flashcard has been added to the deck. What would you like
                        to do next?
                      </p>
                      <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button
                          variant="outline"
                          onClick={handleAddMore}
                          className="border-slate-200 hover:bg-slate-100"
                        >
                          Add More Cards <Plus className="ml-2" strokeWidth={1.6} />
                        </Button>
                        <Button
                          onClick={handleFinish}
                          className="bg-indigo-600 hover:bg-indigo-700 transition-colors duration-100"
                        >
                          Go to Deck <ArrowRight className="ml-2 group-hover:ml-3 transition-all duration-300" strokeWidth={1.6} />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar - Card Preview */}
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center">
                    <Layers className="h-5 w-5 text-indigo-600 mr-2" strokeWidth={1.5} />
                    Your Flashcards
                  </h2>
                </div>
                <div className="p-6">
                  {cards.length === 0 ? (
                    <div className="flex items-center justify-center h-48 text-slate-400 flex-col">
                      <div className="w-24 h-32 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center mb-4">
                        <Plus className="h-6 w-6 text-slate-300" strokeWidth={1.6} />
                      </div>
                      <p className="text-center text-sm font-medium">
                        No cards yet. Add your first card!
                      </p>
                    </div>
                  ) : (
                    <div className="relative h-64 flex items-center justify-center">
                      {/* Stacked cards effect */}
                      {cards
                        .slice(Math.max(0, cards.length - 3))
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
                            className="absolute w-full bg-gradient-to-tr from-indigo-50 to-white border border-indigo-200 rounded-lg shadow-sm p-4 flex flex-col"
                            style={{ zIndex: index }}
                          >
                            <div className="text-xs text-slate-500 mb-1">Original</div>
                            <h3 className="text-lg font-medium mb-3 flex-grow text-slate-900">
                              {card.original}
                            </h3>
                            <div className="border-t border-indigo-100 pt-3">
                              <div className="text-xs text-slate-500 mb-1">
                                Translation
                              </div>
                              <p className="text-sm text-slate-700">{card.translation}</p>
                            </div>
                          </motion.div>
                        ))}

                      {cards.length > 3 && (
                        <div className="absolute bottom-0 left-0 right-0 text-center text-slate-500 text-xs">
                          +{cards.length - 3} more cards
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="border-t border-slate-200 bg-slate-50 p-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-slate-500">Total cards: {cards.length}</p>
                    {cards.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.push(`/anki/deck/${deckId}`)}
                        className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                      >
                        View All
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              <div className="lg:hidden">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/anki/deck/${deckId}`)}
                  className="w-full border-slate-200 hover:bg-slate-100 transition-colors duration-100"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" strokeWidth={1.6} /> Back to Deck
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
