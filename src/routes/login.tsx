import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { PhoneShell } from "@/components/PhoneShell";
import { setUser, type Role } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — Vura" }] }),
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("sagar@vura.app");
  const [pwd, setPwd] = useState("password");
  const [show, setShow] = useState(false);
  const [role, setRole] = useState<Role>("rider");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setUser({ name: email.split("@")[0] || "Rider", email, role });
    nav({ to: role === "driver" ? "/driver" : "/" });
  }

  return (
    <PhoneShell hideTabs>
      <div className="px-5 pt-3 pb-2 flex items-center gap-3">
        <Link to="/welcome" className="grid place-items-center h-9 w-9 rounded-full bg-secondary">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-base font-bold">Sign in</h1>
      </div>

      <div className="px-6 pt-4 pb-6 flex-1 flex flex-col">
        <h2 className="text-2xl font-extrabold tracking-tight">Welcome back</h2>
        <p className="text-sm text-muted-foreground mt-1">Enter your details to continue.</p>

        <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-secondary p-1">
          {(["rider", "driver"] as Role[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`rounded-xl py-2 text-xs font-bold capitalize transition ${role === r ? "bg-surface text-primary shadow-soft" : "text-muted-foreground"}`}
            >
              {r === "rider" ? "I'm a rider" : "I'm a driver"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="mt-5 space-y-3">
          <label className="block">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Email</span>
            <div className="mt-1 flex items-center gap-2 rounded-xl bg-secondary px-3 py-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-transparent text-sm font-medium outline-none"
                required
              />
            </div>
          </label>
          <label className="block">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Password</span>
            <div className="mt-1 flex items-center gap-2 rounded-xl bg-secondary px-3 py-3">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <input
                type={show ? "text" : "password"}
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                className="flex-1 bg-transparent text-sm font-medium outline-none"
                required
              />
              <button type="button" onClick={() => setShow((s) => !s)} className="text-muted-foreground">
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </label>

          <div className="flex justify-end">
            <Link to="/login" className="text-xs font-semibold text-primary">Forgot password?</Link>
          </div>

          <button
            type="submit"
            className="w-full rounded-2xl bg-primary py-4 text-sm font-bold text-primary-foreground shadow-soft active:scale-[0.99] transition"
          >
            Sign in
          </button>
        </form>

        <div className="mt-5 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> or continue with <span className="h-px flex-1 bg-border" />
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {["Google", "Apple", "Phone"].map((p) => (
            <button key={p} className="rounded-xl border border-border py-2.5 text-xs font-bold">{p}</button>
          ))}
        </div>

        <p className="mt-auto pt-6 text-center text-sm">
          New to Vura?{" "}
          <Link to="/signup" className="font-bold text-primary">Create account</Link>
        </p>
      </div>
    </PhoneShell>
  );
}
