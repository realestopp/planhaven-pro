import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Phase = "Planning" | "Booking" | "48h Before" | "Event Day";
export type Priority = "HIGH" | "MED" | "LOW";
export type PayStatus = "Paid" | "Pending" | "Deposit";
export type Rsvp = "Attending" | "Declined" | "Pending";

export type Task = {
  id: string;
  eventId: string;
  title: string;
  owner: string;
  due: string;
  phase: Phase;
  priority: Priority;
  done: boolean;
};

export type BudgetItem = {
  id: string;
  eventId: string;
  category: string;
  item: string;
  estimated: number;
  actual: number;
  status: PayStatus;
};

export type Vendor = {
  id: string;
  eventId: string;
  name: string;
  category: "Photographer" | "Caterer" | "Florist" | "Venue" | "Music";
  contact: string;
  phone: string;
  contract: "Signed" | "Sent" | "Missing";
  status: PayStatus;
};

export type Guest = {
  id: string;
  eventId: string;
  name: string;
  rsvp: Rsvp;
  meal: "Beef" | "Fish" | "Vegan" | "Kids";
  table: string;
  plusOnes: number;
};

export type Milestone = {
  id: string;
  eventId: string;
  label: string;
  date: string;
  done: boolean;
};

export type EventRec = {
  id: string;
  name: string;
  client: string;
  date: string;
  guests: number;
  budget: number;
  accent: "yellow" | "pink" | "cyan" | "lime";
};

const EVENTS: EventRec[] = [
  {
    id: "emma-alex",
    name: "Emma & Alex Wedding",
    client: "Emma Rodriguez",
    date: "2026-09-19",
    guests: 140,
    budget: 68000,
    accent: "pink",
  },
  {
    id: "techcorp",
    name: "TechCorp Annual Gala 2026",
    client: "TechCorp Inc.",
    date: "2026-11-07",
    guests: 320,
    budget: 155000,
    accent: "cyan",
  },
];

const uid = () => Math.random().toString(36).slice(2, 10);

const TASKS: Task[] = [
  { id: uid(), eventId: "emma-alex", title: "Finalize floral moodboard", owner: "Mia", due: "Aug 30", phase: "Planning", priority: "MED", done: false },
  { id: uid(), eventId: "emma-alex", title: "Confirm ceremony permit", owner: "Rron", due: "Sep 02", phase: "Planning", priority: "HIGH", done: false },
  { id: uid(), eventId: "emma-alex", title: "Sign band contract", owner: "Mia", due: "Sep 05", phase: "Booking", priority: "HIGH", done: false },
  { id: uid(), eventId: "emma-alex", title: "Book vintage car transfer", owner: "Leo", due: "Sep 08", phase: "Booking", priority: "LOW", done: false },
  { id: uid(), eventId: "emma-alex", title: "Print seating chart", owner: "Leo", due: "Sep 17", phase: "48h Before", priority: "MED", done: false },
  { id: uid(), eventId: "emma-alex", title: "Vendor arrival call-sheet", owner: "Mia", due: "Sep 18", phase: "48h Before", priority: "HIGH", done: true },
  { id: uid(), eventId: "emma-alex", title: "Ceremony rehearsal 10:00", owner: "Team", due: "Sep 19", phase: "Event Day", priority: "HIGH", done: false },
  { id: uid(), eventId: "techcorp", title: "Sponsor deck approval", owner: "Ana", due: "Sep 12", phase: "Planning", priority: "HIGH", done: false },
  { id: uid(), eventId: "techcorp", title: "Lock AV production quote", owner: "Ana", due: "Sep 25", phase: "Booking", priority: "MED", done: false },
  { id: uid(), eventId: "techcorp", title: "Badge printing run", owner: "Dan", due: "Nov 05", phase: "48h Before", priority: "MED", done: false },
  { id: uid(), eventId: "techcorp", title: "Keynote stage check 07:00", owner: "Dan", due: "Nov 07", phase: "Event Day", priority: "HIGH", done: false },
];

const BUDGET: BudgetItem[] = [
  { id: uid(), eventId: "emma-alex", category: "Venue", item: "Villa Sereno estate", estimated: 22000, actual: 21400, status: "Paid" },
  { id: uid(), eventId: "emma-alex", category: "Catering", item: "Plated dinner ×140", estimated: 19500, actual: 17800, status: "Deposit" },
  { id: uid(), eventId: "emma-alex", category: "Music", item: "The Gold Room (band)", estimated: 6500, actual: 6500, status: "Paid" },
  { id: uid(), eventId: "emma-alex", category: "Florals", item: "Arch + 14 centerpieces", estimated: 7800, actual: 0, status: "Pending" },
  { id: uid(), eventId: "emma-alex", category: "Photography", item: "2 shooters + film", estimated: 5400, actual: 2700, status: "Deposit" },
  { id: uid(), eventId: "techcorp", category: "Venue", item: "Metro Convention Hall B", estimated: 48000, actual: 48000, status: "Paid" },
  { id: uid(), eventId: "techcorp", category: "Catering", item: "Cocktail + seated ×320", estimated: 52000, actual: 26000, status: "Deposit" },
  { id: uid(), eventId: "techcorp", category: "Music", item: "DJ + string quartet", estimated: 9000, actual: 0, status: "Pending" },
  { id: uid(), eventId: "techcorp", category: "Production", item: "LED wall + lighting", estimated: 31000, actual: 12000, status: "Deposit" },
];

const VENDORS: Vendor[] = [
  { id: uid(), eventId: "emma-alex", name: "Nova Film Studio", category: "Photographer", contact: "hey@novafilm.co", phone: "+1 415 220 9911", contract: "Signed", status: "Deposit" },
  { id: uid(), eventId: "emma-alex", name: "Saffron Kitchen", category: "Caterer", contact: "book@saffron.kitchen", phone: "+1 415 771 0032", contract: "Sent", status: "Deposit" },
  { id: uid(), eventId: "emma-alex", name: "Wildstem Florals", category: "Florist", contact: "hello@wildstem.com", phone: "+1 628 442 1188", contract: "Missing", status: "Pending" },
  { id: uid(), eventId: "emma-alex", name: "Villa Sereno", category: "Venue", contact: "events@villasereno.it", phone: "+39 055 220 118", contract: "Signed", status: "Paid" },
  { id: uid(), eventId: "techcorp", name: "Pixel & Grain", category: "Photographer", contact: "studio@pixelgrain.io", phone: "+1 212 555 0180", contract: "Sent", status: "Pending" },
  { id: uid(), eventId: "techcorp", name: "Union Feast Co.", category: "Caterer", contact: "sales@unionfeast.com", phone: "+1 212 900 4412", contract: "Signed", status: "Deposit" },
  { id: uid(), eventId: "techcorp", name: "Metro Convention Hall", category: "Venue", contact: "book@metrohall.com", phone: "+1 212 400 7788", contract: "Signed", status: "Paid" },
  { id: uid(), eventId: "techcorp", name: "Deck Nine Sound", category: "Music", contact: "gigs@decknine.fm", phone: "+1 917 665 3020", contract: "Missing", status: "Pending" },
];

const NAMES_A = ["Sofia Marin", "Daniel Okafor", "Priya Nair", "Lucas Weber", "Chloe Bennett", "Marco Rossi", "Hana Sato", "Owen Clarke", "Isabel Cruz", "Noah Fischer", "Amara Diallo", "Julia Kim"];
const NAMES_B = ["R. Sandoval", "T. Whitfield", "K. Osei", "M. Lindqvist", "J. Alvarez", "S. Mbeki", "P. Grover", "L. Fontaine", "E. Novak", "C. Yamada"];

const GUESTS: Guest[] = [
  ...NAMES_A.map((name, i) => ({
    id: uid(),
    eventId: "emma-alex",
    name,
    rsvp: (["Attending", "Attending", "Pending", "Declined"] as Rsvp[])[i % 4]!,
    meal: (["Beef", "Fish", "Vegan", "Kids"] as const)[i % 4]!,
    table: `T${(i % 6) + 1}`,
    plusOnes: i % 3 === 0 ? 1 : 0,
  })),
  ...NAMES_B.map((name, i) => ({
    id: uid(),
    eventId: "techcorp",
    name,
    rsvp: (["Attending", "Pending", "Attending", "Declined"] as Rsvp[])[i % 4]!,
    meal: (["Fish", "Vegan", "Beef", "Vegan"] as const)[i % 4]!,
    table: `B${(i % 5) + 1}`,
    plusOnes: i % 4 === 0 ? 1 : 0,
  })),
];

const MILESTONES: Milestone[] = [
  { id: uid(), eventId: "emma-alex", label: "Final headcount to caterer", date: "Sep 05", done: false },
  { id: uid(), eventId: "emma-alex", label: "Balance due — Villa Sereno", date: "Sep 10", done: false },
  { id: uid(), eventId: "emma-alex", label: "Rehearsal dinner", date: "Sep 18", done: false },
  { id: uid(), eventId: "emma-alex", label: "Wedding day", date: "Sep 19", done: false },
  { id: uid(), eventId: "techcorp", label: "Sponsor assets locked", date: "Sep 30", done: false },
  { id: uid(), eventId: "techcorp", label: "AV load-in", date: "Nov 05", done: false },
  { id: uid(), eventId: "techcorp", label: "Gala night", date: "Nov 07", done: false },
];

type Ctx = {
  events: EventRec[];
  activeEvent: EventRec;
  setActiveEventId: (id: string) => void;
  tasks: Task[];
  budget: BudgetItem[];
  vendors: Vendor[];
  guests: Guest[];
  milestones: Milestone[];
  addTask: (t: Omit<Task, "id" | "eventId" | "done">) => void;
  moveTask: (id: string, phase: Phase) => void;
  toggleTask: (id: string) => void;
  addExpense: (b: Omit<BudgetItem, "id" | "eventId">) => void;
  updateExpenseStatus: (id: string, status: PayStatus) => void;
  addVendor: (v: Omit<Vendor, "id" | "eventId">) => void;
  setRsvp: (id: string, rsvp: Rsvp) => void;
};

const StoreContext = createContext<Ctx | null>(null);

export function EventFlowProvider({ children }: { children: ReactNode }) {
  const [activeEventId, setActiveEventId] = useState(EVENTS[0]!.id);
  const [tasks, setTasks] = useState(TASKS);
  const [budget, setBudget] = useState(BUDGET);
  const [vendors, setVendors] = useState(VENDORS);
  const [guests, setGuests] = useState(GUESTS);
  const [milestones] = useState(MILESTONES);

  const value = useMemo<Ctx>(() => {
    const inEvent = <T extends { eventId: string }>(rows: T[]) =>
      rows.filter((r) => r.eventId === activeEventId);

    return {
      events: EVENTS,
      activeEvent: EVENTS.find((e) => e.id === activeEventId) ?? EVENTS[0]!,
      setActiveEventId,
      tasks: inEvent(tasks),
      budget: inEvent(budget),
      vendors: inEvent(vendors),
      guests: inEvent(guests),
      milestones: inEvent(milestones),
      addTask: (t) =>
        setTasks((prev) => [
          { ...t, id: uid(), eventId: activeEventId, done: false },
          ...prev,
        ]),
      moveTask: (id, phase) =>
        setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, phase } : t))),
      toggleTask: (id) =>
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
        ),
      addExpense: (b) =>
        setBudget((prev) => [{ ...b, id: uid(), eventId: activeEventId }, ...prev]),
      updateExpenseStatus: (id, status) =>
        setBudget((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b))),
      addVendor: (v) =>
        setVendors((prev) => [{ ...v, id: uid(), eventId: activeEventId }, ...prev]),
      setRsvp: (id, rsvp) =>
        setGuests((prev) => prev.map((g) => (g.id === id ? { ...g, rsvp } : g))),
    };
  }, [activeEventId, tasks, budget, vendors, guests, milestones]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useEventFlow() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useEventFlow must be used inside EventFlowProvider");
  return ctx;
}

export const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
