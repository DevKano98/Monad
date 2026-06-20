import { Activity, Gauge, ShieldCheck, Wrench } from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", icon: Gauge },
  { to: "/feed", label: "Feed", icon: Activity },
  { to: "/incidents", label: "Incidents", icon: Wrench },
  { to: "/reputation", label: "Reputation", icon: ShieldCheck }
];

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 w-64 border-r border-slate-200 bg-white px-4 py-5 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-8">
        <div className="text-xl font-semibold">Axiom</div>
        <div className="text-sm text-slate-500">Monad failure intelligence</div>
      </div>
      <nav className="space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                isActive ? "bg-teal-50 text-signal dark:bg-teal-950" : "text-slate-600 dark:text-slate-300"
              }`
            }
          >
            <link.icon size={18} />
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
