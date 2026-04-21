import { NextRequest, NextResponse } from 'next/server';
import { parsePdf, chunkText } from '@/lib/pdf/parse';
import { generateCardsFromText } from '@/lib/ai/generate';
import { prisma } from '@/lib/server/prisma';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse PDF
    const text = await parsePdf(buffer);
    
    // Chunk text
    const chunks = chunkText(text, 2500);
    
    // Limit to first 3 chunks to avoid massive API bills during testing
    const chunksToProcess = chunks.slice(0, 3);
    
    // Generate cards in parallel
    const allCards = [];
    for (const chunk of chunksToProcess) {
      const cards = await generateCardsFromText(chunk);
      allCards.push(...cards);
    }

    if (allCards.length === 0) {
      return NextResponse.json({ error: 'No cards could be generated' }, { status: 500 });
    }

    // Save to DB
    const deck = await prisma.deck.create({
      data: {
        title: file.name.replace(/\.[^/.]+$/, "") || 'Untitled Deck',
        sourceFileName: file.name,
        cards: {
          create: allCards.map(card => ({
            question: card.question,
            answer: card.answer,
            type: card.type,
            topic: card.topic,
          }))
        }
      }
    });

    return NextResponse.json({ deckId: deck.id });
  } catch (error) {
    console.error('Error generating deck:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
