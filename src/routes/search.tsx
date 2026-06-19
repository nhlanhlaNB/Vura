import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Circle, Star, Clock } from "lucide-react";
import { PhoneShell } from "@/components/PhoneShell";

export const Route = createFileRoute("/search")({
  head: () => ({ meta: [{ title: "Where to? — Vura" }] }),
  component: Search,
});

function Search() {
  const suggestions = [
    { name: "Heathrow Airport", addr: "Terminal 5, London TW6" },
    { name: "Shoreditch High St", addr: "London E1 6JJ" },
    { name: "British Museum", addr: "Great Russell St, London" },
    { name: "King's Cross Station", addr: "Euston Rd, London N1C" },
  ];
  return (
    <PhoneShell hideTabs>
      <div className="px-5 pt-3 pb-4 bg-surface border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <Link to="/" className="grid place-items-center h-9 w-9 rounded-full bg-secondary">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-base font-bold">Plan your ride</h1>
        </div>

        <div className="flex gap-3">
          <div className="flex flex-col items-center pt-3">
            <Circle className="h-3 w-3 fill-foreground text-foreground" />
            <div className="w-px flex-1 my-1 border-l-2 border-dashed border-muted-foreground/40" />
            <MapPin className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 space-y-2">
            <input
              defaultValue="Current location"
              className="w-full rounded-xl bg-secondary px-3 py-3 text-sm font-medium outline-none focus:ring-2 ring-primary/30"
            />
            <input
              autoFocus
              placeholder="Where to?"
              className="w-full rounded-xl bg-accent border border-primary/30 px-3 py-3 text-sm font-medium outline-none focus:ring-2 ring-primary/40"
            />
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 py-4">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Suggestions</p>
        <div className="divide-y divide-border">
          {suggestions.map((s, i) => (
            <Link key={s.name} to="/ride/options" className="flex items-center gap-3 py-3">
              <span className="grid place-items-center h-10 w-10 rounded-full bg-secondary">
                {i === 0 ? <Star className="h-4 w-4 text-primary" /> : <Clock className="h-4 w-4 text-muted-foreground" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{s.name}</p>
                <p className="text-xs text-muted-foreground truncate">{s.addr}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PhoneShell>
  );
}
