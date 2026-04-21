import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { StatCard } from "@/components/dashboard/stat-card";
import { libraryDecks, libraryStats } from "@/data/mock-data";

export function LibraryGrid() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <Badge variant="accent">Library</Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Your study decks
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
            Keep PDF-generated decks organized by recency, due work, and mastery
            so the next review is always obvious.
          </p>
        </div>
        <Button asChild>
          <Link href="/generate">Generate new deck</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {libraryStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative max-w-xl flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-11" placeholder="Search decks, PDFs, or topics" />
        </div>
        <div className="flex flex-wrap gap-2">
          {["Recent", "Due", "Completed"].map((filter, index) => (
            <Button
              key={filter}
              variant={index === 0 ? "default" : "secondary"}
              size="sm"
            >
              {filter}
            </Button>
          ))}
          <Button variant="secondary" size="sm">
            <SlidersHorizontal aria-hidden="true" />
            Filters
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {libraryDecks.map((item) => (
          <Card key={item.title} className="p-5 transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-semibold tracking-tight text-foreground">
                    {item.title}
                  </h2>
                  <Badge variant={item.due > 0 ? "warning" : "success"}>
                    {item.status}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{item.source}</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  {item.cards} cards · {item.due} due · Updated {item.updated}
                </p>
              </div>
              <Button variant="secondary" size="sm" asChild>
                <Link href="/deck/quadratic-equations">Open</Link>
              </Button>
            </div>
            <Progress value={item.mastery} label="Mastery" className="mt-5" />
          </Card>
        ))}
      </div>

      <EmptyState
        title="No archived decks"
        description="Archived and completed decks will appear here when library filters are connected."
      />
    </div>
  );
}
