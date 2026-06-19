import { createFileRoute } from "@tanstack/react-router";
import { TrendingUp, Calendar, Banknote, ChevronRight } from "lucide-react";
import { PhoneShell } from "@/components/PhoneShell";

export const Route = createFileRoute("/driver/earnings")({
  head: () => ({ meta: [{ title: "Earnings — Vura Driver" }] }),
  component: Earnings,
});

const days = [
  { d: "Mon", v: 60 },
  { d: "Tue", v: 80 },
  { d: "Wed", v: 45 },
  { d: "Thu", v: 95 },
  { d: "Fri", v: 70 },
  { d: "Sat", v: 110 },
  { d: "Sun", v: 124 },
];

function Earnings() {
  const max = Math.max(...days.map((d) => d.v));
  return (
    <PhoneShell>
      <div className="hero-gradient text-primary-foreground px-5 pt-4 pb-10 rounded-b-[2rem]">
        <p className="text-xs opacity-85">This week</p>
        <h1 className="text-3xl font-extrabold tracking-tight">R584.20</h1>
        <p className="text-xs opacity-85 mt-1 inline-flex items-center gap-1">
          <TrendingUp className="h-3 w-3" /> +12% vs last week
        </p>

        <div className="mt-5 flex items-end gap-2 h-28">
          {days.map((d, i) => (
            <div key={d.d} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-t-lg bg-white/25" style={{ height: `${(d.v / max) * 100}%` }}>
                <div className={`h-full w-full rounded-t-lg ${i === days.length - 1 ? "bg-surface" : "bg-white/50"}`} />
              </div>
              <span className="text-[10px] font-semibold opacity-85">{d.d}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 -mt-5">
        <div className="rounded-2xl bg-surface shadow-card p-4 flex items-center gap-3">
          <span className="grid place-items-center h-11 w-11 rounded-xl bg-accent text-primary"><Banknote className="h-5 w-5" /></span>
          <div className="flex-1">
            <p className="text-sm font-bold">Cash out</p>
            <p className="text-xs text-muted-foreground">R584.20 available · Instant Pay</p>
          </div>
          <button className="rounded-full bg-primary text-primary-foreground px-4 py-2 text-xs font-bold">Cash out</button>
        </div>

        <h2 className="mt-6 mb-2 text-sm font-bold">Recent trips</h2>
        <div className="space-y-2">
          {[
            { from: "Heathrow → Shoreditch", t: "Today · 9:14", p: "R42.80" },
            { from: "Canary Wharf → Camden", t: "Today · 11:02", p: "R18.40" },
            { from: "Soho → Kensington", t: "Today · 1:25", p: "R21.10" },
            { from: "Stratford → Hackney", t: "Today · 3:48", p: "R14.20" },
          ].map((t, i) => (
            <button key={i} className="w-full flex items-center gap-3 rounded-2xl bg-surface border border-border p-3.5 text-left">
              <span className="grid place-items-center h-10 w-10 rounded-full bg-secondary"><Calendar className="h-4 w-4" /></span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{t.from}</p>
                <p className="text-xs text-muted-foreground">{t.t}</p>
              </div>
              <p className="text-sm font-extrabold">{t.p}</p>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
      <div className="h-6" />
    </PhoneShell>
  );
}
