import Link from "next/link";
import { ArrowRight, FileText, LayoutDashboard, Calendar, Trophy, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/dashboard/stat-card";

interface CardData {
  id: string;
  question: string;
  answer: string;
  type: string;
  topic: string | null;
  easeFactor: number;
}

interface DeckOverviewProps {
  deck: {
    id: string;
    title: string;
    sourceFileName: string | null;
    createdAt: Date;
    cards: CardData[];
  };
  stats: {
    totalCards: number;
    dueToday: number;
    mastered: number;
    weakTopics: string[];
  };
}

const getTypeColor = (type: string) => {
  const t = type.toLowerCase();
  if (t.includes('concept')) return 'bg-blue-100 text-blue-700';
  if (t.includes('application') || t.includes('example')) return 'bg-green-100 text-green-700';
  if (t.includes('relationship')) return 'bg-purple-100 text-purple-700';
  if (t.includes('tricky') || t.includes('misconception')) return 'bg-orange-100 text-orange-700';
  return 'bg-slate-100 text-slate-700';
};

export function DeckOverview({ deck, stats }: DeckOverviewProps) {
  // Compute topic clusters from cards
  const topicsMap: Record<string, { total: number, mastered: number }> = {};
  deck.cards.forEach(card => {
    const topic = card.topic || 'General';
    if (!topicsMap[topic]) {
      topicsMap[topic] = { total: 0, mastered: 0 };
    }
    topicsMap[topic].total += 1;
    if (card.easeFactor > 2.5) {
      topicsMap[topic].mastered += 1;
    }
  });

  const topicClusters = Object.entries(topicsMap).map(([name, data]) => ({
    name,
    cards: data.total,
    mastery: Math.round((data.mastered / data.total) * 100) || 0
  })).sort((a, b) => b.cards - a.cards).slice(0, 5);

  // Compute card types
  const typesMap: Record<string, number> = {};
  deck.cards.forEach(card => {
    typesMap[card.type] = (typesMap[card.type] || 0) + 1;
  });

  const cardTypes = Object.entries(typesMap).map(([label, count]) => ({
    label, count
  })).sort((a, b) => b.count - a.count);

  const statCards = [
    { label: "Total cards", value: stats.totalCards.toString(), detail: "Generated cards", icon: LayoutDashboard },
    { label: "Due today", value: stats.dueToday.toString(), detail: stats.dueToday > 0 ? "Needs review" : "All caught up", icon: Calendar },
    { label: "Mastered", value: stats.mastered.toString(), detail: `${Math.round((stats.mastered / (stats.totalCards || 1)) * 100)}% of deck`, icon: Trophy },
    { label: "Weak topics", value: stats.weakTopics.length.toString(), detail: "Require attention", icon: AlertTriangle }
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <Badge variant="accent">Deck</Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {deck.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {deck.sourceFileName && (
              <span className="inline-flex items-center gap-2">
                <FileText className="size-4" aria-hidden="true" />
                {deck.sourceFileName}
              </span>
            )}
            <span>Created {new Date(deck.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <Button size="lg" disabled={stats.dueToday === 0} asChild>
          <Link href={`/study/${deck.id}`}>
            Start review
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Topic clusters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {topicClusters.length > 0 ? topicClusters.map((topic) => (
              <div key={topic.name}>
                <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-foreground">{topic.name}</span>
                  <span className="text-muted-foreground">{topic.cards} cards</span>
                </div>
                <Progress value={topic.mastery} />
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">No topics found.</p>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Card type breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {cardTypes.length > 0 ? cardTypes.map((type) => (
                <div
                  key={type.label}
                  className="flex items-center justify-between rounded-lg bg-muted px-4 py-3 text-sm"
                >
                  <span className="font-medium text-foreground">{type.label}</span>
                  <span className="text-muted-foreground">{type.count}</span>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">No card types found.</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Weak topics to review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.weakTopics.length > 0 ? stats.weakTopics.map((topic) => (
                <p key={topic} className="rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground">
                  {topic}
                </p>
              )) : (
                <p className="text-sm text-muted-foreground">No weak topics detected yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Flashcard preview
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {deck.cards.slice(0, 6).map((card) => (
            <div 
              key={card.id}
              className="group relative rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl"
              style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
            >
              {/* Subtle top gradient accent */}
              <div className="absolute top-0 left-0 h-1 w-full rounded-t-2xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-80" />
              
              <div className="flex h-full flex-col p-6" style={{ transform: 'translateZ(20px)' }}>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(card.type)}`}>
                    {card.type}
                  </span>
                  {card.topic && <span className="text-xs text-slate-500 text-right">{card.topic}</span>}
                </div>
                
                <h3 className="mb-3 text-lg font-semibold text-slate-900 line-clamp-2 group-hover:text-blue-700 transition-colors">
                  {card.question}
                </h3>
                
                <div className="mt-auto">
                  <div className="mt-2 p-3 rounded-lg bg-slate-100/60 border border-slate-200/50">
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {card.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
