import { createFileRoute, Link } from "@tanstack/react-router";
import { Phone, MessageCircle, Shield, Star, X } from "lucide-react";
import { PhoneShell, FakeMap } from "@/components/PhoneShell";

export const Route = createFileRoute("/ride/track")({
  head: () => ({ meta: [{ title: "Your driver is on the way — Vura" }] }),
  component: Track,
});

function Track() {
  return (
    <PhoneShell hideTabs>
      <div className="relative">
        <FakeMap height={420} />
        <Link to="/" className="absolute top-3 right-4 grid place-items-center h-9 w-9 rounded-full bg-surface shadow-card">
          <X className="h-4 w-4" />
        </Link>
        <div className="absolute top-3 left-1/2 -translate-x-1/2 rounded-full bg-foreground text-background px-4 py-1.5 text-xs font-bold shadow-float">
          Arriving in 3 min
        </div>
      </div>

      <div className="-mt-6 rounded-t-3xl bg-surface px-5 pt-5 pb-4 flex-1 flex flex-col shadow-float">
        <div className="mx-auto h-1.5 w-12 rounded-full bg-border mb-4" />

        <div className="flex items-center gap-3">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary to-primary/60 grid place-items-center text-primary-foreground font-bold text-lg">
            MR
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-1">
              <p className="font-bold">Marcus R.</p>
              <span className="flex items-center gap-0.5 text-xs font-semibold ml-1">
                <Star className="h-3 w-3 fill-primary text-primary" /> 4.96
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Toyota Prius · Silver</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-extrabold tracking-tight">LX24 PQR</p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Plate</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <button className="flex flex-col items-center gap-1 rounded-xl bg-secondary py-3 text-xs font-semibold">
            <Phone className="h-4 w-4 text-primary" /> Call
          </button>
          <button className="flex flex-col items-center gap-1 rounded-xl bg-secondary py-3 text-xs font-semibold">
            <MessageCircle className="h-4 w-4 text-primary" /> Message
          </button>
          <button className="flex flex-col items-center gap-1 rounded-xl bg-secondary py-3 text-xs font-semibold">
            <Shield className="h-4 w-4 text-primary" /> Safety
          </button>
        </div>

        <div className="mt-4 rounded-2xl border border-border p-3.5">
          <p className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Trip</p>
          <div className="mt-2 flex items-start gap-3 text-sm">
            <div className="flex flex-col items-center pt-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-foreground" />
              <span className="w-px h-6 border-l-2 border-dashed border-muted-foreground/40" />
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
            </div>
            <div className="flex-1 space-y-3">
              <p className="font-medium leading-tight">Current location</p>
              <p className="font-medium leading-tight">Shoreditch High St, London</p>
            </div>
            <p className="text-sm font-extrabold">R15.90</p>
          </div>
        </div>

        <Link to="/" className="mt-auto grid place-items-center rounded-2xl bg-secondary py-3.5 text-sm font-bold">
          Cancel trip
        </Link>
      </div>
    </PhoneShell>
  );
}
