import { productFlow, trustFeatures } from "@/data/mock-data";

export function ProductFlow() {
  return (
    <section id="flow" className="space-y-8 py-12">
      <div className="grid gap-4 md:grid-cols-4">
        {productFlow.map((step, index) => (
          <div
            key={step.title}
            className="rounded-lg border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="flex size-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <step.icon className="size-5" aria-hidden="true" />
              </span>
              <span className="text-xs font-semibold text-muted-foreground">
                0{index + 1}
              </span>
            </div>
            <h3 className="mt-5 text-base font-semibold text-foreground">
              {step.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {step.description}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 border-y border-border py-5 sm:grid-cols-2 lg:grid-cols-4">
        {trustFeatures.map((feature) => (
          <div key={feature} className="flex items-center gap-3 text-sm font-medium">
            <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
            <span className="text-muted-foreground">{feature}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
