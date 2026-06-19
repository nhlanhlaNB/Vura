import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Power, Star, TrendingUp, Bell, Navigation, DollarSign } from "lucide-react";
import { PhoneShell, FakeMap } from "@/components/PhoneShell";

export const Route = createFileRoute("/driver/")({
  head: () => ({ meta: [{ title: "Drive — Vura" }] }),
  component: DriverHome,
});

function DriverHome() {
  const [online, setOnline] = useState(false);
  return (
    <PhoneShell>
      <div className="relative">
        <FakeMap height={420} />
        <div className="absolute top-3 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-full bg-surface px-3 py-1.5 shadow-card">
            <span className={`h-2 w-2 rounded-full ${online ? "bg-success animate-pulse" : "bg-muted-foreground"}`} />
            <span className="text-xs font-bold">{online ? "You're online" : "You're offline"}</span>
          </div>
          <button className="grid place-items-center h-9 w-9 rounded-full bg-surface shadow-card">
            <Bell className="h-4 w-4" />
          </button>
        </div>

        {online && (
          <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-foreground text-background p-4 shadow-float">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-80">
              <Navigation className="h-3 w-3" /> New request · 12 sec
            </div>
            <p className="mt-2 text-lg font-extrabold">VuraX · R15.90</p>
            <p className="text-xs opacity-80">4 min away · 22 min trip</p>
            <div className="mt-3 flex gap-2">
              <button onClick={() => setOnline(true)} className="flex-1 rounded-xl bg-background/15 py-2.5 text-xs font-bold">Decline</button>
              <Link to="/driver/trip" className="flex-1 grid place-items-center rounded-xl bg-primary py-2.5 text-xs font-bold text-primary-foreground">Accept</Link>
            </div>
          </div>
        )}
      </div>

      <div className="-mt-6 rounded-t-3xl bg-surface px-5 pt-5 pb-4 flex-1 flex flex-col shadow-float">
        <div className="mx-auto h-1.5 w-12 rounded-full bg-border mb-4" />

        <button
          onClick={() => setOnline((o) => !o)}
          className={`w-full flex items-center justify-center gap-2 rounded-2xl py-4 text-sm font-extrabold shadow-soft transition ${online ? "bg-foreground text-background" : "bg-primary text-primary-foreground"}`}
        >
          <Power className="h-4 w-4" />
          {online ? "Go offline" : "Go online"}
        </button>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { icon: DollarSign, v: "R124.20", l: "Today" },
            { icon: TrendingUp, v: "8", l: "Trips" },
            { icon: Star, v: "4.96", l: "Rating" },
          ].map((s) => (
            <div key={s.l} className="rounded-xl bg-secondary p-3 text-center">
              <s.icon className="h-4 w-4 mx-auto text-primary" />
              <p className="mt-1 text-sm font-extrabold">{s.v}</p>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{s.l}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-border p-4">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Promotion</p>
          <p className="mt-1 text-sm font-bold">Complete 12 trips, earn an extra R40</p>
          <div className="mt-2 h-2 rounded-full bg-secondary overflow-hidden">
            <div className="h-full w-2/3 rounded-full bg-primary" />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">8 of 12 trips · ends Sunday</p>
        </div>
      </div>
    </PhoneShell>
  );
}
