import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, User, Car } from "lucide-react";
import { PhoneShell } from "@/components/PhoneShell";
import { setUser, type Role } from "@/lib/auth";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — Vura" }] }),
  component: Signup,
});

function Signup() {
  const nav = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<Role>("rider");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pwd, setPwd] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setUser({ name: name || "New user", email, phone, role });
    nav({ to: role === "driver" ? "/driver" : "/" });
  }

  return (
    <PhoneShell hideTabs>
      <div className="px-5 pt-3 pb-2 flex items-center gap-3">
        <Link to="/welcome" className="grid place-items-center h-9 w-9 rounded-full bg-secondary">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-base font-bold">Create account</h1>
      </div>

      {step === 1 ? (
        <div className="px-6 pt-4 pb-6 flex-1 flex flex-col">
          <h2 className="text-2xl font-extrabold tracking-tight">How will you use Vura?</h2>
          <p className="text-sm text-muted-foreground mt-1">You can switch later in settings.</p>

          <div className="mt-6 grid gap-3">
            <button
              onClick={() => setRole("rider")}
              className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${role === "rider" ? "border-primary bg-accent shadow-soft" : "border-border bg-surface"}`}
            >
              <span className="grid place-items-center h-12 w-12 rounded-xl bg-primary text-primary-foreground">
                <User className="h-5 w-5" />
              </span>
              <div>
                <p className="font-bold">I want to ride</p>
                <p className="text-xs text-muted-foreground">Get a ride or order delivery</p>
              </div>
            </button>
            <button
              onClick={() => setRole("driver")}
              className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${role === "driver" ? "border-primary bg-accent shadow-soft" : "border-border bg-surface"}`}
            >
              <span className="grid place-items-center h-12 w-12 rounded-xl bg-foreground text-background">
                <Car className="h-5 w-5" />
              </span>
              <div>
                <p className="font-bold">I want to drive</p>
                <p className="text-xs text-muted-foreground">Earn money on your schedule</p>
              </div>
            </button>
          </div>

          <button
            onClick={() => setStep(2)}
            className="mt-auto w-full rounded-2xl bg-primary py-4 text-sm font-bold text-primary-foreground shadow-soft"
          >
            Continue
          </button>
        </div>
      ) : (
        <form onSubmit={submit} className="px-6 pt-4 pb-6 flex-1 flex flex-col">
          <h2 className="text-2xl font-extrabold tracking-tight">Your details</h2>
          <p className="text-sm text-muted-foreground mt-1">Signing up as <span className="font-bold text-primary capitalize">{role}</span></p>

          <div className="mt-5 space-y-3">
            {[
              { label: "Full name", value: name, set: setName, type: "text", placeholder: "Sagar Dash" },
              { label: "Email", value: email, set: setEmail, type: "email", placeholder: "you@email.com" },
              { label: "Phone", value: phone, set: setPhone, type: "tel", placeholder: "+44 7700 900123" },
              { label: "Password", value: pwd, set: setPwd, type: "password", placeholder: "••••••••" },
            ].map((f) => (
              <label key={f.label} className="block">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{f.label}</span>
                <input
                  type={f.type}
                  value={f.value}
                  onChange={(e) => f.set(e.target.value)}
                  placeholder={f.placeholder}
                  required
                  className="mt-1 w-full rounded-xl bg-secondary px-3 py-3 text-sm font-medium outline-none focus:ring-2 ring-primary/30"
                />
              </label>
            ))}
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-2xl bg-primary py-4 text-sm font-bold text-primary-foreground shadow-soft"
          >
            Create account
          </button>

          <p className="mt-auto pt-6 text-center text-sm">
            Already have one?{" "}
            <Link to="/login" className="font-bold text-primary">Sign in</Link>
          </p>
        </form>
      )}
    </PhoneShell>
  );
}
