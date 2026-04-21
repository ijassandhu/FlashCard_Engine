import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/page-shell";
import { DeckOverview } from "@/components/dashboard/deck-overview";
import { prisma } from "@/lib/server/prisma";
import { deck as mockDeckInfo, flashcards } from "@/data/mock-data";

export const dynamic = 'force-dynamic';

export default async function DeckPage({ params }: { params: Promise<{ slug: string }> }) {
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
  const dueCards = deck.cards.filter(c => c.dueDate <= now);
  const masteredCards = deck.cards.filter(c => c.easeFactor >= 2.5 && c.repetitions > 2);
  
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

  const stats = {
    totalCards: deck.cards.length,
    dueToday: dueCards.length,
    mastered: masteredCards.length,
    weakTopics
  };

  return (
    <PageContainer>
      <DeckOverview deck={deck} stats={stats} />
    </PageContainer>
  );
}
