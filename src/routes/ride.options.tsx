import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Users, Zap, Crown, CreditCard, Tag } from "lucide-react";
import { PhoneShell, FakeMap } from "@/components/PhoneShell";

export const Route = createFileRoute("/ride/options")({
  head: () => ({ meta: [{ title: "Choose your ride — Vura" }] }),
  component: RideOptions,
});

const rides = [
  { id: "go", name: "VuraGo", desc: "Affordable, everyday rides", eta: "3 min", price: "R12.40", icon: Users },
  { id: "x", name: "VuraX", desc: "Faster pickups, comfy cars", eta: "4 min", price: "R15.90", icon: Zap, badge: "Popular" },
  { id: "lux", name: "VuraLux", desc: "Premium cars, top-rated drivers", eta: "6 min", price: "R24.50", icon: Crown },
];

function RideOptions() {
  const [selected, setSelected] = useState("x");
  return (
    <PhoneShell hideTabs>
      <div className="relative">
        <FakeMap height={260} />
        <Link to="/search" className="absolute top-3 left-4 grid place-items-center h-9 w-9 rounded-full bg-surface shadow-card">
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>

      <div className="-mt-5 rounded-t-3xl bg-surface px-5 pt-5 pb-4 shadow-float flex-1 flex flex-col">
        <div className="mx-auto h-1.5 w-12 rounded-full bg-border mb-4" />
        <h2 className="text-lg font-bold mb-1">Choose a ride</h2>
        <p className="text-xs text-muted-foreground mb-3">Recommended for your trip</p>

        <div className="space-y-2 flex-1">
          {rides.map((r) => {
            const Icon = r.icon;
            const active = selected === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setSelected(r.id)}
                className={`w-full flex items-center gap-3 rounded-2xl border px-3.5 py-3 text-left transition ${active ? "border-primary bg-accent shadow-soft" : "border-border bg-surface"}`}
              >
                <span className={`grid place-items-center h-12 w-12 rounded-xl ${active ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold">{r.name}</p>
                    {r.badge && <span className="text-[10px] font-bold uppercase rounded-full bg-primary/10 text-primary px-2 py-0.5">{r.badge}</span>}
                  </div>
                  <p className="text-xs text-muted-foreground">{r.desc} · {r.eta}</p>
                </div>
                <p className="text-sm font-extrabold">{r.price}</p>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-secondary px-3 py-2.5 text-xs font-semibold">
            <CreditCard className="h-4 w-4" /> •••• 4242
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-secondary px-3 py-2.5 text-xs font-semibold">
            <Tag className="h-4 w-4" /> Add promo
          </button>
        </div>

        <Link
          to="/ride/track"
          className="mt-3 grid place-items-center rounded-2xl bg-primary py-4 text-sm font-bold text-primary-foreground shadow-soft active:scale-[0.99] transition"
        >
          Confirm VuraX
        </Link>
      </div>
    </PhoneShell>
  );
}
