import type { ReactNode } from "react";
import { FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "blue" | "yellow" | "success" | "warning" | "danger";
const toneCls: Record<Tone, string> = {
  neutral: "bg-muted text-muted-foreground border-border",
  blue: "bg-secondary-soft text-secondary border-secondary/20",
  yellow: "bg-primary-soft text-foreground border-primary/50",
  success: "bg-success-soft text-success border-success/20",
  warning: "bg-warning-soft text-warning border-warning/25",
  danger: "bg-destructive-soft text-destructive border-destructive/20",
};

export function Pill({ tone = "neutral", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium [&_svg]:size-3.5", toneCls[tone], className)}>
      {children}
    </span>
  );
}

export function DemoTag({ children = "Demo data" }: { children?: ReactNode }) {
  return (
    <Pill tone="warning">
      <FlaskConical /> {children}
    </Pill>
  );
}

export function SectionHeading({ eyebrow, title, desc, center }: { eyebrow?: string; title: string; desc?: string; center?: boolean }) {
  return (
    <div className={cn("max-w-2xl", center && "mx-auto text-center")}>
      {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-secondary">{eyebrow}</p>}
      <h2 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
      {desc && <p className="mt-3 text-muted-foreground">{desc}</p>}
    </div>
  );
}

export function Stepper({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="flex items-center gap-2 overflow-x-auto pb-1">
      {steps.map((s, i) => (
        <li key={s} className="flex shrink-0 items-center gap-2">
          <span
            className={cn(
              "flex size-7 items-center justify-center rounded-full border text-xs font-bold transition-colors",
              i < current && "border-secondary bg-secondary text-secondary-foreground",
              i === current && "border-foreground bg-primary text-primary-foreground",
              i > current && "border-border bg-background text-muted-foreground",
            )}
          >
            {i + 1}
          </span>
          <span className={cn("text-sm", i === current ? "font-semibold" : "text-muted-foreground")}>{s}</span>
          {i < steps.length - 1 && <span className="mx-1 h-px w-6 bg-border md:w-10" />}
        </li>
      ))}
    </ol>
  );
}
