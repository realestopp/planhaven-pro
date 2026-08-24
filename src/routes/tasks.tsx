import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, LayoutGrid, List, GripVertical, Check } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import {
  NBBadge,
  NBButton,
  NBCard,
  NBCardHeader,
  NBInput,
  NBSelect,
  PageHeader,
  priorityAccent,
} from "@/components/nb";
import { useEventFlow, type Phase, type Priority } from "@/lib/eventflow-store";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Task Manager — EventFlow" },
      {
        name: "description",
        content:
          "Kanban and list views for event tasks across Planning, Booking, 48h Before and Event Day phases.",
      },
      { property: "og:title", content: "Task Manager — EventFlow" },
      {
        property: "og:description",
        content: "Drag tasks between phases and track HIGH, MED and LOW priorities.",
      },
    ],
  }),
  component: TasksPage,
});

const PHASES: Phase[] = ["Planning", "Booking", "48h Before", "Event Day"];
const PHASE_ACCENT = {
  Planning: "yellow",
  Booking: "cyan",
  "48h Before": "pink",
  "Event Day": "lime",
} as const;

function TasksPage() {
  const { tasks, addTask, moveTask, toggleTask } = useEventFlow();
  const [view, setView] = useState<"kanban" | "list">("kanban");
  const [dragId, setDragId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    owner: "Mia",
    due: "",
    phase: "Planning" as Phase,
    priority: "MED" as Priority,
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    addTask({ ...form, due: form.due || "TBD" });
    setForm({ ...form, title: "", due: "" });
  };

  return (
    <AppShell>
      <PageHeader eyebrow="Event & task manager" title="Tasks">
        <NBButton
          accent={view === "kanban" ? "ink" : "paper"}
          onClick={() => setView("kanban")}
        >
          <LayoutGrid className="h-4 w-4" /> Kanban
        </NBButton>
        <NBButton accent={view === "list" ? "ink" : "paper"} onClick={() => setView("list")}>
          <List className="h-4 w-4" /> List
        </NBButton>
      </PageHeader>

      <NBCard>
        <NBCardHeader accent="yellow" title="Add task" />
        <form onSubmit={submit} className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-6">
          <NBInput
            className="lg:col-span-2"
            placeholder="Task title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <NBInput
            placeholder="Owner"
            value={form.owner}
            onChange={(e) => setForm({ ...form, owner: e.target.value })}
          />
          <NBInput
            placeholder="Due (Sep 12)"
            value={form.due}
            onChange={(e) => setForm({ ...form, due: e.target.value })}
          />
          <NBSelect
            value={form.phase}
            onChange={(e) => setForm({ ...form, phase: e.target.value as Phase })}
          >
            {PHASES.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </NBSelect>
          <div className="flex gap-2">
            <NBSelect
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value as Priority })}
            >
              <option>HIGH</option>
              <option>MED</option>
              <option>LOW</option>
            </NBSelect>
            <NBButton accent="pink" type="submit">
              <Plus className="h-4 w-4" />
            </NBButton>
          </div>
        </form>
      </NBCard>

      {view === "kanban" ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {PHASES.map((phase) => (
            <NBCard
              key={phase}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => dragId && moveTask(dragId, phase)}
              className="flex flex-col"
            >
              <NBCardHeader
                accent={PHASE_ACCENT[phase]}
                title={phase}
                right={
                  <span className="text-xs font-black">
                    {tasks.filter((t) => t.phase === phase).length}
                  </span>
                }
              />
              <div className="flex min-h-32 flex-1 flex-col gap-3 p-3">
                {tasks
                  .filter((t) => t.phase === phase)
                  .map((t) => (
                    <article
                      key={t.id}
                      draggable
                      onDragStart={() => setDragId(t.id)}
                      onDragEnd={() => setDragId(null)}
                      className="cursor-grab border-2 border-ink bg-background p-3 nb-shadow-sm active:cursor-grabbing"
                    >
                      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-2">
                        <GripVertical className="mt-0.5 h-4 w-4 shrink-0" />
                        <p
                          className={`text-sm font-bold ${t.done ? "line-through opacity-60" : ""}`}
                        >
                          {t.title}
                        </p>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <NBBadge accent={priorityAccent(t.priority)}>{t.priority}</NBBadge>
                        <NBBadge>{t.due}</NBBadge>
                        <NBBadge accent="paper">{t.owner}</NBBadge>
                        <button
                          onClick={() => toggleTask(t.id)}
                          className="ml-auto border-2 border-ink bg-lime p-1"
                          aria-label="Toggle done"
                        >
                          <Check className="h-3 w-3" />
                        </button>
                      </div>
                    </article>
                  ))}
              </div>
            </NBCard>
          ))}
        </div>
      ) : (
        <NBCard className="overflow-x-auto">
          <NBCardHeader accent="ink" title="All tasks" />
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-muted">
              <tr className="border-b-2 border-ink text-[11px] label-caps">
                <th className="px-4 py-2">Task</th>
                <th className="px-4 py-2">Phase</th>
                <th className="px-4 py-2">Priority</th>
                <th className="px-4 py-2">Owner</th>
                <th className="px-4 py-2">Due</th>
                <th className="px-4 py-2">Done</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-ink">
              {tasks.map((t) => (
                <tr key={t.id}>
                  <td className={`px-4 py-2 font-bold ${t.done ? "line-through opacity-60" : ""}`}>
                    {t.title}
                  </td>
                  <td className="px-4 py-2">
                    <NBSelect
                      className="w-36 py-1 text-[11px]"
                      value={t.phase}
                      onChange={(e) => moveTask(t.id, e.target.value as Phase)}
                    >
                      {PHASES.map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </NBSelect>
                  </td>
                  <td className="px-4 py-2">
                    <NBBadge accent={priorityAccent(t.priority)}>{t.priority}</NBBadge>
                  </td>
                  <td className="px-4 py-2">{t.owner}</td>
                  <td className="px-4 py-2">{t.due}</td>
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={t.done}
                      onChange={() => toggleTask(t.id)}
                      className="h-4 w-4 accent-lime"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </NBCard>
      )}
    </AppShell>
  );
}
