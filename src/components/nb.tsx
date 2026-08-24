import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Accent = "yellow" | "pink" | "cyan" | "lime" | "paper" | "ink";

const accentBg: Record<Accent, string> = {
  yellow: "bg-yellow text-ink",
  pink: "bg-pink text-ink",
  cyan: "bg-cyan text-ink",
  lime: "bg-lime text-ink",
  paper: "bg-paper text-ink",
  ink: "bg-ink text-paper",
};

export function NBCard({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "border-2 border-ink bg-paper nb-shadow rounded-none",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function NBCardHeader({
  accent = "yellow",
  title,
  right,
  className,
}: {
  accent?: Accent;
  title: ReactNode;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b-2 border-ink px-4 py-2",
        accentBg[accent],
        className,
      )}
    >
      <h3 className="truncate text-sm label-caps">{title}</h3>
      {right ? <div className="shrink-0">{right}</div> : <span />}
    </div>
  );
}

export function NBButton({
  accent = "paper",
  className,
  size = "md",
  ...props
}: ComponentProps<"button"> & { accent?: Accent; size?: "sm" | "md" }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 border-2 border-ink rounded-none nb-shadow nb-hover label-caps",
        size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-4 py-2 text-xs",
        accentBg[accent],
        className,
      )}
      {...props}
    />
  );
}

export function NBBadge({
  accent = "paper",
  className,
  children,
}: {
  accent?: Accent;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center border-2 border-ink px-2 py-0.5 text-[10px] label-caps rounded-none",
        accentBg[accent],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function NBInput({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "w-full border-2 border-ink bg-paper px-3 py-2 text-sm rounded-none outline-none focus:nb-shadow-sm placeholder:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function NBSelect({ className, ...props }: ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "w-full border-2 border-ink bg-paper px-3 py-2 text-sm rounded-none outline-none label-caps",
        className,
      )}
      {...props}
    />
  );
}

export function NBProgress({
  value,
  accent = "lime",
}: {
  value: number;
  accent?: Accent;
}) {
  return (
    <div className="h-5 w-full border-2 border-ink bg-muted rounded-none">
      <div
        className={cn("h-full border-r-2 border-ink", accentBg[accent])}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:flex-wrap sm:justify-between">
      <div className="min-w-0">
        <p className="text-[11px] label-caps text-muted-foreground">{eyebrow}</p>
        <h1 className="truncate text-2xl sm:text-4xl uppercase">{title}</h1>
      </div>
      {children ? <div className="flex flex-wrap gap-2">{children}</div> : null}
    </header>
  );
}

export const statusAccent = (s: string): Accent =>
  s === "Paid" || s === "Attending" || s === "Signed"
    ? "lime"
    : s === "Deposit" || s === "Sent"
      ? "cyan"
      : s === "Declined" || s === "Missing"
        ? "pink"
        : "yellow";

export const priorityAccent = (p: string): Accent =>
  p === "HIGH" ? "pink" : p === "MED" ? "yellow" : "cyan";
