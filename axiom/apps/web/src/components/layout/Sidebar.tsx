import { Activity, Gauge, Map, ShieldCheck, Wrench } from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", icon: Gauge },
  { to: "/feed", label: "Feed", icon: Activity },
  { to: "/map", label: "Map", icon: Map },
  { to: "/incidents", label: "Incidents", icon: Wrench },
  { to: "/reputation", label: "Reputation", icon: ShieldCheck }
];

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-72 flex-col border-r border-black/5 bg-white/85 px-5 py-5 backdrop-blur-xl dark:border-white/10 dark:bg-[#050608]/90">
      <div className="rounded-[28px] border border-black/5 bg-white/90 p-4 shadow-[0_16px_50px_rgba(17,24,39,0.06)] dark:border-white/10 dark:bg-white/[0.03]">
        <div className="flex items-center gap-3">
          <img
            src="/axiom-icon.png"
            alt="Axiom icon"
            className="h-11 w-11 rounded-2xl object-cover shadow-[0_12px_32px_rgba(73,79,223,0.22)]"
          />
          <div>
            <div className="text-sm font-semibold tracking-[0.22em] text-[#494fdf] uppercase">Axiom</div>
          </div>
        </div>
        <div className="mt-4 rounded-2xl bg-[#494fdf]/8 px-3 py-2 text-xs leading-5 text-slate-600 dark:bg-white/5 dark:text-slate-300">
          Live anomaly tracking, reputation scoring, and spatial crash telemetry in one view.
        </div>
      </div>
      <nav className="mt-6 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#494fdf] text-white shadow-[0_16px_36px_rgba(73,79,223,0.28)]"
                  : "text-slate-600 hover:bg-black/[0.04] hover:text-ink dark:text-slate-300 dark:hover:bg-white/[0.05] dark:hover:text-white"
              }`
            }
          >
            <link.icon size={18} />
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto rounded-[28px] border border-black/5 bg-gradient-to-br from-white to-slate-50 p-4 text-sm text-slate-600 shadow-[0_24px_60px_rgba(17,24,39,0.08)] dark:border-white/10 dark:from-white/[0.04] dark:to-white/[0.02] dark:text-slate-300">
        <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">System status</div>
        <div className="mt-2 flex items-center justify-between">
          <span>Realtime ingest</span>
          <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
            Online
          </span>
        </div>
      </div>
    </aside>
  );
}
