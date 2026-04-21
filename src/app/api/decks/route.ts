import { NextResponse } from 'next/server';
import { prisma } from '@/lib/server/prisma';

export async function GET() {
  try {
    const decks = await prisma.deck.findMany({
      include: {
        _count: {
          select: { cards: true }
        },
        cards: {
          select: {
            dueDate: true,
            easeFactor: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const now = new Date();

    const formattedDecks = decks.map(deck => {
      const dueCards = deck.cards.filter(c => c.dueDate <= now).length;
      const masteredCards = deck.cards.filter(c => c.easeFactor > 2.5).length;
      
      return {
        id: deck.id,
        title: deck.title,
        sourceFileName: deck.sourceFileName,
        createdAt: deck.createdAt,
        totalCards: deck._count.cards,
        dueToday: dueCards,
        mastered: masteredCards
      };
    });

    return NextResponse.json(formattedDecks);
  } catch (error) {
    console.error('Error fetching decks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
