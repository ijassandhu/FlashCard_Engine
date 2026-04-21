"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

interface CardData {
  id: string;
  question: string;
  answer: string;
  type: string;
  topic: string | null;
}

interface StudyShellProps {
  deck: {
    id: string;
    title: string;
    sourceFileName: string | null;
  };
  dueCards: CardData[];
  weakTopics: string[];
}

const ratingControls = [
  {
    label: "Again ❌",
    hint: "1",
    variant: "secondary" as const,
    rating: "Again",
    className:
      "border-red-200 bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800 rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-[1.02]",
  },
  {
    label: "Hard ⚠️",
    hint: "2",
    variant: "secondary" as const,
    rating: "Hard",
    className:
      "border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 hover:text-orange-800 rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-[1.02]",
  },
  {
    label: "Good 👍",
    hint: "3",
    variant: "default" as const,
    rating: "Good",
    className:
      "bg-blue-600 text-white hover:bg-blue-700 rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-[1.02]",
  },
  {
    label: "Easy ✅",
    hint: "4",
    variant: "secondary" as const,
    rating: "Easy",
    className:
      "border-green-200 bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 rounded-xl shadow-sm hover:shadow-md transition-all hover:scale-[1.02]",
  },
];

const getTypeColor = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes("concept")) return "bg-blue-100 text-blue-700";
  if (t.includes("example")) return "bg-green-100 text-green-700";
  if (t.includes("relationship")) return "bg-purple-100 text-purple-700";
  if (t.includes("tricky") || t.includes("misconception"))
    return "bg-red-100 text-red-700";
  return "bg-slate-100 text-slate-700";
};

export function StudyShell({ deck, dueCards, weakTopics }: StudyShellProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    reviewed: 0,
    correct: 0,
    hard: 0,
    streak: 0,
  });

  const currentCard = dueCards[currentIndex];
  const progress = Math.round((currentIndex / dueCards.length) * 100);
  const remainingCards = dueCards.length - currentIndex;

  const handleReveal = useCallback(() => {
    setIsRevealed(true);
  }, []);

  const handleRate = useCallback(
    async (rating: string) => {
      if (!currentCard || isSubmitting) return;

      setIsSubmitting(true);

      try {
        await fetch("/api/review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cardId: currentCard.id,
            rating,
          }),
        });

        // Update stats optimistically
        setStats((prev) => ({
          reviewed: prev.reviewed + 1,
          correct:
            rating === "Good" || rating === "Easy"
              ? prev.correct + 1
              : prev.correct,
          hard: rating === "Hard" ? prev.hard + 1 : prev.hard,
          streak: rating === "Good" || rating === "Easy" ? prev.streak + 1 : 0,
        }));

        // Next card
        setIsRevealed(false);
        setCurrentIndex((prev) => prev + 1);
      } catch (err) {
        console.error("Failed to submit review:", err);
      } finally {
        setIsSubmitting(false);
      }
    },
    [currentCard, isSubmitting]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmitting) return;

      if (e.code === "Space") {
        e.preventDefault(); // prevent scrolling
        if (!isRevealed) {
          handleReveal();
        }
      } else if (isRevealed) {
        if (e.key === "1") handleRate("Again");
        if (e.key === "2") handleRate("Hard");
        if (e.key === "3") handleRate("Good");
        if (e.key === "4") handleRate("Easy");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRevealed, isSubmitting, handleReveal, handleRate]);

  if (currentIndex >= dueCards.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 text-center">
        <h2 className="text-3xl font-bold text-slate-900">Session Complete!</h2>
        <p className="text-slate-700 max-w-md">
          You've finished all due cards for this deck. Check back later for more
          reviews.
        </p>
        <Button
          onClick={() => router.push(`/deck/${deck.id}`)}
          size="lg"
          className="rounded-xl shadow-md hover:shadow-lg transition"
        >
          Return to Deck Overview
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <Badge
            variant="secondary"
            className="bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            Study session
          </Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {deck.title}
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            {currentIndex + 1} of {dueCards.length} due cards · {remainingCards}{" "}
            remaining
          </p>
        </div>
        <div className="min-w-64">
          <Progress
            value={progress}
            label="Session progress"
            className="bg-slate-200"
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <Card className="min-h-[520px] rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-slate-50 border border-slate-200">
          <CardHeader className="border-b border-slate-200 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(
                    currentCard.type
                  )}`}
                >
                  {currentCard.type}
                </span>
                {currentCard.topic && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                    {currentCard.topic}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium text-slate-400">
                Press Space to reveal
              </span>
            </div>
          </CardHeader>
          <CardContent className="flex min-h-[438px] flex-col justify-between p-6 sm:p-8">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <p className="text-xs uppercase text-slate-500 font-bold tracking-wider mb-2">
                QUESTION
              </p>
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-slate-900 leading-tight">
                {currentCard.question}
              </h2>
            </div>

            <div
              className={`rounded-xl bg-slate-100 p-5 mt-6 transition-all duration-500 ease-out ${
                isRevealed
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4 pointer-events-none absolute"
              }`}
            >
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-base leading-relaxed text-slate-700">
                    {currentCard.answer}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              {!isRevealed ? (
                <Button
                  className="w-full rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition h-14 text-lg font-medium shadow-md hover:shadow-lg"
                  onClick={handleReveal}
                >
                  Reveal Answer
                </Button>
              ) : (
                <div className="grid gap-3 sm:grid-cols-4 animate-in fade-in zoom-in duration-300">
                  {ratingControls.map((control) => (
                    <Button
                      key={control.label}
                      variant={control.variant}
                      onClick={() => handleRate(control.rating)}
                      disabled={isSubmitting}
                      className={`h-14 relative ${control.className || ""}`}
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        control.label
                      )}
                      {!isSubmitting && (
                        <span className="absolute top-1 right-2 text-[10px] text-slate-400">
                          {control.hint}
                        </span>
                      )}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <aside className="space-y-6">
          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">Weak topics</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {weakTopics.length > 0 ? (
                weakTopics.map((topic) => (
                  <span
                    key={topic}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-100"
                  >
                    {topic}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-500">
                  No weak topics yet.
                </span>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900">Session stats</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              {[
                ["Reviewed", stats.reviewed.toString()],
                ["Correct", stats.correct.toString()],
                ["Hard", stats.hard.toString()],
                ["Streak", stats.streak.toString()],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-xl bg-slate-50 border border-slate-100 p-4 transition hover:bg-slate-100"
                >
                  <p className="text-xs font-medium text-slate-500">{label}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">
                    {value}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs leading-6 text-slate-500 text-center shadow-sm">
            Shortcuts:{" "}
            <kbd className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-700">
              Space
            </kbd>{" "}
            reveal ·{" "}
            <kbd className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-slate-700">
              1-4
            </kbd>{" "}
            rate
          </div>
        </aside>
      </div>
    </div>
  );
}
