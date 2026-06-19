import { createFileRoute, Navigate, useNavigate } from "@tanstack/react-router";
import { Star, Wallet, Gift, Settings, HelpCircle, Shield, LogOut, ChevronRight, RefreshCw, BadgeCheck } from "lucide-react";
import { PhoneShell } from "@/components/PhoneShell";
import { clearUser, setUser, useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "Account — Vura" }] }),
  component: Account,
});

const items = [
  { icon: Wallet, label: "Wallet", sub: "•••• 4242 · R24.10 credits" },
  { icon: Gift, label: "Promotions", sub: "2 active offers" },
  { icon: Shield, label: "Safety", sub: "Trusted contacts, RideCheck" },
  { icon: Settings, label: "Settings", sub: "Notifications, privacy", to: "/settings" },
  { icon: HelpCircle, label: "Help", sub: "Past trips, support" },
];

function Account() {
  const user = useAuth();
  const nav = useNavigate();
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return null;
  if (!user) return <Navigate to="/welcome" />;

  const initials = user.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  const isVerified = Boolean(
    user.idNumber && (user.role === "driver" ? user.licenseDocumentName : user.idDocumentName)
  );

  function signOut() {
    clearUser();
    nav({ to: "/welcome" });
  }
  function switchRole() {
    setUser({ ...user!, role: user!.role === "driver" ? "rider" : "driver" });
    nav({ to: user!.role === "driver" ? "/" : "/driver" });
  }

  return (
    <PhoneShell>
      <div className="hero-gradient text-primary-foreground px-5 pt-4 pb-12 rounded-b-[2rem] relative overflow-hidden">
        <div className="absolute -right-12 -bottom-10 h-44 w-44 rounded-full bg-white/10" />
        <h1 className="text-xl font-bold tracking-tight">Account</h1>
        <div className="mt-4 flex items-center gap-3 relative">
          <div className="h-16 w-16 rounded-full bg-surface text-primary grid place-items-center text-xl font-extrabold shadow-card">
            {initials || "U"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold">{user.name}</p>
              {isVerified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#10b981]/20 text-[#10b981] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  <BadgeCheck className="h-3 w-3" /> Verified
                </span>
              )}
            </div>
            <p className="text-xs opacity-85 mt-0.5">{user.email}</p>
            <p className="text-xs mt-1 inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 font-semibold capitalize">
              <Star className="h-3 w-3 fill-current" /> 4.92 · {user.role}
            </p>
          </div>
        </div>
      </div>

      <div className="px-5 -mt-6">
        <div className="grid grid-cols-3 gap-3 rounded-2xl bg-surface shadow-card p-4 text-center">
          {[
            { v: "128", l: "Trips" },
            { v: "R24", l: "Credits" },
            { v: "Gold", l: "Tier" },
          ].map((s) => (
            <div key={s.l}>
              <p className="text-lg font-extrabold">{s.v}</p>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-semibold">{s.l}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl bg-surface border border-border divide-y divide-border overflow-hidden">
          <button onClick={switchRole} className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
            <span className="grid place-items-center h-10 w-10 rounded-full bg-accent text-primary">
              <RefreshCw className="h-4 w-4" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold">Switch to {user.role === "driver" ? "rider" : "driver"}</p>
              <p className="text-xs text-muted-foreground">Try the other side of Vura</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </button>
          {items.map((it) => (
            <button key={it.label} onClick={() => it.to && nav({ to: it.to as any })} className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
              <span className="grid place-items-center h-10 w-10 rounded-full bg-accent text-primary">
                <it.icon className="h-4 w-4" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold">{it.label}</p>
                <p className="text-xs text-muted-foreground truncate">{it.sub}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>

        <button onClick={signOut} className="mt-4 w-full flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface py-3.5 text-sm font-bold text-primary">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
      <div className="h-6" />
    </PhoneShell>
  );
}
