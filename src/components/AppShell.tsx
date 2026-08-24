import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  KanbanSquare,
  Wallet,
  Store,
  Users,
  Share2,
  Menu,
  X,
  CalendarDays,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useEventFlow } from "@/lib/eventflow-store";
import { NBBadge, NBSelect } from "@/components/nb";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/tasks", label: "Tasks", icon: KanbanSquare },
  { to: "/budget", label: "Budget", icon: Wallet },
  { to: "/vendors", label: "Vendors", icon: Store },
  { to: "/guests", label: "Guests", icon: Users },
  { to: "/portal", label: "Client Portal", icon: Share2 },
] as const;

function NavList({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-2 p-3">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 border-2 border-ink px-3 py-2 text-xs label-caps rounded-none",
              active ? "bg-ink text-paper nb-shadow" : "bg-paper text-ink nb-hover",
            )}
            title={label}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="truncate">{label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="flex items-center gap-2 border-b-2 border-ink bg-yellow px-3 py-3">
      <span className="grid h-8 w-8 shrink-0 place-items-center border-2 border-ink bg-ink text-paper text-sm font-black">
        E
      </span>
      {!collapsed && (
        <span className="truncate text-lg font-black uppercase tracking-tight">
          EventFlow
        </span>
      )}
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const { events, activeEvent, setActiveEventId } = useEventFlow();

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden shrink-0 border-r-2 border-ink bg-paper md:flex md:flex-col",
          collapsed ? "w-16" : "w-60",
        )}
      >
        <Brand collapsed={collapsed} />
        <NavList collapsed={collapsed} />
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="mt-auto flex items-center justify-center gap-2 border-t-2 border-ink bg-muted px-3 py-3 text-[11px] label-caps"
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
          {!collapsed && "Collapse"}
        </button>
      </aside>

      {/* Mobile drawer */}
      {drawer && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-ink/60" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 left-0 w-64 border-r-4 border-ink bg-paper">
            <div className="flex items-center justify-between border-b-2 border-ink bg-yellow px-3 py-3">
              <span className="text-lg font-black uppercase">EventFlow</span>
              <button onClick={() => setDrawer(false)} aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <NavList collapsed={false} onNavigate={() => setDrawer(false)} />
          </div>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-40 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 border-b-2 border-ink bg-paper px-3 py-2 sm:flex sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <button
              className="border-2 border-ink bg-cyan p-1.5 nb-shadow-sm md:hidden"
              onClick={() => setDrawer(true)}
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="hidden items-center gap-2 sm:flex">
              <CalendarDays className="h-4 w-4 shrink-0" />
              <span className="text-[11px] label-caps text-muted-foreground">
                Active project
              </span>
            </div>
          </div>
          <div className="flex min-w-0 items-center justify-end gap-2">
            <NBSelect
              className="max-w-[220px] text-[11px] nb-shadow-sm"
              value={activeEvent.id}
              onChange={(e) => setActiveEventId(e.target.value)}
              aria-label="Switch active event"
            >
              {events.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </NBSelect>
            <NBBadge accent="lime" className="hidden sm:inline-flex">
              Live
            </NBBadge>
          </div>
        </header>

        <main className="min-w-0 flex-1 p-4 sm:p-6">
          <div className="mx-auto flex max-w-6xl flex-col gap-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
