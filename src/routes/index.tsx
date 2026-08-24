import { createFileRoute, Link } from "@tanstack/react-router";
import {
  CalendarPlus,
  Store,
  Download,
  TrendingUp,
  Users,
  Wallet,
  Clock,
} from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  NBBadge,
  NBButton,
  NBCard,
  NBCardHeader,
  NBProgress,
  PageHeader,
} from "@/components/nb";
import { money, useEventFlow } from "@/lib/eventflow-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EventFlow Dashboard — Event & Wedding Planning OS" },
      {
        name: "description",
        content:
          "Track budgets, vendors, guest lists and timelines for every event from one bold, high-contrast planning dashboard.",
      },
      { property: "og:title", content: "EventFlow Dashboard — Event & Wedding Planning OS" },
      {
        property: "og:description",
        content:
          "Budgets, vendors, RSVPs and timelines for boutique event planners in one workspace.",
      },
    ],
  }),
  component: Dashboard,
});

function Stat({
  label,
  value,
  sub,
  accent,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub: string;
  accent: "yellow" | "pink" | "cyan" | "lime";
  icon: typeof Users;
}) {
  return (
    <NBCard className="nb-hover">
      <NBCardHeader accent={accent} title={label} right={<Icon className="h-4 w-4" />} />
      <div className="p-4">
        <p className="text-3xl font-black">{value}</p>
        <p className="mt-1 text-[11px] label-caps text-muted-foreground">{sub}</p>
      </div>
    </NBCard>
  );
}

function Dashboard() {
  const { events, activeEvent, budget, guests, tasks, milestones } = useEventFlow();
  const spent = budget.reduce((s, b) => s + b.actual, 0);
  const est = budget.reduce((s, b) => s + b.estimated, 0);
  const pending = guests.filter((g) => g.rsvp === "Pending").length;
  const openTasks = tasks.filter((t) => !t.done);

  return (
    <AppShell>
      <PageHeader eyebrow={activeEvent.client} title="Dashboard">
        <NBButton accent="pink">
          <CalendarPlus className="h-4 w-4" /> New Event
        </NBButton>
        <Link to="/vendors">
          <NBButton accent="cyan">
            <Store className="h-4 w-4" /> Add Vendor
          </NBButton>
        </Link>
        <Link to="/budget">
          <NBButton accent="yellow">
            <Download className="h-4 w-4" /> Export Budget
          </NBButton>
        </Link>
      </PageHeader>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Active Events"
          value={String(events.length)}
          sub="In production"
          accent="yellow"
          icon={TrendingUp}
        />
        <Stat
          label="Budget Spent"
          value={money(spent)}
          sub={`of ${money(est)} estimated`}
          accent="cyan"
          icon={Wallet}
        />
        <Stat
          label="Pending RSVPs"
          value={String(pending)}
          sub={`${guests.length} invited`}
          accent="pink"
          icon={Users}
        />
        <Stat
          label="Open Deadlines"
          value={String(openTasks.length)}
          sub="Tasks not complete"
          accent="lime"
          icon={Clock}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <NBCard>
          <NBCardHeader accent="ink" title="Upcoming milestones" right={<NBBadge accent="yellow">{activeEvent.name}</NBBadge>} />
          <ol className="divide-y-2 divide-ink">
            {milestones.map((m, i) => (
              <li key={m.id} className="flex items-center gap-4 px-4 py-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center border-2 border-ink bg-yellow text-xs font-black">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-bold uppercase">
                  {m.label}
                </span>
                <NBBadge accent="cyan">{m.date}</NBBadge>
              </li>
            ))}
          </ol>
        </NBCard>

        <div className="flex flex-col gap-4">
          <NBCard>
            <NBCardHeader accent="lime" title="Budget burn" />
            <div className="space-y-3 p-4">
              <NBProgress value={est ? (spent / est) * 100 : 0} accent="lime" />
              <p className="text-xs label-caps">
                {est ? Math.round((spent / est) * 100) : 0}% of estimate used
              </p>
              <p className="text-sm font-bold">
                {money(est - spent)} <span className="label-caps text-[11px]">remaining</span>
              </p>
            </div>
          </NBCard>
          <NBCard>
            <NBCardHeader accent="pink" title="Next up" />
            <ul className="space-y-2 p-4">
              {openTasks.slice(0, 4).map((t) => (
                <li key={t.id} className="flex items-center justify-between gap-2 border-2 border-ink bg-background px-2 py-1.5">
                  <span className="min-w-0 truncate text-xs font-bold">{t.title}</span>
                  <NBBadge accent="yellow">{t.due}</NBBadge>
                </li>
              ))}
            </ul>
          </NBCard>
        </div>
      </section>
    </AppShell>
  );
}
