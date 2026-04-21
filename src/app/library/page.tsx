import Link from "next/link";
import { PageContainer } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/server/prisma";
import { BookOpen, Calendar, Clock, Sparkles } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function LibraryPage() {
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

  return (
    <PageContainer>
      <div className="max-w-5xl mx-auto py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">Your Library</h1>
            <p className="text-slate-700 text-lg">Manage your decks and track your mastery progress.</p>
          </div>
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link href="/generate">
              <Sparkles className="w-4 h-4 mr-2" />
              Generate New Deck
            </Link>
          </Button>
        </div>

        {formattedDecks.length === 0 ? (
          <Card className="p-12 border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-center">
            <BookOpen className="w-16 h-16 text-slate-400 mb-6" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No decks yet</h3>
            <p className="text-slate-700 mb-6 max-w-md">You haven't generated any flashcard decks yet. Upload a PDF to get started.</p>
            <Button asChild variant="secondary" className="border-slate-200 hover:bg-slate-100 text-slate-900">
              <Link href="/generate">Generate your first deck</Link>
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formattedDecks.map((deck) => (
              <Card key={deck.id} className="p-6 bg-white border-slate-200 hover:border-slate-300 transition-all flex flex-col">
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-slate-900 mb-1 truncate" title={deck.title}>
                    {deck.title}
                  </h3>
                  {deck.sourceFileName && (
                    <p className="text-sm text-slate-500 mb-4 flex items-center">
                      <BookOpen className="w-3 h-3 mr-1" />
                      {deck.sourceFileName}
                    </p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 my-6">
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                      <p className="text-xs text-slate-500 mb-1 flex items-center uppercase tracking-wider font-semibold">
                        <Clock className="w-3 h-3 mr-1 text-orange-600" />
                        Due
                      </p>
                      <p className="text-2xl font-bold text-orange-600">{deck.dueToday}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                      <p className="text-xs text-slate-500 mb-1 flex items-center uppercase tracking-wider font-semibold">
                        <Calendar className="w-3 h-3 mr-1 text-blue-500" />
                        Total
                      </p>
                      <p className="text-2xl font-bold text-slate-900">{deck.totalCards}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4 border-t border-slate-100 mt-2">
                  <Button asChild className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-900" variant="secondary">
                    <Link href={`/deck/${deck.id}`}>Details</Link>
                  </Button>
                  <Button asChild className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" disabled={deck.dueToday === 0}>
                    <Link href={deck.dueToday > 0 ? `/study/${deck.id}` : '#'}>
                      Study
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
