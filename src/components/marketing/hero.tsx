import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function Hero() {
  return (
    <section className="grid items-center gap-10 py-6 lg:grid-cols-[1.02fr_0.98fr] lg:py-14">
      <div className="max-w-3xl">
        <Badge variant="accent">AI study decks from real course material</Badge>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Turn PDFs into practice-ready flashcards
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
          Flashcard Engine helps students move from passive reading to active
          recall with AI-powered comprehension, topic-aware cards, and spaced
          repetition signals built into every deck.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/generate">
              Generate your first deck
              <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden bg-surface p-5 shadow-lg">
        <div className="rounded-lg border border-border bg-background p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-foreground">
                Quadratic Equations
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Algebra II - Chapter 4.pdf
              </p>
            </div>
            <Badge variant="warning">18 due</Badge>
          </div>
          <div className="mt-6 rounded-lg border border-border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              Smart review
            </p>
            <h2 className="mt-3 text-xl font-semibold tracking-tight text-foreground">
              What does the discriminant tell you?
            </h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Answer hidden until you are ready to reveal, rate, and schedule the
              next review.
            </p>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-xs font-medium text-muted-foreground">Mastery</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">61%</p>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-xs font-medium text-muted-foreground">
                Weak topic
              </p>
              <p className="mt-2 text-sm font-semibold text-foreground">
                Completing the square
              </p>
            </div>
          </div>
          <Progress value={61} label="Deck readiness" className="mt-5" />
        </div>
      </Card>
    </section>
  );
}
