import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/server/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deck = await prisma.deck.findUnique({
      where: { id },
      include: {
        cards: true
      }
    });

    if (!deck) {
      return NextResponse.json({ error: 'Deck not found' }, { status: 404 });
    }

    const now = new Date();
    const dueCards = deck.cards.filter(c => c.dueDate <= now);
    const masteredCards = deck.cards.filter(c => c.easeFactor >= 2.5 && c.repetitions > 2);
    
    // Calculate weak topics
    const weakCards = deck.cards.filter(c => c.easeFactor < 2.0 || (c.repetitions > 0 && c.interval < 3));
    const topicCounts: Record<string, number> = {};
    weakCards.forEach(c => {
      if (c.topic) {
        topicCounts[c.topic] = (topicCounts[c.topic] || 0) + 1;
      }
    });

    const weakTopics = Object.entries(topicCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(entry => entry[0]);

    return NextResponse.json({
      deck,
      stats: {
        totalCards: deck.cards.length,
        dueToday: dueCards.length,
        mastered: masteredCards.length,
        weakTopics
      }
    });
  } catch (error) {
    console.error('Error fetching deck:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
