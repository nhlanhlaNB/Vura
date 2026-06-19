import { createFileRoute } from "@tanstack/react-router";
import { Star, ChevronRight } from "lucide-react";
import { PhoneShell } from "@/components/PhoneShell";

export const Route = createFileRoute("/driver/trips")({
  head: () => ({ meta: [{ title: "Trip history — Vura Driver" }] }),
  component: Trips,
});

const trips = [
  { name: "Sagar D.", route: "Baker St → Shoreditch", t: "Today · 9:14", p: "R15.90", r: 5 },
  { name: "Amara K.", route: "Soho → Kensington", t: "Today · 11:02", p: "R21.10", r: 5 },
  { name: "Leo M.", route: "Camden → Stratford", t: "Today · 1:25", p: "R18.40", r: 4 },
  { name: "Priya S.", route: "Heathrow → Mayfair", t: "Yesterday · 4:18", p: "R42.80", r: 5 },
  { name: "Jonas R.", route: "Canary Wharf → Hackney", t: "Yesterday · 7:42", p: "R14.20", r: 5 },
];

function Trips() {
  return (
    <PhoneShell>
      <div className="hero-gradient text-primary-foreground px-5 pt-4 pb-8 rounded-b-[2rem]">
        <h1 className="text-2xl font-bold tracking-tight">Trip history</h1>
        <p className="text-sm opacity-85 mt-1">128 completed · 4.96 avg rating</p>
      </div>
      <div className="px-5 mt-5 space-y-2">
        {trips.map((t, i) => (
          <button key={i} className="w-full flex items-center gap-3 rounded-2xl bg-surface border border-border p-3.5 text-left">
            <div className="h-11 w-11 rounded-full bg-secondary grid place-items-center font-bold text-xs">
              {t.name.split(" ").map((p) => p[0]).join("")}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold">{t.name}</p>
              <p className="text-xs text-muted-foreground truncate">{t.route}</p>
              <div className="flex items-center gap-1 mt-0.5 text-[11px] text-muted-foreground">
                <Star className="h-3 w-3 fill-primary text-primary" /> {t.r}.0 · {t.t}
              </div>
            </div>
            <p className="text-sm font-extrabold">{t.p}</p>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}
      </div>
      <div className="h-6" />
    </PhoneShell>
  );
}
