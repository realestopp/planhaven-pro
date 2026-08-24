import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import {
  NBBadge,
  NBButton,
  NBCard,
  NBCardHeader,
  NBInput,
  NBSelect,
  PageHeader,
  statusAccent,
} from "@/components/nb";
import { useEventFlow, type Rsvp } from "@/lib/eventflow-store";

export const Route = createFileRoute("/guests")({
  head: () => ({
    meta: [
      { title: "Guest List & RSVP Manager — EventFlow" },
      {
        name: "description",
        content:
          "Filter guests by RSVP status, meal choice and table assignment, and update confirmations in one click.",
      },
      { property: "og:title", content: "Guest List & RSVP Manager — EventFlow" },
      {
        property: "og:description",
        content: "Track invites, confirmations, plus-ones, meals and seating for every event.",
      },
    ],
  }),
  component: GuestsPage,
});

const FILTERS = ["All", "Attending", "Declined", "Pending"] as const;

function GuestsPage() {
  const { guests, setRsvp } = useEventFlow();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [meal, setMeal] = useState("All");
  const [q, setQ] = useState("");

  const list = guests.filter(
    (g) =>
      (filter === "All" || g.rsvp === filter) &&
      (meal === "All" || g.meal === meal) &&
      g.name.toLowerCase().includes(q.toLowerCase()),
  );

  const confirmed = guests.filter((g) => g.rsvp === "Attending").length;
  const plusOnes = guests.reduce((s, g) => s + g.plusOnes, 0);

  return (
    <AppShell>
      <PageHeader eyebrow="Guest list & RSVP" title="Guests">
        {FILTERS.map((f) => (
          <NBButton
            key={f}
            size="sm"
            accent={filter === f ? "ink" : "paper"}
            onClick={() => setFilter(f)}
          >
            {f}
          </NBButton>
        ))}
      </PageHeader>

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { l: "Total invited", v: guests.length, a: "yellow" as const },
          { l: "Confirmed", v: confirmed, a: "lime" as const },
          { l: "Pending", v: guests.filter((g) => g.rsvp === "Pending").length, a: "cyan" as const },
          { l: "Plus-ones", v: plusOnes, a: "pink" as const },
        ].map((s) => (
          <NBCard key={s.l}>
            <NBCardHeader accent={s.a} title={s.l} />
            <p className="p-4 text-3xl font-black">{s.v}</p>
          </NBCard>
        ))}
      </section>

      <NBCard>
        <NBCardHeader accent="ink" title="Filters" />
        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
          <NBInput
            placeholder="Search guest name"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <NBSelect value={meal} onChange={(e) => setMeal(e.target.value)}>
            {["All", "Beef", "Fish", "Vegan", "Kids"].map((m) => (
              <option key={m}>{m}</option>
            ))}
          </NBSelect>
        </div>
      </NBCard>

      <NBCard className="overflow-x-auto">
        <NBCardHeader accent="pink" title={`${list.length} guests`} />
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="bg-muted">
            <tr className="border-b-2 border-ink text-[11px] label-caps">
              <th className="px-4 py-2">Guest</th>
              <th className="px-4 py-2">RSVP</th>
              <th className="px-4 py-2">Meal</th>
              <th className="px-4 py-2">Table</th>
              <th className="px-4 py-2">+1</th>
              <th className="px-4 py-2">Quick set</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-ink">
            {list.map((g) => (
              <tr key={g.id}>
                <td className="px-4 py-2 font-bold">{g.name}</td>
                <td className="px-4 py-2">
                  <NBBadge accent={statusAccent(g.rsvp)}>{g.rsvp}</NBBadge>
                </td>
                <td className="px-4 py-2">
                  <NBBadge accent="paper">{g.meal}</NBBadge>
                </td>
                <td className="px-4 py-2">{g.table}</td>
                <td className="px-4 py-2">{g.plusOnes}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-1">
                    {(["Attending", "Pending", "Declined"] as Rsvp[]).map((r) => (
                      <NBButton
                        key={r}
                        size="sm"
                        accent={g.rsvp === r ? statusAccent(r) : "paper"}
                        onClick={() => setRsvp(g.id, r)}
                      >
                        {r.slice(0, 3)}
                      </NBButton>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </NBCard>
    </AppShell>
  );
}
