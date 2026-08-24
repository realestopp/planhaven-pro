import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Download } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  NBBadge,
  NBButton,
  NBCard,
  NBCardHeader,
  NBInput,
  NBProgress,
  NBSelect,
  PageHeader,
  statusAccent,
} from "@/components/nb";
import { money, useEventFlow, type PayStatus } from "@/lib/eventflow-store";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export const Route = createFileRoute("/budget")({
  head: () => ({
    meta: [
      { title: "Budget Tracker — EventFlow" },
      {
        name: "description",
        content:
          "Compare estimated versus actual spend by category and track deposits, pending and paid invoices.",
      },
      { property: "og:title", content: "Budget Tracker — EventFlow" },
      {
        property: "og:description",
        content: "Estimated vs actual spend, payment status and expense entry for every event.",
      },
    ],
  }),
  component: BudgetPage,
});

function BudgetPage() {
  const { budget, addExpense, updateExpenseStatus, activeEvent } = useEventFlow();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    category: "Catering",
    item: "",
    estimated: "",
    actual: "",
    status: "Pending" as PayStatus,
  });

  const est = budget.reduce((s, b) => s + b.estimated, 0);
  const act = budget.reduce((s, b) => s + b.actual, 0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.item.trim()) return;
    addExpense({
      category: form.category,
      item: form.item,
      estimated: Number(form.estimated) || 0,
      actual: Number(form.actual) || 0,
      status: form.status,
    });
    setForm({ ...form, item: "", estimated: "", actual: "" });
    setOpen(false);
  };

  return (
    <AppShell>
      <PageHeader eyebrow={activeEvent.name} title="Budget">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <NBButton accent="pink">
              <Plus className="h-4 w-4" /> Add Expense
            </NBButton>
          </DialogTrigger>
          <DialogContent className="rounded-none border-4 border-ink bg-paper p-0 nb-shadow-lg sm:max-w-lg">
            <DialogTitle className="border-b-2 border-ink bg-yellow px-4 py-3 text-sm label-caps">
              New expense
            </DialogTitle>
            <form onSubmit={submit} className="space-y-3 p-4">
              <NBSelect
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {["Catering", "Venue", "Music", "Florals", "Photography", "Production"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </NBSelect>
              <NBInput
                placeholder="Line item"
                value={form.item}
                onChange={(e) => setForm({ ...form, item: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <NBInput
                  type="number"
                  placeholder="Estimated"
                  value={form.estimated}
                  onChange={(e) => setForm({ ...form, estimated: e.target.value })}
                />
                <NBInput
                  type="number"
                  placeholder="Actual"
                  value={form.actual}
                  onChange={(e) => setForm({ ...form, actual: e.target.value })}
                />
              </div>
              <NBSelect
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as PayStatus })}
              >
                <option>Pending</option>
                <option>Deposit</option>
                <option>Paid</option>
              </NBSelect>
              <NBButton accent="lime" type="submit" className="w-full">
                Save expense
              </NBButton>
            </form>
          </DialogContent>
        </Dialog>
        <NBButton accent="cyan">
          <Download className="h-4 w-4" /> Export
        </NBButton>
      </PageHeader>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <NBCard>
          <NBCardHeader accent="yellow" title="Estimated" />
          <p className="p-4 text-3xl font-black">{money(est)}</p>
        </NBCard>
        <NBCard>
          <NBCardHeader accent="cyan" title="Actual spend" />
          <p className="p-4 text-3xl font-black">{money(act)}</p>
        </NBCard>
        <NBCard>
          <NBCardHeader accent="lime" title="Remaining" />
          <div className="space-y-3 p-4">
            <p className="text-3xl font-black">{money(est - act)}</p>
            <NBProgress value={est ? (act / est) * 100 : 0} accent="pink" />
          </div>
        </NBCard>
      </section>

      <NBCard className="overflow-x-auto">
        <NBCardHeader accent="ink" title="Line items" />
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-muted">
            <tr className="border-b-2 border-ink text-[11px] label-caps">
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Item</th>
              <th className="px-4 py-2">Estimated</th>
              <th className="px-4 py-2">Actual</th>
              <th className="px-4 py-2">Variance</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-ink">
            {budget.map((b) => (
              <tr key={b.id}>
                <td className="px-4 py-2">
                  <NBBadge accent="yellow">{b.category}</NBBadge>
                </td>
                <td className="px-4 py-2 font-bold">{b.item}</td>
                <td className="px-4 py-2">{money(b.estimated)}</td>
                <td className="px-4 py-2">{money(b.actual)}</td>
                <td className="px-4 py-2 font-bold">{money(b.estimated - b.actual)}</td>
                <td className="px-4 py-2">
                  <NBSelect
                    className={`w-32 py-1 text-[11px] ${
                      b.status === "Paid" ? "bg-lime" : b.status === "Deposit" ? "bg-cyan" : "bg-yellow"
                    }`}
                    value={b.status}
                    onChange={(e) => updateExpenseStatus(b.id, e.target.value as PayStatus)}
                  >
                    <option>Pending</option>
                    <option>Deposit</option>
                    <option>Paid</option>
                  </NBSelect>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </NBCard>

      <NBCard>
        <NBCardHeader accent="pink" title="Category breakdown" />
        <div className="space-y-4 p-4">
          {Object.entries(
            budget.reduce<Record<string, { e: number; a: number }>>((acc, b) => {
              const row = (acc[b.category] ??= { e: 0, a: 0 });
              row.e += b.estimated;
              row.a += b.actual;
              return acc;
            }, {}),
          ).map(([cat, v]) => (
            <div key={cat} className="space-y-1">
              <div className="flex items-center justify-between text-[11px] label-caps">
                <span>{cat}</span>
                <span>
                  {money(v.a)} / {money(v.e)}
                </span>
              </div>
              <NBProgress value={v.e ? (v.a / v.e) * 100 : 0} accent="cyan" />
            </div>
          ))}
        </div>
      </NBCard>

      <p className="text-[11px] label-caps text-muted-foreground">
        Statuses shown: <NBBadge accent={statusAccent("Paid")}>Paid</NBBadge>{" "}
        <NBBadge accent={statusAccent("Deposit")}>Deposit</NBBadge>{" "}
        <NBBadge accent={statusAccent("Pending")}>Pending</NBBadge>
      </p>
    </AppShell>
  );
}
