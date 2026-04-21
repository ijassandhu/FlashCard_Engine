import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/server/prisma';
import { calculateSM2, getNextDueDate, Rating } from '@/lib/srs/sm2';

export async function POST(req: NextRequest) {
  try {
    const { cardId, rating } = await req.json() as { cardId: string; rating: Rating };

    if (!cardId || !rating) {
      return NextResponse.json({ error: 'Missing cardId or rating' }, { status: 400 });
    }

    const card = await prisma.card.findUnique({
      where: { id: cardId }
    });

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    const newSM2Data = calculateSM2(rating, {
      repetitions: card.repetitions,
      interval: card.interval,
      easeFactor: card.easeFactor
    });

    const nextDueDate = getNextDueDate(newSM2Data.interval);

    // Update card and create review log in a transaction
    const [updatedCard] = await prisma.$transaction([
      prisma.card.update({
        where: { id: cardId },
        data: {
          repetitions: newSM2Data.repetitions,
          interval: newSM2Data.interval,
          easeFactor: newSM2Data.easeFactor,
          dueDate: nextDueDate
        }
      }),
      prisma.reviewLog.create({
        data: {
          cardId,
          rating
        }
      })
    ]);

    return NextResponse.json(updatedCard);
  } catch (error) {
    console.error('Error recording review:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
