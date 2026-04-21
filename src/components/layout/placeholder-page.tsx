import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type PlaceholderPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
};

export function PlaceholderPage({
  eyebrow,
  title,
  description,
  primaryHref,
  primaryLabel,
}: PlaceholderPageProps) {
  return (
    <section className="mx-auto max-w-4xl py-8 sm:py-14">
      <Card className="bg-card p-6 shadow-sm sm:p-8 lg:p-10">
        <Badge variant="accent">{eyebrow}</Badge>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
          {description}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button variant="secondary" asChild>
            <Link href="/">
              <ArrowLeft aria-hidden="true" />
              Back to main app
            </Link>
          </Button>
          {primaryHref && primaryLabel ? (
            <Button asChild>
              <Link href={primaryHref}>
                {primaryLabel}
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          ) : null}
        </div>
      </Card>
    </section>
  );
}
