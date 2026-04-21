import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/page-shell";
import { StudyShell } from "@/components/study/study-shell";
import { prisma } from "@/lib/server/prisma";
import { deck as mockDeckInfo, flashcards } from "@/data/mock-data";

export const dynamic = 'force-dynamic';

export default async function StudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  let deck = await prisma.deck.findUnique({
    where: { id: slug },
    include: { cards: true }
  });

  if (!deck && slug === "quadratic-equations") {
    // Auto-seed the demo deck if it doesn't exist
    deck = await prisma.deck.create({
      data: {
        id: "quadratic-equations",
        title: mockDeckInfo.title,
        sourceFileName: mockDeckInfo.source,
        cards: {
          create: flashcards.map(card => ({
            question: card.question,
            answer: card.answer,
            type: card.type,
            topic: card.topic,
          }))
        }
      },
      include: { cards: true }
    });
  }

  if (!deck) {
    notFound();
  }

  const now = new Date();
  
  // Filter only due cards
  const dueCards = deck.cards.filter(c => c.dueDate <= now);

  if (dueCards.length === 0) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900">All Caught Up!</h2>
          <p className="text-slate-700 max-w-md">You have no due cards for this deck. Excellent job staying on top of your reviews.</p>
        </div>
      </PageContainer>
    );
  }

  // Calculate weak topics
  const weakCards = deck.cards.filter(c => c.easeFactor < 2.0 || (c.repetitions > 0 && c.interval < 3));
  const topicCounts: Record<string, number> = {};
  weakCards.forEach(c => {
    const topic = c.topic || 'General';
    topicCounts[topic] = (topicCounts[topic] || 0) + 1;
  });

  const weakTopics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(entry => entry[0]);

  return (
    <PageContainer>
      <StudyShell deck={deck} dueCards={dueCards} weakTopics={weakTopics} />
    </PageContainer>
  );
}
