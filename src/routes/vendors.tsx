import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, FileText, Plus } from "lucide-react";
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
import { useEventFlow, type Vendor } from "@/lib/eventflow-store";

export const Route = createFileRoute("/vendors")({
  head: () => ({
    meta: [
      { title: "Vendor & Venue Database — EventFlow" },
      {
        name: "description",
        content:
          "Browse vendors and venues with contract status, contact tags and payment progress, filtered by category.",
      },
      { property: "og:title", content: "Vendor & Venue Database — EventFlow" },
      {
        property: "og:description",
        content: "Photographers, caterers, florists and venues with contract and payment status.",
      },
    ],
  }),
  component: VendorsPage,
});

const CATS = ["All", "Photographer", "Caterer", "Florist", "Venue", "Music"] as const;

function VendorsPage() {
  const { vendors, addVendor } = useEventFlow();
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [form, setForm] = useState({
    name: "",
    category: "Photographer" as Vendor["category"],
    contact: "",
    phone: "",
  });

  const list = vendors.filter((v) => cat === "All" || v.category === cat);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    addVendor({ ...form, contract: "Missing", status: "Pending" });
    setForm({ ...form, name: "", contact: "", phone: "" });
  };

  return (
    <AppShell>
      <PageHeader eyebrow="Vendor & venue database" title="Vendors">
        {CATS.map((c) => (
          <NBButton
            key={c}
            size="sm"
            accent={cat === c ? "ink" : "paper"}
            onClick={() => setCat(c)}
          >
            {c}
          </NBButton>
        ))}
      </PageHeader>

      <NBCard>
        <NBCardHeader accent="cyan" title="Add vendor" />
        <form onSubmit={submit} className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-5">
          <NBInput
            placeholder="Vendor name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <NBSelect
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value as Vendor["category"] })
            }
          >
            {CATS.filter((c) => c !== "All").map((c) => (
              <option key={c}>{c}</option>
            ))}
          </NBSelect>
          <NBInput
            placeholder="Email"
            value={form.contact}
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
          />
          <NBInput
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <NBButton accent="pink" type="submit">
            <Plus className="h-4 w-4" /> Add
          </NBButton>
        </form>
      </NBCard>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {list.map((v) => (
          <NBCard key={v.id} className="nb-hover">
            <NBCardHeader
              accent={v.category === "Venue" ? "pink" : v.category === "Caterer" ? "yellow" : "cyan"}
              title={v.category}
              right={<NBBadge accent={statusAccent(v.status)}>{v.status}</NBBadge>}
            />
            <div className="space-y-3 p-4">
              <h4 className="text-lg font-black uppercase">{v.name}</h4>
              <p className="flex items-center gap-2 text-xs">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{v.contact}</span>
              </p>
              <p className="flex items-center gap-2 text-xs">
                <Phone className="h-3.5 w-3.5 shrink-0" /> {v.phone}
              </p>
              <div className="flex flex-wrap items-center gap-2 border-t-2 border-ink pt-3">
                <NBBadge accent={statusAccent(v.contract)}>
                  <FileText className="mr-1 h-3 w-3" /> PDF {v.contract}
                </NBBadge>
                <NBBadge accent="paper">Contract</NBBadge>
              </div>
            </div>
          </NBCard>
        ))}
      </section>
    </AppShell>
  );
}
