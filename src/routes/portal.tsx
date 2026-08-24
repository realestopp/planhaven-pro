import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock, Sparkles } from "lucide-react";
import {
  NBBadge,
  NBButton,
  NBCard,
  NBCardHeader,
  NBProgress,
} from "@/components/nb";
import { money, useEventFlow } from "@/lib/eventflow-store";

export const Route = createFileRoute("/portal")({
  head: () => ({
    meta: [
      { title: "Client Portal — EventFlow" },
      {
        name: "description",
        content:
          "A read-only shared view for clients showing timeline progress, confirmed vendors and a simple budget summary.",
      },
      { property: "og:title", content: "Client Portal — EventFlow" },
      {
        property: "og:description",
        content: "Share timeline progress and budget summaries with your event clients.",
      },
    ],
  }),
  component: PortalPage,
});

function PortalPage() {
  const { activeEvent, budget, milestones, tasks, guests, vendors, events, setActiveEventId } =
    useEventFlow();
  const est = budget.reduce((s, b) => s + b.estimated, 0);
  const act = budget.reduce((s, b) => s + b.actual, 0);
  const done = tasks.filter((t) => t.done).length;
  const progress = tasks.length ? (done / tasks.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b-4 border-ink bg-yellow">
        <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-4 sm:flex sm:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] label-caps">EventFlow client portal</p>
            <h1 className="truncate text-2xl uppercase sm:text-4xl">{activeEvent.name}</h1>
          </div>
          <NBBadge accent="paper">
            <Lock className="mr-1 h-3 w-3" /> Read only
          </NBBadge>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-6">
        <div className="flex flex-wrap gap-2">
          {events.map((e) => (
            <NBButton
              key={e.id}
              size="sm"
              accent={e.id === activeEvent.id ? "ink" : "paper"}
              onClick={() => setActiveEventId(e.id)}
            >
              {e.name}
            </NBButton>
          ))}
          <Link to="/" className="ml-auto">
            <NBButton size="sm" accent="cyan">
              Back to workspace
            </NBButton>
          </Link>
        </div>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <NBCard>
            <NBCardHeader accent="cyan" title="Event date" />
            <p className="p-4 text-2xl font-black">
              {new Date(activeEvent.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </NBCard>
          <NBCard>
            <NBCardHeader accent="pink" title="Guests confirmed" />
            <p className="p-4 text-2xl font-black">
              {guests.filter((g) => g.rsvp === "Attending").length}/{guests.length}
            </p>
          </NBCard>
          <NBCard>
            <NBCardHeader accent="lime" title="Vendors booked" />
            <p className="p-4 text-2xl font-black">
              {vendors.filter((v) => v.contract === "Signed").length}/{vendors.length}
            </p>
          </NBCard>
        </section>

        <NBCard>
          <NBCardHeader accent="ink" title="Planning progress" right={<Sparkles className="h-4 w-4" />} />
          <div className="space-y-3 p-4">
            <NBProgress value={progress} accent="lime" />
            <p className="text-xs label-caps">
              {done} of {tasks.length} milestones complete
            </p>
          </div>
        </NBCard>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <NBCard>
            <NBCardHeader accent="yellow" title="Timeline" />
            <ol className="divide-y-2 divide-ink">
              {milestones.map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <span className="min-w-0 truncate text-sm font-bold uppercase">{m.label}</span>
                  <NBBadge accent="cyan">{m.date}</NBBadge>
                </li>
              ))}
            </ol>
          </NBCard>

          <NBCard>
            <NBCardHeader accent="pink" title="Budget summary" />
            <div className="space-y-4 p-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="border-2 border-ink bg-background p-3">
                  <p className="text-[11px] label-caps">Approved budget</p>
                  <p className="text-xl font-black">{money(est)}</p>
                </div>
                <div className="border-2 border-ink bg-background p-3">
                  <p className="text-[11px] label-caps">Committed</p>
                  <p className="text-xl font-black">{money(act)}</p>
                </div>
              </div>
              <NBProgress value={est ? (act / est) * 100 : 0} accent="cyan" />
              <p className="text-[11px] label-caps text-muted-foreground">
                Detailed invoices are managed by your planner.
              </p>
            </div>
          </NBCard>
        </section>
      </main>

      <footer className="border-t-4 border-ink bg-ink px-4 py-6 text-center text-[11px] label-caps text-paper">
        Prepared by EventFlow for {activeEvent.client}
      </footer>
    </div>
  );
}
