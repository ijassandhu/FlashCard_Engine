import { cn } from "@/lib/utils";

type ProgressProps = {
  value: number;
  label?: string;
  className?: string;
};

export function Progress({ value, label, className }: ProgressProps) {
  const bounded = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("space-y-2", className)}>
      {label ? (
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span>{label}</span>
          <span>{bounded}%</span>
        </div>
      ) : null}
      <div
        className="h-2 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={bounded}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progress"}
      >
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${bounded}%` }}
        />
      </div>
    </div>
  );
}
