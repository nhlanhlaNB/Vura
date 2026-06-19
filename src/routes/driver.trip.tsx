import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone, MessageCircle, Navigation2, CheckCircle2 } from "lucide-react";
import { PhoneShell, FakeMap } from "@/components/PhoneShell";

export const Route = createFileRoute("/driver/trip")({
  head: () => ({ meta: [{ title: "Active trip — Vura Driver" }] }),
  component: DriverTrip,
});

function DriverTrip() {
  return (
    <PhoneShell hideTabs>
      <div className="relative">
        <FakeMap height={420} />
        <div className="absolute top-3 left-1/2 -translate-x-1/2 rounded-full bg-success text-success-foreground px-4 py-1.5 text-xs font-bold shadow-float">
          Pickup in 4 min
        </div>
      </div>

      <div className="-mt-6 rounded-t-3xl bg-surface px-5 pt-5 pb-4 flex-1 flex flex-col shadow-float">
        <div className="mx-auto h-1.5 w-12 rounded-full bg-border mb-4" />

        <div className="flex items-center gap-3">
          <div className="h-14 w-14 rounded-full bg-secondary grid place-items-center font-extrabold">SD</div>
          <div className="flex-1">
            <p className="font-bold">Sagar Dash</p>
            <p className="text-xs text-muted-foreground">★ 4.92 · Rider</p>
          </div>
          <button className="grid place-items-center h-10 w-10 rounded-full bg-secondary"><Phone className="h-4 w-4" /></button>
          <button className="grid place-items-center h-10 w-10 rounded-full bg-secondary"><MessageCircle className="h-4 w-4" /></button>
        </div>

        <div className="mt-4 rounded-2xl border border-border p-3.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Navigation2 className="h-3 w-3" /> Pickup
          </div>
          <p className="mt-1 text-sm font-bold">221B Baker St, London</p>
          <p className="text-xs text-muted-foreground">1.2 mi · 4 min</p>
        </div>

        <button className="mt-3 flex items-center justify-center gap-2 rounded-2xl bg-foreground text-background py-3 text-sm font-bold">
          <Navigation2 className="h-4 w-4" /> Navigate
        </button>

        <Link
          to="/driver"
          className="mt-3 flex items-center justify-center gap-2 rounded-2xl bg-primary py-4 text-sm font-extrabold text-primary-foreground shadow-soft"
        >
          <CheckCircle2 className="h-4 w-4" /> I've arrived
        </Link>
      </div>
    </PhoneShell>
  );
}
